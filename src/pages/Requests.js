import React, {useState} from "react"
import AllRequests from "../components/PendingReq"
import AllDenied from "../components/DeniedReq"

function Requests({socket}) {
    const [tab, setTab] = useState("Pending")

    return (
        <div className="adminRequests">
            <div className="adminRequestsTop">
                <div className="contentTitle">
                    <label><b>Job/Project Requests ({tab})</b></label>
                </div>
                <div className="adminRequestsTopBtn">
                    <button className="btn btn-outline-success allButtons" onClick={(e)=>setTab("Pending")}>Pending</button>
                    <button className="btn btn-outline-success allButtons" onClick={(e)=>setTab("Denied")}>Denied</button>
                </div>
            </div>
            <br />
            <div className="adminRequestsBot">
                {tab ==="Pending" && <AllRequests socket={socket}/>}
                {tab ==="Denied" && <AllDenied />}
            </div>
        </div>
    )
}

export default Requests