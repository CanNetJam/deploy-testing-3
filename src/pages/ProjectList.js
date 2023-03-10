import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../home"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import moment from "moment"

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
        <div className="projectsTop">
          <h2>Job/Project List ({tab})</h2>
          <div className="projectsTopBtn">
            <button className="btn btn-sm btn-primary" onClick={()=>{setTab("Hiring")}}>
              Hiring
            </button>
            <button className="btn btn-sm btn-primary" onClick={()=>{setTab("Ongoing")}}>
              Ongoing
            </button>
            <button className="btn btn-sm btn-primary" onClick={()=>{setTab("Concluded")}}>
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
          <img src={props.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_85/${props.image}.jpg` : "/fallback.png"} className="card-img-top projectPhoto" alt={`${props.company} named ${props.title}`}></img>
        </div>
        <div className="projectListBot">
            <h3>{props.employmenttype}: {props.title}</h3>
            <h4>Type: {props.type}</h4>
            <p><b>Status: {props.status}</b></p>
            <p className="text-muted small">Employer: {props?.employer?.firstname} {props.employer.middlename ? props.employer.middlename.charAt(0).toUpperCase() + ". " : "" }{props?.employer?.lastname}<br />
            Skill Required: {props.skillrequired}<br />
            {props.candidate ? 
              <label>Employee: {props?.candidate?.firstname} {props.candidate.middlename ? props.candidate.middlename.charAt(0).toUpperCase() + ". " : "" }{props?.candidate?.lastname}</label>
            :<></>}<br />
            {props.company!=="undefined" ?
              <label className="text-muted small">Company: {props.company}</label>
            :<label>Company: <i>Not specified.</i></label>}<br />
            Began at: {moment(props.approvaldate).format("MMM. DD, YYYY")}<br />
            {props.completiondate ? <label>Ended at: {moment(props.completiondate).format("MMM. DD, YYYY")}</label> : <></>}
            </p>
        </div>
      </div>
    )
}

export default ProjectList