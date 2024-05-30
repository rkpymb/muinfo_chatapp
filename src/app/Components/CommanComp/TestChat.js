// components/Chat.js
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMessages(page);
  }, [page]);

  const fetchMessages = async (page) => {
    const res = await axios.get(`/api/messages?page=${page}`);
    if (res.data.length === 0) {
      setHasMore(false);
      return;
    }
    setMessages((prevMessages) => [...res.data, ...prevMessages]);
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 500,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
      }}
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
        inverse={true}
      >
        {messages.map((message) => (
          <div key={message.id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            {message.text}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Chat;
