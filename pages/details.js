import React, {useState, useEffect, useContext} from 'react';
import {useRouter} from 'next/router';
import style from '../public/styles/details.module.css'
import {Table, Card, Segmented,Progress } from 'antd'
import axios from 'axios';
import Image from 'next/image'
import {CountContext} from '/components/Layout/Layout';
function Details() {
    const router = useRouter();
    const { changeTheme,} = useContext(CountContext);
    const data = router.query
    const [columnsBol,setColumnsBol] = useState(false)
    const [featured, setFeatured] = useState({});
    const getParams =async (name)=>{
        const data = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/ethereum/${name}`);
        console.log(data)
        if(data.status===200&&data?.data?.pair){
            setFeatured(data.data.pair)
        }
    }
    useEffect(() => {
        if (data?.pairAddress) {
            getParams(data?.pairAddress)
        }
    }, [data?.pairAddress]);

    const params = [{name: 'TOTAL MKTCAP', nu: '$983.62K'}, {name: 'LIQUIDITY', nu: '$288.28K'}, {
        name: 'TOTAL SUPPLY',
        nu: '100.00M'
    }
        , {name: 'HOLDERS', nu: '436'}
        , {name: 'MARKET CAP', nu: ''}
        , {name: '24H VOLUME', nu: '$365.87K'}
        , {name: 'CIRC SUPPLY', nu: ''}
        , {name: 'TOTAL TX', nu: '587'}
        , {name: '%CIRC SUPPLY', nu: ''}
        , {name: 'POOL CREATED', nu: '11/2/2023 19:42'}
        , {name: '%POOLED PLUR', nu: ''}
        , {name: 'POOLED PLUR', nu: '14.63M'}
    ]
    const column = [
        {
            title: 'Date',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'PriceUSD',
            dataIndex: 'address',
            key: 'address',  sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },
        },
        {
            title: 'Total',
            key: 'tags',
            dataIndex: 'tags',
        },
        {
            title: 'Amount PLUR',
            key: 'tags',
            dataIndex: 'tags',
        },
        {
            title: 'Maker',
            key: 'tags',
            dataIndex: 'tags',
        },
        {
            title: 'DEX', align: 'center', render: () => {
                return <Image src="/dex-uniswap.png" alt="" width={30} height={30} style={{borderRadius:'50%',display:'block',margin:'0 auto',width:'auto',height:'auto'}}/>
            }
        },
    ];
    const columns = [
        {
            title: 'Address',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Supply',
            dataIndex: 'age',
            key: 'age'
        },
        {
            key: 'tags',
            dataIndex: 'tags',
            render:()=>{
            return   <Progress percent={50} strokeColor={'black'} trailColor={'rgb(98,98,98)'} showInfo={false} />
            }
        },
        {
            title: 'Amount',
            key: 'tags',
            dataIndex: 'tags'
        },
        {
            title: 'Value',
            key: 'tags',
            dataIndex: 'tags'
        },
    ];
    const tableParams = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London',
        },
        {
            key: '31',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '32',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '33',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '34',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '35',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '36',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '37',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '38',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '39',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '3a',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '3s',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '3ss',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '3d',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '3da',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
        {
            key: '3dada',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney',
        },
    ];
    const changeColumns=(e)=>{
        if(e==='Holders'){
            setColumnsBol(true)
        }else {
            setColumnsBol(false)
        }
    }
    return (
            <div className={`${style['box']} ${changeTheme?'darknessTwo':'brightTwo'}`}>
                {/*头部数据*/}
                <div className={style['top']}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p style={{backgroundColor:'black',color:'white',fontSize:'20px',width:'50px',lineHeight:'50px',textAlign:'center',borderRadius:'50%'}}>{featured?.baseToken?.symbol?.slice(0,1)}</p>
                        <div style={{marginLeft: '15px'}}>
                            <p style={{fontWeight: 'bold', fontSize: '20px'}} className={changeTheme?'darknessFont':'brightFont'}>{featured?.baseToken?.name}</p>
                            <p style={{color: 'rgb(98,98,98)'}}><span
                                style={{fontSize: '18px',}} className={changeTheme?'darknessFont':'brightFont'}>{featured?.baseToken?.symbol?featured.baseToken.symbol+'/':''}</span>{featured?.quoteToken?.symbol||''}</p>
                        </div>
                    </div>
                    <div>
                        <p style={{fontSize: '18px'}} className={changeTheme?'darknessFont':'brightFont'}>PLUR: <span
                            style={{color: 'rgb(32,134,192)'}}>{featured?.baseToken?.address?featured.baseToken.address.slice(0,3)+'...'+featured.baseToken.address.slice(-4):''}</span></p>
                        <p style={{fontSize: '18px'}} className={changeTheme?'darknessFont':'brightFont'}>PAIR: <span
                            style={{color: 'rgb(32,134,192)'}}>{featured?.pairAddress?featured.pairAddress.slice(0,3)+'...'+featured.pairAddress.slice(-4):''}</span></p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '20%'}}>
                        <img src="/Star1.png" alt="" width={30}   height={30}/>
                        <img src="/Website2.png" alt="" width={30}   height={30}/>
                        <img src="/TwitterX.png" alt="" width={30}   height={30}/>
                        <img src="/Telegram2.png" alt="" width={30}   height={30}/>
                        <img src="/Ellipse15.png" alt="" width={30}   height={30}/>
                        <img src="/etherscan.png" alt="" width={30}   height={30}/>
                    </div>
                    <p style={{
                        padding: '10px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        borderRadius: '6px'
                    }} className={changeTheme?'darknessBack':'brightFBack'}>{featured?.priceUsd?'$'+featured.priceUsd:''}</p>
                    <div style={{
                        display: 'flex', alignItems: 'end',
                        flexDirection: 'column'
                    }}>
                        <p style={{color: 'rgb(98,98,98)', display: 'flex', justifyContent: 'center'}}><span style={{
                            color: 'rgb(97,123,64)',
                            letterSpacing: '2px',
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}> {featured?.priceChange?.h24>0?'+'+featured.priceChange.h24+'%':''}</span> {featured?.priceChange?.h24?'24H':''}</p>
                        <p style={{color: 'rgb(98,98,98)', textAlign: 'center'}}>{featured?.priceNative?featured.priceNative+'ETH':''}</p>
                    </div>
                </div>
                {/*<div className={style['bottom']}>*/}
                {/*    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px'}}>*/}
                {/*        <div className={style['left']}>*/}
                {/*            <div className={style['key']}>*/}
                {/*                {*/}
                {/*                    params.map((i, index) => {*/}
                {/*                        return <div key={index} className={style['keyOne']} style={params.length-1===index||params.length-2===index?{}:{marginBottom:'20px'}}>*/}
                {/*                            <p style={{color: 'rgb(98,98,98)'}}>{i.name}</p>*/}
                {/*                            <p style={{fontWeight: 'bold',lineHeight:'1', fontSize: i.nu.length>8?'12px':'15px'}}>{i.nu ? i.nu : '-'}</p>*/}
                {/*                        </div>*/}
                {/*                    })*/}
                {/*                }*/}
                {/*            </div>*/}
                {/*            <div className={style['bot']}>*/}
                {/*                <p style={{fontSize: '18px'}}>SWAP</p>*/}
                {/*                <img src="/LOGOTOU.png" alt="" width={40} height={40}  />*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*         <div style={{width:'80%'}}>*/}
                            <iframe src={`https://dexscreener.com/ethereum/${data?.pairAddress}?embed=1&theme=dark`} style={{width:'100%',height:'96vh'}}></iframe>
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className={style['right']}>*/}
                    {/*    <div style={{backgroundColor: 'rgb(188,238,125)', width: '28%', borderRadius: '10px'}}>*/}
                    {/*    </div>*/}
                    {/*    <Card style={{*/}
                    {/*        backgroundColor: 'rgb(188,158,45)',*/}
                    {/*        borderRadius: '10px',*/}
                    {/*        width: '70%',*/}
                    {/*        border:'none',*/}
                    {/*    }}>*/}
                    {/*        <Segmented className={'detailSegmented'} onChange={changeColumns} options={['Trade History', 'Holders']}/>*/}
                    {/*        <Table className={'hotTable anyTable'} pagination={false} columns={columnsBol?columns:column} dataSource={tableParams}  scroll={{*/}
                    {/*            y: 200,*/}
                    {/*        }} size="small"/>*/}
                    {/*      </Card>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>
    );
}

export default Details;