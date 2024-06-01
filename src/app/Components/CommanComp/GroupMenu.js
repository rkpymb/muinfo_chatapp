"use client"
import React, { useRef, useState, useEffect, useContext } from "react";
import CheckloginContext from '/context/auth/CheckloginContext'
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Mstyles from "@/app/page.module.css";
import GroupInfo from '../CommanComp/GroupInfo'

import { LuMoreVertical, LuPowerOff, LuInfo, LuSettings } from "react-icons/lu";

import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default function CustomizedMenus({ LeaveGroup, GroupData,TotalMembers }) {
    const router = useRouter()
    const Contextdata = useContext(CheckloginContext)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>

            <IconButton
                onClick={handleClick}
                style={{ width: 35, height: 35, }}
            >
                <LuMoreVertical />
            </IconButton>

            <StyledMenu
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >

                <div>
                    <MenuItem  disableRipple>
                        <GroupInfo GroupData={GroupData}  TotalMembers={TotalMembers}/>
                    </MenuItem>
                    <MenuItem onClick={handleClose} disableRipple>
                        <div className={Mstyles.SmallMenuItem} onClick={LeaveGroup}>

                            <div className={Mstyles.SmallMenuItemA}>
                                <LuPowerOff />

                            </div>
                            <div className={Mstyles.SmallMenuItemB}>
                                <span>Leave Group</span>

                            </div>
                        </div>
                    </MenuItem>
                    {Contextdata.UserData.Role == 1 &&
                        <MenuItem onClick={() => router.push(`/group/setting/${GroupData.GroupID}`)} disableRipple>
                            <div className={Mstyles.SmallMenuItem}>
                                <div className={Mstyles.SmallMenuItemA}>
                                    <LuSettings />
                                </div>
                                <div className={Mstyles.SmallMenuItemB}>
                                    <span>Group Settings</span>

                                </div>
                            </div>
                        </MenuItem>
                    }
                </div>

            </StyledMenu>
        </div>
    );
}