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
    const [pairBaseData, setPairBaseData] = useState({});
    const [chainId, setChainId] = useState("ethereum");
    const [pairDexData, setPairDexData] = useState({});
    const [priceUsd, setPriceUsd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const headers = {
        'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
        'Content-Type': 'application/json', // 根据需要添加其他标头
    };
    async function getPairInfo() {
        try {
            const response = await axios.get( baseUrl+'/queryPairInfoByPairAddress', {
                headers: headers,
                params: {
                    pairAddress: data?.pairAddress
                }
            });
            const pairBase = response?.data;
            let pairDex = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainId}/${data?.pairAddress}`);
            setPairBaseData(pairBase[0]);
            setPairDexData(pairDex?.data?.pairs[0]);
            const priceUsd = formatDecimal(pairDex.data.pairs[0].priceUsd, 5);
            setPriceUsd(priceUsd);
            // setPairAddressEllipsis(await strEllipsis(pairAddress));
            // setTokenAddressEllipsis(await strEllipsis(pairDex.data.pairs[0].baseToken.address))
            setIsLoading(false);
        } catch (error) {
            setError(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (data?.pairAddress) {
            // let chainName = chain.name;
            // chainName = chainName.toLocaleLowerCase();
            // setChainId('ethereum')
            // getPairInfo();
            // const timer = setInterval(() => {
                // getPriceUsd();
            // }, 5000);
            return () => {
                // clearInterval(timer);
            };
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
                        <img src="/LOGOTOU.png" alt="" width={'50px'}/>
                        <div style={{marginLeft: '15px'}}>
                            <p style={{fontWeight: 'bold', fontSize: '20px'}}>PLUR</p>
                            <p style={{color: 'rgb(98,98,98)'}}><span
                                style={{fontSize: '18px', color: 'black'}}>CO2/</span>WTTH</p>
                        </div>
                    </div>
                    <div>
                        <p style={{fontSize: '18px'}}>PLUR: <span
                            style={{color: 'rgb(32,134,192)'}}>9dsau93ufash8dh</span></p>
                        <p style={{fontSize: '18px'}}>PAIR: <span
                            style={{color: 'rgb(32,134,192)'}}>9dsau93ufash8dh</span></p>
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
                    }}>$0.000094</p>
                    <div style={{
                        display: 'flex', alignItems: 'end',
                        flexDirection: 'column'
                    }}>
                        <p style={{color: 'rgb(98,98,98)', display: 'flex', justifyContent: 'center'}}><span style={{
                            color: 'rgb(97,123,64)',
                            letterSpacing: '2px',
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}>+ 2207.2%</span>24H</p>
                        <p style={{color: 'rgb(98,98,98)', textAlign: 'center'}}>0.00043ETH</p>
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
                            <iframe src={`https://dexscreener.com/ethereum/${data?.pairAddress}?embed=1&theme=dark`} className="w-full h-full"></iframe>
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