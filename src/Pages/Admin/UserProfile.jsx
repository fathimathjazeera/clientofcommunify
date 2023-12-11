import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfile.css"; // Import your CSS file for styling
import { useParams } from "react-router-dom";

const UserProfileDetails = () => {
  const [singleUser, setSingleUser] = useState();
  const { id } = useParams();

  const fetchSpecificUser = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const response = await axios.get(
        `https://communify-server.mrzera.in/api/specificuser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.status === "success") {
        setSingleUser(response.data.data);
      } else {
        console.log("Failed to fetch user data");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchSpecificUser();
  }, [id]);

  return (
    <>
      {singleUser && (
        <div className="aduser-details-box">
          <h2>User Details</h2>
          <div className="aduser-detail">
            <strong>Name:</strong> {singleUser.username}
          </div>
          <div className="aduser-detail">
            <strong>Email:</strong> {singleUser.email}
          </div>
          <div className="aduser-detail">
            <strong>Karma:</strong> {singleUser.karma}
          </div>
        </div>
      )}
    </>
  );
};

const UserProfileTabs = ({ activeTab, handleTabClick }) => (
  <div className="aduser-tabs">
    <div
      className={`aduser-tab ${activeTab === "posts" && "active"}`}
      onClick={() => handleTabClick("posts")}
    >
      Posts
    </div>
    <div
      className={`aduser-tab ${activeTab === "comments" && "active"}`}
      onClick={() => handleTabClick("comments")}
    >
      Comments
    </div>
    <div
      className={`aduser-tab ${activeTab === "upvotes" && "active"}`}
      onClick={() => handleTabClick("upvotes")}
    >
      Upvotes
    </div>
    <div
      className={`aduser-tab ${activeTab === "downvotes" && "active"}`}
      onClick={() => handleTabClick("downvotes")}
    >
      Downvotes
    </div>
  </div>
);

function UserProfile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([])
  const { id } = useParams();

  const userPosts = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const response = await axios.get(
        `https://communify-server.mrzera.in/api/admin/viewuserpost/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { status, message, data } = response.data;

      if (status === "success") {
        setPosts(data);
        console.log(data, "from viewadminuser");
      }
    } catch (err) {
      console.log(err.message);
    }
  };


  const renderComments = async() => {
    const token=localStorage.getItem('adminAuthToken')
const response=await axios.get(`https://communify-server.mrzera.in/api/admin/viewusercomment/${id}`,
{
    headers:{
        Authorization:`Bearer ${token}`
    }
})
  const {status,message,data}=response.data
setComments(data)
  };




  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "posts") {
      userPosts();
    }else if(tab === "comments"){
      renderComments();
    }
  };

  useEffect(() => {
    userPosts();

  }, [activeTab, id]);





  return (
    <div>
      <UserProfileDetails />
      <UserProfileTabs activeTab={activeTab} handleTabClick={handleTabClick} />

      <div className="aduser-content">
        {activeTab === "posts" && (
          <div>
            {posts?.map((item) => {
              return <h1 key={item.id}>{item.title}</h1>;
            })}
          </div>
        )}
        {activeTab === "comments" && (<div>
          
          {
            comments.map((data)=>(
              <>
              <ul>
              <li>commented on: {data.postId.title}</li>
              <li>{data.text}</li>
              </ul></>
            ))
          }
          </div>)
          }
        {activeTab === "upvotes" && <div>Upvotes content goes here</div>}
        {activeTab === "downvotes" && <div>Downvotes content goes here</div>}
      </div>
    </div>
  );
}

export default UserProfile;
