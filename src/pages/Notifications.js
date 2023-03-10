import React, { useState, useContext, useEffect } from "react"
import { UserContext } from "../home"
import Notif from "../components/Notif"
import Axios from "axios"

function Notifications(props) {
    const { userData, setUserData } = useContext(UserContext)
    const [ notifications, setNotifications ] = useState(props.savedNotifications)
    const [ type, setType ] = useState("All")
    const [ unread, setUnread ] = useState([])
    const [ result, setResult ] = useState([])
    const [ page, setPage ] = useState(0)
    const [ searchCount, setSearchCount ] = useState(10)
    const [ notifResult, setNotifResult ] = useState([])

    const scrollToEnd = ()=> {
        setPage(page+1)
    }
    /* Supposed to be used for infinite scroll pagination
    window.onscroll = function () {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            scrollToEnd()
        }
    }
    */

    let length = notifications.length
    let index = 0

    useEffect(() => {
        const getFiltered = () => { 
            setResult([])
            let slice = (source, index) => source.slice(index, index + searchCount)
            while (index < length) {
                let temp = [slice(notifications, index)]
                setResult(prev=>prev.concat(temp))
                index += searchCount
            }
        }
        getFiltered()
    }, [])

    useEffect(() => {
        const getFiltered = () => { 
            result[0] ? setNotifResult(result[0]) : <></>
        }
        getFiltered()
    }, [result])

    useEffect(() => {
        const getFiltered = () => { 
            result[page] !== undefined ?
                notifResult!==[] ? setNotifResult(prev=>prev.concat(result[page])) : <></>
            : <></>
        }
        getFiltered()
    }, [page])

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
                {notifResult[0] ? 
                    <div className="notifList">
                        {notifResult.map(function(notif) {
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
                        <br />
                        <div className="centerContent">
                            {result[page+1]!==undefined ?
                                <button className="btn btn-sm btn-primary" onClick={()=> scrollToEnd()}>Load More</button>
                            :<span>End of the list.</span>}
                        </div>
                    </div>
                : <span>No notifications at the moment.</span>}
            </div>
        </div>
    )
}

export default Notifications