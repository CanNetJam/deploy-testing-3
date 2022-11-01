import React, {useState} from "react"
import AllRequests from "../components/PendingReq"
import AllDenied from "../components/DeniedReq"

function Requests({socket}) {
    const [tab, setTab] = useState("Pending")

    return (
        <div className="adminRequests">
            <div className="adminRequestsTop">
                <h2>Job/Project Requests ({tab})</h2>
                <div className="adminRequestsTopBtn">
                    <button className="btn btn-sm btn-primary" onClick={(e)=>setTab("Pending")}>Pending</button>
                    <button className="btn btn-sm btn-primary" onClick={(e)=>setTab("Denied")}>Denied</button>
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