import React, { useState, useEffect } from "react";
import Image from 'next/image';
// Import react scroll

import { InputLabel, Input, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Marquee from "react-fast-marquee";
import Link from "next/link";
import Drawer from './Drawer'
import Connect from "./Connect";
import axios from 'axios';

const Header = () => {

  const [hotPairs, setHotPairs] = useState([]);

  useEffect(() => {
    const fetchHotPairs = async () => {
      const headers = {
        'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
        'Content-Type': 'application/json', // 根据需要添加其他标头
      };

      let pairs = await axios.get('http://localhost:3001/queryHotPairAndToken', {
        headers: headers,
        params: {}
      });
      setHotPairs(pairs.data);
    }

    fetchHotPairs();
  }, []);
  return (
    <>
      <header
        className={
          "fixed top-0 w-full  z-30 transition-all headerClass "
        }
      >
        <nav className="max-w-screen-xl pl-6 mx-auto grid grid-flow-col grid-cols-3 py-3">
          <div className="flex items-center">
            <div className="w-full">
              <Marquee
                pauseOnHover={true}
                speed={30}
                gradientWidth={100}
              >
                {hotPairs.map((item, index) => (
                  <span key={item.address}>
                    <span># {index}</span>
                    <Image src={`http://localhost:3001/${item.logo}`} width={20} height={20} className="mx-3 inline rounded-full" />
                    <span>{item.symbol}</span>
                  </span>
                ))}

              </Marquee>
            </div>
          </div>

          <div className="flex justify-center ml-9">
            <button className="search text-xs">Search</button>
          </div>

          <div className="flex justify-end">
            <Link href="/addCoin">
              <Button variant="outlined" className="font-medium tracking-wide py-2 px-5 sm:px-8 text-white-500   outline-none rounded-l-full rounded-r-full capitalize transition-all">Add Coin</Button>
            </Link>
            {/* <Link href="/addPair">
              <Button variant="outlined" className="font-medium tracking-wide py-2 px-5 sm:px-8 text-white-500   outline-none rounded-l-full rounded-r-full capitalize transition-all">Add Pair</Button>
            </Link> */}
            <Connect />
          </div>
        </nav>
        <Drawer />
      </header>
    </>
  );
};

export default Header;
