"use client"
import React, { useRef, useState, useEffect, useContext } from "react";
import Mstyles from "@/app/page.module.css";
import TitleNav from '../../../Components/CommanComp/TitleNav'

import Skeleton from '@mui/material/Skeleton';

import CheckloginContext from '/context/auth/CheckloginContext'
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

import GroupDpUploaderUpdate from '../../../Components/CommanComp/GroupDpUploaderUpdate'

import { useRouter } from 'next/navigation';

import { LuArrowLeft, LuSearch, LuChevronRight, LuTrash, } from "react-icons/lu";

const page = ({ params }) => {
    const router = useRouter()
    const { slug } = params;
    const Contextdata = useContext(CheckloginContext)
    const [GroupData, setGroupData] = useState(null);
    const [Loading, setLoading] = useState(true);
    const [LoadingBtn, setLoadingBtn] = useState(false);

    const [IsJoin, setIsJoin] = useState(null);

    const [GroupName, setGroupName] = useState(null);
    const [Tagline, setTagline] = useState(null);
    const [Description, setDescription] = useState(null);
    const [GroupLogo, setGroupLogo] = useState(null);

    const blurredImageData = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg==';


    useEffect(() => {

        if (slug) {
            GetData()
        }
    }, [slug]);


    const GetData = async () => {

        setLoading(true)
        const sendUM = { GroupID: slug }
        const data = await fetch("/api/user/group_data", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(sendUM)
        }).then((a) => {
            return a.json();
        })
            .then((parsed) => {

                setTimeout(function () {
                    if (parsed.ReqData && parsed.ReqData.Group) {

                        setGroupData(parsed.ReqData.Group)
                        setGroupName(parsed.ReqData.Group.GroupName)
                        setDescription(parsed.ReqData.Group.Description)
                        setTagline(parsed.ReqData.Group.Tagline)
                        setIsJoin(parsed.ReqData.IsJoin)

                        setLoading(false)
                        Contextdata.ChangeMainLoader(false)



                    }

                }, 1000);



            })
    }



    const onImageUpload = (Filedata) => {
        if (Filedata) {
            setGroupLogo(Filedata)
        } else {
            setGroupLogo(null)
        }


    };


    const UpdateGroup = async () => {

        if (GroupName !== null && Tagline !== null && Description !== null) {
            setLoadingBtn(true)
            const sendUM = {
                GroupName: GroupName,
                GroupID: GroupData.GroupID,
                Tagline: Tagline,
                Description: Description
            }
            const data = await fetch("/api/user/update_group", {
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
                    if (parsed.ReqData.done) {
                        Contextdata.ChangeAlertData(`Group Updated`, 'success');

                    } else {
                        Contextdata.ChangeAlertData(`Something Went Wrong`, 'warning');
                    }


                })
        }
    }
    const delete_group = async () => {

        if (GroupData) {
            setLoadingBtn(true)
            const sendUM = {
                
                GroupID: GroupData.GroupID,
              
            }
            const data = await fetch("/api/user/delete_group", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(sendUM)
            }).then((a) => {
                return a.json();
            })
                .then((parsed) => {
                    
                    if (parsed.ReqData.done) {
                        Contextdata.ChangeAlertData(`Group Deleted`, 'success');
                        router.push('/group')

                    } else {
                        Contextdata.ChangeAlertData(`Something Went Wrong`, 'warning');
                    }


                })
        }
    }
    return (<div>
        <TitleNav title={'Group Settings'} />

        <div className={Mstyles.PageBox}>
            {GroupData && IsJoin ?
                <div className={Mstyles.GroupSHBox}>
                    <div className={Mstyles.EditPBoxProfile}>
                        <GroupDpUploaderUpdate onImageUpload={onImageUpload} GroupData={GroupData} />
                    </div>

                    <div className={Mstyles.GroupSHBoxEdit}>
                        {/* <div className={Mstyles.FormTitle}>
                            <span>Edit Group Details</span>
                        </div> */}
                        <form onSubmit={UpdateGroup} className={Mstyles.fadeinAnimation}>

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





                            <div className={Mstyles.formbtn}>
                                <LoadingButton
                                    fullWidth
                                    onClick={UpdateGroup}
                                    endIcon={<LuChevronRight />}
                                    loading={LoadingBtn}
                                    desabled={LoadingBtn}
                                    loadingPosition="end"
                                    variant='contained'
                                >
                                    <span>Update Group</span>
                                </LoadingButton>


                            </div>

                        </form>

                    </div>


                    <div className={Mstyles.GroupSHBoxEdit}>

                        <div className={Mstyles.fadeinAnimation}>

                            <div className={Mstyles.FormTitle}>
                                <span>Delete Group</span>
                               <div>
                               <small>This action will delete all data related to this group</small>
                               </div>
                            </div>
                            <div className={Mstyles.formbtn}>
                                <LoadingButton
                                    fullWidth
                                    onClick={delete_group}
                                    endIcon={<LuTrash />}
                                    loading={LoadingBtn}
                                    desabled={LoadingBtn}
                                    loadingPosition="end"
                                    variant='outlined'
                                >
                                    <span>Delete Group</span>
                                </LoadingButton>


                            </div>

                        </div>

                    </div>

                </div> :
                <div style={{ width: '90%', margin: 'auto' }}>
                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: '30%' }} />
                    <div style={{ height: '10px' }}></div>
                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                    <div style={{ height: '2px' }}></div>
                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: '65%' }} />
                    <div style={{ height: '2px' }}></div>
                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: '70%' }} />
                </div>

            }
        </div>






    </div>

    )
}

export default page
