import React,{useState,useEffect} from 'react';
import {useRouter} from 'next/router';
import  baseUrl from '/utils/baseUrl'
import style from '../styles/details.module.css'
import {Table, Card, Segmented,Progress } from 'antd'
// import {useNetwork,chain} from 'wagmi'
import axios from 'axios'
import { formatDecimal } from '../components/Utils';

function Details(props) {
    const router = useRouter();
    // const { chain } = useNetwork();
    const data = router.query
    const [columnsBol,setColumnsBol] = useState(false)
    const [featured, setFeatured] = useState({});
    const getParams =async (name)=>{
        const data = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/ethereum/${name}`);
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
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },
        },
        {
            title: 'Type',
            dataIndex: 'age',
            key: 'age',  sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },
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
            dataIndex: 'tags',  sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },
        },
        {
            title: 'Amount PLUR',
            key: 'tags',
            dataIndex: 'tags',  sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },
        },
        {
            title: 'Maker',
            key: 'tags',
            dataIndex: 'tags',  sorter: {
                compare: (a, b) => a.chinese - b.chinese,
            },
        },
        {
            title: 'Actions',
            render:()=>{
                return <img src="/LOGOTOU.png" width={'30px'} alt=""/>
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
        }
    ];
    const changeColumns=(e)=>{
        if(e==='Holders'){
            setColumnsBol(true)
        }else {
            setColumnsBol(false)
        }
    }
    return (
            <div className={style['box']}>
                <div className={style['top']}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p style={{backgroundColor:'black',color:'white',fontSize:'20px',width:'50px',lineHeight:'50px',textAlign:'center',borderRadius:'50%'}}>{featured?.baseToken?.symbol?.slice(0,1)}</p>
                        <div style={{marginLeft: '15px'}}>
                            <p style={{fontWeight: 'bold', fontSize: '20px'}}>{featured?.baseToken?.name}</p>
                            <p style={{color: 'rgb(98,98,98)'}}><span
                                style={{fontSize: '18px', color: 'black'}}>{featured?.baseToken?.symbol?featured.baseToken.symbol+'/':''}</span>{featured?.quoteToken?.symbol||''}</p>
                        </div>
                    </div>
                    <div>
                        <p style={{fontSize: '18px'}}>PLUR: <span
                            style={{color: 'rgb(32,134,192)'}}>{featured?.baseToken?.address||''}</span></p>
                        <p style={{fontSize: '18px'}}>PAIR: <span
                            style={{color: 'rgb(32,134,192)'}}>{featured?.pairAddress||''}</span></p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '20%'}}>
                        <img src="/LOGOTOU.png" alt="" width={'30px'}/>
                        <img src="/LOGOTOU.png" alt="" width={'30px'}/>
                        <img src="/LOGOTOU.png" alt="" width={'30px'}/>
                        <img src="/LOGOTOU.png" alt="" width={'30px'}/>
                        <img src="/LOGOTOU.png" alt="" width={'30px'}/>
                        <img src="/LOGOTOU.png" alt="" width={'30px'}/>
                    </div>
                    <p style={{
                        backgroundColor: 'rgb(188,158,45)',
                        padding: '10px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        borderRadius: '6px'
                    }}>{featured?.priceUsd?'$'+featured.priceUsd:''}</p>
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
                <div className={style['bottom']}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px'}}>
                        <div className={style['left']}>
                            <div className={style['key']}>
                                {
                                    params.map((i, index) => {
                                        return <div key={index} className={style['keyOne']} style={params.length-1===index||params.length-2===index?{}:{marginBottom:'20px'}}>
                                            <p style={{color: 'rgb(98,98,98)'}}>{i.name}</p>
                                            <p style={{fontWeight: 'bold', fontSize: '18px'}}>{i.nu ? i.nu : '-'}</p>
                                        </div>
                                    })
                                }
                            </div>
                            <div className={style['bot']}>
                                <p style={{fontSize: '18px'}}>SWAP</p>
                                <img src="/LOGOTOU.png" alt="" width={'40px'}/>
                            </div>
                        </div>
                        <div style={{width:'70%'}}>
                            <iframe src={`https://dexscreener.com/ethereum/${data?.pairAddress}?embed=1&theme=dark`} style={{width:'100%',height:'100%'}}></iframe>
                        </div>
                    </div>
                    <div className={style['right']}>
                        <div style={{backgroundColor: 'rgb(188,238,125)', width: '28%', borderRadius: '10px'}}>
                        </div>
                        <Card style={{
                            backgroundColor: 'rgb(188,158,45)',
                            borderRadius: '10px',
                            width: '70%',
                            border:'none'
                        }}>
                            <Segmented className={'detailSegmented'} onChange={changeColumns} options={['Trade History', 'Holders']}/>
                            <Table className={'hotTable'} pagination={false} columns={columnsBol?columns:column} dataSource={tableParams}/>
                          </Card>
                    </div>
                </div>
            </div>
    );
}

export default Details;