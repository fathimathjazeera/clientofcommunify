import React, { useContext, useState } from 'react';
import './Navbar.css';
import axios from 'axios';
import main from '../../Images/main.png';
import create from '../../Images/create.png';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../Context/MyContext';
import axiosInstance from '../../AxiosInstance/AxiosInstance';
const Navbar = () => {
  const [community, setCommunity] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const navigation = useNavigate()
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const {isLoggedIn,username} = useContext(MyContext)


  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };


  const logout=()=>{
    const user=localStorage.getItem('authToken')
    const admin=localStorage.getItem('adminAuthToken')
if(user){
  localStorage.removeItem('authToken');
  location.reload()
  navigation('/')
}else if(admin)
localStorage.removeItem('adminAuthToken');
  }

  
  const clickCommunity = () => {
    setModalOpen(true);
  };

  const closeCommunityModal = () => {
    setModalOpen(false);
  };

  const createCommunity = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await axiosInstance.post(
        '/api/users/createcommunity',

      )

      const { status, message } = response.data;
      if (status === 'success') {
        console.log('Successfully created community');
      } else {
        console.log('Failed to create community');
      }
    } catch (err) {
      console.log(err.message, 'error');
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div className="login-home">
      <div className="login-navbar">
        <div className="left-nav" style={{marginLeft:"30px"}}>
          <img
           src={main}
            alt=""
            className="logo-communify"
            onClick={()=>{navigation('/')}}
            style={{cursor:"pointer"}}
          />
          <h1 className="logo-name" style={{marginLeft:"50px", cursor:"pointer"}} onClick={()=>{navigation('/')}}>
            <span className="span-c" >C</span>ommunify
          </h1>
   
            <div className="menu-button" onClick={clickCommunity}  style={{marginLeft:"200px", cursor:"pointer"}}>
              <img style={{height:"30px", width:"30px"}}  src={create} alt="" />
            </div>
        
        </div>
        <div className="middle-nav">
          <div className="search-bar" style={{marginRight:"200px"}}>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="right-nav">
        <div className="user-profile" onClick={toggleDropdown}>
          <img src='https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/user-profile-icon.png' alt="User Profile" className="user-profile-image" />
          {isDropdownOpen && (
            <div className="dropdown">
              <ul>
                {isLoggedIn ?
                <>
                <li onClick={()=>{navigation('/Profile')}}>{username}</li>
                <li onClick={logout}> Logout </li>
               </> : <li onClick={ ()=>navigation('/auth') }> Login/Signup </li>
              }
              
              </ul>
            </div>
          )}
        </div>
      </div>
      </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>Create a Community</div>
              <div className="modal-close" onClick={closeCommunityModal}>
                &times;
              </div>
            </div>
            <div className="modal-body">
              <div className="form-control">
                <label htmlFor="communityname">Name</label>
                <span>r/</span>
                <input
                  id="communityname"
                  name="name"
                  onChange={(e) => {
                    setCommunity(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <div className="button" onClick={closeCommunityModal}>
                Cancel
              </div>
              <div className="button blue" onClick={createCommunity}>
                Create
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
