import React, {useState, useEffect, useContext} from "react"
import Axios from "axios"
import {UserContext} from "../home"
import SendUpdate from "./SendUpdate"
import {format} from "timeago.js"
import moment from "moment"

function ProjectUpdates({projectid, employer, freelancer, ongoing, socket}) {
    const cloud_name = "dzjkgjjut"
    const { userData, setUserData } = useContext(UserContext)
    const [ theFree, setTheFree ] = useState(false)
    const [ theEmp, setTheEmp ] = useState(false)
    const [ updates, setUpdates ] = useState([])
    const [ addUpdate, setAddUpdate ] = useState([])
    const [ selected, setSelected ] = useState("")
    const [ sendUpdate, setSendUpdate ] = useState(false)
    const [ selectedFree, setSelectedFree ] = useState("")
    const [ note, setNote ] = useState("")
    const [ noteId, setNoteId ] = useState(null)
    const [ addNote, setAddNote ] = useState(false)
    const [ sendRequest, setSendRequest ] = useState(false)
    
    useEffect(()=> {
        const whatUser = async () => {
            if(userData.user.id===employer) {
                setTheEmp(true)
            }
            if(userData.user.id===freelancer) {
                setTheFree(true)
            }
        }
        whatUser()
    }, [])

    useEffect(()=> {
        const updates = async () => {
            try {
                const res = await Axios.get(`/api/updates/${projectid}`)
                setUpdates(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        updates()
    }, [addUpdate])
    
    useEffect(() => { 
        const user = freelancer
        const getUserData = async () => {
            try {
                const res = await Axios.get(`/api/search-profile/${user}`)
                setSelectedFree(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getUserData()
    }, [])
    
    async function reqUpdate (e) {
        e.preventDefault()
        setAddNote(false)
        try {
            const add = await Axios.post("/api/create-updates", {projectid: projectid, note: note})
            setNoteId(add.data._id)
            
            const subject = projectid
            const type = "Project Update Request"
            const action = "sent a"
            await Axios.post(`/api/send-notifications/${userData.user.id}/${freelancer}/${action}/${type}/${subject}`)

            socket.emit("sendNotification", {
                senderId: userData.user.id,
                receiverId: freelancer,
                subject: subject,
                type: type,
                action: action,
            })
            setAddUpdate(add)
            setNote("")
        } catch (err) {
            console.log(err)
        }
    }
    
    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }

    return (
        <div className="notifications">
            <div className="notificationsTop">
                <div>
                    <h2>Project Updates</h2>
                </div>
                <div>
                    {!ongoing && (
                        <></>
                    )}
                    {ongoing && (
                        <div>
                            {theEmp && (
                            <div>
                                <button className="btn btn-sm btn-primary" onClick={()=> {
                                    if (sendRequest===false) {
                                        setAddNote(true)
                                    }
                                    if (sendRequest===true) {
                                        setAddNote(false)
                                    }
                                }}>
                                    Request Project Update
                                </button>
                            </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div>
                {addNote && (
                    <form className="projectUpdate" onSubmit={reqUpdate}>
                        <div className="projectUpdateContent">
                            <label>Note: (Optional, leave blank if not necessary.) </label>
                            <input onChange={e => setNote(e.target.value)} value={note} type="text" className="form-control inputStretch" placeholder="Specify the contents of your update request here..." />
                            
                            <div className="btnWrapper">
                                <button className="btn btn-sm btn-primary">
                                    Send Request
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=> {
                                    setAddNote(false)
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            <div>
                {updates[0] ? 
                    <div className="searchList">
                        {updates?.map((a)=>{
                            return (
                                <div className="theUpdate" key={idPlusKey(a._id, userData.user.id)}>
                                    <h1>Project Progress #{1+(updates.indexOf(a))}</h1>
                                    <p>Requested at: {moment(a.createdAt).format("MMM. DD, YYYY")} <br /> {format(a.createdAt)}</p>
                                    {a.note!=="" ?
                                        <p>Note: {a.note}</p>
                                    :<></>}
                                    
                                    <div className="projectUpdatePhoto">
                                        <img src={a.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/w_300,h_200,c_fill,q_85/${a.image}.jpg` : "/fallback.png"} alt={`${a.title} named ${a.title}`}></img>
                                    </div>
                                    <p>Title: {a.title!== "" ? a.title : "Waiting for project update."}<br />
                                    Description: {a.description!== "" ? a.description : "Waiting for project update."}</p>
                                    {a.uploadedby && (
                                        <div>
                                            <p>Uploaded by: {selectedFree.firstname} {selectedFree.middlename ? selectedFree.middlename?.charAt(0).toUpperCase() + "." : ""} {selectedFree.lastname}<br />
                                            Edited at: {moment(a.updatedAt).format("MMM. DD, YYYY")} <br></br>({format(a.updatedAt)})</p>
                                        </div>
                                    )}

                                    {ongoing && (
                                        <div>
                                            {theFree && (
                                                <div>
                                                    <div>
                                                        <button className="btn btn-sm btn-primary" onClick={()=> {setSendUpdate(true), setSelected(a._id)}}>
                                                            Send Project Update
                                                        </button>
                                                        {sendUpdate && (
                                                        <button className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=> setSendUpdate(false)}>
                                                            Cancel
                                                        </button>
                                                        )}
                                                    </div>
                                                    <div>
                                                        {sendUpdate && (
                                                            <div>
                                                                {selected===a._id &&
                                                                    <SendUpdate 
                                                                    projectid={a._id}
                                                                    employer={employer}
                                                                    title={a.title}
                                                                    description={a.description}  
                                                                    setAddUpdate={setAddUpdate}
                                                                    setSendUpdate={setSendUpdate}
                                                                    socket={socket}/>
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                : 
                <div>
                    <span>No project progress available.</span>
                </div>}
            </div>
        </div>
    )
}

export default ProjectUpdates