import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage, useNetwork, useSigner } from "wagmi";
import { ethers } from 'ethers';

const Connect = () => {

    const { isConnected, address } = useAccount();
    const { chain } = useNetwork();
    const { signMessage } = useSignMessage();

    async function signDexPertMessage(dataToSign) {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const signature = await signer.signMessage(dataToSign);
            return signature;
        } else {
            return null;
        }
    }

    useEffect(() => {
        if (isConnected) {
        } else {
        }
    }, [isConnected]);

    return (
        <ConnectButton chainStatus="icon" showBalance={false} accountStatus="avatar" />
    );
};

export default Connect;
