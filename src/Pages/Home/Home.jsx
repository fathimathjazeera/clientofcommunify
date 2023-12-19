import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import axiosInstance from "../../AxiosInstance/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../Context/MyContext";





function Home() {
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState("popular");
  const [popularData, setPopularData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [postId, setPostId] = useState();
  const [userId,setUserId] = useState()
  const { isLoggedIn,setUsername } = useContext(MyContext);
  const navigation = useNavigate();
  console.log(popularData,"from popular");






  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/viewposts"
      );
      const filteredPost = response.data.data.filter((post) => {

        return userId != post.postedBy._id;
      });
      setFiltered(filteredPost);
    } catch (error) {
      console.log(error.message, "fetchPosts");
    }
  };





  const viewPopular = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/users/viewpopular");
      const { status, message, data } = response.data;
      if (status === "success") {

       const filter= data.filter((post)=>{
          return userId != post.postedBy
        })
        setPopularData(filter);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

 
  
  const onSelectFilter = async (tabName) => {
    setActiveTab(tabName);
    if (tabName === "popular") {
      await viewPopular();
    } else if (tabName === "best" || tabName === "new" || tabName === "top") {
      await fetchPosts();
    }
  };



  const openModal = (postId) => {
    setModalOpen(true);
    setPostId(postId);
  };
  const closeModal = () => {
    setModalOpen(false);
    resetCopyStatus();
  };

  // Copy post link to clipboard
  const copyLink = () => {
    try {
      const linkInput = document.getElementById("postLink");
      linkInput.select();
      document.execCommand("copy");
      setIsCopied(true);
    } catch (error) {
      console.error("Error copying link: ", error);
    }
  };

  const resetCopyStatus = () => {
    setIsCopied(false);
  };

  const upvote = async (id) => {
    const token = localStorage.getItem("authToken");
    console.log(token);
    try {
      const postData = {
        action: "upvote",
      };
      await axiosInstance.post(
        `/api/users/upvote/${id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPosts()
    } catch (err) {
      console.log(err.message, "error");
    }
  };

  const downvote = async (id) => {
    const token = localStorage.getItem("authToken");
    console.log(token);
    try {
      const postData = {
        action: "downvote",
      };
      await axiosI.post(
        `/api/users/downvote/${id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

fetchPosts()

    } catch (err) {
      console.log(err.message, "error");
    }
  };








  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        const decodedToken = JSON.parse(atob(authToken.split(".")[1]));
        const id = decodedToken.id;
       setUserId(id)
        setUsername(decodedToken.username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }



  }, []);

useEffect(() => {
  
if(activeTab == "popular"){
  viewPopular()
}


}, [])


  return (
    <div>
      <Navbar />

      <div className="small-navbar">
        <div
          className={`filter-option ${activeTab === "popular" && "active"}`}
          onClick={() => onSelectFilter("popular")}
        >
          Popular
        </div>
        <div
          className={`filter-option ${activeTab === "best" && "active"}`}
          onClick={() => onSelectFilter("best")}
        >
          Best
        </div>
        <div
          className={`filter-option ${activeTab === "new" && "active"}`}
          onClick={() => onSelectFilter("new")}
        >
          New
        </div>
        <div
          className={`filter-option ${activeTab === "top" && "active"}`}
          onClick={() => onSelectFilter("top")}
        >
          Top
        </div>
      </div>

      {activeTab === "popular" && (
        <>
          {popularData.map((post) => (
            <div
              key={post._id}
              className="post-card"
              style={{
                height: post.image ? "647px" : "200px",
              }}
            >
              <div className="upvoteClass">
                <svg
                  onClick={() => {
                    upvote(post._id);
                  }}
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m4 14h2 2v3 4c0 .553.447 1 1 1h6c.553 0 1-.447 1-1v-5-2h1 3c.385 0 .734-.221.901-.566.166-.347.12-.758-.12-1.059l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10c-.24.301-.286.712-.12 1.059.167.345.516.566.901.566z" />
                </svg>
                <p>{post?.totalvote}</p>
                <svg
                  onClick={() => {
                    downvote(post._id);
                  }}
                  style={{ transform: "scale(1,-1)" }}
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m4 14h2 2v3 4c0 .553.447 1 1 1h6c.553 0 1-.447 1-1v-5-2h1 3c.385 0 .734-.221.901-.566.166-.347.12-.758-.12-1.059l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10c-.24.301-.286.712-.12 1.059.167.345.516.566.901.566z" />
                </svg>
              </div>
              <h3
                onClick={() => {
                  navigation(`/r/${post.subreddit}`);
                }}
              >
                r/{post.subreddit}
              </h3>
              <h3
                style={{ marginLeft: "100px" }}
                onClick={() => {
                  navigation(`/${post._id}`);
                }}
              >
                {post.title}
              </h3>
              {post.image ? (
                <img
                  onClick={() => {
                    navigation(`/${post._id}`);
                  }}
                  src={post.image}
                  alt=""
                  style={{
                    width: "500px",
                    height: "500px",
                    marginLeft: "90px",
                    borderRadius: "5px",
                  }}
                />
              ) : null}
              <p
                style={{ marginLeft: "100px" }}
                onClick={() => {
                  navigation(`/${post._id}`);
                }}
              >
                {post.content}
              </p>
              <div className="button-container">
                <button className="button comment">Comment</button>
                <button
                  className="button share"
                  onClick={() => openModal(post._id)}
                >
                  Share
                </button>
                <button className="button report">Report</button>
              </div>
            </div>
          ))}
        </>
      )}




{activeTab === "best" && (
        <>
          {filtered.map((post) => (
            <div
              key={post._id}
              className="post-card"
              style={{
                height: post.image ? "647px" : "200px",
              }}
            >
              <div className="upvoteClass">
                <svg
                  onClick={() => {
                    upvote(post._id);
                  }}
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m4 14h2 2v3 4c0 .553.447 1 1 1h6c.553 0 1-.447 1-1v-5-2h1 3c.385 0 .734-.221.901-.566.166-.347.12-.758-.12-1.059l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10c-.24.301-.286.712-.12 1.059.167.345.516.566.901.566z" />
                </svg>
                <p>{post?.totalvote}</p>
                <svg
                  onClick={() => {
                    downvote(post._id);
                  }}
                  style={{ transform: "scale(1,-1)" }}
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m4 14h2 2v3 4c0 .553.447 1 1 1h6c.553 0 1-.447 1-1v-5-2h1 3c.385 0 .734-.221.901-.566.166-.347.12-.758-.12-1.059l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10c-.24.301-.286.712-.12 1.059.167.345.516.566.901.566z" />
                </svg>
              </div>
              <h3
                onClick={() => {
                  navigation(`/r/${post.subreddit}`);
                }}
              >
                r/{post.subreddit}
              </h3>
              <h3
                style={{ marginLeft: "100px" }}
                onClick={() => {
                  navigation(`/${post._id}`);
                }}
              >
                {post.title}
              </h3>
              {post.image ? (
                <img
                  onClick={() => {
                    navigation(`/${post._id}`);
                  }}
                  src={post.image}
                  alt=""
                  style={{
                    width: "500px",
                    height: "500px",
                    marginLeft: "90px",
                    borderRadius: "5px",
                  }}
                />
              ) : null}
              <p
                style={{ marginLeft: "100px" }}
                onClick={() => {
                  navigation(`/${post._id}`);
                }}
              >
                {post.content}
              </p>
              <div className="button-container">
                <button className="button comment">Comment</button>
                <button
                  className="button share"
                  onClick={() => openModal(post._id)}
                >
                  Share
                </button>
                <button className="button report">Report</button>
              </div>
            </div>
          ))}
        </>
      )}

{activeTab === "new" && (
        <>
          {filtered.map((post) => (
            <div
              key={post._id}
              className="post-card"
              style={{
                height: post.image ? "647px" : "200px",
              }}
            >
              <div className="upvoteClass">
                <svg
                  onClick={() => {
                    upvote(post._id);
                  }}
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m4 14h2 2v3 4c0 .553.447 1 1 1h6c.553 0 1-.447 1-1v-5-2h1 3c.385 0 .734-.221.901-.566.166-.347.12-.758-.12-1.059l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10c-.24.301-.286.712-.12 1.059.167.345.516.566.901.566z" />
                </svg>
                <p>{post?.totalvote}</p>
                <svg
                  onClick={() => {
                    downvote(post._id);
                  }}
                  style={{ transform: "scale(1,-1)" }}
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m4 14h2 2v3 4c0 .553.447 1 1 1h6c.553 0 1-.447 1-1v-5-2h1 3c.385 0 .734-.221.901-.566.166-.347.12-.758-.12-1.059l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10c-.24.301-.286.712-.12 1.059.167.345.516.566.901.566z" />
                </svg>
              </div>
              <h3
                onClick={() => {
                  navigation(`/r/${post.subreddit}`);
                }}
              >
                r/{post.subreddit}
              </h3>
              <h3
                style={{ marginLeft: "100px" }}
                onClick={() => {
                  navigation(`/${post._id}`);
                }}
              >
                {post.title}
              </h3>
              {post.image ? (
                <img
                  onClick={() => {
                    navigation(`/${post._id}`);
                  }}
                  src={post.image}
                  alt=""
                  style={{
                    width: "500px",
                    height: "500px",
                    marginLeft: "90px",
                    borderRadius: "5px",
                  }}
                />
              ) : null}
              <p
                style={{ marginLeft: "100px" }}
                onClick={() => {
                  navigation(`/${post._id}`);
                }}
              >
                {post.content}
              </p>
              <div className="button-container">
                <button className="button comment">Comment</button>
                <button
                  className="button share"
                  onClick={() => openModal(post._id)}
                >
                  Share
                </button>
                <button className="button report">Report</button>
              </div>
            </div>
          ))}
        </>
      )}



{activeTab === "top" && (
        <>
          {filtered.map((post) => (
            <div
              key={post._id}
              className="post-card"
              style={{
                height: post.image ? "647px" : "200px",
              }}
            >
              <div className="upvoteClass">
                <svg
                  onClick={() => {
                    upvote(post._id);
                  }}
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m4 14h2 2v3 4c0 .553.447 1 1 1h6c.553 0 1-.447 1-1v-5-2h1 3c.385 0 .734-.221.901-.566.166-.347.12-.758-.12-1.059l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10c-.24.301-.286.712-.12 1.059.167.345.516.566.901.566z" />
                </svg>
                <p>{post?.totalvote}</p>
                <svg
                  onClick={() => {
                    downvote(post._id);
                  }}
                  style={{ transform: "scale(1,-1)" }}
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m4 14h2 2v3 4c0 .553.447 1 1 1h6c.553 0 1-.447 1-1v-5-2h1 3c.385 0 .734-.221.901-.566.166-.347.12-.758-.12-1.059l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10c-.24.301-.286.712-.12 1.059.167.345.516.566.901.566z" />
                </svg>
              </div>
              <h3
                onClick={() => {
                  navigation(`/r/${post.subreddit}`);
                }}
              >
                r/{post.subreddit}
              </h3>
              <h3
                style={{ marginLeft: "100px" }}
                onClick={() => {
                  navigation(`/${post._id}`);
                }}
              >
                {post.title}
              </h3>
              {post.image ? (
                <img
                  onClick={() => {
                    navigation(`/${post._id}`);
                  }}
                  src={post.image}
                  alt=""
                  style={{
                    width: "500px",
                    height: "500px",
                    marginLeft: "90px",
                    borderRadius: "5px",
                  }}
                />
              ) : null}
              <p
                style={{ marginLeft: "100px" }}
                onClick={() => {
                  navigation(`/${post._id}`);
                }}
              >
                {post.content}
              </p>
              <div className="button-container">
                <button className="button comment">Comment</button>
                <button
                  className="button share"
                  onClick={() => openModal(post._id)}
                >
                  Share
                </button>
                <button className="button report">Report</button>
              </div>
            </div>
          ))}
        </>
      )}












      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <h2>Share Post</h2>
            <input
              type="text"
              id="postLink"

              

              value={`https://communify.mrzera.in/${postId}`}

              readOnly
            />
            <div className="button-containerr">
              <button className="button" onClick={copyLink}>
                {isCopied ? "Copied!" : "Copy Link"}
              </button>
              <button className="button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="side-box">
        <div>
          <img
            style={{ width: "100%" }}
            src="https://www.redditstatic.com/desktop2x/img/id-cards/home-banner@2x.png"
            alt=""
          />
        </div>
        <h3 style={{ color: "black" }}>Hello, Users</h3>
        <h5 style={{ color: "black" }}>
          Communify, your personalized frontpage for connecting with your
          cherished communities. Join the conversation and stay connected with
          like-minded individuals, making Communify the heartbeat of your online
          social experience.
        </h5>
        <button
          className="side-box-button create-post"
          onClick={isLoggedIn ? () => navigation("/Create") : () => navigation("/auth")}
        >
          Create Post
        </button>
      </div>
    </div>
  );
}

export default Home;
