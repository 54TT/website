import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getCsrfToken } from "next-auth/react"
import  baseUrl from '../../../utils/baseUrl'
import { SiweMessage } from "siwe"
import axios from 'axios';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

export default async function auth(req, res) {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const para = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)
          let result = null
          if(para){
             result = await para.verify({
              signature: credentials?.signature || "",
              domain: nextAuthUrl.host,
              nonce: await getCsrfToken({ req }),
            })
          }
          if (result&&result.success) {
            return {
              id: para.address,
            }
          }
          return null
        } catch (e) {
          return null
        }
      },
    }),
  ]

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin")

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop()
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: "jwt",
    },
    secret:  process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        let userAndFollowStats = (await axios.get( baseUrl+"/api/user", {
          params: {
            address: token.sub
          }
        })).data;
        if(!userAndFollowStats.user){
          userAndFollowStats = (await axios.post( baseUrl+"/api/user",{
              address: token.sub
          })).data
        }
        session.address = token.sub
        session.user = userAndFollowStats.user
        session.userFollowStats = userAndFollowStats.userFollowStats
        return session
      },
    },
  })
}