"use client"
import React, { useState, useEffect, useContext } from 'react';
import CheckloginContext from '/context/auth/CheckloginContext'

import Dialog from '@mui/material/Dialog';


import { LuArrowLeft, LuSearch, LuChevronRight, LuMinus, } from "react-icons/lu";

import Mstyles from "@/app/page.module.css";
import { MediaFilesUrl, MediaFilesFolder, FeedimgFolder, DomainURL } from '/Data/config';
import IconButton from '@mui/material/IconButton';
import DpUploader from '../CommanComp/DpUploader'
import Slide from '@mui/material/Slide';

import LoadingButton from '@mui/lab/LoadingButton';

import { LuPlus } from "react-icons/lu";
import TextField from '@mui/material/TextField';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const Demo = ({ SType }) => {
    const blurredImageData = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg==';

    const Contextdata = useContext(CheckloginContext)
    const [OpenEdit, setOpenEdit] = React.useState(false);
    const [LoadingBtn, setLoadingBtn] = React.useState(false);
    const [GroupName, setGroupName] = useState(null);
    const [Tagline, setTagline] = useState([]);
    const [Description, setDescription] = useState('');
    const [GroupLogo, setGroupLogo] = useState(null);

    const handleClickOpen = () => {
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
    };


    const descriptionElementRef = React.useRef(null);

    const onImageUpload = (Filedata) => {
        if (Filedata) {
            setGroupLogo(Filedata)
        } else {
            setGroupLogo(null)
        }


    };

    const AddGroup = async () => {
        if (GroupName !== null && GroupLogo !== null && Tagline !== null && Description !== null) {
            setLoadingBtn(true)
            const sendUM = {
                GroupName: GroupName,
                GroupLogo: GroupLogo,
                Tagline: Tagline,
                Description: Description
            }
            const data = await fetch("/api/user/create_group", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(sendUM)
            }).then((a) => {
                return a.json();
            })
                .then((parsed) => {
                    setLoadingBtn(false)
                    if (parsed.ReqData.AddedData && parsed.ReqData.AddedData.done) {
                        Contextdata.ChangeAlertData(`Group Created`, 'success');
                        setGroupName(null)
                        setGroupLogo(null)
                        setTagline(null)
                        setDescription(null)
                        setOpenEdit(false);

                    }

                    if (parsed.ReqData.error && parsed.ReqData.error.msg) {
                        Contextdata.ChangeAlertData(`${parsed.ReqData.error.msg}`, 'warning');
                    } else if (parsed.ReqData.error) {
                        Contextdata.ChangeAlertData(`Something Went Wrong`, 'warning');
                    }
                })
        }
    }

    return (
        <div>
            {Contextdata.UserData.Role == 1 &&

                <div>
                    <div style={{ height: '15px' }}></div>
                    <div className={Mstyles.craetegrpbtn}>

                        <LoadingButton
                            fullWidth
                            onClick={handleClickOpen}
                            startIcon={<LuPlus />}
                            loading={false}
                            loadingPosition="end"
                            variant='contained'
                        >
                            <span>Create New Group</span>
                        </LoadingButton>
                    </div>
                    <div style={{ height: '15px' }}></div>


                    <Dialog
                        fullScreen
                        open={OpenEdit}
                        onClose={handleCloseEdit}
                        TransitionComponent={Transition}
                    >
                        <div className={Mstyles.ModalHeader}>
                            <div className={Mstyles.ModalHeaderMain}>
                                <div className={Mstyles.ModalHeaderMainA}>
                                    <div className={Mstyles.ModalHeaderMainAA}>
                                        <IconButton
                                            onClick={handleCloseEdit}
                                            aria-label="toggle password visibility"
                                            style={{ width: 40, height: 40, }}
                                        >
                                            <LuArrowLeft />
                                        </IconButton>
                                    </div>
                                    <div className={Mstyles.ModalHeaderMainAB}>
                                        <span>Create New Group</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className={Mstyles.ModalContainer}>

                            <div className={Mstyles.AddCatBox}>
                                <form onSubmit={AddGroup} className={Mstyles.fadeinAnimation}>

                                    <div className={Mstyles.inputItem}>
                                        <TextField
                                            required
                                            label="Group Name"
                                            fullWidth
                                            value={GroupName}
                                            onInput={e => setGroupName(e.target.value)}

                                        />
                                    </div>
                                    <div className={Mstyles.inputItem}>
                                        <TextField
                                            required
                                            label="Group Description"
                                            fullWidth
                                            value={Description}
                                            onInput={e => setDescription(e.target.value)}

                                        />
                                    </div>
                                    <div className={Mstyles.inputItem}>
                                        <TextField
                                            required
                                            label="Group Tagline"
                                            fullWidth
                                            value={Tagline}
                                            onInput={e => setTagline(e.target.value)}

                                        />
                                    </div>



                                    <div className={Mstyles.EditPBoxProfile}>
                                        <DpUploader onImageUpload={onImageUpload} />
                                    </div>

                                    <div className={Mstyles.formbtn}>
                                        <LoadingButton
                                            fullWidth
                                            onClick={AddGroup}
                                            endIcon={<LuChevronRight />}
                                            loading={LoadingBtn}
                                            desabled={LoadingBtn}
                                            loadingPosition="end"
                                            variant='contained'
                                        >
                                            <span>Create Group</span>
                                        </LoadingButton>


                                    </div>

                                </form>

                            </div>

                        </div>



                    </Dialog >

                </div>
            }

        </div >
    )
};

export default Demo;
