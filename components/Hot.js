import React, { useEffect, useState } from "react";
import { Table, TableBody, TableRow, TableContainer, TableHead } from '@mui/material';
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import Link from "next/link";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Image from 'next/image';
import { formatDecimal, sendGetRequestWithSensitiveData } from './utils';

export default function Hot() {

  const [pairs, setPairs] = useState([]);
  const [chainId, setChainId] = useState("ethereum");
  const [timeFilter, setTimeFilter] = useState("24h");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pairCount, setPairCount] = useState(0);

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
        const newPairInfo = {
          pairAddress: pairInfo.pairAddress,
          baseToken: pairInfo.baseToken,
          priceUsd: formatDecimal(pairInfo.priceUsd, 5),
          quoteToken: pairInfo.quoteToken,
          liquidity: pairInfo.liquidity,
          dexId: pairInfo.dexId,
          url: pairInfo.url,
        };

        const baseTokenInfo = await axios.get('http://localhost:3001/queryTokenByAddress', {
          headers: headers,
          params: {
            address: pairInfo.baseToken.address
          }
        });
        newPairInfo.baseTokenInfo = baseTokenInfo.data[0]
        if (data === null || data === []) {
          throw new error("data is null")
        }

        const timeFrame = timeFilterParam.toLowerCase();
        const txnsFilter = timeFrame === "24h" ? "h24" : timeFrame === "6h" ? "h6" : timeFrame === "1h" ? "h1" : timeFrame === "5m" ? "m5" : "h24"
        newPairInfo.priceChange = pairInfo.priceChange[txnsFilter];
        newPairInfo.volume = pairInfo.volume[txnsFilter];
        newPairInfo.txns = {
          buys: pairInfo.txns[txnsFilter].buys,
          sells: pairInfo.txns[txnsFilter].sells,
        };

        return newPairInfo;
      });

      Promise.all(newPairInfos)
        .then((resolvedPairs) => {

          setPairs(resolvedPairs);
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

  const autoConvert = (number) => {
    if (Math.abs(number) >= 1000000) {
      return `${(number / 1000000).toFixed(2).replace(/\.?0*$/, '')}M`;
    } else if (Math.abs(number) >= 1000) {
      return `${(number / 1000).toFixed(2).replace(/\.?0*$/, '')}K`;
    } else {
      return number.toFixed(2).replace(/\.?0*$/, '');
    }
  };

  useEffect(() => {
    fetchData(chainId, timeFilter, currentPage, rowsPerPage);

    const timer = setInterval(() => {
      fetchData(chainId, timeFilter, currentPage, rowsPerPage);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [chainId, timeFilter, currentPage, rowsPerPage]);

  return (
    <div className="mx-auto mt-20 ml-20 mr-5">
      <div className="mx-auto flex flex-col text-center justify-center h-full">
        <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 mt-5 justify-content text-right">
          <ButtonGroup variant="contained" aria-label="outlined button group">
            {["24h", "6h", "1h", "5m"].map((filter) => (
              <Button key={filter} className="block" onClick={() => fetchData(chainId, filter)}>{filter}</Button>
            ))}
          </ButtonGroup>
        </div>
        <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 mt-5">
          <div className="flex flex-col rounded-lg">
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
                        <Link href={`/pairInfo?chainId=${chainId}&pairAddress=${row.pairAddress}`}>
                          <Image src={`http://localhost:3001/${row.baseTokenInfo.logo}`} width={20} height={20} className="inline mr-2" />
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
          </div>
        </div>
      </div>
    </div>
  );
}
