import React, { useState, useEffect} from "react"
import {format} from "timeago.js"
import moment from "moment"
import Axios from "axios"

function AllLogsTable() {
    const [ logs, setLogs ] = useState([])
    const [ result, setResult ] = useState([])
    const [ searchCount, setSearchCount ] = useState(1000)
    let length = logs.length
    let index = 0
    useEffect(() => {
        const Logs = async () => {
          try {
            const res = await Axios.get(`/api/all-logs`)
            setLogs(res.data)
          } catch (err) {
            console.log(err)
          }
        }
        Logs()
    }, [])

    useEffect(() => {
        const getFiltered = async () => { 
            setResult([])
            let slice = (source, index) => source.slice(index, index + searchCount)
            while (index < length) {
                let temp = [slice(logs, index)]
                setResult(prev=>prev.concat(temp))
                index += searchCount
            }
        }
        getFiltered()
    }, [logs])

    return (
        <div>
            <div className="contentTitle">
                <label><b>System Logs</b></label>
            </div>
            <br/>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Admin</th>
                        <th>Action</th>
                        <th>Subject</th>
                        <th>Account</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {result[0] ? 
                        <>
                            {result[0]?.map((log) => {
                                return (
                                    <tr key={log._id}>
                                        <td>{((logs.indexOf(log))+1)<10 ? "0"+((logs.indexOf(log))+1) : ((logs.indexOf(log))+1) }</td>
                                        <td>{log.adminId?.firstname} {log.adminId?.middlename ? log.adminId.middlename.charAt(0).toUpperCase() + ". " : "" }{log.adminId?.lastname}</td>
                                        <td>{log.type}</td>
                                        <td>{log.projectId?.title}</td>
                                        <td>{log.userId?.firstname} {log.userId?.middlename ? log.userId.middlename.charAt(0).toUpperCase() + ". " : "" }{log.userId?.lastname}</td>
                                        <td>
                                            {log.createdAt ? moment(log.createdAt).format("MMM. DD, YYYY"): "No data."}<br />
                                            ({format(log.createdAt ? log.createdAt : "No data.")})
                                        </td>
                                    </tr>
                                )
                            })}
                        </>
                    :<></>}
                </tbody>
            </table>
        </div>
    )
}

export default AllLogsTable