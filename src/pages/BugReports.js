import React, { useState, useEffect, useRef} from "react"
import Axios from "axios"

function BugReports() {
    const cloud_name = "dzjkgjjut"
    const [ bugReports, setBugReports] = useState([])
    const [ result, setResult ] = useState([])
    const [ searchCount, setSearchCount ] = useState(10)
    const [ page, setPage ] = useState(0)
    const topPage = useRef(null)
    let length = bugReports.length
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

    useEffect(() => {
        const getFiltered = async () => { 
            setResult([])
            let slice = (source, index) => source.slice(index, index + searchCount)
            while (index < length) {
                let temp = [slice(bugReports, index)]
                setResult(prev=>prev.concat(temp))
                index += searchCount
            }
        }
        getFiltered()
    }, [bugReports])

    return (
        <div className="bugReports">
            <div ref={topPage}></div>
            <div className="contentTitle">
                <label><b>Bug Reports</b></label>
            </div>
            <table>
                <thead>
                    <tr>
                        <th><div className="constantHWBugs">No.</div></th>
                        <th><div className="constantHWBugs">Photo</div></th>
                        <th><div className="constantHWBugs">Title</div></th>
                        <th><div className="constantHWBugs">Description</div></th>
                        <th><div className="constantHWBugs">Sender</div></th>
                        <th><div className="constantHWBugs">Report Id</div></th>
                    </tr>
                </thead>
                <tbody>
                    {result[0] ? 
                        <>
                            {result[page]?.map((a) => {
                                return (
                                    <tr key={a.month}>
                                        <td><div className="constantHWBugs">{(( bugReports.indexOf(a))+1)<10 ? "0"+(( bugReports.indexOf(a))+1) : (( bugReports.indexOf(a))+1) }</div></td>
                                        <td><div className="constantHWBugs"><img src={a.photo ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_55/${a.photo}.jpg` : "/fallback.png"} className="bugImg"></img></div></td>
                                        <td><div className="constantHWBugs">{a.title}</div></td>
                                        <td><div className="constantHWBugs">{a.description}</div></td>
                                        <td><div className="constantHWBugs">{a.userid?.firstname} {a.userid?.middlename ? a.userid.middlename.charAt(0).toUpperCase() + ". " : "" }{a.userid?.lastname}</div></td>
                                        <td><div className="constantHWBugs">{a._id}</div></td>
                                    </tr>
                                )   
                            })}
                        </>
                    :<></>}
                </tbody>
            </table>
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

export default BugReports