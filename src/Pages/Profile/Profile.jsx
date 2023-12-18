// Profile.js
import React, { useState, useEffect } from "react";
import "./Profile.css";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [user, setUser] = useState([]);
  const [userPost, setUserPost] = useState([]);
  const [usersComments, setUsersComments] = useState([]);
  const [userUpvote,setUserUpvote]= useState([])
const [userDownvote, setUserDownvote] = useState([])

const [isEditModalOpen, setIsEditModalOpen] = useState(false);


const [editedProfile, setEditedProfile] = useState({
  username: user.username,
  email: user.email,
  // Add other profile fields as needed
});
const openEditModal = () => {
  setIsEditModalOpen(true);
};

// Function to close the edit profile modal
const closeEditModal = () => {
  setIsEditModalOpen(false);
};

// Function to handle input changes in the edit profile modal
const handleEditInputChange = (e) => {
  const { name, value } = e.target;
  setEditedProfile((prevProfile) => ({
    ...prevProfile,
    [name]: value,
  }));
};

const handleProfileEditSubmit = async() => {
  const token= localStorage.getItem('authToken')
await axios.put('https://communify-server.mrzera.in/api/users/editprofile',{
user
},{
headers:{
  Authorization:`Bearer ${token}`
}
})
  closeEditModal();
};


const navigation=useNavigate()
  console.log(userDownvote, "downvotes home from profile");



  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const deleteProfile=async()=>{
    try{
      const token=localStorage.getItem('authToken')
   const response=   await axios.delete('https://communify-server.mrzera.in/api/users/deleteprofile',{
       headers:{
         Authorization:`Bearer ${token}`
       }
      })
      const{status,message,data}= response.data
      if(status=='success'){
        console.log("success");
      }
    }catch(err){
      console.log(err.message);
    }

}
  const userPosts = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        "https://communify-server.mrzera.in/api/users/viewuserpost",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { status, message, data } = response.data;

      if (status === "success") {
        console.log("Fetched userposts successfully:", data);
        setUserPost(data);
      } else {
        console.error("comments retrieval failed. Message:", message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  
  const viewUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      "https://communify-server.mrzera.in/api/users/userprofile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { status, message, data } = response.data;
    if (status === "success") {
      console.log("Fetched userprofile:", data);
      setUser(data);
    } else {
      console.error("comments retrieval failed. Message:", message);
    }
  };

  const userComments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "https://communify-server.mrzera.in/api/users/viewusercomment",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { status, message, data } = response.data;

      if (status === "success") {
        console.log("Fetched usercomments successfully:", data);
        setUsersComments(data);
      } else {
        console.error("comments retrieval failed. Message:", message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const userUpvoted = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('https://communify-server.mrzera.in/api/users/userupvote', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { status, message, data } = response.data;
  
      if (status === 'success') {
        setUserUpvote(data);
       
      }
    } catch (err) {
      console.log(err.message, "error");
    }
  };
  
  const userDownvoted = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('https://communify-server.mrzera.in/api/users/userdownvote', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { status, message, data } = response.data;


      if (status === 'success') {
        setUserDownvote(data);
       
      }
    } catch (err) {
      console.log(err.message, "error");
    }
  };

  const deletePost=async(id)=>{
    try{
    const token=localStorage.getItem('authToken')
    
    await axios.delete(`https://communify-server.mrzera.in/api/users/deletepost/${id}`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
      userPosts()
    }catch(err){
      console.log(err.message);
    }
    }

  useEffect(() => {
    viewUserProfile();
    userPosts();
    userComments();
    userUpvoted()
    userDownvoted()
  }, []);



  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="left-panel">
          <div className="p-tabs" style={{marginLeft:"30px"}}>
            <div
              className={`p-tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => handleTabClick("posts")}
            >
              Posts
            </div>
            <div
              className={`p-tab ${activeTab === "comments" ? "active" : ""}`}
              onClick={() => handleTabClick("comments")}
            >
              Comments
            </div>
            <div
              className={`p-tab ${activeTab === "upvote" ? "active" : ""}`}
              onClick={() => handleTabClick("upvote")}
            >
              Upvote
            </div>
            <div
              className={`p-tab ${activeTab === "downvote" ? "active" : ""}`}
              onClick={() => handleTabClick("downvote")}
            >
              Downvote
            </div>
           
          </div>
          <div className="p-tab-content" style={{zIndex:"1"}}>
            {activeTab == "posts" && (
              <>
                {userPost?.map((item) => {
                  return (
                    <>
                      <h1>{item.title}</h1>
                      <img  src={item.image} width={200} height={200}/>
                      <h1>{item.content}</h1>
                      <button style={{zIndex:"1"}} onClick={()=>{deletePost(item._id)}}>delete</button>
                      <button style={{zIndex:"1"}} >edit</button>
                    </>
                  );
                })}
              </>
            )}
            {activeTab == "comments" && (
              <>
              {usersComments?.map((item)=>{
                return <>
                 <h4>Posted on {item.postId?.title}</h4>
                <h4>{item?.text}</h4>
               
                </>

              })}

              </>

            )}
             {activeTab == "upvote" && (
              <>
              {userUpvote?.map((item)=>{
                return <>
                 
                <h4>{item.postId?.title}</h4>
                <h4>{item.postId?.content}</h4>
                <img style={{height:"200px", width:"200px"}} src={item?.postId?.image} alt="post" />
                
                </>

              })}

              </>

            )}
 {activeTab == "downvote" && (
              <>
              {userDownvote?.map((item)=>{
                return <>
                 
                <h4>{item.postId.title}</h4>
                <h4>{item.postId.content}</h4>
                <img style={{height:"200px", width:"200px"}} src={item.postId.image} alt="post" />
                
                </>

              })}

              </>

            )}



          </div>
        </div>

        <div className="right-panel">
          <div className="p-profile-box">
            <img
              src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/user-profile-icon.png"
              alt="User Profile"
              className="p-profile-image"
            />
            <div className="p-username">{user.username}</div>
            <div className="p-profile-details">
              <h3>{user.email}</h3>
          
            </div>
            <div className="p-profile-actions">
              <button className="p-edit-profile" onClick={openEditModal}>Edit Profile</button>
              <button className="p-delete-profile" onClick={deleteProfile}>Delete Profile</button>
            </div>
            <button className="p-create-post" onClick={()=>{navigation('/Create')}}>Create Post</button>
          </div>
        </div>
      </div>




      {isEditModalOpen && (
        <div className="p-edit-modal-overlay">
          <div className="p-edit-modal">
            <h2>Edit Profile</h2>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={editedProfile.username}
                onChange={handleEditInputChange}
                className="p-edit-input"
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleEditInputChange}
                className="p-edit-input"
              />
            </label>
            {/* Add other profile fields as needed */}
            <button onClick={handleProfileEditSubmit} className="p-edit-submit">
              Save Changes
            </button>
            <button onClick={closeEditModal} className="p-edit-cancel">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;