import React from "react";
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
const Drawer = ({getMoney}) => {
    const router = useRouter();
    const drawerWidth = 300;
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
            backgroundColor:'black',
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
    const pushPer=()=>{
        if(cookie.get('name')){
            const data = cookie.get('name')
            router.push(`/${data}`)
        }else {
            getMoney()
        }
    }
    const push = () => {
        if (cookie.get('name')) {
            router.push('/social')
        }else {
            getMoney()
        }
    }
    return (
        <div className={'aaaa'}>
            <Drawer variant="permanent" open={openDrawer} onMouseEnter={handleDrawerOpen}
                    onMouseLeave={handleDrawerClose}>
                <Link href={'/statement'}>
                <div style={{cursor:'pointer'}}>
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
                            <img src={'/LOGO.png'} alt="logo" width={45} height={45}/>
                        </ListItemIcon>
                        {/*Vector*/}
                        <ListItemText primary={<img width={'50%'}   src="/Vector.png"  alt=""/>} sx={{opacity: openDrawer ? 1 : 0}}/>
                    </DrawerHeader>
                </div>
                </Link>
                <List>
                    <ListItem key="Dex Pboard" disablePadding sx={{display: 'block',}} className="drawerItem">
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

                                    <img src={`/Home.png`} alt="logo" width={32} height={32} />
                                </ListItemIcon>
                                <ListItemText primary="Dex Pboard" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="Featured" disablePadding sx={{display: 'block'}} className="drawerItem">
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

                                    <img src={`/Exchange.png`} alt="logo" height={32} width={32} />
                                </ListItemIcon>
                                <ListItemText primary="Featured" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="Presale" disablePadding sx={{display: 'block'}} className="drawerItem">
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
                                    <img src={`/pre-sale.png`} alt="logo" height={32} width={32} />
                                </ListItemIcon>
                                <ListItemText primary="Presale" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="Launch" disablePadding sx={{display: 'block'}} className="drawerItem">
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
                                    <img src={`/pre-sale.png`} alt="logo" height={32} width={32} />
                                </ListItemIcon>
                                <ListItemText primary="Launch" sx={{opacity: openDrawer ? 1 : 0}}/>
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

                                    <img src={`/newPairs.png`} alt="logo" height={32} width={32} />
                                </ListItemIcon>
                                <ListItemText primary="Live New Pairs" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="Information" disablePadding sx={{display: 'block'}} className="drawerItem">
                        <div  onClick={push}>
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
                                    <img src={`/News.png`} alt="logo" width={32} height={32} />
                                </ListItemIcon>
                                <ListItemText primary="Information" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </div>
                    </ListItem>
                    <ListItem key="Comminicate" disablePadding sx={{display: 'block'}} className="drawerItem">
                        <div onClick={pushPer} >
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
                                    <img src={`/Users.png`} height={32} alt="logo" width={32} />
                                </ListItemIcon>
                                <ListItemText primary="Comminicate" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </div>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
};
export default Drawer;
