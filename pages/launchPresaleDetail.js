import React from 'react';
import styled from '/public/styles/all.module.css'

function LaunchPresaleDetail(props) {
    return (
        <div className={styled.lpDetail}>
            {/*左边*/}
            <div className={styled.lpDetailLeft}>
                {/*上边*/}
                <div className={styled.lpDetailLeftTop}>
                    <img src="/avatar.png" alt="" width={80}/>
                    <span style={{fontWeight: 'bold', fontSize: '22px'}}>PLUR</span>
                    <div className={styled.lpDetailLeftBack}>$PLUR
                    </div>
                    <div>
                        <p className={styled.lpDetailLefP}>Launch</p>
                        <p className={styled.lpDetailLefPT}>02:02:20</p>
                    </div>
                    <div>
                        <p className={styled.lpDetailLefP}>Presale</p>
                        <p className={styled.lpDetailLefPT}>02:02:20</p>
                    </div>
                </div>
                <div className={styled.lpDetailLeftBot}>
                    Meme Alliance is an exciting GameFI ecosystem that aims to bring together various meme communities.
                    Imagine iconic characters like Pepe, Shib, Volt, Doge, and Elmo battling it out and forming
                    alliances through networking. The experienced ElmoERC team, with their extensive background in
                    crypto projects, is developing Meme Alliance to ensure its success. This flagship game will be a
                    high-quality, on-chain, first-person shooter developed in Unreal Engine 5. Players can connect their
                    wallets to the game client and access an in-game and web-based marketplace. Competitions will allow
                    players to earn multiple tokens, making Meme Alliance a true play-to-earn game. Best part; the game
                    is already under development for some months, first open Beta is set to launch still coming
                    December. But Meme Alliance is more than just a shooter; it offers unique features like lotteries,
                    currency burning support, and reward pools. By staking $MMA, players can even earn other meme coins
                    like $PEPE, $SHIB, $BONE, or $LEASH. The Meme Alliance Ecosystem provides strong utility to multiple
                    projects simultaneously, uniting the power of memecoins in one inclusive ecosystem. - Contract
                    renounced after launch -0/0 Taxes -CMC/CG Listing -CEX Listings - KOLs/Influencers on board - Ads on
                    all major crypto sites - Youtubers to create content - Trending on multiple platforms - AMAs on
                    various large Twitter accounts, Telegram groups and Private groups - Strong tokenomics that will
                    support an amazing launch and long term gains Don't miss out on the exclusive advantage for Elmofo
                    NFT holders in the Meme Alliance presale! Be whitelisted and get a one-hour head start compared to
                    the public sale. Secure your position early and join the exciting Meme Alliance ecosystem. Mint your
                    Elmofo NFT: https://nfts.elmoerc.io Join us and be a part of Meme Alliance!
                </div>
            </div>
            {/*右边*/}
            <div className={styled.lpDetailR}>
                <div className={styled.lpDetailRight}>
                    <img src="/detailImg.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p>@plur123</p>
                </div>
                <div className={styled.lpDetailRight}>
                    <img src="/detailImg.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p>Presale platform</p>
                </div>
                <div className={styled.lpDetailRight}>
                    <img src="/detailImg.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p>Launch platform</p>
                </div>
                <div className={styled.lpDetailRight}>
                    <img src="/detailImg.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p>Discord</p>
                </div>
                <div className={styled.lpDetailRight}>
                    <img src="/detailImg.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p>Twitter</p>
                </div>
                <div className={styled.lpDetailRight}>
                    <img src="/detailImg.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p className={styled.lpDetailRightP}>0x9B3A8159e119 eb09822115AE08 Ee1526849e1116</p>
                </div>
            </div>
        </div>
    );
}

export default LaunchPresaleDetail;