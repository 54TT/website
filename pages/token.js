import React, {useState, useRef, useContext} from 'react';
import {Card, Pagination, Segmented, Form, Input, Button, Popconfirm} from "antd";
import styles from '/public/styles/all.module.css'
import {CountContext} from "../components/Layout/Layout";

const {TextArea} = Input;

function Token(props) {
    const {changeTheme} = useContext(CountContext);
    const [infoSow, setInfoShow] = useState(false)
    const [infoParams, setInfoParams] = useState(null)
    const [form] = Form.useForm()
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const filePickerRef = useRef(null);
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

    //   获取图片
    const addImageFromDevice = (e) => {
        const {files} = e.target;
        setImage(files[0]);
        setImagePreview(URL.createObjectURL(files[0]));
    };


    // 删除图片
    const deleteImg = () => {
        setImage(null)
        setImagePreview(null);
    }
    return (
        <div className={styles.coinBox}>
            <p style={{fontSize: '20px', fontWeight: 'bold'}}>MY TOKEN</p>
            {/*数据*/}
            {
                infoSow ? <div style={{display: 'flex', alignItems: 'center'}}>
                        <div className={styles.coinBoxTop}>
                            <img src="/Booking.png" alt="" width={30}/>
                            <span style={{margin: '0 10px'}}>{infoParams && infoParams.name}</span>
                            <span style={{color: '#2294D4'}}>{infoParams && infoParams.token}</span>
                        </div>
                        <div className={styles.coinBoxSet}>
                    <span className={styles.coinBoxInfo}>info</span>
                            <img src="/setCoin.svg" alt="" width={15} style={{cursor: 'pointer'}}/>
                        </div>
                    </div>
                    : ''
            }
            {
                infoSow ? <Form
                    name="basic"
                    form={form}
                    onFinish={onFinish}
                    layout={'vertical'}
                    autoComplete="off"
                   className={styles.coinBoxForm}
                >
                    <Form.Item
                        label="e-mail"
                        name="e-mail"
                        style={{width: '45%', marginBottom: '10px'}}
                        labelCol={{
                            span: 20,
                        }}
                    >
                        <Input className={changeTheme?'darknessTwo':'brightTT'}/>
                    </Form.Item>

                    <Form.Item
                        label="LINK TO LOGO URL"
                        name="LINK"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: !imagePreview,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        {
                            imagePreview ? '' :
                                <Input readOnly  className={changeTheme?'darknessTwo':'brightTT'}
                                       onClick={() => filePickerRef.current.click()}/>
                        }
                        <input
                            ref={filePickerRef}
                            onChange={addImageFromDevice}
                            type="file"
                            accept="image/*"
                            style={{display: "none"}}
                        />
                        {
                            imagePreview ? <div style={{display: 'flex', alignItems: 'center'}}>
                                <img src={imagePreview} alt="imagePreview"
                                     width={35}/>
                                <Popconfirm
                                    title="Delete the task"
                                    description="Are you sure to delete this task?"
                                    onConfirm={deleteImg}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <img src="/delete1.svg" style={{marginLeft: '10px', cursor: 'pointer'}}
                                         alt=""
                                         width={15}/>
                                </Popconfirm>
                            </div> : ''
                        }
                    </Form.Item>
                    <Form.Item
                        label="Token Website"
                        labelCol={{
                            span: 20,
                        }}
                        name="Token"
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input  className={changeTheme?'darknessTwo':'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Telegram"
                        labelCol={{
                            span: 20,
                        }}
                        name="Telegram"
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input  className={changeTheme?'darknessTwo':'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Discord"
                        name="Discord"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input  className={changeTheme?'darknessTwo':'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Twitter"
                        labelCol={{
                            span: 20,
                        }}
                        name="Twitter"
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input  className={changeTheme?'darknessTwo':'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Facebook"
                        labelCol={{
                            span: 20,
                        }}
                        name="Facebook"
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input  className={changeTheme?'darknessTwo':'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Youtube"
                        name="Youtube"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input  className={changeTheme?'darknessTwo':'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Instagram"
                        name="Instagram"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input  className={changeTheme?'darknessTwo':'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="TikTok"
                        name="TikTok"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input  className={changeTheme?'darknessTwo':'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Medium"
                        name="Medium"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input  className={changeTheme?'darknessTwo':'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Project Brief"
                        name="Project"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input className={changeTheme?'darknessTwo':'brightTT'}/>
                    </Form.Item>

                    <Form.Item label="TextArea" name="12"
                               labelCol={{
                                   span: 20,
                               }} style={{width: '100%', marginBottom: '10px'}}>
                        <TextArea placeholder={'max. 150 characters'}
                                  style={{width: '100%', backgroundColor: 'rgb(254,239,146)'}} maxLength={10}/>
                    </Form.Item>


                    <Form.Item style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                        <div style={{display: 'flex',}}>
                            <img src="/Vectors.svg" alt="" onClick={() => setInfoShow(false)}
                                 style={{cursor: 'pointer', marginRight: '20px'}} width={25}/>
                            <img src="/sure.svg" alt="" onClick={() => form.submit()} style={{cursor: 'pointer'}}
                                 width={30}/>
                        </div>
                    </Form.Item>
                </Form> : <div>
                    {

                        data.map((i, index) => {
                            return <div key={index} className={styles.coinBoxTop}>
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    marginRight: '10px'
                                }}>{index + 1}</span>
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
                        })}
                    <div style={{
                        position: 'absolute', bottom: '50px', left: '50%',
                        transform: 'translateX(-50%)'
                    }}>
                        <Pagination defaultCurrent={1} total={50}/>
                    </div>
                </div>
            }
        </div>
    );
}

export default Token;