import React, { useState, useEffect, useRef} from "react"
import {format} from "timeago.js"
import moment from "moment"
import Axios from "axios"

function AllLogsTable() {
    const [ logs, setLogs ] = useState([])
    const [ result, setResult ] = useState([])
    const [ searchCount, setSearchCount ] = useState(10)
    const [ page, setPage ] = useState(0)
    const topPage = useRef(null)
    let length = logs.length
    let index = 0

    const scrollToSection = (elementRef) => {
        window.scrollTo({
          top: elementRef.current.offsetTop,
          behavior: "smooth",
        })
      }
  
      useEffect(()=> {
          const windowOpen = () => {   
              scrollToSection(topPage)
          }
          windowOpen()
      }, [])

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
        <div className="systemLogs">
            <div ref={topPage}></div>
            <div className="contentTitle">
                <label><b>System Logs</b></label>
            </div>
            <br/>
            <div className="tableList">
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th><div className="constantHW">Admin</div></th>
                            <th><div className="constantHW">Action</div></th>
                            <th><div className="constantHW">Subject</div></th>
                            <th><div className="constantHW">Account</div></th>
                            <th><div className="constantHW">Date</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {result[0] ? 
                            <>
                                {result[page]?.map((log) => {
                                    return (
                                        <tr key={log._id}>
                                            <td>{((logs.indexOf(log))+1)<10 ? "0"+((logs.indexOf(log))+1) : ((logs.indexOf(log))+1) }</td>
                                            <td><div className="constantHW">{log.adminId?.firstname} {log.adminId?.middlename ? log.adminId.middlename.charAt(0).toUpperCase() + ". " : "" }{log.adminId?.lastname}</div></td>
                                            <td><div className="constantHW">{log.type}</div></td>
                                            <td><div className="constantHW">{log.projectId?.title}</div></td>
                                            <td><div className="constantHW">{log.userId?.firstname} {log.userId?.middlename ? log.userId.middlename.charAt(0).toUpperCase() + ". " : "" }{log.userId?.lastname}</div></td>
                                            <td><div className="constantHW">
                                                {log.createdAt ? moment(log.createdAt).format("MMM. DD, YYYY"): "No data."}<br />
                                                ({format(log.createdAt ? log.createdAt : "No data.")})
                                            </div></td>
                                        </tr>
                                    )
                                })}
                            </>
                        :<></>}
                    </tbody>
                </table>
            </div>
            {result[0] ? 
                <div className="pageNumber">
                    <button disabled={page===0? true : false} className="btn btn-outline-success pageButtons" onClick={()=>setPage(page-1)}>Previous</button>
                    {result?.map((a)=>{
                        return (
                            <button key={result?.indexOf(a)} disabled={result?.indexOf(a)===page ? true : false} className="btn btn-outline-success pageButtons" onClick={()=>setPage(result?.indexOf(a))}>
                                {(result?.indexOf(a))+1}
                            </button>
                        )
                    })}
                    <button disabled={page===(result.length-1)? true : false} className="btn btn-outline-success pageButtons" onClick={()=>setPage(page+1)}>Next</button>
                </div>
            : null}
        </div>
    )
}

export default AllLogsTable