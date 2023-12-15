import React, { useEffect, useState } from 'react';
import './Community.css'; // Import your CSS file for styling
import Navbar from '../../components/Navbar/Navbar';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../AxiosInstance/AxiosInstance';

function Community() {
  const { communityname } = useParams();
  const [community, setCommunity] = useState({});
  const [communityPost, setCommunityPost] = useState([]);
  const [joined, setJoined] = useState(() => {
    const storedJoined = localStorage.getItem('joined');
    return storedJoined ? JSON.parse(storedJoined) : null;
  });

  const viewSpecificCommunity = async () => {
    try {
      const response = await axiosInstance.get(`/api/users/singlecommunity/${communityname}`);
      const { status, message, data } = response.data;

      if (status === 'success') {
        setCommunity(data);
      } else {
        console.error('Failed to fetch', message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const viewCommunityPost = async () => {
    try {
      const response = await axiosInstance.get(`/api/users/communitypost/${communityname}`);
      const { status, message, data } = response.data;
      if (status === 'success') {
        console.log('successfully fetched communitypost', data);
        setCommunityPost(data);
      } else {
        console.error('Failed to fetch', message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const joinCommunity = async (id) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axiosInstance.put(`/api/users/joincommunity/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { status, message, data } = response.data;
      if (status === 'success') {
        if (data.joined_communities.includes(id)) {
          setJoined(null);
          localStorage.removeItem('joined');
        } else {
          setJoined(data);
          localStorage.setItem('joined', JSON.stringify(data));
        }
      }

      viewSpecificCommunity();
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    viewSpecificCommunity();
    viewCommunityPost();
  }, [communityname]);

  return (
    <>
      <Navbar />

      <div className="com-container">
        {community && (
          <>
            <div className="com-header">
              <h1 className="com-community-name">r/ {community.name}</h1>
              <button className="com-create-post-button">Create Post</button>
              <button className="com-join-button" onClick={() => { joinCommunity(community._id) }}>

                {joined ? 'Joined' : 'Join'}
              </button>
            </div>

            <div className="com-main-content">
              {/* Individual Post */}
              <div className="com-side-box">
                <div className="com-side-header">
                  <h2 className="com-side-community-name">Community Info</h2>
                </div>
                <div className="com-side-body">
                  <p>Name: <strong>{community.name}</strong> </p>
                  <p>Members: {community.subscribers?.length}</p>

                  <p>Posts: {communityPost?.length}</p>

                </div>
              </div>
              {communityPost.map((item) => (
              <div className="com-post-container">
               
                  <div key={item._id}>
                    <h2 className="com-post-content-name">{item.title}</h2>

                    <div className="com-post-image-container">
                      
                      <img src={item.image} alt="Content" className="com-post-image" />
                    </div>
                    <button className="com-post-share-button">Share</button>
                  </div>
              

              </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Community;
