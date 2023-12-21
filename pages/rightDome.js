import React from 'react';

function RightDome({data}) {
    return (
        <div style={{height: '40vh', position: 'relative'}}>
            <div style={{position: 'absolute',width:'70%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
                <img src={data==='loading'?"/lookingWho.svg":'/Group-186.svg'} alt="" style={{display:'block',margin:'0 auto'}} width={'50px'}/>
                <p style={{color: 'white',textAlign:'center'}}>{data==='loading'?'loading......':'Haven\'t found anyone else yet...'}</p>
            </div>
        </div>
    );
}
export default RightDome;