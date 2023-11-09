import React, {useEffect, useState} from "react";
import axios from 'axios';
import Link from "next/link";
import  baseUrl from '/utils/baseUrl'
import Image from 'next/image';
import {Table, Pagination, notification,Card} from 'antd'
import {formatDecimal, sendGetRequestWithSensitiveData} from './utils';
import _ from 'lodash'
import {ApolloClient, InMemoryCache, useQuery} from "@apollo/client";
import {gql} from "graphql-tag";
import {useRouter} from "next/router";
const client = new ApolloClient({
    uri: 'http://192.168.8.101:8000/subgraphs/name/levi/uniswapv2', cache: new InMemoryCache(),
});
export default function NewPair() {
    const GET_DATA = gql`
query NewPair {
  pairs(orderBy: createdAtTimestamp, orderDirection: desc, first: 10) {
    reserveETH
    createdAtTimestamp
    txCount
    token1 {
      id
      name
      symbol
    }
    token0 {
      id
      symbol
      name
    }
  }
}
`;
    const router= useRouter()
    const [pairs, setPairs] = useState([]);
    const [chainId, setChainId] = useState("ethereum");
    const [timeFilter, setTimeFilter] = useState("24h");
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pairCount, setPairCount] = useState(0);
    const dataParams = [
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
    const [loadingBool, setLoadingBool] = useState(true);
    const fetchData = async (chainIdParam, timeFilterParam, pageIndex, pageSize) => {
        try {
            const headers = {
                'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
                'Content-Type': 'application/json', // 根据需要添加其他标头
            };

            let pairCount = await axios.get( baseUrl+'/queryAllPairCount', {
                headers: headers,
                params: {}
            });
            setPairCount(pairCount.data[0].count);

            let data = await axios.get( baseUrl+'/queryAllPair', {
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

                const baseTokenInfo = await axios.get( baseUrl+'/queryTokenByAddress', {
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
                    notification.error({
                        message: `Please note`, description: 'Error reported', placement: 'topLeft',
                    });
                });
            setTimeFilter(timeFilterParam);
            // setPairs(newPairInfos);
        } catch (error) {
            notification.error({
                message: `Please note`, description: 'Error reported', placement: 'topLeft',
            });
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
        // fetchData(chainId, timeFilter, currentPage, rowsPerPage);

        // const timer = setInterval(() => {
        //     fetchData(chainId, timeFilter, currentPage, rowsPerPage);
        // }, 5000);

        // return () => {
        //     clearInterval(timer);
        // };
    }, [chainId, timeFilter, currentPage, rowsPerPage]);
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
            title: 'Pair',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <div style={{display: 'flex', alignItems: 'center'}}>
                <img src="/avatar.png" alt="" width={'40px'}/>
                <div style={{marginLeft: '15px'}}>
                    <p style={{display: 'flex', alignItems: 'flex-end', lineHeight: '1'}}><span
                        style={{fontSize: '18px'}}>CAT/</span><span style={{color: 'rgb(98,98,98)'}}>WATTH</span></p>
                    <p style={{lineHeight:'1',marginTop:'3px'}}>98a09fs0fhsd8f9a0sf</p>
                </div>
            </div>,
        },
        {
            title: 'Price',
            dataIndex: 'age',
            key: 'age',
            render:()=>{
                return <p>$1.3435435435</p>
            }
        },
        {
            title: '%24',
            dataIndex: 'address',
            key: 'address',
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },
            render:()=>{
                return <p style={{lineHeight:1,width:'84%',backgroundColor:'rgb(188,238,125)',textAlign:'center',padding:'5px 0',borderRadius:'5px'}}>6345%</p>
            }
        },
        {
            title: 'Created',
            key: 'tags',
            dataIndex: 'tags',
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },
            render:()=>{
                return <span>3 year</span>
            }
        },
        {
            title: 'Volume',
            key: 'action',
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },
            render:()=>{
                return <span>$218.06M</span>
            }
        },
        {
            title: 'Swaps',
            key: 'action',
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },   render:()=>{
                return <span>4.58K</span>
            }
        },
        {
            title: 'Liquidity',
            key: 'action',
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },
            render:()=>{
                return <span>134.53M</span>
            }
        },
        {
            title: 'T.M.Cap',
            key: 'action',
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },
            render:()=>{
                return <span>$65.32B</span>
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
    const {loading, error, data} = useQuery(GET_DATA, {client});
    useEffect(() => {
        if (!loading) {
            if (data && data?.pairs.length > 0) {
                setTableParams(data?.pairs)
                setLoadingBool(false)
            } else {
                setTableParams([])
                setLoadingBool(false)
            }
        } else {
            setLoadingBool(true)
        }
    }, [data, loading])
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
                        <img src="/wallet.png" alt="" width={'70px'}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}}>COMING SOON</span>
                    </div>
                    <Pagination defaultCurrent={1} total={50} pageSize={10}/>
                </div>
                <Table rowKey={(i)=> i?.token0?.id}    onRow={(record) => {
                    return {
                        onClick: (event) => {
                            // const data  = record.pairAddress
                            // router.push(`/details?pairAddress=${data}`)
                        },
                    };
                }} className={'hotTable'} loading={loadingBool} columns={columns} bordered={false} dataSource={tableParams} pagination={false}/>
            </Card>
            <p style={{marginTop:'80px',textAlign:'center',lineHeight:'1',fontSize:'20px',color:'rgb(98,98,98)'}}>©DEXPert.io</p>
        </div>
        // <div className="mx-auto mt-20 ml-20 mr-5">
        //   <div className="mx-auto flex flex-col text-center justify-center h-full">
        //     <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 mt-5 justify-content text-right">
        //       <ButtonGroup variant="contained" aria-label="outlined button group">
        //         {["24h", "6h", "1h", "5m"].map((filter) => (
        //           <Button key={filter} className="block" onClick={() => fetchData(chainId, filter)}>{filter}</Button>
        //         ))}
        //       </ButtonGroup>
        //     </div>
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
        //                 <TableCell><span className="aa">Pair</span></TableCell>
        //                 <TableCell><span>Price</span></TableCell>
        //                 <TableCell><span>% {timeFilter}</span></TableCell>
        //                 <TableCell><span>Volume</span></TableCell>
        //                 <TableCell><span>Swaps</span></TableCell>
        //                 <TableCell><span>Liquidity</span></TableCell>
        //                 <TableCell><span>Dex</span></TableCell>
        //               </TableRow>
        //             </TableHead>
        //             <TableBody
        //               sx={{
        //                 [`& .${tableCellClasses.root}`]: {
        //                   borderBottom: ".0625rem solid #23323c!important",
        //                 }
        //               }}>
        //               {pairs.map((row) => (
        //                 <TableRow key={row.pairAddress} className="pair-row">
        //                   <TableCell>
        //                     <Link href={`/pairInfo?chainId=${chainId}&pairAddress=${row.pairAddress}`}>
        //                       <Image src={`http://192.168.8.104:3004/${row.baseTokenInfo.logo}`} width={20} height={20} className="inline mr-2" />
        //                       <span></span><span>{row.baseToken.symbol}</span><span style={{ color: "#818ea3" }}>/</span><span style={{ color: "#818ea3" }}>{row.quoteToken.symbol}</span>
        //                     </Link>
        //                   </TableCell>
        //                   <TableCell><span>{row.priceUsd}</span></TableCell>
        //                   <TableCell><span style={{ color: row.priceChange >= 0 ? '#17c671' : '#ea3943' }}>{row.priceChange} %</span></TableCell>
        //                   <TableCell><span>{autoConvert(row.volume)}</span></TableCell>
        //                   <TableCell><span>{autoConvert(row.txns.buys + row.txns.sells)}</span></TableCell>
        //                   <TableCell><span>{autoConvert(row.liquidity.usd)}</span></TableCell>
        //                   <TableCell>
        //                     <Link href={`https://app.uniswap.org/#/swap?inputCurrency=${row.quoteToken.address}&outputCurrency=${row.baseToken.address}`} target="_blank">
        //                       <Image src={`/assets/${row.dexId}.png`} alt="logo" width={20} height={20} />
        //                     </Link>
        //                   </TableCell>
        //                 </TableRow>
        //               ))}
        //             </TableBody>
        //           </Table>
        //         </TableContainer>
        //         <TablePagination
        //           rowsPerPageOptions={[10, 30]} // 设置每页行数选项
        //           component="div"
        //           count={pairCount} // 数据总数
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
