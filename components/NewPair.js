import React, {useEffect, useState} from "react";
import {Table, Pagination, notification, Card} from 'antd'
import _ from 'lodash'
import {ApolloClient, InMemoryCache, useQuery} from "@apollo/client";
import {gql} from "graphql-tag";
import {useRouter} from "next/router";
import dayjs from "dayjs";

const client = new ApolloClient({
    uri: 'http://188.166.191.246:8000/subgraphs/name/dsb/uniswap', cache: new InMemoryCache(),
});
export default function NewPair() {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const GET_DATA = gql`
query liveNewPair {
  pairs(first: ${rowsPerPage}, skip: ${(currentPage - 1) * 10}, orderBy: createdAtTimestamp, orderDirection: desc) {
    createdAtTimestamp
    id
    txCount
    token0 {
      name
      symbol
      id
    }
    token1 {
      name
      symbol
      id
    }
  }
   uniswapFactories {
    pairCount
  }
}
`;
    const [tableParams, setTableParams] = useState([]);
    const [tableTotal, setTableTotal] = useState(0);
    const [loadingBool, setLoadingBool] = useState(true);
    const {loading, error, data} = useQuery(GET_DATA, {client});
    useEffect(() => {
        if (!loading) {
            if (data && data?.pairs.length > 0) {
                setTableParams(data?.pairs)
                setTableTotal(data?.uniswapFactories[0]?.pairCount)
                setLoadingBool(false)
            } else {
                setTableParams([])
                setLoadingBool(false)
            }
        } else {
            setTableParams([])
            setLoadingBool(false)
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
            title: 'Pair',
            dataIndex: 'name', align: 'center',
            render: (text, record) => <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '60%',
                margin: '0 auto'
            }}>
                <p style={{
                    borderRadius: '50%',
                    fontSize: '20px',
                    width: '40px',
                    lineHeight: '40px',
                    textAlign: "center",
                    backgroundColor: 'black',
                    color: 'white'
                }}>{record?.token0?.symbol?.slice(0, 1)}</p>
                <div style={{marginLeft: '15px'}}>
                    <p style={{display: 'flex', alignItems: 'flex-end', lineHeight: '1'}}><span
                        style={{fontSize: '18px'}}>{record?.token0?.symbol ? record.token0.symbol + '/' : ''}</span><span
                        style={{color: 'rgb(98,98,98)'}}>{record?.token1?.symbol ? record.token1.symbol : ''}</span></p>
                    <p style={{
                        lineHeight: '1',
                        marginTop: '3px',
                    }}>{record?.id?.slice(0, 4)}...{record?.id?.slice(-4)}</p>
                </div>
            </div>,
        },
        {
            title: 'Price',
            dataIndex: 'age', align: 'center',
            render: () => {
                return <p>-</p>
            }
        },
        {
            title: '%24',
            dataIndex: 'address', align: 'center',
            render: () => {
                return <p style={{
                    lineHeight: 1,
                    width: '84%',
                    backgroundColor: 'rgb(188,238,125)',
                    textAlign: 'center',
                    padding: '5px 0',
                    borderRadius: '5px'
                }}>-</p>
            }
        },
        {
            title: 'Created', align: 'center',
            dataIndex: 'tags',
            // sorter: {
            //     compare: (a, b) => a.chinese - b.chinese,
            // },
            render: (_, record) => {
                return <span>{record?.createdAtTimestamp ? dayjs.unix(Number(record.createdAtTimestamp)).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
            }
        },
        {
            title: 'Volume', align: 'center',
            dataIndex: 'tags',
            render: () => {
                return <span>-</span>
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
            title: 'Liquidity',
            dataIndex: 'liquidity', align: 'center',
            render: () => {
                return <span>-</span>
            }
        },
        {
            title: 'T.M.Cap', align: 'center',
            key: 'action',
            render: () => {
                return <span>-</span>
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
                       loading={loadingBool} columns={columns} bordered={false} dataSource={tableParams}
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
