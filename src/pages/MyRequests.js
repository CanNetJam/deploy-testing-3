import React, { useState, useEffect, useContext } from "react"
import {UserContext} from "../home"
import Axios from "axios"

function MyRequests() {
    const cloud_name = "dzjkgjjut"
    const { userData, setUserData } = useContext(UserContext)
    const [ requests, setRequests ] = useState([])
    const [ tab, setTab ] = useState("Pending")

    useEffect(() => {
        async function go() {
          const response = await Axios.get(`/api/pending-requests/${userData.user.id}/${tab}`)
          setRequests(response.data)
        }
        go()
    }, [tab])

    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }

    return (
        <div className="projectRequest">
            <div className="projectRequestTop contentTitle">
                <label><b>Requests</b> (<i>{tab}</i>)</label>
                <div className="projectRequestBtn">
                    <div>
                        <button className="btn btn-outline-success allButtons" onClick={()=>setTab("Pending")}>
                            Pending
                        </button>
                    </div>
                    <div>
                        <button className="btn btn-outline-success allButtons" onClick={()=>setTab("Denied")}>
                            Denied
                        </button>
                    </div>
                </div>
            </div>
            <div className="projectRequestBot">
                {requests[0] ? 
                    <div className="projects-grid">
                        {requests.map((a)=> {
                            return (
                                <div className="projectListCard" key={idPlusKey(a._id, userData.user.id)}>
                                    <div className="projectListPhoto">
                                        <img className="projectListImage" src={a.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${a.image}.jpg` : "/fallback.png"} alt={`${a.company} named ${a.title}`}></img>
                                    </div>
                                    <div className="projectListBot">
                                        <p>Status: <b>{a.requeststatus}</b><br/>
                                        {a.type}: {a.title} (<i>{a.employmenttype}</i>)<br/>
                                        Company: {a.company}<br/>
                                        Skill Required: {a.skillrequired}<br/>
                                        Description: {a.description}</p>

                                        {a.requeststatus==="Denied" ? 
                                            <p>Disapproval reason: {a.note ? <b>{a.note}</b> : <i>Not Specified.</i>}</p>
                                        :<></>}

                                    </div>
                                </div>
                            )
                        })}
                    </div>
                : <span>You do not have any {tab} project request right now.</span>}
            </div>    
        </div>
    )
}

export default MyRequests