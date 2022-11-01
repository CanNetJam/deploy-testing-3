import React, { useState, useEffect, useContext } from "react"
import {UserContext} from "../home"
import Axios from "axios"

function MyRequests() {
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
            <div className="projectRequestTop">
                <h2>Requests ({tab})</h2>
                <div className="projectRequestBtn">
                    <div>
                        <button className="btn btn-sm btn-primary" onClick={()=>setTab("Pending")}>
                            Pending
                        </button>
                    </div>
                    <div>
                        <button className="btn btn-sm btn-primary" onClick={()=>setTab("Denied")}>
                            Denied
                        </button>
                    </div>
                </div>
            </div>
            <div className="projectRequestBot">
                {requests[0] ? 
                    <div className="projects-grid">
                        <label>My {tab} Requests: </label>
                        {requests.map((a)=> {
                            return (
                                <div className="card" key={idPlusKey(a._id, userData.user.id)}>
                                    <div className="our-project-card-top">
                                        <img src={a.photo ? `/uploaded-photos/${a.photo}` : "/fallback.png"} className="card-img-top" alt={`${a.company} named ${a.title}`} />
                                    </div>
                                    <div className="card-body">
                                        <h3><b>Type:</b> {a.type}</h3>
                                        <h3><b>Status:</b> {a.requeststatus}</h3>
                                        <h3>Title: {a.title}</h3>
                                        <p className="text-muted small">Company: {a.company}</p>
                                        <p className="text-muted small">Skill Required: {a.skillrequired}</p>
                                        <p className="text-muted small">Description: {a.description}</p>
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