import React, {useContext} from "react";
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

const Drawer = ({getMoney}) => {
    const router = useRouter();
    const drawerWidth = 300;
    const drawer = changeLang('drawer')
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
        overflowX: 'hidden',
        width: `calc(${theme.spacing(7)} + 1px)`,
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
            width: drawerWidth,
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

    return (
        <div className={'aaaa'}>
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
                                }}
                            >
                                <Image src={'/LOGO.png'} alt="logo" width={45} height={45}/>
                            </ListItemIcon>
                            {/*Vector*/}
                            <ListItemText primary={<div style={{width: '50%'}}><Image width={100} height={100}
                                                                                      style={{width: '100%'}}
                                                                                      src="/Vector.png" alt=""/></div>}
                                          sx={{opacity: openDrawer ? 1 : 0}}/>
                        </DrawerHeader>
                    </div>
                </Link>
                <List>
                    <ListItem key="Home" disablePadding sx={{display: 'block',}} className="drawerItem">
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
                                    <Image src={`/Home.png`} alt="logo" width={32} height={32}/>
                                </ListItemIcon>
                                <ListItemText primary={drawer.home} sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="Featured Pairs" disablePadding sx={{display: 'block'}} className="drawerItem">
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
                                    <Image src={`/Exchange.png`} alt="logo" height={32} width={32}/>
                                </ListItemIcon>
                                <ListItemText primary={drawer.featured} sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="Presales" disablePadding sx={{display: 'block'}} className="drawerItem">
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
                                    <Image src={`/pre-sale.png`} alt="logo" height={32} width={32}/>
                                </ListItemIcon>
                                <ListItemText primary={drawer.presale} sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="Launching Soon Tokens" disablePadding sx={{display: 'block'}} className="drawerItem">
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
                                    <Image src={`/pre-sale.png`} alt="logo" height={32} width={32}/>
                                </ListItemIcon>
                                <ListItemText primary={drawer.launch} sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="Live New Pairs" disablePadding sx={{display: 'block'}} className="drawerItem">
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
                                    <Image src={`/newPairs.png`} alt="logo" height={32} width={32}/>
                                </ListItemIcon>
                                <ListItemText primary={drawer.newPair} sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="DEXpert Community" disablePadding sx={{display: 'block'}} className="drawerItem">
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
                                    <Image src={`/News.png`} alt="logo" width={32} height={32}/>
                                </ListItemIcon>
                                <ListItemText primary={drawer.community} sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </div>
                    </ListItem>
                    <ListItem key="User Profile" disablePadding sx={{display: 'block'}} className="drawerItem">
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
                                    <Image src={`/Users.png`} height={32} alt="logo" width={32}/>
                                </ListItemIcon>
                                <ListItemText primary={drawer.user} sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </div>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
};
export default Drawer;
