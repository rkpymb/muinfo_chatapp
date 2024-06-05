"use client"
import { useState, useEffect, useContext } from 'react';

import Mstyles from "@/app/page.module.css";
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import { MediaFilesUrl, MediaFilesFolder } from '/Data/config'

import { useRouter } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import CheckloginContext from '/context/auth/CheckloginContext'

import LoadingButton from '@mui/lab/LoadingButton';
import { LuUsers2, LuPlus } from "react-icons/lu";


const MyGroups = () => {
    const Contextdata = useContext(CheckloginContext)
    const router = useRouter()
    const [FeedList, setFeedList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [AllData, setAllData] = useState(0);
    const [limit, setlimit] = useState(10);
    const [PostID, setPostID] = useState('Demo1234');
    const [hasMore, setHasMore] = useState(true);
    const [ShowComments, setShowComments] = useState(false);
    const [count, setCount] = useState(1);
    const [page, setPage] = useState(1);

    const blurredImageData = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg==';

    const GetData = async () => {

        const sendUM = {
            page: page,
            limit: limit,

        };

        try {
            const data = await fetch("/api/user/my_groups", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(sendUM)
            });

            if (!data.ok) {
                throw new Error('Failed to fetch data');
            }
            const parsed = await data.json();

            if (parsed.ReqData) {
                console.log(parsed.ReqData.DataList)

                if (parsed.ReqData.DataList.length === 0) {
                    setHasMore(false);
                    setIsLoading(false);

                } else {

                    if (page === 1) {
                        setFeedList([])
                    }

                    setFeedList(prevData => [...prevData, ...parsed.ReqData.DataList]);
                    setPage(page + 1)

                    if (parsed.ReqData.DataList.length < limit) {
                        setHasMore(false);

                    }
                    setIsLoading(false);
                }


            } else {
                setHasMore(false);
            }


        } catch (error) {
            console.error('Error fetching data:', error);

        }
    };

    const loadMoreData = () => {
        if (!isLoading) {
            setIsLoading(true);
            setTimeout(function () {
                GetData();
            }, 1000);

        }
    };


    useEffect(() => {

        if (Contextdata.UserLogin) {
            GetData();
        }

    }, [Contextdata.UserData])

    return (
        <div>
            {FeedList.length > 0 &&
                <div className={Mstyles.SideBarTitle}>
                    <span>Group Messages</span>

                </div>


            }
            <InfiniteScroll
                dataLength={FeedList.length}
                next={loadMoreData}
                hasMore={hasMore}
                scrollThreshold={0.2}
                loader={<div style={{ textAlign: 'center', margin: 'auto', marginTop: '20px' }} >
                    <CircularProgress size={25} color="success" />
                </div>}

            >


                <div className={Mstyles.GroupGrid}>
                    {FeedList.map((item, index) => {
                        return <div key={index} className={Mstyles.AllGroupItem} onClick={() => router.push(`/group/${item.GroupData.GroupID}`)}>
                            <div className={Mstyles.GroupItemTop}>
                                <div className={Mstyles.GroupItemToA}>
                                    <div className={Mstyles.GroupItemLogo}>
                                        <Image
                                            src={`${MediaFilesUrl}${MediaFilesFolder}${item.GroupData.GroupLogo}`}
                                            alt=""
                                            layout='responsive'
                                            height={100}
                                            width={100}
                                            blurDataURL={blurredImageData}
                                            placeholder='blur'
                                            style={{ objectFit: "cover", }}
                                        />
                                    </div>

                                </div>
                                <div className={Mstyles.GroupItemTopB}>
                                    <div className={Mstyles.GroupItemDetails}>
                                        <div className={Mstyles.GroupName}>
                                            <span>{item.GroupData.GroupName}</span>

                                        </div>

                                        <div className={Mstyles.Recentmsg}>
                                            <span>{item.LastMsg ? item.LastMsg.ChatData[0].ChatText.slice(0, 25) : 'start conversation'}</span>
                                        </div>
                                        <div className={Mstyles.MsgTimebox}>
                                            <span>{item.LastMsg ? item.LastMsg.time : null}</span>
                                        </div>


                                    </div>
                                </div>
                            </div>


                        </div>
                    }

                    )}
                </div>


            </InfiniteScroll>





        </div>
    )
}

export default MyGroups
