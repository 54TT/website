import React from "react";
import MuiDrawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Link from "next/link";
import Image from "next/image"

const Drawer = () => {
    const drawerWidth = 200;

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

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));


    const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
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
    return (
        <nav>
            <Drawer variant="permanent" open={openDrawer} onMouseEnter={handleDrawerOpen} onMouseLeave={handleDrawerClose}>
                <Link href="./">
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
                                    <Image src="/assets/LOGO.png" alt="logo" width={45} height={45}/>
                                </ListItemIcon>
                            
                        <ListItemText primary="DEX PERT" sx={{ opacity: openDrawer ? 1 : 0}} />
                    </DrawerHeader>
                </Link>
                <List>
                    <ListItem key="Hot pairs" disablePadding sx={{ display: 'block' }} className="drawerItem">
                        <Link href="/hot">
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
                                    <Image src="/assets/home-icon.png" alt="logo" width={32} height={32}/>
                                </ListItemIcon>
                                <ListItemText primary="Hot pairs" sx={{ opacity: openDrawer ? 1 : 0 }} />
                            </ListItemButton>
                        </Link>
                    </ListItem>

                    <ListItem key="Launch" disablePadding sx={{ display: 'block' }} className="drawerItem">
                        <Link href="/presale">
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
                                    <Image src="/assets/launch-icon.png" alt="logo" width={32} height={32}/>
                                </ListItemIcon>
                                <ListItemText primary="Launch" sx={{ opacity: openDrawer ? 1 : 0 }} />
                            </ListItemButton>
                        </Link>
                    </ListItem>

                    <ListItem key="Star" disablePadding sx={{ display: 'block' }} className="drawerItem">
                        <Link href="/launch">
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
                                    <Image src="/assets/star-icon.png" alt="logo" width={32} height={32}/>
                                </ListItemIcon>
                                <ListItemText primary="Star" sx={{ opacity: openDrawer ? 1 : 0 }} />
                            </ListItemButton>
                        </Link>
                    </ListItem>

                    <ListItem key="Space" disablePadding sx={{ display: 'block' }} className="drawerItem">
                        <Link href="/launch">
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
                                    <Image src="/assets/space-icon.png" alt="logo" width={32} height={32}/>
                                </ListItemIcon>
                                <ListItemText primary="Space" sx={{ opacity: openDrawer ? 1 : 0 }} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
        </nav>
    );
};

export default Drawer;
