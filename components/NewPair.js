import React, {useEffect, useState} from "react";
import {Table, Pagination, Card} from 'antd'
import _ from 'lodash'
import {ApolloClient, InMemoryCache, useQuery} from "@apollo/client";
import {gql} from "graphql-tag";
import dayjs from "dayjs";
import {autoConvertNew, } from '/utils/set'
const client = new ApolloClient({
    uri: 'http://188.166.191.246:8000/subgraphs/name/dsb/uniswap', cache: new InMemoryCache(),
});
export default function NewPair() {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const GET_DATA=gql`query LiveNewPair {
  uniswapFactories {
    id
    pairCount
  }
  bundles {
    id
    ethPrice
  }
  pairs(first: ${rowsPerPage}, skip: ${(currentPage - 1) * 10}, orderBy: createdAtTimestamp, orderDirection: desc) {
    id
    reserveETH  
    liquidityPositionSnapshots(orderDirection: desc, first: 1) {
      token0PriceUSD
      token1PriceUSD
    }
    volumeUSD
    trackedReserveETH
    token0 {
      id
      name
      symbol
    }
    token1 {
      id
      name
      symbol
    }
    txCount
    createdAtTimestamp
    createdAtBlockNumber
  }
}`
    const [tableParams, setTableParams] = useState([]);
    const [tableTotal, setTableTotal] = useState(0);
    const {loading, error, data} = useQuery(GET_DATA, {client});
    useEffect(() => {
        if (!loading) {
            if (data && data?.pairs.length > 0) {
                setTableParams(data?.pairs)
                setTableTotal(data?.uniswapFactories[0]?.pairCount)
            } else {
                setTableParams([])
            }
        } else {
            setTableParams([])
        }
    }, [loading, data]);
    const chang = (e, a) => {
        setCurrentPage(e)
        setRowsPerPage(a)
    }
    const changeImg = (record) => {
        const data = _.cloneDeep(tableParams)
        data.map((i) => {
            if (i.key === record.key) {
                i.img = !i.img;
            }
            return i

        })
        setTableParams(data)
    }

    const columns = [
        {
            title:'',align: 'right',width: 40,
            render:(text, record)=>{
                return   <p style={{
                    borderRadius: '50%',
                    fontSize: '20px',
                    width: '40px',
                    lineHeight: '40px',
                    textAlign: "center",
                    backgroundColor: 'black',
                    color: 'white'
                }}>{record?.token0?.symbol?.slice(0, 1)||''}</p>
            }
        },
        {
            title: 'Pair',
            dataIndex: 'name',
            render: (text, record) => <div style={{
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'start',
            }}>
                <div style={{marginLeft: '15px'}}>
                    <p style={{display: 'flex', alignItems: 'flex-end', lineHeight: '1'}}><span
                        style={{fontSize: '18px'}}>{record?.token0?.symbol?record?.token0?.symbol.length>7?record?.token0?.symbol.slice(0,5):record?.token0?.symbol+'/':''}</span><span
                        style={{color: 'rgb(98,98,98)'}}>{record?.token1?.symbol?record?.token1?.symbol.length>7?record?.token1?.symbol.slice(0,5):record?.token1?.symbol :''}</span></p>
                    <p style={{
                        lineHeight: '1',
                        marginTop: '3px',
                    }}>{record?.id?.slice(0, 4)}...{record?.id?.slice(-4)}</p>
                </div>
            </div>,
        },
        {
            title: 'Price($)',
            dataIndex: 'age', align: 'center',
            render: (text,record) => {
                const data = record?.liquidityPositionSnapshots[0]?.token0PriceUSD||0
                return <p>{data?autoConvertNew(Number(data)):0}</p>
            }
        },
        {
            title: 'Created', align: 'center',
            dataIndex: 'tags',
            render: (_, record) => {
                return <span>{record?.createdAtTimestamp ? dayjs.unix(Number(record.createdAtTimestamp)).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
            }
        },
        {
            title: 'Volume($)', align: 'center',
            dataIndex: 'volumeUSD',
            render: (text) => {
                return <span>{text?text.length>10?text.toString().slice(0,7):text:0}</span>
            }
        },
        {
            title: 'ReserveETH', align: 'center',
            dataIndex: 'reserveETH',
            render: (text) => {
                return <span>{text?text.length>10?text.toString().slice(0,7):text:0}</span>
            }
        },
        {
            title: 'TrackedReserveETH', align: 'center',
            dataIndex: 'trackedReserveETH',
            render: (text) => {
                return <span>{text?text.length>10?text.toString().slice(0,7):text:0}</span>
            }
        },
        {
            title: 'txCount', align: 'center',
            dataIndex: 'txCount',
            render: (text) => {
                return <span>{text ? text : ''}</span>
            }
        },
        {
            title: 'Actions',
            key: 'action', align: 'center',
            width: 50,
            render: (text, record) => {
                return <img src={`${record.img ? "/StarHave.png" : "/StarNone.png"}`} alt="" height={20} width={20}
                            style={{cursor: 'pointer'}} onClick={() => changeImg(record)}/>
            }
        },
    ];
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
                        <img src="/gpsReceiving.png" alt="" height={70} width={70}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}}>COMING SOON</span>
                    </div>
                    <Pagination defaultCurrent={1} current={currentPage} onChange={chang} total={tableTotal}
                                pageSize={rowsPerPage}/>
                </div>
                <Table rowKey={(i) => i.id + i?.token0?.id + i?.token1?.id + i?.token0?.name} className={'hotTable anyTable'}
                       loading={loading} columns={columns} bordered={false} dataSource={tableParams}
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
    );
}
