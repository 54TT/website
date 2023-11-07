import React from "react";
import MuiDrawer from '@mui/material/Drawer';
import {styled, useTheme} from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import getConfig from 'next/config';
import {useRouter} from "next/router";

const Drawer = () => {
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
    const push = (name) => {
        router.push(name)
    }

    return (
        <>
            <Drawer variant="permanent" open={openDrawer} onMouseEnter={handleDrawerOpen}
                    onMouseLeave={handleDrawerClose}>
                <div onClick={() => push('/')}>
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
                        <ListItemText primary="DEX PERT" sx={{opacity: openDrawer ? 1 : 0}}/>
                    </DrawerHeader>
                </div>
                <List>
                    <ListItem key="DEXPboard" disablePadding sx={{display: 'block'}} className="drawerItem">
                        <div onClick={() => push('/')}>
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

                                    <img src={`/Home.png`} alt="logo" width={32}/>
                                </ListItemIcon>
                                <ListItemText primary="DEXPboard" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </div>
                    </ListItem>
                    <ListItem key="FEATURED" disablePadding sx={{display: 'block'}} className="drawerItem">
                        <div onClick={() => push('/featured')}>
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

                                    <img src={` /Exchange.png`} alt="logo" width={32}/>
                                </ListItemIcon>
                                <ListItemText primary="FEATURED" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </div>
                    </ListItem>
                    <ListItem key="PRESALE & LAUNCH" disablePadding sx={{display: 'block'}} className="drawerItem">
                        <div onClick={() => push('/presale')}>
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
                                    <img src={` /pre-sale.png`} alt="logo" width={32}/>
                                </ListItemIcon>
                                <ListItemText primary="PRESALE & LAUNCH" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </div>
                    </ListItem>
                    <ListItem key="Live New Pairs" disablePadding sx={{display: 'block'}} className="drawerItem">
                        <div onClick={() => push('/newPair')}>
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

                                    <img src={` /newPairs.png`} alt="logo" width={32}/>
                                </ListItemIcon>
                                <ListItemText primary="Live New Pairs" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </div>
                    </ListItem>
                    <ListItem key="Information" disablePadding sx={{display: 'block'}} className="drawerItem">
                        <div>
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
                                    <img src={` /News.png`} alt="logo" width={32}/>
                                </ListItemIcon>
                                <ListItemText primary="Information" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </div>
                    </ListItem>
                    <ListItem key="comminicate" disablePadding sx={{display: 'block'}} className="drawerItem">
                        <div onClick={() => push('/social')}>
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
                                    <img src={` /ChatS.png`} alt="logo" width={32}/>
                                </ListItemIcon>
                                <ListItemText primary="comminicate" sx={{opacity: openDrawer ? 1 : 0}}/>
                            </ListItemButton>
                        </div>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Drawer;
