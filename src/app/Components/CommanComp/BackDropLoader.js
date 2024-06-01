"use client"
import React, { useRef, useState, useEffect, useContext } from "react";

import { useRouter } from 'next/navigation';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import CheckloginContext from '/context/auth/CheckloginContext'

export default function BackDropLoader() {
    const Contextdata = useContext(CheckloginContext)


    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={Contextdata.MainLoader}
               
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
