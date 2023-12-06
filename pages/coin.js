import React from 'react';
import {Card, Pagination, Segmented, Form, Input, Table, Button} from "antd";
import styles from '/public/styles/all.module.css'
const { TextArea } = Input;
function Coin(props) {
    const dataSource = [
        {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
        {
            key: '2',
            name: '胡彦祖',
            age: 45,
            address: '西湖区湖底公园1号',
        },
    ];
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
        },
    ];
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    return (
        <div className={styles.coinBox}>
            <p style={{fontSize: '20px', fontWeight: 'bold'}}>MY TOKEN</p>
            <div className={styles.coinBoxTop}>
                <img src="/Booking.png" alt="" width={30}/>
                <span>cat</span>
                <span style={{color: '#2294D4'}}>0x6982508145454Ce325dDbE47a25d4ec3d2311933</span>
            </div>
            <div className={styles.coinBoxSet}>
                <span style={{fontSize:'18px',fontWeight:'bold',marginRight:'10px',cursor:'pointer'}}>info</span>
                <img src="/setCoin.svg" alt="" width={15} style={{cursor:'pointer'}}/>
            </div>

            <Form
                name="basic"
                onFinish={onFinish}
                layout={'vertical'}
                autoComplete="off"
                style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}
            >
                    <Form.Item
                        label="1"
                        name="1"
                        style={{width:'45%',marginBottom:'10px'}}
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
                        <Input  style={{width:'100%'}}/>
                    </Form.Item>

                <Form.Item
                    label="2"
                    name="2"
                    labelCol={{
                        span: 20,
                    }}
                    style={{width:'45%',marginBottom:'10px'}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input style={{width:'100%'}}/>
                </Form.Item>
                <Form.Item
                    label="3"
                    labelCol={{
                        span: 20,
                    }}
                    name="3"
                    style={{width:'45%',marginBottom:'10px'}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input  style={{width:'100%'}}/>
                </Form.Item>
                <Form.Item
                    label="4"
                    labelCol={{
                        span: 20,
                    }}
                    name="4"
                    style={{width:'45%',marginBottom:'10px'}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input  style={{width:'100%'}}/>
                </Form.Item>
                <Form.Item
                    label="5"
                    name="5"
                    labelCol={{
                        span: 20,
                    }}
                    style={{width:'45%',marginBottom:'10px'}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input  style={{width:'100%'}}/>
                </Form.Item>
                <Form.Item
                    label="6"
                    labelCol={{
                        span: 20,
                    }}
                    name="6"
                    style={{width:'45%',marginBottom:'10px'}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input  style={{width:'100%'}}/>
                </Form.Item>
                <Form.Item
                    label="7"
                    labelCol={{
                        span: 20,
                    }}
                    name="7"
                    style={{width:'45%',marginBottom:'10px'}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input  style={{width:'100%'}}/>
                </Form.Item>
                <Form.Item
                    label="8"
                    name="8"
                    labelCol={{
                        span: 20,
                    }}
                    style={{width:'45%',marginBottom:'10px'}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input  style={{width:'100%'}}/>
                </Form.Item>
                <Form.Item
                    label="9"
                    name="9"
                    labelCol={{
                        span: 20,
                    }}
                    style={{width:'45%',marginBottom:'10px'}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input  style={{width:'100%'}}/>
                </Form.Item>
                <Form.Item
                    label="10"
                    name="10"
                    labelCol={{
                        span: 20,
                    }}
                    style={{width:'45%',marginBottom:'10px'}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input  style={{width:'100%'}}/>
                </Form.Item>
                <Form.Item
                    label="11"
                    name="11"
                    labelCol={{
                        span: 20,
                    }}
                    style={{width:'45%',marginBottom:'10px'}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input  style={{width:'100%'}}/>
                </Form.Item>
                <Form.Item
                    label="12"
                    name="12"
                    labelCol={{
                        span: 20,
                    }}
                    style={{width:'45%',marginBottom:'10px'}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input  style={{width:'100%'}}/>
                </Form.Item>

                <Form.Item label="TextArea"   name="12"
                           labelCol={{
                               span: 20,

                           }}   style={{width:'100%',marginBottom:'10px'}}>
                    <TextArea  placeholder={'max. 150 characters'} maxLength={10}/>
                </Form.Item>
                <Form.Item style={{display:'flex',justifyContent:'flex-end',width:'100%'}}>
                    <Button type="primary" htmlType="submit" icon={<img src="/sure.svg" alt="" width={25}/>}>
                    </Button>
                </Form.Item>
            </Form>
            {/*<Table  columns={columns}  />*/}
        </div>
    );
}

export default Coin;