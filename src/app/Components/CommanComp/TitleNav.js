"use client"

import React from 'react'


import Mstyles from "@/app/page.module.css";

import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';

import { LuArrowLeft, LuPowerOff, LuInfo, LuSettings } from "react-icons/lu";
const TitleNav = ({ title }) => {
    const router = useRouter()

    const blurredImageData = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg==';
    return (
        <div className={Mstyles.Navttitle}>
        <div className={Mstyles.NavttitleA}>
            <IconButton
              onClick={() => router.back()}
               
                style={{ width: 40, height: 40, }}
            >
                <LuArrowLeft />
            </IconButton>
        </div>
        <div className={Mstyles.NavttitleB}>
            <span>{title}</span>
        </div>

    </div>
    )
}

export default TitleNav
