import React, {useState, useEffect} from "react"
import Axios from "axios"

function Conversation({conversation, currentUser}) {
    const [user, setUser] = useState(null)
    const [pic, setPic] = useState()
    
    useEffect(() => {
        const memberId = conversation.members.find((m) => m !== currentUser.id)
        const getUser = async () => {
          try {
            const res = await Axios.get(`/members/${memberId}`)
            setUser(res.data[0].firstname)//need to find the firstname of the userId 
            setPic(res.data[0].photo)
          } catch (err) {
            console.log(err)
          }
        }
        getUser()
      }, [currentUser, conversation])
    
    return (
        <div className="conversation">
            <img className="conversationImg" src={pic ? `/uploaded-photos/${pic}` : "/fallback.png"} alt=""/>
            <span className="conversationName">{user}</span>
        </div>
    )
}

export default Conversation