import React, {useState, useRef} from 'react';
import {Card, Pagination, Segmented, Form, Input, Button} from "antd";
import styles from '/public/styles/all.module.css'
const {TextArea} = Input;
function Token(props) {
    const [infoSow, setInfoShow] = useState(false)
    const [infoParams, setInfoParams] = useState(null)
    const [form] =Form.useForm()
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const setInfo = (i) => {
        setInfoParams(i)
        setInfoShow(true)
    }
    const data = [{name: 'text', token: '0x6982508145454Ce325dDbE44ec3d2311933'}, {
        name: 'text2',
        token: '0x6982508145454Ce325d7a25d4ec3d2311933'
    }, {
        name: 'textx698250454bE47a25d4ec3d2x69825085d23',
        token: '0x6982508145454Ce325dDbE47a25d4ec3d2311933'
    }, {name: 'text4', token: '0x6982d4ec3d2311933'}, {
        name: 'text5',
        token: '0x6982508145454Ce325dDbE47a25d4ec3d2311933'
    }]
    return (
        <div className={styles.coinBox}>
            <p style={{fontSize: '20px', fontWeight: 'bold'}}>MY TOKEN</p>
            {/*数据*/}
            {
                infoSow? <div style={{display: 'flex', alignItems: 'center'}}>
                    <div className={styles.coinBoxTop}>
                        <img src="/Booking.png" alt="" width={30}/>
                        <span style={{margin: '0 10px'}}>{infoParams&&infoParams.name}</span>
                        <span style={{color: '#2294D4'}}>{infoParams&&infoParams.token}</span>
                    </div>
                    <div className={styles.coinBoxSet}>
                    <span style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginRight: '10px',
                        cursor: 'pointer'
                    }}>info</span>
                        <img src="/setCoin.svg" alt="" width={15} style={{cursor: 'pointer'}}/>
                    </div>
                </div>:''
            }
            {
                !infoSow ? data.map((i, index) => {
                    return <div key={index} className={styles.coinBoxTop}>
                        <span style={{fontSize: '18px', fontWeight: 'bold', marginRight: '10px'}}>{index + 1}</span>
                        <img src="/Booking.png" alt="" width={30}/>
                        <span style={{margin: '0 10px'}}>{i.name}</span>
                        <span style={{color: '#2294D4'}}>{i.token}</span>
                        <div className={styles.coinBoxSet}>
                            <span style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                marginRight: '10px',
                                cursor: 'pointer'
                            }}>info</span>
                            <img src="/setCoin.svg" alt="" width={15} style={{cursor: 'pointer'}}
                                 onClick={() => setInfo(i)}/>
                        </div>
                    </div>
                }) : ''
            }
            {
                infoSow?'': <div style={{
                    position:'absolute',bottom:'50px',left:'50%',
                    transform:'translateX(-50%)'
                }}>
                    <Pagination defaultCurrent={1} total={50} />
                </div>
            }
            {
                infoSow ? <Form
                    name="basic"
                    form={form}
                    onFinish={onFinish}
                    layout={'vertical'}
                    autoComplete="off"
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}
                >
                    <Form.Item
                        label="1"
                        name="1"
                        style={{width: '45%', marginBottom: '10px'}}
                        labelCol={{
                            span: 20,
                        }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>

                    <Form.Item
                        label="2"
                        name="2"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="3"
                        labelCol={{
                            span: 20,
                        }}
                        name="3"
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="4"
                        labelCol={{
                            span: 20,
                        }}
                        name="4"
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="5"
                        name="5"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="6"
                        labelCol={{
                            span: 20,
                        }}
                        name="6"
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="7"
                        labelCol={{
                            span: 20,
                        }}
                        name="7"
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="8"
                        name="8"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="9"
                        name="9"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="10"
                        name="10"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="11"
                        name="11"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="12"
                        name="12"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>

                    <Form.Item label="TextArea" name="12"
                               labelCol={{
                                   span: 20,

                               }} style={{width: '100%', marginBottom: '10px'}}>
                        <TextArea placeholder={'max. 150 characters'} maxLength={10}/>
                    </Form.Item>


                    <Form.Item style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                        <div style={{display: 'flex',}}>
                            <img src="/Vectors.svg" alt="" onClick={()=>setInfoShow(false)} style={{cursor: 'pointer', marginRight: '20px'}} width={25}/>
                            <img src="/sure.svg" alt="" onClick={()=>form.submit()} style={{cursor: 'pointer'}}
                                 width={30}/>
                        </div>
                    </Form.Item>
                </Form> : ''
            }
        </div>
    );
}

export default Token;