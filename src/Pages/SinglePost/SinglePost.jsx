import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./SinglePost.css";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { MyContext } from "../../Context/MyContext";

function SinglePost() {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [postId, setPostId] = useState();
  const [commentView, setCommentView] = useState([]);
  const [clickEdit, setClickEdit] = useState({ edit: false });
  const [userId, setUserId] = useState();
  const [reply, setReply] = useState({ reply: false });
  const [replyData, setReplyData] = useState([]);
  const navigation = useNavigate();

  console.log(replyData, "ggggg");

  const { id } = useParams();

  const { isLoggedIn } = useContext(MyContext);

  const singlePost = async () => {
    try {
      const response = await axios.get(
        `https://communify-server.mrzera.xyz/api/users/singlepost/${id}`
      );
      const { status, message, data } = response.data;
      if (status === "success") {
        console.log("Fetched single post:", data);
        setData(data);
      } else {
        console.error("Singlepost retrieval failed:", message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const upvote = async (id) => {
    const token = localStorage.getItem("authToken");
    console.log(token);
    try {
      const postData = {
        action: "upvote",
      };
      await axios.post(
        `https://communify-server.mrzera.xyz/api/users/upvote/${id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      singlePost();
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
      await axios.post(
        `https://communify-server.mrzera.xyz/api/users/downvote/${id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      singlePost();
    } catch (err) {
      console.log(err.message, "error");
    }
  };

  const editComment = async (id, e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const comment = e.target.newcomment.value;
    console.log(comment, "edited");
    try {
      const response = await axios.put(
        `https://communify-server.mrzera.xyz/api/users/editcomment/${id}`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { status, message } = response.data;
      if (status === "success") {
        setClickEdit(false);
        console.log("edited comment");
        viewComment();
        e.target.reset();
      } else {
        console.log("edit failed");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const replyComment = async (id, e) => {
    const token = localStorage.getItem("authToken");
    try {
      const reply = e.target.replycomment.value;
      const response = await axios.put(
        `https://communify-server.mrzera.xyz/api/users/replycomment/${id}`,
        { reply: reply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { status, message, data } = response.data;

      if (status == "success") {
        setReply({ reply: false });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const viewCommentReply = async () => {
    try {
      const response = await axios.get(
        `https://communify-server.mrzera.xyz/api/users/viewreply/${id}`
      );
      const { status, message, data } = response.data;

      if (status == "success") {
        setReplyData(data);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        const decodedToken = JSON.parse(atob(authToken.split(".")[1]));
        const id = decodedToken.id;
        setUserId(id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.log("Token not found");
    }
  }, []);

  const openModal = (postId) => {
    setModalOpen(true);
    setPostId(postId);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetCopyStatus();
  };

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

  const viewComment = async () => {
    try {
      const response = await axios.get(
        `https://communify-server.mrzera.xyz/api/users/viewcomment/${id}`
      );
      const { status, message, data } = response.data;

      if (status === "success") {
        console.log("Fetched comments:", data);

        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCommentView(sortedData);
      } else {
        console.error("comments retrieval failed. Message:", message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const postComment = async (e) => {
    try {
      console.log(id, "id for commenting post");
      e.preventDefault();
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `https://communify-server.mrzera.xyz/api/users/postcomment/${id}`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { status, message } = response.data;

      if (status === "success") {
        alert("commented");
        e.target.reset();
        viewComment();
        console.log("succes from comment");
      } else {
        console.error("comments retrieval failed. Message:", message);
      }
    } catch (err) {
      console.log(err.message, "error while commenting");
    }
  };
  const deleteComment = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `https://communify-server.mrzera.xyz/api/users/deletecomment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { status, data } = response.data;

      if (status === "success") {
        // Comment deleted successfully, call viewComment to refresh comments
        console.log("Deleted Succes");

        viewComment();
      } else {
        // Handle unsuccessful deletion
        console.error("Comment deletion failed. Message:", data.message);
      }
    } catch (err) {
      // Handle errors during the API call
      console.error("Error deleting comment:", err.message);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const resetCopyStatus = () => {
    setIsCopied(false);
  };

  useEffect(() => {
    singlePost();
    viewComment();
    viewCommentReply();
  }, []);

  return (
    <div>
      <Navbar />
      {data && (
        <div
          key={data._id}
          className="post-card"
          style={{
            height: data.image ? "647px" : "200px",
          }}
        >
          <div className="upvoteClass">
            <svg
              onClick={() => {
                upvote(data._id);
              }}
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m4 14h2 2v3 4c0 .553.447 1 1 1h6c.553 0 1-.447 1-1v-5-2h1 3c.385 0 .734-.221.901-.566.166-.347.12-.758-.12-1.059l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10c-.24.301-.286.712-.12 1.059.167.345.516.566.901.566z" />
            </svg>

            <p>{data?.totalvote}</p>
            <svg
              onClick={() => {
                downvote(data._id);
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
              navigation(`/r/${data.subreddit}`);
            }}
          >
            r/{data.subreddit}
          </h3>
          <h3 style={{ marginLeft: "100px" }}>{data.title}</h3>

          {data.image ? (
            <img
              src={data.image}
              alt=""
              style={{
                width: "500px",
                height: "500px",
                marginLeft: "90px",
                borderRadius: "5px",
              }}
            />
          ) : null}

          <p style={{ marginLeft: "100px" }}>{data.content}</p>
          <div className="button-container">
            <button className="button comment">
              {commentView.length} Comments{" "}
            </button>
            <button
              className="button share"
              onClick={() => openModal(data._id)}
            >
              Share
            </button>
            <button className="button report">Report</button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <h2>Share Post</h2>
            <input
              type="text"
              id="postLink"
              value={`https://communify-server.mrzera.xyz/${postId}`}
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
      {data && data.postedBy && data.postedBy.joined_communities && (
        <div className="com-det-container">
          <div className="user-name">{data.postedBy.username}</div>
          <div className="user-details">
            Your personal Reddit frontpage. Come here to check in with your
            favorite communities.
          </div>
          <div className="favorite-communities">Favorite Communities:</div>
          <ul className="community-list">
            <li className="community-list-item">
              {data.postedBy.joined_communities[0]}
            </li>
            <li className="community-list-item">
              {data.postedBy.joined_communities[1]}
            </li>
          </ul>
          <button className="create-post-button" onClick={isLoggedIn? ()=>{navigation('/Create')} : ()=>{navigation('/auth')}}>Create Post</button>
        </div>
      )}

      {/* Comment Section */}

      <div className="comment-section">
        {isLoggedIn ? (
          <>
            <h2>Comments</h2>
            <div className="comment-input-container">
              <form onSubmit={postComment}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={handleCommentChange}
                />
                <button className="button" type="Submit">
                  Comment
                </button>
              </form>
            </div>
            <div className="comment-list">
              {commentView.map((c) => (
                <div className="comment-item" key={c.commentId}>
                  <span className="comment-user">{c.userId?.username}:</span>
                  <span className="comment-content">{c.text} </span>

                  {clickEdit.edit && c._id == clickEdit.id ? (
                    <>
                      <form onSubmit={(e) => editComment(c._id, e)}>
                        <input
                          type="text"
                          id="newcomment"
                          style={{ marginLeft: "20px" }}
                        />
                        <button type="submit">save</button>
                      </form>
                    </>
                  ) : (
                    <>
                      <p marginTop={2} marginLeft={7}>
                        {c.text}
                      </p>

                      {isLoggedIn && userId !== c.userId?._id && (
                        <p
                          style={{ marginLeft: "430px", marginTop: "-20px" }}
                          onClick={() => setReply({ reply: true, id: c._id })}
                        >
                          Reply
                        </p>
                      )}
                    </>
                  )}

                  {replyData
                    ?.filter((dat) => {
                      return dat._id == c._id;
                    })
                    .map((fil) => {
                      return <p> reply : {fil.reply}</p>;
                    })}

                  {reply.reply && reply.id === c._id ? (
                    <form
                      onSubmit={(e) => {
                        replyComment(c._id, e);
                      }}
                    >
                      <textarea
                        name=""
                        id="replycomment"
                        cols="30"
                        rows="2"
                        style={{
                          marginTop: 20,
                          backgroundColor: "rgb(242, 241, 241)",
                        }}
                      ></textarea>
                      <button
                        type="submit"
                        style={{
                          marginTop: 70,
                          position: "absolute",
                          backgroundColor: "red",
                        }}
                      >
                        reply
                      </button>
                    </form>
                  ) : (
                    ""
                  )}

                  {isLoggedIn && userId === c.userId?._id && (
                    <>
                      <button
                        className="button-comment"
                        onClick={() => {
                          deleteComment(c._id);
                        }}
                      >
                        delete
                      </button>

                      <button
                        className="button-comment"
                        onClick={() => {
                          setClickEdit({ edit: true, id: c._id });
                        }}
                      >
                        edit
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Add comment</p>
        )}
      </div>
      {/* // end comment section */}
    </div>
  );
}

export default SinglePost;
