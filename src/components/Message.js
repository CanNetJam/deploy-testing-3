import React, {useState, useEffect} from "react"
import {format} from "timeago.js"
import Axios from "axios"

function Message({message, own}) {
    const cloud_name = "dzjkgjjut"
    const [pic, setPic] = useState()

    useEffect(() => {
        const memberId = message.sender
        const getUser = async () => {
          try {
            const res = await Axios.get(`/members/${memberId}`)
            setPic(res.data[0].image)
          } catch (err) {
            console.log(err)
          }
        };
        getUser()
      }, [])

    return (
        <div className={own? "message own" : "message"}>
            <div className="messageTop">
                <img src={pic ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${pic}.jpg` : "/fallback.png"} className="messageImg"></img>
                <p className="messageText">
                    {message.text}
                </p>
            </div>
            <div className="messageBottom">
                {format(message.createdAt)}
            </div>
        </div>
    )
}

export default Message