import React, { useEffect, useState } from "react";
import { Table, TableBody, TableRow, TableContainer, TableHead } from '@mui/material';
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import Link from "next/link";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Image from 'next/image';
import { formatDecimal, sendGetRequestWithSensitiveData, getRelativeTimeDifference, formatDateTime } from './Utils';
import { useAccount, useNetwork} from "wagmi";
import moment from 'moment';

export default function Presale() {
  const { chain } = useNetwork();
  const [presales, setPresales] = useState([]);
  const [chainId, setChainId] = useState("ethereum");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [presaleCount, setPresaleCount] = useState(0);

  const [refreshedTime, setRefreshedTime] = useState(moment());

  const updateRefreshedTime = () => {
    setRefreshedTime(moment());
  };

  useEffect(() => {
    const intervalId = setInterval(updateRefreshedTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async (chainIdParam, pageIndex, pageSize) => {
    try {
      const headers = {
        'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
        'Content-Type': 'application/json', // 根据需要添加其他标头
      };
      
      let pairCount = await axios.get('http://localhost:3001/queryAllPresaleCount', {
          headers: headers,
          params: {}
        });
      setPresaleCount(pairCount.data[0].count);

      let data = await axios.get('http://localhost:3001/queryAllPresale', {
          headers: headers,
          params: {
            pageIndex: pageIndex,
            pageSize: pageSize
          }
        });
      data = data.data
      setPresales(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let chainName = chain.name;
    chainName = chainName.toLocaleLowerCase();
    setChainId(chainName);

    fetchData(chainName, currentPage, rowsPerPage);

    const timer = setInterval(() => {
      fetchData(chainName, currentPage, rowsPerPage);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [chain, currentPage, rowsPerPage]);

  return (
    <div className="mx-auto mt-20 ml-20 mr-5">
      <div className="mx-auto flex flex-col text-center justify-center h-full">
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
                    <TableCell><span>token</span></TableCell>
                    <TableCell><span>platform</span></TableCell>
                    <TableCell><span>time</span></TableCell>
                    <TableCell><span>link</span></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    [`& .${tableCellClasses.root}`]: {
                      borderBottom: ".0625rem solid #23323c!important",
                    }
                  }}>
                  {presales.map((row) => (
                    <TableRow key={row.tokenAddress} className="pair-row">
                      <TableCell>
                        <Link href={``}>
                          <Image src={`http://localhost:3001/${row.tokenLogo}`} width={20} height={20} className="inline mr-2" />
                          <span></span><span>{row.tokenSymbol}</span>
                        </Link>
                      </TableCell>
                      <TableCell><span>{row.presalePlatform}</span></TableCell>
                      <TableCell><span>{getRelativeTimeDifference(formatDateTime(row.presaleTime))}</span></TableCell>
                      <TableCell><span>{row.presaleLink}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 30]} // 设置每页行数选项
              component="div"
              count={presaleCount} // 数据总数
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
