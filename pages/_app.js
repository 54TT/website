import "../styles/tailwind.css";
import "../styles/slick.css";
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  RainbowKitAuthenticationProvider,
  createAuthenticationAdapter
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
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

const { connectors } = getDefaultWallets({
  appName: 'Dex Pert App',
  projectId: '91383724685e391bed500342fc272001',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
})

function DexPert({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={darkTheme()} appInfo={{
          appName: 'Dex Pert App',
          disclaimer: Disclaimer,
        }}>
          <Component {...pageProps} />
        </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default DexPert;
