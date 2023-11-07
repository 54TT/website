import React, { useEffect, useState } from "react";
import axios from 'axios';
import Link from "next/link";
import  baseUrl from '/utils/baseUrl'
import { Input } from "@material-tailwind/react";
import { formatDecimal, sendGetRequestWithSensitiveData, sendPostRequestWithSensitiveData } from './Utils';
import { useRouter } from 'next/router';
import {notification} from "antd";
// import { useAccount, chain} from "wagmi";

export default function CoinForm() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [logoPath, setLogoPath] = useState("")

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    const headers = {
      'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
      'Content-Type': 'multipart/form-data', // 根据需要添加其他标头
    };
    await sendPostRequestWithSensitiveData( baseUrl+'/uploadLogo', headers, formData)
      .then(responseData => {
        if (responseData.message === "success") {
          const resLogoPath = responseData.logoPath;
          setLogoPath(resLogoPath);
          setTokenInfo({
            ...tokenInfo,
            ['logo']: resLogoPath,
          });
        } else {
          throw new Error("logo file upload failed")
        }
      })
      .catch(error => {
        notification.error({
          message: `Please note`, description: 'Error reported', placement: 'topLeft',
        });
      });

    setSelectedFile(file);

    // 使用FileReader来生成预览图
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const [tokenInfo, setTokenInfo] = useState({
    tokenAddress: '',
    logo: '',
    // chain: '',
  });

  const [pairInfo, setPairInfo] = useState({
    pairAddress: '',
  });

  const handleTokenInfoChange = (e) => {
    const { name, value } = e.target;
    setTokenInfo({
      ...tokenInfo,
      [name]: value,
    });
  };

  const handlePairInfoChange = (e) => {
    const { name, value } = e.target;
    setPairInfo({
      ...pairInfo,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    event.preventDefault()
    const formData = new FormData();
    formData.append('pairInfo', JSON.stringify(pairInfo))
    formData.append('tokenInfo', JSON.stringify(tokenInfo))
    const headers = {
      'x-api-key': '922e0369e89a40d9be91d68fde539325',
      'Content-Type': 'application/json',
    };

    await sendPostRequestWithSensitiveData( baseUrl+'/addPair', headers, formData)
      .then(responseData => {
        if(responseData.success === true){
          router.push('/');
        }
      })
      .catch(error => {
        notification.error({
          message: `Please note`, description: 'Error reported', placement: 'topLeft',
        });
      });
  };

  // useEffect(() => {
  //   if(chain){
  //     const chainName = chain.name;
  //     setTokenInfo({ ...tokenInfo, chain: chainName})
  //   }
  // }, [chain]);

  return (
    <div className="mx-auto mt-20 ml-20 mr-5 text-white-500">
        <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label for="tokenAddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Token Address
              </label>
              <input
                type="text"
                id="tokenAddress"
                name="tokenAddress"
                value={tokenInfo.tokenAddress}
                onChange={handleTokenInfoChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Token Address"
                required
                style={{ color: 'black', backgroundColor: 'white' }}
              />
            </div>
            <div>
              <label for="logo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Logo
              </label>
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  select file:
                </label>
                <input
                  type="file"
                  name="image"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>

              {selectedFile && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">select file name:</h3>
                  <p className="text-gray-700">{selectedFile.name}</p>
                  <h3 className="text-lg font-semibold mt-2">preview:</h3>
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="mt-2 rounded-xl shadow w-40 h-40"
                  />
                </div>
              )}

            </div>
            
          </div>
          <div className="mb-6">
            <label for="pairAddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              pair address
            </label>
            <input
              type="text"
              id="pairAddress"
              name="pairAddress"
              value={pairInfo.pairAddress}
              onChange={handlePairInfoChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="pair address"
              required
              style={{ color: 'black', backgroundColor: 'white' }}
            />
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
            </div>
            <label for="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
          </div>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
    </div>
  );
}
