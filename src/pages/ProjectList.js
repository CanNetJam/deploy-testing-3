import React, { useState, useEffect, useContext, useRef } from "react"
import { UserContext } from "../home"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import {format} from "timeago.js"

function ProjectList() {
    const { userData, setUserData } = useContext(UserContext)
    const [ projects, setProjects ] = useState([])
    const [ tab, setTab ] = useState("Hiring")
    const [ result, setResult ] = useState([])
    const [ searchCount, setSearchCount ] = useState(10)
    const [ page, setPage ] = useState(0)
    const topPage = useRef(null)

    let length = projects.length
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
      const response = await Axios.get(`/api/projects/${userData.user.id}/${tab}`)
      setProjects(response.data)
    }
    go()
    }, [tab])

    useEffect(() => {
      const getFiltered = async () => { 
          setResult([])
          let slice = (source, index) => source.slice(index, index + searchCount)
          while (index < length) {
              let temp = [slice(projects, index)]
              setResult(prev=>prev.concat(temp))
              index += searchCount
          }
      }
      getFiltered()
    }, [projects])
    
    return (
      <div className="projects">
        <div ref={topPage}></div>
        <div className="projectsTop contentTitle">
          <label><b>Job/Project List</b> (<i>{tab}</i>)</label>
          <div className="projectsTopBtn">
            <button className="btn btn-outline-success allButtons" onClick={()=>{setPage(0), setTab("Hiring")}}>
              Hiring
            </button>
            <button className="btn btn-outline-success allButtons" onClick={()=>{setPage(0), setTab("Ongoing")}}>
              Ongoing
            </button>
            <button className="btn btn-outline-success allButtons" onClick={()=>{setPage(0), setTab("Concluded")}}>
              Concluded
            </button>
          </div>
        </div>

        <div className="projectsBot">
          {result[0] ? 
            <div className="searchHiringList">
              {result[page]?.map(function(Projects) {
                return (
                  <div key={Projects._id}>
                    <EachProject 
                      _id={Projects._id} 
                      type ={Projects.type}  
                      status ={Projects.status} 
                      title ={Projects.title} 
                      company ={Projects.company} 
                      employmenttype={Projects.employmenttype}
                      description ={Projects.description} 
                      skillrequired ={Projects.skillrequired} 
                      photo={Projects.photo}
                      image={Projects.image}
                      employer={Projects.employer}
                      candidate={Projects.candidate}
                      tempcandidate={Projects.tempcandidate}
                      employeelist={Projects.employeelist}
                      approvaldate={Projects.approvaldate}
                      completiondate={Projects.completiondate} />
                  </div>
                )
              })}
            </div>
          : <div>
              <span>You have no {tab} projects right now.</span>
            </div>}
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

function EachProject(props) {
    const cloud_name = "dzjkgjjut"
    let navigate = useNavigate()
    return (
      <div className="projectListCard" onClick={(e)=>{navigate("/project", {state: {_id: props._id}})}}>
        <div className="projectListPhoto">
          <img className="projectListImage" src={props.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${props.image}.jpg` : "/fallback.png"} alt={`${props.company} named ${props.title}`}></img>
        </div>
        <div className="projectListBot">
            <p><b>Status: {props.status}</b><br/>
            <b>{props.type}</b>: {props.title} (<i>{props.employmenttype}</i>)</p>
            <p>Employer: {props?.employer?.firstname} {props.employer.middlename ? props.employer.middlename.charAt(0).toUpperCase() + ". " : "" }{props?.employer?.lastname}<br />
            Skill Required: {props.skillrequired}<br />
            {props.company!=="undefined" ?
              <label>Company: {props.company}</label>
            :<label>Company: <i>Not specified.</i></label>}<br />
            </p>
            <p className="text-muted small">Posted {format(props.approvaldate)}<br/>
            {props.completiondate ? <label>Ended {format(props.completiondate)}</label> : <></>}</p>
        </div>
      </div>
    )
}

export default ProjectList