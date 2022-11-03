//dito ang REACT Client-Side 
import React, { createContext, useState, useEffect, } from 'react'
import Axios from "axios"
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client"

import TopNav from "./navigation/TopNav"
import LeftNavFree from "./navigation/LeftNavFree"
import LeftNavEmp from "./navigation/LeftNavEmp"
import LeftNavAdmin from "./navigation/LeftNavAdmin"

import Home from "./pages/Homes"
import About from "./pages/About"
import Help from "./pages/Help"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import RegisterAccount from "./pages/Register"
import AllProjects from "./pages/AllProjects"
import AllAccounts from "./pages/AccountList"
import ProjectList from "./pages/ProjectList"
import Requests from "./pages/Requests"
import Messages from "./pages/Messages"
import MyRequests from "./pages/MyRequests"
import ProjectProposal from "./pages/ProjectRequest"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"
import Reports from "./pages/Reports"

import SearchBox from "./components/SearchBox"
import SearchProfile from "./components/SearchProfile"
import Project from "./components/Project"
import Hiring from "./components/Hiring"

export const UserContext = createContext()

function App() {
  const [ userData, setUserData ] = useState ({
    token: undefined,
    user: undefined
  })
  const [ socket, setSocket ] = useState(null)
  const [ savedNotifications, setSavedNotifications ] = useState([])
  const [ liveNotif, setLiveNotif ] = useState([])
  const [ number, setNumber ] = useState(0)
  
  //ws://deploy-testing-3.herokuapp.com/socket.io/?EIO=4&transport=websocket
  //ws://localhost:8080 
  useEffect(()=> {
    setSocket(io())
  }, [])

  useEffect(() => {
    socket?.emit("addUser", userData?.user?.id)
  }, [socket, userData])

  useEffect(() => {
    const getNotifications = async () => {
      if (userData.user) {
        try {
          const res = await Axios.get(`/api/notifications/${userData?.user?.id}`, {headers: {'auth-token': userData.token}})
          setSavedNotifications(res.data)
        } catch (err) {
          console.log(err)
        }
      }
    }
    getNotifications()
  }, [userData, number, liveNotif])
  
  useEffect(() => {
    socket?.on("getNotification", (data) => {
      setLiveNotif((prev) => [...prev, data])
    })
  }, [socket])

  useEffect(() => {
    const isLoggedIn = async () => {
      let token = localStorage.getItem("auth-token")
      if (token == null){
        localStorage.setItem("auth-token", "")
        token = ""
      }
      
      if (token !== null){
        const tokenResponse = await Axios.post('/tokenIsValid', null, {headers: {"auth-token": token}})
        if(tokenResponse.data){
          const userResponse = await Axios.get('/profile/user', {headers: {'auth-token': token}})
          if (userResponse) {
            setUserData({
              token: token,
              user: userResponse.data
            })
          }
          if (!userResponse) {
            setUserData({
              token: undefined,
              user: undefined
            })
          }
        }
      }
    }
    isLoggedIn()
  }, [])

  function conRender() {
    if (userData.user.type ==="Freelancer"){
      return <LeftNavFree savedNotifications={savedNotifications} setNumber={setNumber}/>
    } 
    if (userData.user.type ==="Employer"){
      return <LeftNavEmp savedNotifications={savedNotifications} setNumber={setNumber}/>
    }
    if (userData.user.type ==="Admin"){
      return <LeftNavAdmin savedNotifications={savedNotifications} setNumber={setNumber}/>
    }
  }

  return (
    <div className="all">
      <Router > 
          <UserContext.Provider value={{ userData, setUserData }}>
          <div className="top"> 
            <TopNav savedNotifications={savedNotifications} setNumber={setNumber}/>
          </div>
          <div className="horizontal_line"></div>
            <div className="content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchBox />} />
                    <Route path="/search-profile" element={<SearchProfile socket={socket} />}/>
                    <Route path="/hiring" element={<Hiring />} />
                    <Route path="/about" element={<About />}/>
                    <Route path="/help" element={<Help />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<RegisterAccount />} />
                    <Route path="/user-profile" element={<AllAccounts />} />
                    <Route path="/all-requests" element={<Requests socket={socket} />} />
                    <Route path="/all-projects" element={<AllProjects />} />
                    <Route path="/notifications" element={<Notifications 
                      savedNotifications={savedNotifications} 
                      setNumber={setNumber}/>} />
                    <Route path="/profile/user" element={<Profile />} />
                    <Route path="/start-project" element={<MyRequests />} />
                    <Route path="/project-proposal" element={<ProjectProposal socket={socket}/>} />
                    <Route path="/project-list" element={<ProjectList />} />
                    <Route path="/project" element={<Project socket={socket}/>} />
                    <Route path="/messages" element={<Messages socket={socket}/>} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/reports" element={<Reports />} />
                  </Routes> 
            </div>
          </UserContext.Provider>
      </Router>
    </div>
  )
}

const root = createRoot(document.querySelector("#home"))
root.render(<App />)