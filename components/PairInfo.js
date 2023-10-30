import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatDecimal } from './Utils';
import Link from "next/link";
import { useAccount, useNetwork } from "wagmi";

export default function PairInfo() {
  const router = useRouter();
  const { pairAddress } = router.query;
  const [pairBaseData, setPairBaseData] = useState({});
  const [pairDexData, setPairDexData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pairAddressEllipsis, setPairAddressEllipsis] = useState("");
  const [tokenAddressEllipsis, setTokenAddressEllipsis] = useState("");
  const [priceUsd, setPriceUsd] = useState(0);
  const { chain } = useNetwork();
  const [chainId, setChainId] = useState("ethereum");

  const headers = {
    'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
    'Content-Type': 'application/json', // 根据需要添加其他标头
  };

  async function getPairInfo() {
    try {
      const response = await axios.get('http://localhost:3001/queryPairInfoByPairAddress', {
        headers: headers,
        params: {
          pairAddress: pairAddress
        }
      });
      const pairBase = response.data;
      console.log("pairBase:", pairBase)
      let pairDex = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainId}/${pairAddress}`);
      console.log("pairDex:", pairDex)
      setPairBaseData(pairBase[0]);
      setPairDexData(pairDex.data.pairs[0]);
      const priceUsd = formatDecimal(pairDex.data.pairs[0].priceUsd, 5);
      setPriceUsd(priceUsd);
      setPairAddressEllipsis(await strEllipsis(pairAddress));
      setTokenAddressEllipsis(await strEllipsis(pairDex.data.pairs[0].baseToken.address))
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }

  async function getPriceUsd() {
    let pairDex = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainId}/${pairAddress}`);
    const priceUsd = formatDecimal(pairDex.data.pairs[0].priceUsd, 5);
    setPriceUsd(priceUsd);
  }

  async function strEllipsis(str) {
    if (str) {
      str = str.slice(0, 5) + "..." + str.slice(str.length - 4, str.length)
      return str;
    }
  }

  useEffect(() => {
    if (pairAddress && chain) {
      let chainName = chain.name;
      chainName = chainName.toLocaleLowerCase();
      setChainId(chainName);
      getPairInfo();

      const timer = setInterval(() => {
        getPriceUsd();
      }, 5000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [pairAddress, chain]);

  return (
    <div className="mx-auto mt-16 ml-20 mr-5">
      {isLoading ? (
        <></>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div className="w-full h-60">
          <div className="block">
            <div className="grid grid-flow-row grid-cols-2 px-3 mt-3">
              <div className="grid grid-flow-row grid-cols-2 m-9 w-32">
                <div className="w-9">
                  <Image src={`http://localhost:3001/${pairBaseData.logo}`} alt="logo" width={40} height={40} className="inline rounded-full" />
                </div>
                <div className="w-32">
                  <div>
                  <span className="text-2xl ml-4">{pairDexData.baseToken.name}</span>
                    </div>
                    <div>
                  <span className="text-2xl ml-4">{pairDexData.baseToken.symbol}</span><span style={{ color: "#818ea3" }}> / </span><span style={{ color: "#818ea3" }}>{pairDexData.quoteToken.symbol}</span>
                    </div>
                </div>
              </div>
              {/* <div className="mt-4">
                  <span className="text-xs">token: {tokenAddressEllipsis}</span>
                  <CopyToClipboard text={pairDexData.baseToken.address}>
                    <Image src="/assets/copy.svg" width={20} height={20} className="ml-2 inline cursor-pointer" />
                  </CopyToClipboard>
                  <span className="text-xs truncate inline ml-6">pair: {pairAddressEllipsis}</span>
                  <CopyToClipboard text={pairDexData.pairAddress}>
                    <Image src="/assets/copy.svg" width={20} height={20} className="ml-2 inline cursor-pointer" />
                  </CopyToClipboard>
                </div> */}
              {/* <div className="mt-5">
                  <ul className="inline-block space-x-5">
                    <li className="inline">
                      <Link href={`https://etherscan.io/token/${pairDexData.baseToken.address}`} target="_blank">
                        <Image src="/assets/ether-scan.png" width={20} height={20} />
                      </Link>
                    </li>

                  </ul>
                </div> */}
              <div className="m-9">
                <p className="text-block text-3xl">$ {priceUsd}</p>
                <span style={{ color: pairDexData.priceChange.h24 >= 0 ? '#17c671' : '#ea3943' }}>{pairDexData.priceChange.h24} %</span>
              </div>
            </div>
          </div>
          <div className="w-full h-screen">
            <iframe src={`https://dexscreener.com/${chainId}/${pairDexData.pairAddress}?embed=1&theme=dark`} className="w-full h-full"></iframe>
          </div>
        </div>

      )}
    </div>
  );
}
