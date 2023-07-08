import React, {useState, useEffect} from "react"
import Axios from "axios"


function Conversation({conversation, currentUser}) {
    const cloud_name = "dzjkgjjut"
    const [user, setUser] = useState(null)
    const [pic, setPic] = useState()

    useEffect(() => {
        const memberId = conversation.members.find((m) => m !== currentUser.id)
        const getUser = async () => {
          try {
            const res = await Axios.get(`/members/${memberId}`)
            setUser(res.data[0].firstname)//need to find the firstname of the userId 
            setPic(res.data[0].image)
          } catch (err) {
            console.log(err)
          }
        }
        getUser()
      }, [currentUser, conversation])
    
    return (
        <div className="conversation">
            <img src={pic ? `https://res.cloudinary.com/${cloud_name}/image/upload/w_300,h_200,c_fill,q_85/${pic}.jpg` : "/fallback.png"} className="messageImg"></img>
            <span className="conversationName">{user}</span>
        </div>
    )
}

export default Conversation