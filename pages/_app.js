import "../styles/tailwind.css";
import "../styles/slick.css";
import axios from 'axios'
import  baseUrl from '/utils/baseUrl'
// import "semantic-ui-css/semantic.min.css"; //semantic ui css package
// import {
//   getDefaultWallets,
//   RainbowKitProvider,
//   darkTheme,
//   RainbowKitAuthenticationProvider,
//   createAuthenticationAdapter
// } from '@rainbow-me/rainbowkit';
import { SessionProvider } from "next-auth/react"
import { configureChains,createClient ,WagmiConfig,chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import {redirectUser} from '../utils/set'
export const { chains, publicClient, webSocketPublicClient,provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    publicProvider()
  ]
);

const Disclaimer = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{' '}
    <Link href="https://termsofservice.xyz">Terms of Service</Link> and
    acknowledge you have read and understand the protocol{' '}
    <Link href="https://disclaimer.xyz">Disclaimer</Link>
  </Text>
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


// config={wagmiConfig}
function DexPert({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
        {/*<RainbowKitProvider chains={chains} theme={darkTheme()} appInfo={{*/}
        {/*  appName: 'Dex Pert App',*/}
        {/*  disclaimer: Disclaimer,*/}
        {/*}}>*/}
          <Component {...pageProps} />
        {/*</RainbowKitProvider>*/}
        </SessionProvider>
    </WagmiConfig>
  );
}

export default DexPert;
