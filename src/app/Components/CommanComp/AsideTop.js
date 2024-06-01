"use client"

import { useState, useEffect, useContext } from 'react';
import Mstyles from "@/app/page.module.css";
import CheckloginContext from '/context/auth/CheckloginContext'
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';
import { MediaFilesUrl, MediaFilesFolder } from '/Data/config'
import CreateGroup from '../CommanComp/CreateGroup'


const AsideTop = () => {

    const Contextdata = useContext(CheckloginContext)
    const blurredImageData = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg==';

    return (
        <div className={Mstyles.AsideTop}>
            <div className={Mstyles.AsideTopA}>
                <div className={Mstyles.UserAvatar}>
                    {!Contextdata.UserLogin ?
                        <Skeleton variant="circular" animation='wave' width={40} height={40} /> :

                        <Image
                            src={`${MediaFilesUrl}${MediaFilesFolder}${Contextdata.UserData.dp}`}
                            alt=""
                            layout='fill'
                            blurDataURL={blurredImageData}
                            placeholder='blur'

                        />
                    }


                </div>

                {!Contextdata.UserLogin ?
                    <div className={Mstyles.AsideTopText}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={60} />
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
                    </div> :

                    <div className={Mstyles.AsideTopText}>
                        <span>Hi, {Contextdata.UserData.name}</span>
                        <small>Let's disscuss your topics and queries.</small>
                    </div>
                }

            </div>
            <div className={Mstyles.AsideTopB}>

                {Contextdata.UserData.Role == 1 &&
                    <CreateGroup />
                }


            </div>



        </div>
    )
}

export default AsideTop
