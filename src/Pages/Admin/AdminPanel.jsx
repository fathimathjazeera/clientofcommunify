import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../AxiosInstance/AxiosInstance";
import ReactPaginate from 'react-paginate';
import "./AdminPanel.css";
import { useNavigate, useParams } from "react-router-dom";

const DashboardTab = () => (
  <div className="dashboard-box">
    <h2>Dashboard Content</h2>
    <p>Some dummy data for the Dashboard tab...</p>
  </div>
);




const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [limit,setLimit] = useState(5)
  const [pageCount,setPageCount]=useState(1)
  const currentPage= useRef(1)
  const navigation = useNavigate();




  const allUsers = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const response = await axiosInstance.get("/api/admin/allusers");
      const { status, message, data } = response.data;
      setUsers(data);
    } catch (err) {
      console.log(err.message);
    }
  };




  const paginatedUsers=async()=>{
    try {
      const token = localStorage.getItem("adminAuthToken");
      const response = await axiosInstance.get(`/api/admin/allusers?page=${currentPage.current}&limit=${limit}`);
      const { status, message, data } = response.data;
      setUsers(data);
      setPageCount(data.pageCount)
    } catch (err) {
      console.log(err.message);
    }
  }





  const blockUser = async (id, isBlocked) => {
    const token = localStorage.getItem("adminAuthToken");
    const response = await axiosInstance.put(
      `/api/admin/blockuser/${id}`,
      { isBlocked: !isBlocked },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { status, message, data } = response.data;
    if (status == "success") {
      setIsBlocked(data.isBlocked);
      localStorage.setItem("isBlocked", isBlocked);
      const state = localStorage.getItem("isBlocked", isBlocked);
    }
  };






  useEffect(() => {
    // allUsers();
    currentPage.current = 1
    paginatedUsers()
  }, []); 



  useEffect(() => {
    // allUsers();
    paginatedUsers()
  }, [isBlocked]);





const handlePageClick=async(e)=>{
console.log(e,"hhiii");
currentPage.current= e.selected+1;
paginatedUsers()
}




  return (
    <div>
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td onClick={() => navigation(`/adminView/${user._id}`)}>
                {user.username}
              </td>
              <td>{user.email}</td>
              <td>
                <button
                  className="block-button"
                  onClick={() => {
                    blockUser(user._id, user.isBlocked);
                  }}
                >
                  {user.isBlocked ? "Unblock" : "block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        marginPagesDisplayed={2}
        containerClassName="pagination justify-content-center"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
      />
    </div>
  );
};




const CommunitiesTab = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const viewCommunities = async () => {
      try {
        const token = localStorage.getItem("adminAuthToken");
        const response = await axiosInstance.get("/api/admin/viewcommunities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { status, message, data } = response.data;
        setCommunities(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    viewCommunities();
  }, []);

  return (
    <div className="adcommunities-content">
      {communities.map((community) => (
        <div key={community._id} className="adcommunity-card">
          <h2>{community.name}</h2>
        </div>
      ))}
    </div>
  );
};
const ReportedPostsTab = () => {
  const [reportedPost, setReportedPost] = useState([]);

  useEffect(() => {
    const viewReportedPost = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/reportedpost");
        const { status, message, data } = response.data;

        if (status === "success") {
          setReportedPost(data);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    viewReportedPost();
  }, []);

  return (
    <div className="aduser-content">
      {reportedPost.map((post) => (
        <div key={post.id} className="reported-post-card">
          <h1>{post.title}</h1>
          <img src={post.image} alt="" />
          <h3>{post?.content}</h3>
        </div>
      ))}
    </div>
  );
};

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigation = useNavigate();

  const handleTabClick = (tab) => {
    if (tab === "Logout") {
      // Perform logout logic here (e.g., clearing authentication token)
      localStorage.removeItem("adminAuthToken");
      alert("Logout successful");
      // Navigate to the login page, assuming you have a navigation function
      navigation("/auth");
    } else {
      setActiveTab(tab);
    }
  };
  const renderActiveTab = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardTab />;
      case "Users":
        return <UsersTab />;
      case "Communities":
        return <CommunitiesTab />;
      case "ReportedPosts":
        return <ReportedPostsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div
          className={`admin-sidebar-item ${
            activeTab === "Dashboard" && "active"
          }`}
          onClick={() => handleTabClick("Dashboard")}
        >
          Dashboard
        </div>
        <div
          className={`admin-sidebar-item ${activeTab === "Users" && "active"}`}
          onClick={() => handleTabClick("Users")}
        >
          Users
        </div>
        <div
          className={`admin-sidebar-item ${
            activeTab === "Communities" && "active"
          }`}
          onClick={() => handleTabClick("Communities")}
        >
          Communities
        </div>
        <div
          className={`admin-sidebar-item ${
            activeTab === "ReportedPosts" && "active"
          }`}
          onClick={() => handleTabClick("ReportedPosts")}
        >
          Reported Posts
        </div>
        <div
          className={`admin-sidebar-item admin-logout ${
            activeTab === "Logout" && "active"
          }`}
          onClick={() => handleTabClick("Logout")}
        >
          Logout
        </div>
      </div>
      <div className="admin-content">{renderActiveTab()}</div>
    </div>
  );
}

export default AdminPanel;
