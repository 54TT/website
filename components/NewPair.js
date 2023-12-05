import React, {useContext, useEffect, useState} from "react";
import {Table, Pagination, Card} from 'antd'
import _ from 'lodash'
import {ApolloClient, InMemoryCache, useQuery} from "@apollo/client";
import {gql} from "graphql-tag";
import Image from 'next/image';
import {autoConvertNew,autoConvert} from '/utils/set';
import {formatDecimal, sendGetRequestWithSensitiveData, getRelativeTimeDifference, formatDateTime} from './Utils';
import styled from '/public/styles/all.module.css'
const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/levi0522/uniswap-v2', cache: new InMemoryCache(),
});
import {changeLang} from "/utils/set";
import {CountContext} from "./Layout/Layout";
export default function NewPair() {
    const newPair=changeLang('newPair')
    const {changeTheme} = useContext(CountContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const GET_DATA = gql`query LiveNewPair {
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
    const setMany=(text)=>{
        let data = null
        if (text&&Number(text) < 1 && text.toString().includes('0000')) {
            data = formatDecimal(text.toString(),3)
            if(data.length>10){
                data=data.slice(0,8)
            }
        } else if (text&&Number(text)) {
            data = autoConvert(Number(text))
        }else{
            data =0
        }
        return data
    }

    const columns = [
        {
            title: '', align: 'right', width: 30,
            render: (text, record) => {
                return <p className={styled.launchTableP}>{record?.token0?.symbol?.slice(0, 1) || ''}</p>
            }
        },
        {
            title: newPair?.pair,
            dataIndex: 'name',
            render: (text, record) => <div className={styled.newPairTable}>
                <p className={styled.newPairTableText}><span
                    style={{fontSize: '18px'}} className={changeTheme ? 'darknessFont' : 'brightFont'}>{record?.token0?.symbol ? record?.token0?.symbol.length > 7 ? record?.token0?.symbol.slice(0, 5) : record?.token0?.symbol + '/' : ''}</span><span
                    style={{color: 'rgb(98,98,98)'}}>{record?.token1?.symbol ? record?.token1?.symbol.length > 7 ? record?.token1?.symbol.slice(0, 5) : record?.token1?.symbol : ''}</span>
                </p>
            </div>,
        },
        {
            title: newPair?.price+'($)',
            dataIndex: 'age', align: 'center',
            render: (text, record) => {
                const data = record?.liquidityPositionSnapshots[0]?.token0PriceUSD || 0
                return <p className={changeTheme ? 'darknessFont' : 'brightFont'}>{data ? autoConvertNew(Number(data)) : 0}</p>
            }
        },
        {
            title: newPair?.time, align: 'center',
            dataIndex: 'tags',
            render: (_, record) => {
                const data =  record?.createdAtTimestamp.toString().length>10?Number(record.createdAtTimestamp.toString().slice(0,10)):record.createdAtTimestamp
                return <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{record?.createdAtTimestamp ? getRelativeTimeDifference(formatDateTime(data)): ''}</span>
            }
        },
        {
            title: newPair?.volume+'($)', align: 'center',
            dataIndex: 'volumeUSD',
            render: (text) => {
                return <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{setMany(text)}</span>
            }
        },
        {
            title: newPair?.reserve, align: 'center',
            dataIndex: 'reserveETH',
            render: (text) => {
                const data =setMany(text)
                return <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{data}</span>
            }
        },
        {
            title: newPair?.tracked, align: 'center',
            dataIndex: 'trackedReserveETH',
            render: (text) => {
                return <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{setMany(text)}</span>
            }
        },
        {
            title: newPair.txCount, align: 'center',
            dataIndex: 'txCount',
            render: (text) => {
                return <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{text ? text : ''}</span>
            }
        },
        {
            title: newPair.dex, align: 'center', render: (text, record) => {
                return <Image src="/dex-uniswap.png" alt="" width={30} height={30}
                           className={styled.newPairTableImg}/>
            }
        },
    ];
    return (
        <div className={styled.launchBox}>
            <Card className={`${styled.launchBoxCard} ${changeTheme?'darknessTwo':'brightTwo'}`}>
                <div className={styled.launchBoxCardBox}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Image src="/gpsReceiving.png" alt="" height={70} width={70}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}} className={changeTheme ? 'darknessFont' : 'brightFont'}>{newPair?.newPair}</span>
                    </div>
                    <Pagination defaultCurrent={1} current={currentPage} onChange={chang} total={tableTotal}
                                pageSize={rowsPerPage}/>
                </div>
                <Table rowKey={(i) => i.id + i?.token0?.id + i?.token1?.id + i?.token0?.name}
                       className={`anyTable ${changeTheme ? 'hotTableD' : 'hotTable'}`}
                       loading={loading} columns={columns} bordered={false} dataSource={tableParams}
                       pagination={false}/>
            </Card>
            <p className={styled.launchBoxBot}>©DEXpert.io</p>
        </div>
    );
}
