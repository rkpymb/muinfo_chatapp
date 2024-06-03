"use client"
import {
    useState, useEffect, forwardRef,
    useCallback,
    useLayoutEffect,
    useRef,
    useContext
} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Mstyles from "@/app/page.module.css";

import CheckloginContext from '/context/auth/CheckloginContext'


import Image from 'next/image';
import { MediaFilesUrl, MediaFilesFolder } from '/Data/config'

import { LuMoreVertical } from "react-icons/lu";
import IconButton from '@mui/material/IconButton';

let defaultStartIndex = 1;
let hasMore = true;

const MessageList = ({ ParentID, socket, roomId, ClickReply }) => {
    const Contextdata = useContext(CheckloginContext)
    const [FeedList, setFeedList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [PageNo, setPageNo] = useState(1);
    const [loading, setLoading] = useState(false);
    const [scrollToKey, setScrollToKey] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const itemRefs = useRef({});
    const containerRef = useRef(null);

    const [IsExpended, setIsExpended] = useState(false);

    const blurredImageData = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg==';

    const limit = 5;

    const fetchMoreItemsAbove = useCallback(() => {
        if (hasMore) {
            setTimeout(() => {
                GetData();
            }, 1000);
        }
    }, []);

    useLayoutEffect(() => {
        if (scrollToKey !== null && itemRefs.current[scrollToKey]) {
            itemRefs.current[scrollToKey].scrollIntoView({ behavior: 'smooth' });
        }
    }, [scrollToKey]);

    const onScroll = useCallback(
        (e) => {
            const { scrollTop } = e.target;
            if (scrollTop <= 0 && !loading) {
                fetchMoreItemsAbove();
            }
        },
        [fetchMoreItemsAbove, loading]
    );

    const GetData = async () => {
        setLoading(true);
        const sendUM = {
            page: defaultStartIndex,
            limit: limit,
            ParentID: ParentID
        };

        try {
            const response = await fetch("/api/user/group_message", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(sendUM)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const parsed = await response.json();

            if (parsed.ReqData) {
                const dataList = parsed.ReqData.DataList.reverse();
                if (dataList.length < limit) {
                    hasMore = false;
                }

                setFeedList((prevData) => removeDuplicates([...dataList, ...prevData]));
                defaultStartIndex += 1;

            } else {
                hasMore = false;
            }
            setLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
            hasMore = false;
            setLoading(false);
        }
    };

    const DeleteMsg = async (msg) => {
        const confirmDelete = window.confirm("Do you really want to delete this Message?");
        if (confirmDelete) {

            const sendUM = {
                msg: msg,
            };

            try {
                const response = await fetch("/api/user/delete_msg", {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(sendUM)
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const parsed = await response.json();

                if (parsed.ReqData.done) {

                    const msg_id = parsed.ReqData.msg_id
                    socket.emit('DeletedMessage', { msg_id, roomId });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const Expendmsg = async () => {
        if (IsExpended == true) {
            setIsExpended(false)
        } else {
            setIsExpended(true)
        }
    };

    useEffect(() => {
        defaultStartIndex = 1;
        hasMore = true;
        GetData();
    }, []);

    const Item = forwardRef(({ itemdata }, ref) => {
        const MsgBy = itemdata.Profile;
        const Userdp = `url(${MediaFilesUrl}${MediaFilesFolder}${MsgBy.dp})`
        const isActive = activeItem === itemdata.PostData._id;

        const handleClick = () => {
            setActiveItem((prevActiveItem) =>
                prevActiveItem === itemdata.PostData._id ? null : itemdata.PostData._id
            );
        };

        return (
            <main className="msger-chat" ref={ref} >
                <div className={MsgBy.username === Contextdata.UserData.username ? "msg right-msg" : "msg left-msg"}>
                    <div
                        className="msg-img"
                        style={{
                            backgroundImage: Userdp
                        }}
                    />
                    <div>
                        <div className="msg-bubble">

                            <div className="msg-info">
                                <div className="msg-info-name">{MsgBy.name}</div>

                                <div className="msg-info-time">
                                    {MsgBy.username === Contextdata.UserData.username && !isActive ?
                                        <IconButton
                                            onClick={handleClick}
                                            style={{
                                                width: 30, height: 30,
                                                color: 'white'
                                            }}
                                        >
                                            <LuMoreVertical />
                                        </IconButton> :
                                        <div className={Mstyles.MsgBtnsBox}>
                                            {(MsgBy.username === Contextdata.UserData.username || Contextdata.UserData.Role == 1) && (
                                                <div className={Mstyles.MsgBtns} >
                                                    <Image
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            DeleteMsg(itemdata.PostData);
                                                        }}
                                                        src={`/svg/delete.svg`}
                                                        alt=""
                                                        height={20}
                                                        width={20}

                                                        className={MsgBy.username === Contextdata.UserData.username ? Mstyles.whiteImage : Mstyles.blackImage}

                                                    />
                                                </div>

                                            )}

                                            <div className={Mstyles.MsgBtns}>
                                                <Image
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        ClickReply(itemdata);
                                                    }}
                                                    src={`/svg/reply.svg`}

                                                    height={20}
                                                    width={20}

                                                    className={MsgBy.username === Contextdata.UserData.username ? Mstyles.whiteImage : Mstyles.blackImage}

                                                />
                                            </div>
                                        </div>

                                    }

                                </div>
                            </div>
                            {itemdata.ReplyOf &&
                                <div className={Mstyles.ReplayMsgitem} onClick={Expendmsg}>
                                    <div className={Mstyles.ReplayforName}>
                                        {itemdata.ReplyOf[0].name}
                                    </div>
                                    <div className={IsExpended ? Mstyles.ReplayMsgitemTextFull : Mstyles.ReplayMsgitemText}>{itemdata.ReplyOf[0].PostData.ChatData[0].ChatText}
                                    </div>

                                </div>

                            }
                            <div className="msg-text">{itemdata.PostData.ChatData[0].ChatText}</div>
                            <div className="time-text">{itemdata.formattedDate}</div>
                        </div>

                    </div>
                </div>
            </main>
        );
    });

    const removeItemById = (id) => {
        setFeedList((prevData) => {
            const itemExists = prevData.some(item => item.PostData._id == id);
            if (!itemExists) {

                return prevData;
            }

            return prevData.filter(item => item.PostData._id !== id);
        });
    };

    useEffect(() => {
        if (socket) {
            socket.on('NewGroupMessage', (data) => {
                const newMessage = data.data.SoketData;
                addNewMessage(newMessage);
                setScrollToKey(data.data.SoketData[0].PostData._id);

            });
            socket.on('DeletedMessage', (data) => {
                const Del_msg_Id = data.data.msg_id;
                removeItemById(Del_msg_Id);
            });
        }
    }, [socket]);

    const addNewMessage = (newMessage) => {
        setFeedList((prevData) => removeDuplicates([...prevData, ...newMessage]));
    };

    const removeDuplicates = (list) => {
        const uniqueIds = new Set();
        return list.filter(item => {
            if (uniqueIds.has(item.PostData._id)) {
                return false;
            }
            uniqueIds.add(item.PostData._id);
            return true;
        });
    };

    return (
        <div
            ref={containerRef}
            style={{
                height: '100%',
                opacity: loading ? 0.5 : 1,
                overflow: "auto",
                width: "100%"
            }}
            onScroll={onScroll}
        >
            <main className="msger-chat">
                <div className={Mstyles.msgBox}>
                    {FeedList.map((item, index) => (
                        <Item
                            key={item.PostData._id}
                            itemdata={item}
                            ref={(el) => (itemRefs.current[item.PostData._id] = el)}
                            id={item.PostData._id}
                        />
                    ))}
                </div>
            </main>
            {loading && (
                <div className={Mstyles.CenterLoader}>
                    <CircularProgress />
                </div>
            )}
        </div>
    );
};

export default MessageList;
