import React, { useState, useContext, useEffect } from "react"
import { UserContext } from "../home"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import {format} from "timeago.js"
import moment from "moment"

function Notif(props) {
    const cloud_name = "dzjkgjjut"
    let navigate = useNavigate()
    const { userData, setUserData } = useContext(UserContext)

    async function redirectTo(p) {
        await Axios.post(`/api/update-notifications/${props._id}`)
        props.setNumber(prev=>prev+1)
        if (userData?.user?.type==="Admin" && (p.type==="Job Request" || p.type==="Project Request")) {
            navigate("/all-requests", {state: {_id: p.subject}})
        }
        if (userData?.user?.type==="Employer" || userData?.user?.type==="Candidate" && (p.type==="Job Request" || p.type==="Project Request")) {
            navigate("/project", {state: {_id: p.subject}})
        }
        if (p.type==="Job Hiring Request" || p.type==="Job Hiring" || p.type==="Job" || p.type==="Project Hiring Request" || p.type==="Project Hiring" || p.type==="Project" || p.type==="Project Update Request") {
            navigate("/project", {state: {_id: p.subject}})
        }
        if (p.type==="Message") {
            const prevConvo = await Axios.get("/api/get-conversation/", {params: {
                member1: p.recieverId,
                member2: p.senderId
            }})
            navigate("/messages", {state: {_id: prevConvo.data}})
        }
    }
    let senderName = (props.sender?.firstname) + (props?.sender?.middlename ? props.sender.middlename.charAt(0).toUpperCase() + ". " : "" )+(props.sender?.lastname)
    return (
        <div className="notif" onClick={()=>redirectTo(props)}>
            <div className="notifTop">
                <div>
                    {props.sender._id===userData.user?.id ? 
                        <img className="messageImg" src={"/WebPhoto/warning.png"}></img>
                    :
                        <img src={props?.sender?.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/${props.sender.image}.jpg` : "/fallback.png"} className="messageImg" alt={`${props.sender?.firstname}'s image` }></img>
                    }
                </div>
                <div>
                    {props.sender._id===userData.user?.id ? <b>System Warning! </b> : senderName}
                    {" "}{props.action}{" "}{props.type}.
                </div>
            </div>
            <div className="notifBot">
                {moment(props.createdAt).format("ddd: MMM. DD, YYYY")} <br />({format(props.createdAt)})
            </div>
        </div>
    )
}

export default Notif