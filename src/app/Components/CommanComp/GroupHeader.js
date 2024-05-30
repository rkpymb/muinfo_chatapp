"use client"

import React from 'react'


import Mstyles from "@/app/page.module.css";
import Skeleton from '@mui/material/Skeleton';
import Image from 'next/image';
import { MediaFilesUrl, MediaFilesFolder } from '/Data/config'
import { LuMoreVertical, LuPlus, LuUsers2 } from "react-icons/lu";

import IconButton from '@mui/material/IconButton';
const GroupHeader = ({ GroupData ,TotalMembers}) => {

    const blurredImageData = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg==';
    return (
        <div className={Mstyles.GroupHeader}>
            <div className={Mstyles.GroupHeaderMain}>
                <div className={Mstyles.GroupHeaderA}>
                    <div className={Mstyles.GroupTop}>
                        <div className={Mstyles.GroupItemToA}>
                            {!GroupData ? <div>
                                <Skeleton variant="circular" width={40} height={40} />
                            </div> :
                                <div className={Mstyles.UserAvatar}>

                                    <Image
                                        src={`${MediaFilesUrl}${MediaFilesFolder}${GroupData.GroupLogo}`}
                                        alt=""
                                        layout='fill'
                                        blurDataURL={blurredImageData}
                                        placeholder='blur'
                                        
                                    />
                                </div>
                            }

                        </div>
                        <div className={Mstyles.GroupTopB}>
                            <div className={Mstyles.GroupItemDetails}>

                                {!GroupData ? <div>
                                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
                                </div> :
                                    <span>{GroupData.GroupName}</span>
                                }

                                <div className={Mstyles.GrouCountItemB}>



                                    {!GroupData ? <div>
                                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={50} />
                                    </div> :
                                        <span>{TotalMembers} Members</span>
                                    }

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className={Mstyles.GroupHeaderB}>
                    {!GroupData ? <div style={{padding:'10px'}}>
                        <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                    </div> :
                        <IconButton
                            style={{ width: 35, height: 35, }}
                        >
                            <LuMoreVertical />
                        </IconButton>
                    }

                </div>
            </div>
        </div>
    )
}

export default GroupHeader