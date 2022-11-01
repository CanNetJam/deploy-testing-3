import React, { useState, useEffect, useRef, useContext } from "react"
import Conversation from "../components/Conversation"
import Message from "../components/Message"
import { UserContext } from "../home"
import Axios from "axios"
import { useLocation } from 'react-router-dom'

function Messages({socket}) {
    const location = useLocation()
    const { userData, setUserData } = useContext(UserContext)
    const [ conversations, setConversations ] = useState([])
    const [ currentChat, setCurrentChat ] = useState(location.state?._id ? location.state._id : null)
    const [ messages, setMessages ] = useState([])
    const [ newMessage, setNewMessage ] = useState("")
    const [ arrivalMessage, setArrivalMessage ] = useState(null)
    
    const scrollRef = useRef()
    
    useEffect(()=> {
      socket.current = socket
      socket.current.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        })
      })
    }, [])

    useEffect(() => {
      arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat])

    useEffect(()=> {
      socket.current.emit("addUser", userData.user.id)

    }, [userData])

    useEffect(() => {
        const getConversations = async () => {
          try {
            const res = await Axios.get("/conversations/" + userData.user.id)
            setConversations(res.data)
            if (!location.state?._id) {
              setCurrentChat(res.data[0])
            }
          } catch (err) {
            console.log(err)
          }
        }
        getConversations()
    }, [userData.user.id])
    
    useEffect(() => {
        const getMessages = async () => {
          try {
            const res = await Axios.get("/message/" + currentChat?._id)
            setMessages(res.data)
          } catch (err) {
            console.log(err)
          }
        };
        getMessages()
    }, [currentChat])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const message = {
          sender: userData.user.id,
          text: newMessage,
          conversationId: currentChat._id,
        }

        const receiverId = currentChat.members.find(
          (member) => member !== userData.user.id
        )

        socket.current.emit("sendMessage", {
          senderId: userData.user.id,
          receiverId,
          text: newMessage,
        })
    
        try {
          const res = await Axios.post("/api/message", message)
          setMessages([...messages, res.data])
          const subject = res.data.conversationId
          const type = "Message"
          const action = "sent a"
          await Axios.post(`/api/send-notifications/${userData.user.id}/${receiverId}/${action}/${type}/${subject}`)

          socket.current.emit("sendNotification", {
            senderId: userData.user.id,
            receiverId: receiverId,
            subject: subject,
            type: type,
            action: action,
          })

          setNewMessage("")
        } catch (err) {
          console.log(err)
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    function idPlusKey(a, b) {
      const key = a + b 
      return key
    }

    return (
            <div className="messages">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for Partners" className="chatMenuInput" />
                        {conversations.map((c)=>{
                            return (
                                <div key={c._id} onClick={()=> setCurrentChat(c)}>
                                    <Conversation  conversation={c} currentUser={userData.user} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                      {currentChat ? 
                        <>
                          <div className="chatBoxTop">
                            {messages.map((m)=>{
                              return (
                                <div key= {idPlusKey(userData.user.id, m._id)} ref={scrollRef}>
                                  <Message message={m} own={m.sender === userData.user.id}/>
                                </div>
                              )
                            })}
                          </div>
                          <div className="chatBoxBottom">
                              <textarea 
                                  onChange={(e)=> setNewMessage(e.target.value)}
                                  value={newMessage}
                                  className="chatMessageInput" 
                                  placeholder="Write something for your partner!">
                              </textarea>
                              <button
                                  onClick={handleSubmit} 
                                  className="chatSubmitButton">
                                      Send
                              </button>
                          </div>
                        </>
                        : <span className="noConversationText">Go and visit someone's profile to chat with them.</span>
                      }
                    </div>
                </div>
            </div>
    )
}

export default Messages