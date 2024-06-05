"use client"
import React, { useRef, useState, useEffect, useContext } from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Mstyles from "@/app/page.module.css";
import { LuArrowLeft, LuPowerOff, LuInfo, LuSettings } from "react-icons/lu";
import Image from 'next/image';
import { MediaFilesUrl, MediaFilesFolder, API_URL } from '/Data/config'
export default function GroupInfo({ GroupData, TotalMembers }) {
    const blurredImageData = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg==';

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <div>

            <div className={Mstyles.SmallMenuItem} onClick={handleOpen}>

                <div className={Mstyles.SmallMenuItemA}>
                    <LuInfo />

                </div>
                <div className={Mstyles.SmallMenuItemB}>
                    <span>Group Info</span>

                </div>
            </div>
            {open ?
                <div>
                    <Backdrop
                       onClick={handleClose}
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={open}

                    >
                        <div className={Mstyles.GroupInfobox}>

                            <div className={Mstyles.JBTopInfo}>
                                <div className={Mstyles.Mh}>
                                    <div className={Mstyles.MhA}>
                                        <IconButton
                                            onClick={handleClose}
                                            aria-label="toggle password visibility"
                                            style={{ width: 40, height: 40, }}
                                        >
                                            <LuArrowLeft />
                                        </IconButton>
                                    </div>
                                    <div className={Mstyles.MhB}>
                                        <span>Group info</span>
                                    </div>

                                </div>

                                <div className={Mstyles.GroupInfoMb}>


                                    {!GroupData ? <div>
                                        <Skeleton variant="circular" width={70} height={70} />
                                    </div> :

                                        <div className={Mstyles.GroupAvatarBig}>

                                            <Image
                                                src={`${MediaFilesUrl}${MediaFilesFolder}${GroupData && GroupData.GroupLogo}`}
                                                alt=""
                                                layout='fill'
                                                blurDataURL={blurredImageData}
                                                placeholder='blur'

                                            />

                                        </div>
                                    }
                                    <div style={{ height: '20px' }}></div>

                                    {!GroupData ? <div style={{ width: '40%', margin: 'auto' }}>
                                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={'100%'} />
                                    </div> :
                                        <div className={Mstyles.GroupNameT}>
                                            <span>{GroupData.GroupName}</span>
                                        </div>
                                    }

                                    {!GroupData ? <div style={{ width: '60%', margin: 'auto' }}>
                                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={'100%'} />
                                    </div> :
                                        <div className={Mstyles.Tagline}>
                                            <span>{GroupData.Tagline}</span>
                                        </div>
                                    }
                                    <div style={{ height: '20px' }}></div>
                                    <div className={Mstyles.TotalMembers}>
                                        <span>{TotalMembers} Members</span>
                                    </div>
                                    <div style={{ height: '20px' }}></div>
                                    {!GroupData ? null :
                                        <div className={Mstyles.Description}>
                                            <span>{GroupData.Description}</span>
                                        </div>
                                    }

                                </div>


                            </div>

                        </div>
                    </Backdrop>
                </div> : null
            }

        </div>
    );
}
