import React, {useContext, useState, useEffect} from "react";
import MuiDrawer from '@mui/material/Drawer';
import {styled, useTheme} from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {useRouter} from "next/router";
import Link from 'next/link'
import cookie from "js-cookie";
import Image from 'next/image'
import {changeLang} from "/utils/set";
import {Switch } from 'antd'
import {CountContext} from "./Layout";

const Drawer = ({getMoney}) => {
    const { changeBack,changeTheme,} = useContext(CountContext);
    const router = useRouter();
    const drawerWidth = 300;
    const drawer = changeLang('drawer')
    const [value,setValue] =useState(false)
    const openedMixin = (theme) => ({
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
    });
    const closedMixin = (theme) => ({
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,

        }),
        width: `calc(${theme.spacing(7)} + 1px)`,
        overflowX: 'hidden',
        [theme.breakpoints.up('sm')]: {
            width: `calc(${theme.spacing(8)} + 1px)`,
        },
    });
    const DrawerHeader = styled('div')(({theme}) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));
    const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
        ({theme, open}) => ({
            backgroundColor: 'black',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            ...(open && {
                ...openedMixin(theme),
                '& .MuiDrawer-paper': openedMixin(theme),
            }),
            ...(!open && {
                ...closedMixin(theme),
                '& .MuiDrawer-paper': closedMixin(theme),
            }),
        }),
    );
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };
    const pushPer = () => {
        if (cookie.get('name')) {
            const data = cookie.get('name')
            router.push(`/${data}`)
        } else {
            getMoney()
        }
    }
    const push = () => {
        if (cookie.get('name')) {
            router.push('/social')
        } else {
            getMoney()
        }
    }
    const changeThemes=(value)=>{
        changeBack(value)
        setValue(value)
    }
    // 实时获取页面宽高
    // const [height, setHeight] = useState(0);
    // const [width, setWidth] = useState(0);
    // const [isShowDisplay, setIsShowDisplay] = useState(Boolean)
    // const resizeUpdate = (e) => {
    //     let h = e.target.innerHeight;
    //     let w = e.target.innerWidth;
    //     setHeight(h);
    //     setWidth(w)
    // };
    // useEffect(() => {
    //     let h = window.innerHeight;
    //     let w = window.innerWidth;
    //     setHeight(h)
    //     setWidth(w)
    //     window.addEventListener('resize', resizeUpdate);
    //     if(width <= 768){
    //         setIsShowDisplay(true)
    //     }else{
    //         setIsShowDisplay(false)
    //     }
    //     return () => {
    //         window.removeEventListener('resize', resizeUpdate);
    //     }
    // }, []);
    return (
        <div className="drawerShowNode">
            <div className={changeTheme?'darknessTwo':'brightTwo'} style={{position: 'relative'}}>
                <Drawer variant="permanent" open={openDrawer} onMouseEnter={handleDrawerOpen}
                        onMouseLeave={handleDrawerClose}>
                    <Link href={'/statement'}>
                        <div style={{cursor: 'pointer'}}>
                            <DrawerHeader sx={{
                                minHeight: 48,
                                justifyContent: openDrawer ? 'center' : 'center',
                            }}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: openDrawer ? 3 : 0,
                                        justifyContent: 'center',
                                        marginLeft:'10px'
                                    }}
                                >
                                    <Image src={'/logoTop.svg'} alt="logo" width={30} height={30}/>
                                </ListItemIcon>
                                <ListItemText primary={<div style={{width: '50%'}}>
                                    <Image width={100} height={100} style={{width: '100%'}} src="/Vector.png" alt=""/></div>}
                                            sx={{opacity: openDrawer ? 1 : 0}}/>
                            </DrawerHeader>
                        </div>
                    </Link>
                    <List>
                        <ListItem key="Home" disablePadding sx={{display: 'block',}} className={changeTheme?'darknessItem':'brightItem'}>
                            <Link href={'/'}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: openDrawer ? 'initial' : 'center',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: openDrawer ? 3 : 0,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image src={`/HomeLogo.svg`} alt="logo" width={32} height={32}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={changeTheme?'darknessFont':'brightFont'}>{drawer.home}</span>} sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem key="Featured Pairs" disablePadding sx={{display: 'block'}} className={changeTheme?'darknessItem':'brightItem'}>
                            <Link href={'/featured'}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: openDrawer ? 'initial' : 'center',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: openDrawer ? 3 : 0,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image src={`/ExchangeLogo.svg`} alt="logo" height={32} width={32}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={changeTheme?'darknessFont':'brightFont'}>{drawer.featured}</span>} sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem key="Presales" disablePadding sx={{display: 'block'}} className={changeTheme?'darknessItem':'brightItem'}>
                            <Link href={'/presale'}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: openDrawer ? 'initial' : 'center',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: openDrawer ? 3 : 0,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image src={`/pre-saleLogo.svg`} alt="logo" height={32} width={32}/>
                                    </ListItemIcon>
                                    <ListItemText primary={ <span className={changeTheme?'darknessFont':'brightFont'}>{drawer.presale}</span>} sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem key="Launching Soon Tokens" disablePadding sx={{display: 'block'}} className={changeTheme?'darknessItem':'brightItem'}>
                            <Link href={'/launch'}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: openDrawer ? 'initial' : 'center',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: openDrawer ? 3 : 0,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image src={`/pre-saleLogo.svg`} alt="logo" height={32} width={32}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={changeTheme?'darknessFont':'brightFont'}>{drawer.launch}</span>} sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem key="Live New Pairs" disablePadding sx={{display: 'block'}} className={changeTheme?'darknessItem':'brightItem'}>
                            <Link href={'/newPair'}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: openDrawer ? 'initial' : 'center',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: openDrawer ? 3 : 0,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image src={`/newpairsLogo.svg`} alt="logo" height={32} width={32}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={changeTheme?'darknessFont':'brightFont'}>{drawer.newPair}</span>} sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem key="DEXpert Community" disablePadding sx={{display: 'block'}} className={changeTheme?'darknessItem':'brightItem'}>
                            <div onClick={push}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: openDrawer ? 'initial' : 'center',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: openDrawer ? 3 : 0,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image src={`/NewsLogo.svg`} alt="logo" width={32} height={32}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={changeTheme?'darknessFont':'brightFont'}>{drawer.community}</span>} sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </div>
                        </ListItem>
                        <ListItem key="User Profile" disablePadding sx={{display: 'block'}} className={changeTheme?'darknessItem':'brightItem'}>
                            <div onClick={pushPer}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: openDrawer ? 'initial' : 'center',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: openDrawer ? 3 : 0,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image src={`/UserSettings.svg`} height={32} alt="logo" width={32}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={changeTheme?'darknessFont':'brightFont'}>{drawer.user}</span>} sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </div>
                        </ListItem>
                    </List>
                    <div style={{position: 'absolute', bottom: '20px', left: '8px'}}>
                        <Switch checked={value} className={changeTheme?'darknessOne':'brightOne'} onChange={changeThemes}/>
                    </div>
                </Drawer>
            </div>
        </div>
    );
};
export default Drawer;
