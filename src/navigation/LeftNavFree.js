import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../home"
import Axios from "axios"

function LeftNavFree({savedNotifications, setNumber}){
    const { userData, setUserData } = useContext(UserContext)
    let navigate = useNavigate()
    const [ notifications, setNotifications ] = useState([])
    const [ messagesNotif, setMessagesNotif ] = useState([])
    const [ projectNotif, setProjectNotif ] = useState([])
    const [ openProfile, setOpenProfile ] = useState(false)
    let type = "All"
    
    useEffect(() => {
        const notif = savedNotifications?.filter((notif) => notif.cleared ==="No")
        setNotifications(notif)
    }, [savedNotifications])

    useEffect(() => {
        const notif = savedNotifications?.filter((notif) => notif.type === "Message" && notif.cleared ==="No")
        setMessagesNotif(notif)
    }, [savedNotifications])

    useEffect(() => {
        const notif = savedNotifications?.filter((notif) => 
        (notif.type === "Project Update Request" || notif.type === "Project Request" || notif.type === "Project" || notif.type === "Project Hiring Request"
        || notif.type === "Job Request" || notif.type === "Job" || notif.type === "Job Hiring Request") && notif.cleared ==="No")
        setProjectNotif(notif)
    }, [savedNotifications])

    async function readAll(props) {
        try {
            await Axios.post(`/api/read-all-notifications/${props}/${type}`)
            type = "All"
        } catch (err) {
            console.log(err)
        }
    }

    const logOut = async () => {
        try {
            await Axios.post(`/api/logout/${userData.user.id}`)
        } catch (err) {
            console.log(err)
        }
        setUserData({
          token: undefined,
          user: undefined,
        });
        localStorage.setItem("auth-token", "")
    }
    
    return (
        <div className="topnavRight">
            <div className="leftButtons hovertext" data-hover="My Jobs" onClick={()=>{
                if (projectNotif?.length!==0) {
                    type = "All Project", 
                    readAll(userData.user.id), 
                    setNumber(prev=>prev+1), 
                    navigate("/project-list")
                }
                if (projectNotif?.length===0) {
                    navigate("/project-list")
                }
            }}>
                <img src={"/WebPhoto/job.png"} alt={"job icon"} />
                {projectNotif[0] ? 
                    <div className="counter">{projectNotif.length}</div>
                :<></>}
            </div>
            <div className="leftButtons hovertext" data-hover="Notifications" onClick={()=>{navigate("/notifications")}}>
                <img src={"/WebPhoto/notifications.png"} alt={"notifications icon"} />
                {notifications[0] ? 
                    <div className="counter">{notifications.length}</div>
                :<></>}
            </div>
            <div className="leftButtons hovertext" data-hover="Messages" onClick={()=>{
                if (messagesNotif?.length!==0) {
                    type = "Message", 
                    readAll(userData.user.id), 
                    setNumber(prev=>prev+1), 
                    navigate("/messages")
                }
                if (messagesNotif?.length===0) {
                    navigate("/messages")
                }
            }}>
                <img src={"/WebPhoto/messages.png"} alt={"messages icon"} />
                {messagesNotif[0] ? 
                    <div className="counter">{messagesNotif.length}</div>
                : <></>}
            </div>
            <div className="leftButtons accountPickerWrapper"  onClick={()=> {
                    if (openProfile === false) {
                        setOpenProfile(true)
                    }
                    if (openProfile === true) {
                        setOpenProfile(false)
                    }
                }}>
                    {userData.user.sex==="Male" ?
                        <img src={"/WebPhoto/maleuser.png"} alt={"male user icon"} />
                    :<></>}
                    {userData.user.sex==="Female" ?
                        <img src={"/WebPhoto/femaleuser.png"} alt={"female user icon"} />
                    :<></>}
                {openProfile && (
                    <div className="accountPicker">
                        <div className="leftButtons" onClick={()=>{setOpenProfile(false), navigate("/profile/user")}}> 
                            <p>My Profile</p>
                        </div>
                        <div className="leftButtons" onClick={()=>{setOpenProfile(false), navigate("/settings")}}>
                            <p><img src={"/WebPhoto/settings.png"} alt={"settings icon"} />Settings</p>
                        </div>
                        <div className="leftButtons" onClick={()=>{setOpenProfile(false), navigate("/help")}}>
                            <p><img src={"/WebPhoto/help.png"} alt={"help icon"} />Help</p>
                        </div>
                        <div className="leftButtons" onClick={()=>{ logOut(), navigate("/")}}>
                            <p><img src={"/WebPhoto/logout.png"} alt={"logout icon"} />Logout</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LeftNavFree