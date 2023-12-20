import "/public/styles/tailwind.css";
import "/public/styles/slick.css";
import '/public/styles/theme.css'
import {WagmiConfig, createConfig} from 'wagmi';
import {mainnet, polygon, optimism, arbitrum} from 'wagmi/chains';
import { createPublicClient, http } from 'viem'
require('dotenv').config({path: '.env'})
//   使用钱包依赖
// import {ConnectKitProvider, getDefaultConfig} from 'hjt-connectkit';
// import {ConnectKitButton, changeBack} from 'hjt-connectkit';
// const config = createConfig(
//     getDefaultConfig({
//         appName: 'ConnectKit Next.js demo',
//         //infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
//         //alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_ID,
//         chains: [mainnet, polygon, optimism, arbitrum],
//         // walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
//     })
// );

const config = createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
        chain: mainnet,
        transport: http(),
    }),
})
const Layout = dynamic(
    () => import('/components/Layout/Layout'),
    {ssr: false}
);
const Head = dynamic(
    () => import('next/head'),
    {ssr: false}
);
import React from "react";
import dynamic from "next/dynamic";

function DexPert({Component, pageProps}) {
     return (
        <>
            <Head>
                <link rel="shortcut icon" href="/Group19.svg"/>
                <title>Dex Pert</title>
            </Head>
            <WagmiConfig config={config}>
                {/*<ConnectKitProvider >*/}
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                {/*</ConnectKitProvider>*/}
            </WagmiConfig>
        </>
    );
}

export default DexPert;
