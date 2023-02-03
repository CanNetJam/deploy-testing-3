import React, { useState, useEffect, useRef} from "react"
import Axios from "axios"
import { useReactToPrint } from "react-to-print"

function BugReports() {
    const cloud_name = "dzjkgjjut"
    const [ bugReports, setBugReports] = useState([])

    useEffect(() => {
        const getBugReports = async () => {
          try {
            const res = await Axios.get("/api/all-bug-report")
            setBugReports(res.data)
          } catch (err) {
            console.log(err)
          }
        }
        getBugReports()
    }, [])

    return (
        <div>
            <div className="centerContent">
                <h1>Bug Reports</h1>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Sender</th>
                        <th>Title</th>
                        <th>Photo</th>
                        <th>Desription</th>
                        <th>Report Id</th>
                    </tr>
                </thead>
                <tbody>
                    {bugReports.map((a)=> (
                        <tr key={a.month}>
                            <td>{a.userid?.firstname} {a.userid?.middlename ? a.userid.middlename.charAt(0).toUpperCase() + ". " : "" }{a.userid?.lastname}</td>
                            <td>{a.title}</td>
                            <td><img src={a.photo ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_85/${a.photo}.jpg` : "/fallback.png"} className="messageImg"></img></td>
                            <td>{a.description}</td>
                            <td>{a._id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div> 
    )
}

export default BugReports