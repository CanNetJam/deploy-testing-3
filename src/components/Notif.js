import React from "react"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import {format} from "timeago.js"
import moment from "moment"

function Notif(props) {
    let navigate = useNavigate()

    async function redirectTo(p) {
        await Axios.post(`/api/update-notifications/${props._id}`)
        props.setNumber(prev=>prev+1)
        if (p.type==="Job Request") {
            navigate("/all-requests", {state: {_id: p.subject}})
        }
        if (p.type==="Job Request" || p.type==="Job Hiring Request" || p.type==="Job Hiring" || p.type==="Job"
        || p.type==="Project Request" || p.type==="Project Hiring Request" || p.type==="Project Hiring" || p.type==="Project") {
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

    return (
        <div className="notif" onClick={()=>redirectTo(props)}>
            <div className="notifTop">
                <div>
                    <img className="messageImg" src={props?.sender?.photo ? `/uploaded-photos/${props.sender.photo}` : "/fallback.png"} alt={`${props.type} named ${props.action}`} />
                </div>
                <div>
                    {props.sender?.firstname} {props?.sender?.middlename ? props.sender.middlename.charAt(0).toUpperCase() + ". " : "" }{props.sender?.lastname}
                    {" "}{props.action}{" "}{props.type}.
                </div>
            </div>
            <div className="notifBot">
                {moment(props.createdAt).format("ddd: MMM. DD, YYYY")} <br></br>({format(props.createdAt)})
            </div>
        </div>
    )
}

export default Notif