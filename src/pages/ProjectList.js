import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../home"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import {format} from "timeago.js"

function ProjectList() {
    const { userData, setUserData } = useContext(UserContext)
    const [ projects, setProjects ] = useState([])
    const [ tab, setTab ] = useState("Hiring")
    
    useEffect(() => {
    async function go() {
      const response = await Axios.get(`/api/projects/${userData.user.id}/${tab}`)
      setProjects(response.data)
    }
    go()
    }, [tab])
    
    return (
      <div className="projects">
        <div className="projectsTop contentTitle">
          <label><b>Job/Project List</b> (<i>{tab}</i>)</label>
          <div className="projectsTopBtn">
            <button className="btn btn-outline-success allButtons" onClick={()=>{setTab("Hiring")}}>
              Hiring
            </button>
            <button className="btn btn-outline-success allButtons" onClick={()=>{setTab("Ongoing")}}>
              Ongoing
            </button>
            <button className="btn btn-outline-success allButtons" onClick={()=>{setTab("Concluded")}}>
              Concluded
            </button>
          </div>
        </div>

        <div className="projectsBot">
          {projects[0] ? 
            <div>
              {projects.map(function(Projects) {
                return (
                  <div className="projects-grid" key={Projects._id}>
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