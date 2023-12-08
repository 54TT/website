import "../public/styles/tailwind.css";
import "../public/styles/slick.css";
import '../public/styles/theme.css'
// import {configureChains, createClient, WagmiConfig, chain} from 'wagmi';
// import {publicProvider} from 'wagmi/providers/public';
import {WagmiConfig, createConfig} from 'wagmi';
import {ConfigProvider} from 'antd'
import {mainnet, polygon, optimism, arbitrum} from 'wagmi/chains';
//   使用钱包依赖
import {ConnectKitProvider, getDefaultConfig} from 'hjt-connectkit';

require('dotenv').config({path: '.env'})
// export const {chains, publicClient, webSocketPublicClient, provider} = configureChains(
//     [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
//     [
//         publicProvider()
//     ]
// );
// const client = createClient({
//     autoConnect: true,
//     provider,
// })
const config = createConfig(
    getDefaultConfig({
        appName: 'ConnectKit Next.js demo',
        //infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        //alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_ID,
        chains: [mainnet, polygon, optimism, arbitrum],
        // walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
    })
);
import Layout from '/components/Layout/Layout'
import Head from 'next/head';

function DexPert({Component, pageProps}) {
    return (<>
            <Head>
                <link rel="shortcut icon" href="/avatar.png"/>
                <title>My new cool app</title>
            </Head>
            <WagmiConfig config={config}>
                <ConnectKitProvider debugMode>
                    <ConfigProvider theme={{
                        components: {
                            Select: {
                                selectorBg: 'rgb(254, 239, 146)'
                            },
                        },
                    }}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ConfigProvider>
                </ConnectKitProvider>
            </WagmiConfig>
        </>
    );
}

export default DexPert;
