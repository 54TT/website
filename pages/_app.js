import "../styles/tailwind.css";
import "../styles/slick.css";
import {SessionProvider} from "next-auth/react"
import {configureChains, createClient, WagmiConfig, chain} from 'wagmi';
import {publicProvider} from 'wagmi/providers/public';
require('dotenv').config({ path: '.env' })
export const {chains, publicClient, webSocketPublicClient, provider} = configureChains(
    [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
    [
        publicProvider()
    ]
);
// const { connectors } = getDefaultWallets({
//   appName: 'Dex Pert App',
//   projectId: '91383724685e391bed500342fc272001',
//   chains
// });

// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors,
//   publicClient,
//   webSocketPublicClient
// })
const client = createClient({
    autoConnect: true,
    provider,
})
import Layout from '/components/Layout/Layout'
import Head from 'next/head';
function DexPert({Component, pageProps}) {
    return (<>
        <Head>
            <link rel="shortcut icon" href="/avatar.png" />
            <title>My new cool app</title>
        </Head>
        <WagmiConfig client={client}>
        {/*    <SessionProvider session={pageProps.session} refetchInterval={0}>*/}
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            {/*</SessionProvider>*/}
        </WagmiConfig>
        </>
    );
}
export default DexPert;
