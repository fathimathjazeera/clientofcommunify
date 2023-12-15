import React, { useState } from "react";
import axiosInstance from "../../AxiosInstance/AxiosInstance";
import "./CreatePost.css";
import Navbar from "../../components/Navbar/Navbar";
import UploadPosts from "../../Images/UploadPosts";
import { useNavigate } from "react-router-dom";
function CreatePost() {
  const [activeTab, setActiveTab] = useState(1);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const nav = useNavigate();
  const handleImageChange = (event) => {
    const newImage = event.target.files[0];
    setImage(newImage);
    setImageUrl(URL.createObjectURL(newImage));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const content = activeTab === 2 ? event.target.content.value : null;
    const subredditName = event.target.subredditName.value;
  
    try {
      let url;
      if (image) {
        url = await UploadPosts(image);
      }
  
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.post(
        "/api/users/createpost",
        {
          title,
          content,
          subredditName,
          url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      event.target.reset();
      nav("/");
    } catch (err) {
      console.log(err.message);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="main-create-container">
        <span className="main-create-title">Create Creativity</span>
        <div className="create-post-container">
          <div className="tabs">
            <div
              className={`tab ${activeTab === 1 ? "active" : ""}`}
              onClick={() => handleTabChange(1)}
            >
              With Image
            </div>
            <div
              className={`tab ${activeTab === 2 ? "active" : ""}`}
              onClick={() => handleTabChange(2)}
            >
              Without Image
            </div>
          </div>
          <form onSubmit={handleSubmit} className="form-container">
            <div className="tab-content">
              <div className="form-group">
                <label>Title</label>
                <input type="text" id="title" className="input-field" />
              </div>
              <div className="form-group">
                <label>Community</label>
                <input type="text" id="subredditName" className="input-field" />
              </div>

              {activeTab === 1 && (
                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input-field"
                  />
                  {imageUrl && (
                    <img
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "10px",
                        marginTop: "10px",
                      }}
                      src={imageUrl}
                      alt="Post image"
                    />
                  )}
                </div>
              )}
              {activeTab === 2 && (
                <div className="form-group">
                  <label>Content</label>
                  <textarea id="content" className="input-field" />
                </div>
              )}
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
