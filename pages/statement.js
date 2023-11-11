import React from 'react';
import styled from "styled-components";
import Bott from '/components/Bottom'

function Statement(props) {
    const data = ['Welcome to DEXpert.io , your premier destination for all things ERC-20 within the Ethereum network. In ' +
    '                the fast-evolving world of blockchain and cryptocurrency, the Ethereum platform has played a pivotal ' +
    '                role in facilitating a wide array of digital assets through its ERC-20 token standard. Our platform is ' +
    '                designed to provide you with comprehensive tools and resources to explore, analyze, and invest in these ' +
    '                tokens, empowering you to make informed decisions in the ever-expanding DeFi landscape.','Why ERC-20 Tokens?','ERC-20 tokens are the backbone of Ethereum\'s decentralized ecosystem, powering a wide range of applications, from decentralized finance (DeFi) projects to non-fungible tokens (NFTs) and more. As the Ethereum network continues to grow and innovate, ERC-20 tokens have become a crucial part of this transformative journey.  ','What We Offer:',
    'At DEXpert.io , we are committed to delivering a user-friendly and informative experience tailored to the unique needs of ERC-20 token enthusiasts. Here\'s what you can expect:  ',' ' +
        'Comprehensive Token Database: Explore our extensive ERC-20 token database, providing detailed information on a vast array of tokens. Whether you\'re looking for established projects or hidden gems, you\'ll find it here.  ','Real-Time Data: Stay up-to-date with real-time token prices, market capitalization, trading volume, and historical data to make well-informed investment decisions.  ','Advanced Analytics: We offer advanced analytics tools, including technical indicators, charting, and trading insights to help you gain a deeper understanding of token performance.  ','Token Discovery: Discover new and promising ERC-20 projects that align with your investment strategy or interests.  ','Community and Discussion: Connect with fellow enthusiasts, traders, and investors in our community forums. Share insights, strategies, and stay informed about the latest developments in the world of ERC-20 tokens.  ','Customized Alerts: Set up custom alerts to be notified when your favorite tokens reach specific price points or other criteria. ',' ' +
        'Twitter-Like Social Platform: Engage with our community through our Twitter-inspired social platform. Share your thoughts, analyses, and updates on your favorite tokens, follow other users, and build meaningful connections in the crypto space.  ','Educational Resources: Access educational content and guides to help you understand the ERC-20 token ecosystem better.  ','Our Commitment:  ','At DEXpert.io, our mission is to provide a platform that empowers you to navigate the ERC-20 token landscape with confidence. We aim to foster a knowledgeable and engaged community of cryptocurrency enthusiasts, enabling you to unlock the full potential of your Ethereum-based investments while also fostering meaningful connections with like-minded individuals.  ',' ' +
        'Join us on this exciting journey in the world of ERC-20 tokens and Ethereum. Your financial future and social connections are at your fingertips. Start exploring, communicating, and making informed decisions today.',''
    ]
    return (
        <div style={{
            width: '86%',
            margin: '0 auto',
            border: '1px solid',
            backgroundColor: 'rgb(253,213,62)',
            borderRadius: '10px',
            padding: '20px 40px'
        }}>
            <p style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '26%',
                margin: '0 auto'
            }}><img src={'/logo1.png'} alt="logo" width={'80px'}/><span
                style={{fontSize: '45px', fontWeight: 'bold', color: 'rgb(55,55,55,)'}}>DEXPERT</span></p>
            <p style={{marginTop: '10px', fontSize: '18px'}}>DEXpert.io </p>
            {
                data.map((i,dev)=>{
                    return  <P key={dev}>{i}</P>
                })
            }
            <Bott/>
        </div>
    );
}

export default Statement;

const P = styled.p`
  font-size: 18px;
  line-height: 1.2;
  margin-top: 20px;
`
