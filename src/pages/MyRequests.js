import React, { useState, useEffect, useContext, useRef } from "react"
import {UserContext} from "../home"
import Axios from "axios"

function MyRequests() {
    const cloud_name = "dzjkgjjut"
    const { userData, setUserData } = useContext(UserContext)
    const [ requests, setRequests ] = useState([])
    const [ result, setResult ] = useState([])
    const [ searchCount, setSearchCount ] = useState(10)
    const [ page, setPage ] = useState(0)
    const [ tab, setTab ] = useState("Pending")
    const topPage = useRef(null)
    let length = requests.length
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
        async function go() {
          const response = await Axios.get(`/api/pending-requests/${userData.user.id}/${tab}`)
          setRequests(response.data)
        }
        go()
    }, [tab])

    useEffect(() => {
        const getFiltered = async () => { 
            setResult([])
            let slice = (source, index) => source.slice(index, index + searchCount)
            while (index < length) {
                let temp = [slice(requests, index)]
                setResult(prev=>prev.concat(temp))
                index += searchCount
            }
        }
        getFiltered()
    }, [requests])

    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }

    return (
        <div className="projectRequest">
            <div ref={topPage}></div>
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
                {result[0] ? 
                    <div className="searchHiringList">
                        {result[page]?.map((a)=> {
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

export default MyRequests