import { useState } from "react"
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CssBaseline,
    Divider,
    Tooltip,
    useMediaQuery,
    useTheme,
} from "@mui/material"

import { Link, Outlet, useLocation } from "react-router-dom"

import MenuIcon from "@mui/icons-material/Menu"
import DashboardIcon from "@mui/icons-material/Dashboard"
import ContactsIcon from "@mui/icons-material/Contacts"
import PeopleIcon from "@mui/icons-material/People"

const drawerWidth = 240
const collapsedWidth = 72

export default function DashboardLayout() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const [mobileOpen, setMobileOpen] = useState(false)
    const [open, setOpen] = useState(true)

    const location = useLocation()

    const toggleDrawer = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen)
        } else {
            setOpen(!open)
        }
    }

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
        { text: "Clients", icon: <PeopleIcon />, path: "/clients" },
        { text: "Contacts", icon: <ContactsIcon />, path: "/contacts" },
    ]

    const drawerContent = (
        <>
            <Toolbar />
            <Divider />
            <List>
                {menuItems.map((item) => {
                    const active = location.pathname === item.path

                    return (
                        <Tooltip
                            key={item.text}
                            title={!open && !isMobile ? item.text : ""}
                            placement="right"
                        >
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={active}
                                onClick={() => isMobile && setMobileOpen(false)}
                                sx={{
                                    justifyContent: !open && !isMobile ? "center" : "flex-start",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: !open && !isMobile ? "auto" : 2,
                                        justifyContent: "center",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                {(open || isMobile) && (
                                    <ListItemText primary={item.text} />
                                )}
                            </ListItemButton>
                        </Tooltip>
                    )
                })}
            </List>
        </>
    )

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* APP BAR */}
            <AppBar
                position="fixed"
                sx={{ zIndex: theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <IconButton color="inherit" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Contacts App 🚀
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* DRAWERS */}
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": { width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        width: open ? drawerWidth : collapsedWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: open ? drawerWidth : collapsedWidth,
                            transition: "width 0.3s",
                            overflowX: "hidden",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {/* MAIN CONTENT */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    )
}
