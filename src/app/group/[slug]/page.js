"use client"
import React, { useRef, useState, useEffect, useContext } from "react";
import Mstyles from "@/app/page.module.css";
import GroupHeader from '../../Components/CommanComp/GroupHeader'

import MessageList from '../../Components/Chat/MessageList'
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import CheckloginContext from '/context/auth/CheckloginContext'
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import { GrAttachment } from "react-icons/gr";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MediaFilesUrl, MediaFilesFolder, API_URL } from '/Data/config'

import io from 'socket.io-client';

import { LuSendHorizonal, LuPlus, LuUsers2 } from "react-icons/lu";
const page = ({ params }) => {
    const router = useRouter()
    const { slug } = params;
    const Contextdata = useContext(CheckloginContext)

    const [GroupData, setGroupData] = useState(null);
    const [EditorContent, setEditorContent] = useState(null);
    const [MsgText, setMsgText] = useState(null);
    const [Loading, setLoading] = useState(true);
    const [LoadingBtn, setLoadingBtn] = useState(false);
    const [SendLoadingBtn, setSendLoadingBtn] = useState(false);
    const [IsJoin, setIsJoin] = useState(null);
    const [TotalMembers, setTotalMembers] = useState(0);
    let [OnlineInGroup, setOnlineInGroup] = useState(0);
    let [OnlineUsers, setOnlineUsers] = useState([]);

    const [roomId, setRoomId] = useState(null);
    const [socket, setSocket] = useState(null);

    const blurredImageData = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg==';



    useEffect(() => {


        if (IsJoin && roomId && Contextdata.UserJwtToken) {


            const newSocket = io(API_URL, {
                auth: {
                    token: Contextdata.UserJwtToken || null,
                },
                transports: ['websocket'],
            });

            newSocket.on('connect', () => {
                console.log('Connected to server');

            });

            newSocket.on('disconnect', () => {
                console.log('Disconnected from server');

                if (roomId) {
                    newSocket.emit('LeaveRoom', roomId);
                }
            });

            newSocket.on('connect_error', (err) => {
                console.error('Connection error:', err);
            });

            const joinRoom = () => {
                if (roomId) {
                    newSocket.emit('joinRoom', roomId);
                }
            };



            joinRoom();

            newSocket.on('userJoined', (data) => {
                const NewData = data.roomUsers[slug]
                setOnlineUsers(NewData);

            });

            newSocket.on('userLeft', (data) => {
                const NewData = data.roomUsers[slug]
                setOnlineUsers(NewData);
            });


            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [roomId, Contextdata.UserJwtToken, IsJoin]);


    useEffect(() => {
        setRoomId(slug)
        if (slug) {
            GetData()
        }
    }, [slug]);

    useEffect(() => {
        console.log(OnlineUsers)
        setOnlineInGroup(OnlineUsers.length)
    }, [OnlineUsers]);




    const handleChange = (event) => {
        setMsgText(event.target.value);
    };

    const handleClick = () => {
        const formattedText = MsgText.replace(/\n/g, '<br />');
        setEditorContent(formattedText);
    };

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
                        console.log(parsed.ReqData.Group)
                        setGroupData(parsed.ReqData.Group)
                        setIsJoin(parsed.ReqData.IsJoin)
                        setTotalMembers(parsed.ReqData.TotalMembers)
                        setLoading(false)
                        Contextdata.ChangeMainLoader(false)



                    }

                }, 1000);



            })
    }
    const JoinGroup = async () => {
        setLoadingBtn(true)
        const sendUM = { GroupID: slug }
        const data = await fetch("/api/user/join_group", {
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
                    if (parsed.ReqData && parsed.ReqData.done) {
                        setLoadingBtn(false)
                        GetData()
                    }
                }, 3000);
            })
    }
    const LeaveGroup = async () => {
       
        let text = "Do you want to leave this group ?";
        if (confirm(text) == true) {
            Contextdata.ChangeMainLoader(true)
            const sendUM = { GroupID: slug }
            const data = await fetch("/api/user/leave_group", {
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
                        if (parsed.ReqData && parsed.ReqData.done) {
                            Contextdata.ChangeMainLoader(false)
                            router.push('/group')
                        }else{
                            
                            Contextdata.ChangeMainLoader(false)
                        }
                    }, 3000);
                })
        }


    }
    const send_group_msg = async () => {
        if (MsgText !== null) {
            setSendLoadingBtn(true)
            const sendUM = {
                GroupID: slug,
                ChatType: 'Text',
                ChatText: MsgText,
            }
            const data = await fetch("/api/user/send_group_msg", {
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
                        if (parsed.ReqData && parsed.ReqData.done) {

                            setMsgText('')
                            const SoketData = parsed.ReqData.NewData
                            socket.emit('NewGroupMessage', { SoketData, roomId });
                            setSendLoadingBtn(false)



                        }
                    }, 100);
                })
        }

    }


    return (<div>

        {IsJoin ?
            <div>
                <GroupHeader GroupData={GroupData} TotalMembers={TotalMembers} OnlineInGroup={OnlineInGroup} LeaveGroup={LeaveGroup} />

                <div className={Mstyles.Chatbox}
                    id="scrollableDiv"
                >
                    {!Loading &&
                        <MessageList ParentID={slug} socket={socket} roomId={roomId} />
                    }

                </div>
                {!Loading &&
                    <div className={Mstyles.ChatboxFotter}>
                        {IsJoin !== null ?
                            <div className={Mstyles.ChatWritebox}>
                                <div className={Mstyles.ChatWriteboxA}>
                                    <IconButton
                                        style={{ width: 45, height: 45, }}
                                        onClick={handleClick}
                                    >
                                        <GrAttachment />
                                    </IconButton>
                                </div>
                                <div className={Mstyles.ChatWriteboxB}>

                                    <TextField
                                        placeholder="Write message ..."
                                        autoFocus={true}
                                        multiline
                                        fullWidth
                                        variant="standard"
                                        maxRows={4}
                                        value={MsgText}
                                        onChange={handleChange}

                                    />
                                </div>
                                <div className={Mstyles.ChatWriteboxC}>

                                    <IconButton
                                        style={{ width: 45, height: 45, }}
                                        onClick={send_group_msg}
                                        loading={SendLoadingBtn}
                                        desabled={SendLoadingBtn}
                                        loadingPosition="end"

                                    >
                                        <LuSendHorizonal />
                                    </IconButton>


                                </div>

                            </div> :
                            null
                        }


                    </div>

                }



            </div> :
            <div>

                <div className={Mstyles.JoinGroupBox}>

                    <div className={Mstyles.JBTop}>
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
                        {Loading ? <div>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
                        </div> :
                            <div className={Mstyles.TotalMembers}>
                                <span>{TotalMembers} Members</span>
                            </div>
                        }
                        <div style={{ height: '20px' }}></div>
                        {!GroupData ? null :
                            <div className={Mstyles.Description}>
                                <span>{GroupData.Description}</span>
                            </div>
                        }




                    </div>

                </div>
                {!Loading &&
                    <div className={Mstyles.ChatboxFotter}>
                        <div className={Mstyles.JoinbtnBox}>

                            <LoadingButton
                                fullWidth
                                onClick={JoinGroup}

                                startIcon={<LuPlus />}
                                loading={LoadingBtn}
                                desabled={LoadingBtn}
                                loadingPosition="end"
                                variant='contained'
                            >
                                <span>Join Group</span>
                            </LoadingButton>
                        </div>


                    </div>

                }



            </div>



        }





    </div>

    )
}

export default page
