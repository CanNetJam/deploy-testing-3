import React, {useState, useEffect} from "react"
import {format} from "timeago.js"
import Axios from "axios"

function Message({message, own}) {
    const [pic, setPic] = useState()

    useEffect(() => {
        const memberId = message.sender
        const getUser = async () => {
          try {
            const res = await Axios.get(`/members/${memberId}`)
            setPic(res.data[0].photo)
          } catch (err) {
            console.log(err)
          }
        };
        getUser()
      }, [])

    return (
        <div className={own? "message own" : "message"}>
            <div className="messageTop">
                <img className="messageImg" src={pic ? `/uploaded-photos/${pic}` : "/fallback.png"} alt=""/>
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