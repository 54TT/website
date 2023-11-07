import React, {useEffect, useState} from "react";
import axios from 'axios';
import Link from "next/link";import  baseUrl from '/utils/baseUrl';
import Image from 'next/image';
import {formatDecimal, sendGetRequestWithSensitiveData, getRelativeTimeDifference, formatDateTime} from './Utils';
// import { useAccount, useNetwork} from "wagmi";
import {useRouter} from 'next/router';
import moment from 'moment';
import {notification, Pagination, Table, Card} from "antd";
import _ from "lodash";
import {get} from "../utils/axios";

export default function Presale() {
    // const { chain } = useNetwork();
    const router = useRouter();
    const [launch, setLaunch] = useState([]);
    const [launchBol, setLaunchBol] = useState(true);
    const [presales, setPresales] = useState([]);
    const [chainId, setChainId] = useState("ethereum");
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(30);
    const [presaleCount, setPresaleCount] = useState(0);
    const hint = () => {
        notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
        });
    }
    const [refreshedTime, setRefreshedTime] = useState(moment());
    const updateRefreshedTime = () => {
        setRefreshedTime(moment());
    };

    const getParams = (url, params) => {
        get(url, params).then((res) => {
            if (res.status === 200) {
                let data = res.data
                if (data.data && data.data.length > 0) {
                    setLaunch(data.data)
                    setLaunchBol(false)
                } else {
                    setLaunch([])
                    setLaunchBol(false)
                }
            }
        }).catch(err => {
            hint()
        })
    }

    useEffect(() => {
        getParams('/queryPresaleAndLaunch', '')
        // const intervalId = setInterval(updateRefreshedTime, 1000);
        // return () => clearInterval(intervalId);
    }, []);
    const changeImg = (record) => {
        const data = _.cloneDeep(launch)
        data.map((i) => {
            if (i.key === record.key) {
                i.img = !i.img;
            }
            return i
        })
        setLaunch(data)
    }

    const push = (record, name) => {
        if (name === 'a') {
            window.open(record.telegram)
        } else if (name === 'b') {
            window.open(record.twitter)
        } else {
            window.open(record.website)
        }
    }

    const columns = [
        {
            title: '',
            dataIndex: 'age',
            key: 'age',
            width: 100,
            render: () => {
                return <img src="/avatar.png" alt="" width={'50px'}/>
            }
        },
        {
            title: 'Pair',
            dataIndex: 'name',
            render: (text) => {
                return <p style={{fontWeight: 'bold', fontSize: '20px', textAlign: 'center'}}>{text}</p>
            }
        },
        {
            title: 'Social Info',
            dataIndex: 'address',
            width: 200,
            render: (text, record) => {
                return <div
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'}}>
                    <img src={'/Telegram.png'} alt="" width={'40px'} onClick={() => push(record, 'a')}/>
                    <img src={'/TwitterCircled.png'} alt="" width={'40px'} onClick={() => push(record, 'b')}/>
                    <img src={'/Website.png'} alt="" width={'40px'} onClick={() => push(record, 'c')}/>
                </div>
            }
        },
        {
            title: 'Pre-sale ends',
            dataIndex: 'presale_time',
            sorter: {
                compare: (a, b) => {
                    const data = moment(a.presale_time).format('YYYY-MM-DD HH:mm:ss')
                    const pa = moment(b.presale_time).format('YYYY-MM-DD HH:mm:ss')
                    return moment(pa).isBefore(data)
                }
            },
            // moment('2010-10-20').isBefore('2010-10-21');
            render: (text) => {
                return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img
                    src="/Time.png" alt="" width={'30px'}/> <span>{moment(text).format('YYYY-MM-DD:HH:mm:ss')}</span>
                </div>
            }
        },
        {
            title: 'Launch time',
            dataIndex: 'launch_time',
            sorter: {
                compare: (a, b) => {
                    const data = moment(a.launch_time).format('YYYY-MM-DD HH:mm:ss')
                    const pa = moment(b.launch_time).format('YYYY-MM-DD HH:mm:ss')
                    return moment(pa).isBefore(data)
                },
            },
            render: (text) => {
                return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img
                    src="/Time.png" alt="" width={'30px'}/> <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
                </div>
            }
        },
        {
            title: 'Actions',
            key: 'action',
            width: 50,
            render: (text, record) => {
                return <img src={`${record.img ? "/StarHave.png" : "/StarNone.png"}`} alt="" width={'20px'}
                            style={{cursor: 'pointer'}} onClick={() => changeImg(record)}/>
            }
        },
    ];
    const fetchData = async (chainIdParam, pageIndex, pageSize) => {
        try {
            const headers = {
                'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
                'Content-Type': 'application/json', // 根据需要添加其他标头
            };

            let pairCount = await axios.get( baseUrl+'/queryAllPresaleCount', {
                headers: headers,
                params: {}
            });
            setPresaleCount(pairCount.data[0].count);

            let data = await axios.get( baseUrl+'/queryAllPresale', {
                headers: headers,
                params: {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                }
            });
            data = data.data
            setPresales(data);
        } catch (error) {
            notification.error({
                message: `Please note`, description: 'Error reported', placement: 'topLeft',
            });
        }
    };

    // useEffect(() => {
    //   let chainName = chain.name;
    //   chainName = chainName.toLocaleLowerCase();
    //   setChainId(chainName);
    //
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
                width: '100%', border: 'none'
            }}>
                <div style={{
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src="/Group.png" alt="" width={'70px'}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}}>PRESALE & LAUNCH</span>
                    </div>
                    <Pagination defaultCurrent={1} total={50} pageSize={10}/>
                </div>
                <Table className={'hotTable presale'} columns={columns} bordered={launchBol} dataSource={launch}
                       pagination={false}/>
            </Card>
            <p style={{
                marginTop: '80px',
                textAlign: 'center',
                lineHeight: '1',
                fontSize: '20px',
                color: 'rgb(98,98,98)'
            }}>©DEXPert.io</p>
        </div>
    )
    {/*<div className="mx-auto mt-20 ml-20 mr-5">*/
    }
    {/*  <div className="mx-auto flex flex-col text-center justify-center h-full">*/
    }
    {/*    <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 mt-5">*/
    }
    {/*      <div className="flex flex-col rounded-lg">*/
    }
    {/*        <TableContainer>*/
    }
    {/*          <Table size="medium">*/
    }
    {/*            <TableHead sx={{*/
    }
    {/*              [`& .${tableCellClasses.root}`]: {*/
    }
    {/*                borderBottom: "none"*/
    }
    {/*              }*/
    }
    {/*            }}>*/
    }
    {/*              <TableRow>*/
    }
    {/*                <TableCell><span>token</span></TableCell>*/
    }
    {/*                <TableCell><span>platform</span></TableCell>*/
    }
    {/*                <TableCell><span>time</span></TableCell>*/
    }
    {/*                <TableCell><span>link</span></TableCell>*/
    }
    {/*              </TableRow>*/
    }
    {/*            </TableHead>*/
    }
    {/*            <TableBody*/
    }
    {/*              sx={{*/
    }
    {/*                [`& .${tableCellClasses.root}`]: {*/
    }
    {/*                  borderBottom: ".0625rem solid #23323c!important",*/
    }
    {/*                }*/
    }
    {/*              }}>*/
    }
    {/*              {presales.map((row) => (*/
    }
    {/*                <TableRow key={row.tokenAddress} className="pair-row">*/
    }
    {/*                  <TableCell>*/
    }
    {/*                    <Link href={``}>*/
    }
    {/*                      <Image src={`http://192.168.8.104:3004/${row.tokenLogo}`} width={20} height={20} className="inline mr-2" />*/
    }
    {/*                      <span></span><span>{row.tokenSymbol}</span>*/
    }
    {/*                    </Link>*/
    }
    {/*                  </TableCell>*/
    }
    {/*                  <TableCell><span>{row.presalePlatform}</span></TableCell>*/
    }
    {/*                  <TableCell><span>{getRelativeTimeDifference(formatDateTime(row.presaleTime))}</span></TableCell>*/
    }
    {/*                  <TableCell><span>{row.presaleLink}</span></TableCell>*/
    }
    {/*                </TableRow>*/
    }
    {/*              ))}*/
    }
    {/*            </TableBody>*/
    }
    {/*          </Table>*/
    }
    {/*        </TableContainer>*/
    }
    {/*        <TablePagination*/
    }
    {/*          rowsPerPageOptions={[10, 30]} // 设置每页行数选项*/
    }
    {/*          component="div"*/
    }
    {/*          count={presaleCount} // 数据总数*/
    }
    {/*          rowsPerPage={rowsPerPage}*/
    }
    {/*          page={currentPage}*/
    }
    {/*          onPageChange={(event, newPage) => setCurrentPage(newPage)} // 处理页码变化的回调*/
    }
    {/*          onRowsPerPageChange={(event) => {*/
    }
    {/*            setRowsPerPage(parseInt(event.target.value, 10));*/
    }
    {/*            setCurrentPage(0); // 当每页行数变化时，回到第一页*/
    }
    {/*          }}*/
    }
    {/*        />*/
    }
    {/*      </div>*/
    }
    {/*    </div>*/
    }
    {/*  </div>*/
    }
    {/*</div>*/
    }
}
