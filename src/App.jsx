import "./App.css";
import Auth from "./Pages/Auth/Auth";
import { Route, Routes, Navigate} from "react-router-dom";
import Home from "./Pages/Home/Home";
import SinglePost from "./Pages/SinglePost/SinglePost";
import CreatePost from './Pages/CreatePost/CreatePost'
import { useEffect, useState } from "react";
import { MyContext } from "./Context/MyContext";
import Profile from "./Pages/Profile/Profile";
import Community from "./Pages/Communiy/Community";
import AdminPanel from "./Pages/Admin/AdminPanel";
import UserProfile from "./Pages/Admin/UserProfile";
function App() {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [adminLogin, setAdminLogin] = useState(false)
  const [username,setUsername]=useState()


  useEffect(() => {
    const stored = localStorage.getItem('authToken')
    const adminToken = localStorage.getItem('adminAuthToken')
    if (stored) {
      setIsLoggedIn(true)

    } else if (adminToken) {
      setAdminLogin(true)

    }
  }, [])

  return (
    <div className="App">
      <div className="blur" style={{ top: "-18%", right: "0" }}></div>
      <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>
<MyContext.Provider value={{isLoggedIn,setIsLoggedIn,username,setUsername}}>

      <Routes>
      <Route
  path="/auth"
  element={isLoggedIn ? <Navigate to="/" /> : <Auth />}
/>

        <Route path="/" element={<Home/>}></Route>
        <Route path="/:id" element={<SinglePost/>}></Route>
        <Route path="/Create" element={<CreatePost/>}></Route>
        <Route path="/Profile" element={<Profile/>}></Route>
        <Route path="/r/:communityname" element={<Community/>}></Route>
        <Route path="/Admin" element={<AdminPanel/>}></Route>
        <Route path="/AdminView/:id" element={<UserProfile/>}></Route>
       
      </Routes>

</MyContext.Provider>
    </div>
  );
}

export default App;
