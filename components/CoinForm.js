import React, { useEffect, useState } from "react";
import axios from 'axios';
import Link from "next/link";
import { formatDecimal, sendGetRequestWithSensitiveData, sendPostRequestWithSensitiveData, getPairByTokenAddress } from './Utils';
import { useRouter } from 'next/router';
import { useAccount, useNetwork } from "wagmi";
import Image from 'next/image';
import { presalePlatforms, launchPlatforms } from "./Constant"
import {notification} from "antd";
import  baseUrl from '/utils/baseUrl'


export default function CoinForm() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [logoPath, setLogoPath] = useState("")
  // const { chain } = useNetwork();

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const handleRadioChange = (e) => {
    if (e.target.value === "no") {
      setShowAdditionalFields(true);
    } else {
      setShowAdditionalFields(false);
    }
  };

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
          duration:2
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

  const [presale, setPresale] = useState({
    presaleTime: '',
    presalePlatform: '',
    presaleLink: '',
  })

  const [launch, setLaunch] = useState({
    launchTime: '',
    launchPlatform: '',
    launchLink: '',
  })

  const [links, setLinks] = useState({
    telegram: '',
  });

  const handleTokenInfoChange = (e) => {
    const { name, value } = e.target;
    setTokenInfo({
      ...tokenInfo,
      [name]: value,
    });
  };

  const handlePresaleChange = (e) => {
    const { name, value } = e.target;
    setPresale({
      ...presale,
      [name]: value,
    });
  };

  const handleLaunchChange = (e) => {
    const { name, value } = e.target;
    setLaunch({
      ...launch,
      [name]: value,
    });
  };

  const handleLinksChange = (e) => {
    const { name, value } = e.target;
    setLinks({
      ...links,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    event.preventDefault()

    const pair = (await axios.get( baseUrl+"/getPairByTokenAddress", {
      params: {
        tokenAddress: tokenInfo.tokenAddress
      }
    })).data.pair;
    if (showAdditionalFields) {
      if (pair !== "0x0000000000000000000000000000000000000000") {
        return;
      }
      const formData = new FormData();
      formData.append('token', JSON.stringify(tokenInfo));
      formData.append('links', JSON.stringify(links))
      formData.append('presale', JSON.stringify(presale))
      formData.append('launch', JSON.stringify(launch))

      const headers = {
        'x-api-key': '922e0369e89a40d9be91d68fde539325',
        'Content-Type': 'application/json',
      };
      await sendPostRequestWithSensitiveData( baseUrl+'/addCoin', headers, formData)
        .then(responseData => {
          if (responseData.success === true) {
            router.push('/');
          }
        })
        .catch(error => {
          notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
            duration:2
          });
        });
    } else {
      if (pair === "0x0000000000000000000000000000000000000000") {
        return;
      }
      const formData = new FormData();
      formData.append('pairInfo', JSON.stringify({ pairAddress: pair }))
      formData.append('tokenInfo', JSON.stringify(tokenInfo))
      const headers = {
        'x-api-key': '922e0369e89a40d9be91d68fde539325',
        'Content-Type': 'application/json',
      };

      await sendPostRequestWithSensitiveData( baseUrl+'/addPair', headers, formData)
        .then(responseData => {
          if (responseData.success === true) {
            router.push('/');
          }
        })
        .catch(error => {
          notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
            duration:2
          });
        });
    }
  };

  // useEffect(() => {
  //   if (chain) {
  //     const chainName = chain.name;
  //     setTokenInfo({ ...tokenInfo, chain: chainName })
  //   }
  // }, [chain]);

  return (
    <div className="mx-auto mt-20 ml-20 mr-5 text-white-500">
        <form onSubmit={handleSubmit}>
          <lable>Token Info</lable>
          <hr />
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
          <div>
            <label>Is there a pair?</label>
            <input type="radio" id="yes" name="pair" value="yes" onChange={handleRadioChange} />
            <label for="yes">Yes</label>
            <input type="radio" id="no" name="pair" value="no" onChange={handleRadioChange} />
            <label for="no">No</label>
          </div>
          {showAdditionalFields && (
            <div className="grid grid-flow-col grid-cols-2">
              <div>
                <div className="mb-6">
                  <label for="presaleTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Presale Time
                  </label>
                  <input
                    type="datetime-local"
                    id="presaleTime"
                    name="presaleTime"
                    value={presale.presaleTime}
                    onChange={handlePresaleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Presale Time"
                    required
                    style={{ color: 'black', backgroundColor: 'white' }}
                  />
                </div>
                <div className="mb-6">
                  <label for="presalePlatform" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Presale Platform
                  </label>
                  <select
                    id="presalePlatform"
                    name="presalePlatform"
                    value={presale.presalePlatform}
                    onChange={handlePresaleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    style={{ color: 'black', backgroundColor: 'white' }}
                  >
                    <option value="">Select a Presale Platform</option>
                    {presalePlatforms.map((platform, index) => (
                      <option
                        key={index}
                        value={platform.name}
                      >
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label for="presaleLink" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Presale Link
                  </label>
                  <input
                    type="text"
                    id="presaleLink"
                    name="presaleLink"
                    value={presale.presaleLink}
                    onChange={handlePresaleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Presale Link"
                    required
                    style={{ color: 'black', backgroundColor: 'white' }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-6">
                  <label for="launchTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Launch Time
                  </label>
                  <input
                    type="datetime-local"
                    id="launchTime"
                    name="launchTime"
                    value={launch.launchTime}
                    onChange={handleLaunchChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Launch Time"
                    required
                    style={{ color: 'black', backgroundColor: 'white' }}
                  />
                </div>
                <div className="mb-6">
                  <label for="launchPlatform" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Launch Platform
                  </label>
                  <select
                    id="launchPlatform"
                    name="launchPlatform"
                    value={launch.launchPlatform}
                    onChange={handleLaunchChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    style={{ color: 'black', backgroundColor: 'white' }}
                  >
                    <option value="">Select a Launch Platform</option>
                    {launchPlatforms.map((launchPlatform, index) => (
                      <option
                        key={index}
                        value={launchPlatform.name}
                      >
                        {launchPlatform.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label for="launchLink" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Launch Link
                  </label>
                  <input
                    type="text"
                    id="launchLink"
                    name="launchLink"
                    value={launch.launchLink}
                    onChange={handleLaunchChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Launch Link"
                    required
                    style={{ color: 'black', backgroundColor: 'white' }}
                  />
                </div>
              </div>
            </div>
          )}
          <lable>Links</lable>
          <hr />
          <div className="mb-6">
            <label for="telegram" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              telegram
            </label>
            <input
              type="text"
              id="telegram"
              name="telegram"
              value={links.telegram}
              onChange={handleLinksChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="telegram"
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
