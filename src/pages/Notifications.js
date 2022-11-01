import React, { useState, useContext, useEffect } from "react"
import { UserContext } from "../home"
import Notif from "../components/Notif"
import Axios from "axios"

function Notifications(props) {
    const { userData, setUserData } = useContext(UserContext)
    const [ notifications, setNotifications ] = useState(props.savedNotifications)
    const [ type, setType ] = useState("All")
    const [ unread, setUnread ] = useState([])

    async function readAll(props) {
        try {
            const res = await Axios.post(`/api/read-all-notifications/${props}/${type}`)
            setNotifications(res.data)
            setType("All")
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const unread = notifications.filter((a) => a.cleared ==="No")
        setUnread(unread)
    }, [props.savedNotifications])

    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }
    
    return (
        <div className="notifications">
            <div className="notificationsTop">
                <div>
                    <h2>{userData.user.firstname}'s Notifications</h2>
                </div>
                <div>
                    {unread[0]? 
                        <div>
                            <button className="btn btn-sm btn-primary" onClick={()=>{
                                readAll(userData.user.id),
                                props.setNumber(prev=>prev+1)
                            }}>
                                Mark all as Read
                            </button>
                        </div>
                    : <></>}
                </div>
            </div>
            <br />
            <div className="notificationsBot">
                {notifications[0] ? 
                    <div className="notifList">
                        {notifications.map(function(notif) {
                            return <Notif 
                                _id={notif._id}
                                key={idPlusKey(notif._id, userData.user.id)} 
                                sender={notif.senderId} 
                                reciever ={notif.recieverId} 
                                type={notif.type}
                                action={notif.action}
                                cleared={notif.cleared}
                                subject={notif.subject}
                                createdAt={notif.createdAt}
                                setNumber={props.setNumber}/>
                        })}
                    </div>
                : <span>No notifications at the moment.</span>}
            </div>
        </div>
    )
}

export default Notifications