import React, { useEffect, useState } from "react";
import { Table, TableBody, TableRow, TableContainer, TableHead } from '@mui/material';
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import Link from "next/link";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import Image from 'next/image';
import { formatDecimal, sendGetRequestWithSensitiveData, getRelativeTimeDifference, formatDateTime } from './Utils';
import { useAccount, useNetwork } from "wagmi";
import { presalePlatforms, presalePlatformMatchLogos, launchPlatformMatchLogos } from "./Constant"

export default function Home() {

  const [pairs, setPairs] = useState([]);
  const [featuredPairs, setFeaturedPairs] = useState([]);
  const { chain } = useNetwork();
  const [timeFilter, setTimeFilter] = useState("24h");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [pairCount, setPairCount] = useState(0);
  const [chainId, setChainId] = useState("ethereum");
  const [hotPairs, setHotPairs] = useState([]);
  const [launchs, setLaunchs] = useState([]);
  const [presales, setPresales] = useState([]);

  const fetchData = async (chainIdParam, timeFilterParam, pageIndex, pageSize) => {
    try {
      const headers = {
        'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
        'Content-Type': 'application/json', // 根据需要添加其他标头
      };

      let pairCount = await axios.get('http://localhost:3001/queryAllPairCount', {
        headers: headers,
        params: {}
      });
      setPairCount(pairCount.data[0].count);

      let data = await axios.get('http://localhost:3001/queryAllPair', {
        headers: headers,
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize
        }
      });
      data = data.data

      const pairArray = data.map(item => item.address).join(",");
      const pairInfosResponse = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainIdParam}/${pairArray}`);
      const pairInfos = pairInfosResponse.data.pairs;
      let newPairInfos = pairInfos.map(async (pairInfo) => {
        const baseTokenInfo = await axios.get('http://localhost:3001/queryTokenByAddress', {
          headers: headers,
          params: {
            address: pairInfo.baseToken.address
          }
        });
        const timeFrame = timeFilterParam.toLowerCase();
        const txnsFilter = timeFrame === "24h" ? "h24" : timeFrame === "6h" ? "h6" : timeFrame === "1h" ? "h1" : timeFrame === "5m" ? "m5" : "h24"
        const newPairInfo = {
          pairAddress: pairInfo.pairAddress,
          baseToken: pairInfo.baseToken,
          priceUsd: formatDecimal(pairInfo.priceUsd, 5),
          quoteToken: pairInfo.quoteToken,
          liquidity: pairInfo.liquidity,
          dexId: pairInfo.dexId,
          url: pairInfo.url,
          baseTokenInfo: baseTokenInfo.data[0],
          priceChange: pairInfo.priceChange[txnsFilter],
          volume: pairInfo.volume[txnsFilter],
          txns: {
            buys: pairInfo.txns[txnsFilter].buys,
            sells: pairInfo.txns[txnsFilter].sells,
          }
        };
        return newPairInfo;
      });

      Promise.all(newPairInfos)
        .then((resolvedPairs) => {

          setPairs(resolvedPairs);
          setHotPairs(resolvedPairs.slice(0, 5))
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setTimeFilter(timeFilterParam);
      // setPairs(newPairInfos);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFeaturedPairsData = async (chainIdParam, timeFilterParam) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      let data = await axios.get('http://localhost:3001/queryAllFeatured', {
        headers: headers,
        params: {
        }
      });
      data = data.data
      const pairArray = data.map(item => item.pairAddress).join(",");
      const pairInfosResponse = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainIdParam}/${pairArray}`);
      const pairInfos = pairInfosResponse.data.pairs;
      let newPairInfos = pairInfos.map(async (pairInfo) => {
        const baseTokenInfo = await axios.get('http://localhost:3001/queryTokenByAddress', {
          headers: headers,
          params: {
            address: pairInfo.baseToken.address
          }
        });
        const timeFrame = timeFilterParam.toLowerCase();
        const txnsFilter = timeFrame === "24h" ? "h24" : timeFrame === "6h" ? "h6" : timeFrame === "1h" ? "h1" : timeFrame === "5m" ? "m5" : "h24"
        const newPairInfo = {
          pairAddress: pairInfo.pairAddress,
          baseToken: pairInfo.baseToken,
          priceUsd: formatDecimal(pairInfo.priceUsd, 5),
          quoteToken: pairInfo.quoteToken,
          liquidity: pairInfo.liquidity,
          dexId: pairInfo.dexId,
          url: pairInfo.url,
          baseTokenInfo: baseTokenInfo.data[0],
          priceChange: pairInfo.priceChange[txnsFilter],
          volume: pairInfo.volume[txnsFilter],
          txns: {
            buys: pairInfo.txns[txnsFilter].buys,
            sells: pairInfo.txns[txnsFilter].sells,
          }
        };
        return newPairInfo;
      });

      Promise.all(newPairInfos)
        .then((resolvedPairs) => {
          console.log(resolvedPairs)
          setFeaturedPairs(resolvedPairs);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const autoConvert = (number) => {
    if (Math.abs(number) >= 1000000) {
      return `${(number / 1000000).toFixed(2).replace(/\.?0*$/, '')}M`;
    } else if (Math.abs(number) >= 1000) {
      return `${(number / 1000).toFixed(2).replace(/\.?0*$/, '')}K`;
    } else {
      return number.toFixed(2).replace(/\.?0*$/, '');
    }
  };

  const fetchLaunchsData = async () => {
    try {
      const headers = {
        'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
        'Content-Type': 'application/json', // 根据需要添加其他标头
      };

      let launchsData = await axios.get('http://localhost:3001/queryAllLaunch', {
        headers: headers,
        params: {
          pageIndex: 0,
          pageSize: 5
        }
      });
      setLaunchs(launchsData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPresalesData = async () => {
    try {
      const headers = {
        'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
        'Content-Type': 'application/json', // 根据需要添加其他标头
      };

      let presalesData = await axios.get('http://localhost:3001/queryAllPresale', {
        headers: headers,
        params: {
          pageIndex: 0,
          pageSize: 3
        }
      });
      setPresales(presalesData.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let chainName = "ethereum";
    if (chain) {
      chainName = chain.name;
      chainName = chainName.toLocaleLowerCase();
      setChainId(chainName);
    }
    fetchData(chainName, timeFilter, currentPage, rowsPerPage);

    const timer = setInterval(() => {
      fetchData(chainName, timeFilter, currentPage, rowsPerPage);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [chain, timeFilter, currentPage, rowsPerPage]);

  useEffect(() => {
    fetchLaunchsData();
    fetchPresalesData();
    fetchFeaturedPairsData('ethereum', '24h');
  }, []);

  return (
    <div className="mx-auto mt-32 ml-20 mr-5">

      <div className="mx-auto flex flex-col text-center justify-center h-full">
        <div className="grid grid-flow-row sm:grid-flow-col grid-cols-3 h-full">
          <div className="col-span-2">
            <div className="grid grid-flow-row grid-cols-2 w-full">
              <div className="mx-16 w-92 flex flex-col items-center justify-center">
                <Card sx={{ minWidth: 200, backgroundColor: 'rgba(239, 203, 128, 0.28)', width: 400, height: 330 }} >
                  <Image src='/assets/fire-flame.png' width={70} height={70} className="fire-flame" />
                  <div className="grid grid-flow-row grid-cols-2 px-3 mt-5 ml-2 mr-10">
                    <div>
                      <p className="text-left font-semibold">Hot Pairs</p>
                    </div>
                    <div>
                      <p className="text-right more">More&gt;</p>
                    </div>
                  </div>
                  <Table
                    sx={{
                      [`& .${tableCellClasses.root}`]: {
                        borderBottom: "none",
                      }
                    }}>
                    <TableBody>
                      {featuredPairs.map((hotPair) => (
                        <TableRow key={hotPair.pairAddress}>
                          <TableCell>
                            <Link href={`/pairInfo?pairAddress=${hotPair.pairAddress}`}>
                              <Image src={`http://localhost:3001/${hotPair.baseTokenInfo.logo}`} width={30} height={30} className="inline mr-2 rounded-full" />
                              <span></span><span>{hotPair.baseToken.symbol}</span><span style={{ color: "#818ea3" }}>/</span><span style={{ color: "#818ea3" }}>{hotPair.quoteToken.symbol}</span>
                            </Link>
                          </TableCell>
                          <TableCell><span>{hotPair.priceUsd}</span></TableCell>
                          <TableCell><span style={{ color: hotPair.priceChange >= 0 ? '#17c671' : '#ea3943' }}>{hotPair.priceChange} %</span></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
              <div className="flex flex-col items-center justify-center mx-16">
                <Image src='/assets/home-launch-icon.png' width={70} height={70} className="home-launch-icon" />
                <div className="grid grid-flow-row grid-cols-2 px-3 mt-3 w-full">
                  <div>
                    <p className="text-left font-semibold">PreSales</p>
                  </div>
                  <div>
                    <p className="text-right more">More&gt;</p>
                  </div>
                </div>
                <div>

                  {presales.map((presale) => (
                    <Card sx={{ minWidth: 200, backgroundColor: 'rgba(166, 253, 133, 0.34)', width: 400, height: 80 }} className="mt-4">
                      <div className="grid grid-flow-row grid-cols-3 w-full h-full">
                        <div className="flex flex-col items-center justify-center">
                          <Image src={`http://localhost:3001/${presale.tokenLogo}`} width={50} height={50} className="rounded-full" />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <div>{presale.tokenName}</div>
                          <div className="rounded-3xl w-32" style={{backgroundColor: 'rgba(172, 209, 157, 0.69'}}>
                            <Link href=''> 
                              <Image src='/assets/website-icon.png' width={20} height={20} className="inline"/>
                            </Link>
                            <Link href=''>
                            <Image src='/assets/twitter-icon.png' width={20} height={20} className="inline"/>
                            </Link>
                            <Link href=''>
                            <Image src='/assets/telegram-icon.png' width={20} height={20} className="inline"/>
                            </Link>
                          </div>
                          {/* <span>{getRelativeTimeDifference(formatDateTime(presale.presaleTime))}</span> */}
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <Link href={presale.presaleLink} target="_blank">
                            <Image src={presalePlatformMatchLogos[presale.presalePlatform]} width={20} height={20} />
                          </Link>
                        </div>
                      </div>

                    </Card>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full mt-10">
              <Card sx={{ backgroundColor: 'rgba(239, 203, 128, 0.28)', width: 900, height: 400 }}>
                <ButtonGroup variant="contained" aria-label="outlined button group">
                  {["24h", "6h", "1h", "5m"].map((filter) => (
                    <Button key={filter} className="block" elevation={0} onClick={() => fetchData(chainId, filter, currentPage, rowsPerPage)}><p>{filter}</p></Button>
                  ))}
                </ButtonGroup>
                <TableContainer>
                  <Table size="medium">
                    <TableHead sx={{
                      [`& .${tableCellClasses.root}`]: {
                        borderBottom: "none"
                      }
                    }}>
                      <TableRow>
                        <TableCell><span className="aa">Pair</span></TableCell>
                        <TableCell><span>Price</span></TableCell>
                        <TableCell><span>% {timeFilter}</span></TableCell>
                        <TableCell><span>Volume</span></TableCell>
                        <TableCell><span>Swaps</span></TableCell>
                        <TableCell><span>Liquidity</span></TableCell>
                        <TableCell><span>Dex</span></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      sx={{
                        [`& .${tableCellClasses.root}`]: {
                          borderBottom: ".0625rem solid #23323c!important",
                        }
                      }}>
                      {pairs.map((row) => (
                        <TableRow key={row.pairAddress} className="pair-row">
                          <TableCell>
                            <Link href={`/pairInfo?pairAddress=${row.pairAddress}`}>
                              <Image src={`http://localhost:3001/${row.baseTokenInfo.logo}`} width={20} height={20} className="inline mr-2 rounded-full" />
                              <span></span><span>{row.baseToken.symbol}</span><span style={{ color: "#818ea3" }}>/</span><span style={{ color: "#818ea3" }}>{row.quoteToken.symbol}</span>
                            </Link>
                          </TableCell>
                          <TableCell><span>{row.priceUsd}</span></TableCell>
                          <TableCell><span style={{ color: row.priceChange >= 0 ? '#17c671' : '#ea3943' }}>{row.priceChange} %</span></TableCell>
                          <TableCell><span>{autoConvert(row.volume)}</span></TableCell>
                          <TableCell><span>{autoConvert(row.txns.buys + row.txns.sells)}</span></TableCell>
                          <TableCell><span>{autoConvert(row.liquidity.usd)}</span></TableCell>
                          <TableCell>
                            <Link href={`https://app.uniswap.org/#/swap?inputCurrency=${row.quoteToken.address}&outputCurrency=${row.baseToken.address}`} target="_blank">
                              <Image src={`/assets/${row.dexId}.png`} alt="logo" width={20} height={20} />
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 30]} // 设置每页行数选项
                  component="div"
                  count={pairCount} // 数据总数
                  rowsPerPage={rowsPerPage}
                  page={currentPage}
                  onPageChange={(event, newPage) => setCurrentPage(newPage)} // 处理页码变化的回调
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setCurrentPage(0); // 当每页行数变化时，回到第一页
                  }}
                />
              </Card>
            </div>
          </div>
          <div className="w-full h-full">
            <Card sx={{ minWidth: 200, backgroundColor: 'rgba(239, 203, 128, 0.28)', width: 400 }} className="h-full ml-16">
              <Image src='/assets/fire-flame.png' width={70} height={70} className="fire-flame" />
              <div className="grid grid-flow-row grid-cols-2 px-3 mt-5 ml-2 mr-10">
                <div>
                  <p className="text-left font-semibold">Hot Pairs</p>
                </div>
                <div>
                  <p className="text-right more">More&gt;</p>
                </div>
              </div>
              <Table
                sx={{
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none",
                  }
                }}>
                <TableBody>
                  {featuredPairs.map((hotPair) => (
                    <TableRow key={hotPair.pairAddress}>
                      <TableCell>
                        <Link href={`/pairInfo?pairAddress=${hotPair.pairAddress}`}>
                          <Image src={`http://localhost:3001/${hotPair.baseTokenInfo.logo}`} width={30} height={30} className="inline mr-2 rounded-full" />
                          <span></span><span>{hotPair.baseToken.symbol}</span><span style={{ color: "#818ea3" }}>/</span><span style={{ color: "#818ea3" }}>{hotPair.quoteToken.symbol}</span>
                        </Link>
                      </TableCell>
                      <TableCell><span>{hotPair.priceUsd}</span></TableCell>
                      <TableCell><span style={{ color: hotPair.priceChange >= 0 ? '#17c671' : '#ea3943' }}>{hotPair.priceChange} %</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
