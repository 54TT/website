import React from 'react';
import styles from '/public/styles/all.module.css'
import {Button,Popconfirm } from 'antd'

function Coin() {


    const data = [{name: 'cat1', coin: 'CAT1'}, {name: 'cat2', coin: 'CAT2'}, {
        name: 'cat3',
        coin: 'CAT3'
    }, {name: 'cat4', coin: 'CAT4'}, {name: 'cat5', coin: 'CAT5'}, {name: 'cat6', coin: 'CAT6'}, {
        name: 'cat',
        coin: 'CAT'
    }]
    const confirm = (e,i) => {
        e.preventDefault()
        console.log(e);
        console.log(i);
    };
    const cancel = (e) => {
        console.log(e);
    };
    return (
        <div className={styles.coin}>
            <p style={{fontSize: '20px', fontWeight: 'bold'}}>Your coin</p>
            {
                data.map((i, index) => {
                    return index!==0&&<div key={index} className={styles.coinList}>
                        <span>{index+1}.</span>
                        <img src="/avatar.png" alt="" width={30} style={{margin: '0 10px'}}/>
                        <span>{i.name}</span>
                        <span style={{fontSize: '18px', margin: '0 10px'}}>${i.coin}</span>
                        <span style={{fontSize: '18px', fontWeight: 'bold'}}>info</span>
                        <img src="/setCoin.svg" alt="" width={14} style={{cursor: 'pointer', margin: '0 10px'}}/>
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={(e)=>confirm(e,i)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <img src="/delete1.svg" alt=" " width={14} style={{cursor: 'pointer'}}/>
                        </Popconfirm>
                    </div>
                })
            }
            <Button style={{backgroundColor: 'rgb(254,239,146)'}}>Add a coin</Button>
        </div>
    );
}

export default Coin;