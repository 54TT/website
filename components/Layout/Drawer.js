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
import {changeLang} from "/utils/set";
import {Switch} from 'antd'
import {CountContext} from '/components/Layout/Layout';

const Drawer = ({getMoney}) => {
    const {changeBack, changeTheme,} = useContext(CountContext);
    const router = useRouter();
    const drawerWidth = 300;
    const drawer = changeLang('drawer')
    const [value, setValue] = useState(false)
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
        if (cookie.get('username') && cookie.get('username') != 'undefined') {
            const data = JSON.parse(cookie.get('username'))
            if (Number(data?.uid)) {
                router.push(`/${data?.uid}`)
            }
        } else {
            getMoney()
        }
    }
    const push = () => {
        if (cookie.get('username') && cookie.get('username') != 'undefined') {
            router.push('/social')
        } else {
            getMoney()
        }
    }
    const changeThemes = (value) => {
        changeBack(value)
        setValue(value)
    }
    return (
        <div className={`drawerShowNode ${changeTheme ? 'socialScrollDd' : 'socialScrolld'}`}>
            <div className={changeTheme ? 'darknessTwo' : 'brightTwo'} style={{position: 'relative'}}>
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
                                        marginLeft: '10px'
                                    }}
                                >
                                    {/* 源图片：logoTop */}
                                    <img src={'/logo.svg'} alt="logo" width={30} height={30}/>
                                </ListItemIcon>
                                <ListItemText primary={<div style={{width: '50%'}}>
                                    <img width={100} height={100} style={{width: '100%'}} src="/Group21.svg" alt=""/>
                                </div>}
                                              sx={{opacity: openDrawer ? 1 : 0}}/>
                            </DrawerHeader>
                        </div>
                    </Link>
                    <List>
                        <ListItem key="Home" disablePadding sx={{display: 'block',}}
                                  className={changeTheme ? 'darknessItem' : 'brightItem'}>
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
                                        {/* 源图片：HomeLogo */}
                                        <img src={`/Vector.svg`} alt="logo" width={28} height={28}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span
                                        className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.home}</span>}
                                                  sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem key="Featured Pairs" disablePadding sx={{display: 'block'}}
                                  className={changeTheme ? 'darknessItem' : 'brightItem'}>
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
                                        }}>
                                        {/* 源图片：ExchangeLogo */}
                                        <img src={`/GroupJiuBa.svg`} alt="logo" height={28} width={28}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span
                                        className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.featured}</span>}
                                                  sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem key="Presales" disablePadding sx={{display: 'block'}}
                                  className={changeTheme ? 'darknessItem' : 'brightItem'}>
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
                                        {/* 源图片：pre-saleLogo */}
                                        <img src={`/icon_rocket_.svg`} alt="logo" height={28} width={28}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span
                                        className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.presale}</span>}
                                                  sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem key="Launching Soon Tokens" disablePadding sx={{display: 'block'}}
                                  className={changeTheme ? 'darknessItem' : 'brightItem'}>
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
                                        {/* 源图片：pre-saleLogo */}
                                        <img src={`/icon_timer_.svg`} alt="logo" height={28} width={28}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span
                                        className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.launch}</span>}
                                                  sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem key="Live New Pairs" disablePadding sx={{display: 'block'}}
                                  className={changeTheme ? 'darknessItem' : 'brightItem'}>
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
                                        {/* 源图片：newpairsLogo */}
                                        <img src={`/icon_graph_.svg`} alt="logo" height={28} width={28}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span
                                        className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.newPair}</span>}
                                                  sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem key="DEXpert Community" disablePadding sx={{display: 'block'}}
                                  className={changeTheme ? 'darknessItem' : 'brightItem'}>
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
                                        {/* 源图片：NewsLogo */}
                                        <img src={`/icon_newspaper_.svg`} alt="logo" width={28} height={28}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span
                                        className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.community}</span>}
                                                  sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </div>
                        </ListItem>
                        <ListItem key="User Profile" disablePadding sx={{display: 'block'}}
                                  className={changeTheme ? 'darknessItem' : 'brightItem'}>
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
                                        {/* 源图片：UserSettings */}
                                        <img src={`/icon_new_spaper_.svg`} height={28} alt="logo" width={28}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span
                                        className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.user}</span>}
                                                  sx={{opacity: openDrawer ? 1 : 0}}/>
                                </ListItemButton>
                            </div>
                        </ListItem>
                    </List>
                    <div style={{position: 'absolute', bottom: '20px', left: '8px'}}>
                        <Switch checked={value} className={changeTheme ? 'darknessOne' : 'brightOne'}
                                onChange={changeThemes}/>
                    </div>
                </Drawer>
            </div>
        </div>
    );
};
export default Drawer;
