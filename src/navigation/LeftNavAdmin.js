import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../home"
import Axios from "axios"

function LeftNavAdmin({savedNotifications, setNumber}){
    const { userData, setUserData } = useContext(UserContext)
    let navigate = useNavigate()
    const [ notifications, setNotifications ] = useState([])
    const [ messagesNotif, setMessagesNotif ] = useState([])
    const [ projectNotif, setProjectNotif ] = useState([])
    const [ endNotif, setEndNotif ] = useState([])
    const [ openProfile, setOpenProfile ] = useState(false)
    let type = "All"

    useEffect(() => {
        const notif = savedNotifications.filter((notif) => notif.cleared ==="No")
        setNotifications(notif)
    }, [savedNotifications])

    useEffect(() => {
        const notif = savedNotifications.filter((notif) => notif.type === "Message" && notif.cleared ==="No")
        setMessagesNotif(notif)
    }, [savedNotifications])

    useEffect(() => {
        const notif = savedNotifications.filter((notif) => 
        (notif.type === "Project Request" || notif.type === "Job Request") && notif.cleared ==="No")
        setProjectNotif(notif)
    }, [savedNotifications])

    useEffect(() => {
        const notif = savedNotifications.filter((notif) => 
        notif.type === "Project" && notif.cleared ==="No")
        setEndNotif(notif)
    }, [savedNotifications])

    async function readAll(props) {
        try {
            await Axios.post(`/api/read-all-notifications/${props}/${type}`)
            type = "All"
        } catch (err) {
            console.log(err)
        }
    }

    const logOut = () => {
        setUserData({
          token: undefined,
          user: undefined,
        });
        localStorage.setItem("auth-token", "")
    }
    
    return (
        <div className="topnavRight">
            
                <div className="leftButtons hovertext" data-hover="Job/Project Request" onClick={()=>{
                    if (projectNotif.length!==0) {
                        type = "Request" , 
                        readAll(userData.user.id), 
                        setNumber(prev=>prev+1), 
                        navigate("/all-requests")
                    }
                    if (projectNotif.length===0) {
                        navigate("/all-requests")
                    }
                }}>
                    <img src={"/WebPhoto/queue.png"} alt={"queue icon"} />
                    {projectNotif[0] ? 
                        <div className="counter">{projectNotif.length}</div>
                    :<></>}
                </div>
                <div className="leftButtons hovertext" data-hover="Jobs List" onClick={()=>{
                    if (endNotif.length!==0) {
                        type = "All Project", 
                        readAll(userData.user.id), 
                        setNumber(prev=>prev+1),
                        navigate("/all-projects")
                    }
                    if (endNotif.length===0) {
                        navigate("/all-projects")
                    }
                }}>
                    <img src={"/WebPhoto/folder.png"} alt={"folder icon"} />
                    {endNotif[0] ? 
                        <div className="counter">{endNotif.length}</div>
                    :<></>}
                </div>
                <div className="leftButtons hovertext" data-hover="Register Account" onClick={()=>{navigate("/register")}}>
                    <img src={"/WebPhoto/register.png"} alt={"register icon"} />
                </div>
                <div className="leftButtons hovertext" data-hover="Accounts List" onClick={()=>{navigate("/user-profile")}}>
                    <img src={"/WebPhoto/folder-user.png"} alt={"folder-user icon"} />
                </div>
                <div className="leftButtons hovertext" data-hover="Reports" onClick={()=>{navigate("/reports")}}>
                    <img src={"/WebPhoto/reports.png"} alt={"reports icon"} />
                </div>
                <div className="leftButtons hovertext" data-hover="Notifications" onClick={()=>{navigate("/notifications")}}>
                    <img src={"/WebPhoto/notifications.png"} alt={"notifications icon"} />
                    {notifications[0] ? 
                        <div className="counter">{notifications.length}</div>
                    :<></>}
                </div>
                <div className="leftButtons hovertext" data-hover="Messages" onClick={()=>{
                    if (messagesNotif.length!==0) {
                        type = "Message", 
                        readAll(userData.user.id), 
                        setNumber(prev=>prev+1), 
                        navigate("/messages")
                    }
                    if (messagesNotif.length===0) {
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
                        <img src={"/WebPhoto/administrator.png"} alt={"administrator icon"} />

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

export default LeftNavAdmin