import React, { useEffect, useState } from "react";
import axios from 'axios';
import Link from "next/link";
import Image from 'next/image';
import  baseUrl from '/utils/baseUrl'
import { formatDecimal, sendGetRequestWithSensitiveData, getRelativeTimeDifference, formatDateTime } from './utils';
import { useAccount, useNetwork} from "wagmi";
import dayjs from 'dayjs';
import {notification, Pagination, Table,Card} from "antd";
import _ from "lodash";
import {get} from "../utils/axios";
import {useRouter} from 'next/router'
export default function Featured() {

  // const { chain } = useNetwork();
  const router= useRouter()
  const [launchs, setLaunchs] = useState([]);
  const [chainId, setChainId] = useState("ethereum");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [launchCount, setLaunchCount] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [featuredBol, setFeaturedBol] = useState(true);
  const [refreshedTime, setRefreshedTime] = useState(dayjs());
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  const [tableParams, setTableParams] = useState([]);
  const hint = () => {
    notification.error({
      message: `Please note`, description: 'Error reported', placement: 'topLeft',
    });
  }
  const changeImg=(record)=>{
    const data = _.cloneDeep(tableParams)
    data.map((i)=>{
      if(i.key===record.key){
        i.img = !i.img;
      }
      return i

    })
    setTableParams(data)
  }
  const columns = [
    {
      title: 'Pair info',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div style={{display: 'flex', alignItems: 'center'}}>
        <img src="/avatar.png" alt="" width={'40px'}/>
        <div>
          <p style={{display: 'flex', alignItems: 'flex-end', lineHeight: '1'}}><span
              style={{fontSize: '18px'}}>CAT/</span><span style={{color: 'rgb(98,98,98)'}}>WATTH</span></p>
          <p style={{lineHeight:'1',marginTop:'3px'}}>98a09fs0fhsd8f9a0sf</p>
        </div>
      </div>,
    },
    {
      title: 'Listed Since',
      dataIndex: 'age',
      key: 'age',
      render:()=>{
        return <p style={{display:'flex',alignItems:'center'}}><img src="/Time.png" alt="" width={'25px'}/> <span>3m55ss</span></p>
      }
    },
    {
      title: 'Token Price USD',
      dataIndex: 'address',
      key: 'address',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
      },
      render:()=>{
        return <p>$0.00007563</p>
      }
    },
    {
      title: 'Total Liquidity',
      key: 'tags',
      dataIndex: 'tags',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
      },
      render:()=>{
        return <span>$5,389</span>
      }
    },
    {
      title: 'Pool Variation',
      key: 'action',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
      },
      render:()=>{
        return <span>1.03ETH</span>
      }
    },
    {
      title: 'Amount',
      key: 'action',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
      },   render:()=>{
        return <p style={{lineHeight:1,width:'84%',backgroundColor:'rgb(188,238,125)',textAlign:'center',padding:'5px 0',borderRadius:'5px'}}>6345%</p>
      }
    },
    {
      title: 'Pool Remaining',
      key: 'action',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
      },
      render:()=>{
        return <div style={{display:'flex',alignItems:'center'}}><span>3.39ETH</span><img src="/Website.png" alt="" width={'20px'}/><img src="/Website.png" alt="" width={'20px'}/><img src="/Website.png" alt="" width={'20px'}/></div>
      }
    },
    {
      title: 'Actions',
      key: 'action',
      width:50,
      render:(text,record)=>{
        return <img src={`${record.img?"/StarHave.png":"/StarNone.png"}`} alt="" width={'20px'} style={{cursor:'pointer'}} onClick={()=>changeImg(record)}/>
      }
    },
  ];
  const updateRefreshedTime = () => {
    setRefreshedTime(dayjs());
  };
  const getParams = (url, params) => {
    get(url, params).then(async (res) => {
      if (res.status === 200) {
        let data = res.data
          if (data) {
            const pairArray = data.map(item => item.pairAddress).join(",");
            const pairInfosResponse = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/ethereum/${pairArray}`);
            if (pairInfosResponse.status === 200) {
              setFeaturedBol(false)
              setTableParams(pairInfosResponse.data?.pairs.length > 0 ? pairInfosResponse.data?.pairs : [])
            } else {
              setFeaturedBol(false)
              setTableParams([])
            }
          } else {
            setFeaturedBol(false)
            setTableParams([])
          }
      }
    }).catch(err => {
      hint()
    })
  }
  useEffect(() => {
    getParams('/queryFeatured', '')
    // const intervalId = setInterval(updateRefreshedTime, 1000);
    // return () => clearInterval(intervalId);
  }, []);

  const fetchData = async (chainIdParam, pageIndex, pageSize) => {
    try {
      const headers = {
        'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
        'Content-Type': 'application/json', // 根据需要添加其他标头
      };
      
      let pairCount = await axios.get( baseUrl+'/queryAllLaunchCount', {
          headers: headers,
          params: {}
        });
        setLaunchCount(pairCount.data[0].count);

      let data = await axios.get( baseUrl+'/queryAllLaunch', {
          headers: headers,
          params: {
            pageIndex: pageIndex,
            pageSize: pageSize
          }
        });
      data = data.data
      setLaunchs(data);
    } catch (error) {
      notification.error({
        message: `Please note`, description: 'Error reported', placement: 'topLeft',
      });
    }
  };

  // useEffect(() => {
  //   let chainName = "ethereum";
  //   if(chain){
  //     chainName = chain.name;
  //     chainName = chainName.toLocaleLowerCase();
  //     setChainId(chainName);
  //   }
  //   fetchData(chainName, currentPage, rowsPerPage);
  //
  //   const timer = setInterval(() => {
  //     fetchData(chainName, currentPage, rowsPerPage);
  //   }, 5000);
  //
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [chain, currentPage, rowsPerPage]);

  return (
      <div style={{marginRight: '20px'}}>
        <Card style={{
          minWidth: 700,
          backgroundColor: 'rgb(253, 213, 62)',
          width: '100%', border:'none'
        }}>
          <div style={{
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <img src="/gpsReceiving.png" alt="" width={'70px'}/>
              <span style={{fontWeight: 'bold', fontSize: '26px'}}>LIVE NEW PAIRS</span>
            </div>
            <Pagination defaultCurrent={1} total={50} pageSize={10}/>
          </div>
          <Table className={'hotTable'} columns={columns}    onRow={(record) => {
            return {
              onClick: (event) => {
                const data  = record.pairAddress
                router.push(`/details?pairAddress=${data}`,)
              },
            };
          }} loading={featuredBol} bordered={false} dataSource={tableParams} pagination={false}/>
        </Card>
        <p style={{marginTop:'80px',textAlign:'center',lineHeight:'1',fontSize:'20px',color:'rgb(98,98,98)'}}>©DEXPert.io</p>
      </div>

    // <div className="mx-auto mt-20 ml-20 mr-5">
    //   <div className="mx-auto flex flex-col text-center justify-center h-full">
    //     <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 mt-5">
    //       <div className="flex flex-col rounded-lg">
    //         <TableContainer>
    //           <Table size="medium">
    //             <TableHead sx={{
    //               [`& .${tableCellClasses.root}`]: {
    //                 borderBottom: "none"
    //               }
    //             }}>
    //               <TableRow>
    //                 <TableCell><span>token</span></TableCell>
    //                 <TableCell><span>platform</span></TableCell>
    //                 <TableCell><span>time</span></TableCell>
    //                 <TableCell><span>link</span></TableCell>
    //               </TableRow>
    //             </TableHead>
    //             <TableBody
    //               sx={{
    //                 [`& .${tableCellClasses.root}`]: {
    //                   borderBottom: ".0625rem solid #23323c!important",
    //                 }
    //               }}>
    //               {launchs.map((row) => (
    //                 <TableRow key={row.tokenAddress} className="pair-row">
    //                   <TableCell>
    //                     <Link href={``}>
    //                       <Image src={`http://192.168.8.104:3004/${row.tokenLogo}`} width={20} height={20} className="inline mr-2" />
    //                       <span></span><span>{row.tokenSymbol}</span>
    //                     </Link>
    //                   </TableCell>
    //                   <TableCell><span>{row.launchPlatform}</span></TableCell>
    //                   <TableCell><span>{getRelativeTimeDifference(formatDateTime(row.launchTime))}</span></TableCell>
    //                   <TableCell><span>{row.launchLink}</span></TableCell>
    //                 </TableRow>
    //               ))}
    //             </TableBody>
    //           </Table>
    //         </TableContainer>
    //         <TablePagination
    //           rowsPerPageOptions={[10, 30]} // 设置每页行数选项
    //           component="div"
    //           count={launchCount} // 数据总数
    //           rowsPerPage={rowsPerPage}
    //           page={currentPage}
    //           onPageChange={(event, newPage) => setCurrentPage(newPage)} // 处理页码变化的回调
    //           onRowsPerPageChange={(event) => {
    //             setRowsPerPage(parseInt(event.target.value, 10));
    //             setCurrentPage(0); // 当每页行数变化时，回到第一页
    //           }}
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
