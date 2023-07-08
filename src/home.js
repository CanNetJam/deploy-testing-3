import React, { createContext, useState, useEffect } from 'react'
import Axios from "axios"
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client"

import TopNav from "./navigation/TopNav"

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
import BugReports from "./pages/BugReports"

import SearchBox from "./components/SearchBox"
import SearchProfile from "./components/SearchProfile"
import Project from "./components/Project"
import Hiring from "./components/Hiring"
import CompanyProfile from "./components/CompanyProfile"
import AllLogsTable from "./components/AllLogsTable"

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
  const [ currentWindow, setCurrentWindow ] = useState("")
  
  //http://localhost:3000
  //https://deploy-testing-3.onrender.com
  useEffect(()=> {
    setSocket(io("https://deploy-testing-3.onrender.com"))
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
    const getProjects = async () => {
      if (userData.user?.type==="Employer") {
        try {
          const res = await Axios.get(`/api/all-projects-expiry/${userData?.user?.id}`, {headers: {'auth-token': userData.token}})

            res.data?.map( async (a) => {
              const subject = a._id
              const type = a.type + " Hiring"
              const action = "impending expiration of your"

              const notif = await Axios.get(`/api/check-existing-notif/${userData?.user?.id}/${action}/${type}/${subject}/`, {headers: {'auth-token': userData.token}})
              if (notif.data.length===0) {
                await Axios.post(`/api/send-notifications/${userData.user.id}/${userData.user.id}/${action}/${type}/${subject}`)
                
                socket.emit("sendNotification", {
                  senderId: userData.user.id,
                  receiverId: userData.user.id,
                  subject: subject,
                  type: type,
                  action: action,
                })
              }
            })

        } catch (err) {
          console.log(err)
        }
      }
    }
    getProjects ()
  }, [userData, number])
  
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
      
      if (token !== null && token !== ""){
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

  return (
    <div className="all">
      <Router > 
          <UserContext.Provider value={{ userData, setUserData }}>
          <div className="top"> 
            <TopNav savedNotifications={savedNotifications} setNumber={setNumber} setCurrentWindow={setCurrentWindow} />
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home currentWindow={currentWindow} setCurrentWindow={setCurrentWindow} />} />
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
              <Route path="/notifications" element={<Notifications savedNotifications={savedNotifications} setNumber={setNumber}/>} />
              <Route path="/profile/user" element={<Profile />} />
              <Route path="/start-project" element={<MyRequests />} />
              <Route path="/project-proposal" element={<ProjectProposal socket={socket}/>} />
              <Route path="/project-list" element={<ProjectList />} />
              <Route path="/project" element={<Project socket={socket}/>} />
              <Route path="/messages" element={<Messages socket={socket}/>} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/bug-reports" element={<BugReports />} />
              <Route path="/company-profile" element={<CompanyProfile />} />
              <Route path="/system-logs" element={<AllLogsTable />} />
            </Routes> 
          </div>
          <div className="pagefooter">
            <label className="">2023 Cavite State University Carmona Campus | Carmona, Cavite, Philippines</label>
          </div>
          </UserContext.Provider>
      </Router>
    </div>
  )
}

const root = createRoot(document.querySelector("#home"))
root.render(<App />)