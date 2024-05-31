"use client"
import { useState, useEffect, useContext } from 'react';

import Mstyles from "@/app/page.module.css";
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import { MediaFilesUrl, MediaFilesFolder } from '/Data/config'

import { useRouter } from 'next/navigation';
import IconButton from '@mui/material/IconButton';

import LoadingButton from '@mui/lab/LoadingButton';
import { LuUsers2, LuPlus } from "react-icons/lu";
const FeedlistMain = () => {
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
            const data = await fetch("/api/user/group_list", {
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
                console.log(parsed.ReqData)

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

        GetData();

    }, [count])

    return (
        <div>
            {FeedList.length > 0 &&
                <div className={Mstyles.SideBarTitle}>
                    <span>All Groups ({FeedList.length})</span>

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

                <div className={Mstyles.GroupGridAll}>
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
                                        <div className={Mstyles.MemberCountText}>
                                            <span>{item.TotalMembers} Members</span>
                                        </div>
                                        <div className={Mstyles.Tagline}>
                                            <span>{item.GroupData.Tagline}</span>
                                        </div>


                                    </div>
                                </div>
                            </div>
                            <div>
                                <LoadingButton
                                    fullWidth

                                    endIcon={<LuPlus />}
                                    loading={false}
                                    desabled={false}
                                    loadingPosition="end"
                                    variant='contained'
                                    size='small'
                                >
                                    <span>Join</span>
                                </LoadingButton>
                            </div>


                        </div>
                    }

                    )}
                </div>


            </InfiniteScroll>



        </div>
    )
}

export default FeedlistMain
