import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import {UserContext} from "../home"
import moment from "moment"

function AllDenied(){
    const { userData, setUserData } = useContext(UserContext)
    const [projects, setProjects] = useState([])

    useEffect(() => {
      let isCancelled = false
      async function go() {
        const type = userData?.user.type
        const response = await Axios.get(`/api/denied-projects/${type}`, {headers: {'auth-token': userData.token}})
        if (!isCancelled) {
          setProjects(response.data)
        }
      }
      go()
      return ()=> {
        isCancelled = true
      }
    }, [])

    return(
        <div>
          <div>
            {projects[0] ? 
              <div className="accounts-grid">
                {projects.map(function(projects) {
                  return <Projects 
                    key={projects._id} 
                    _id={projects._id}
                    type ={projects.type} 
                    requeststatus ={projects.requeststatus} 
                    title ={projects.title} 
                    company ={projects.company} 
                    description ={projects.description} 
                    skillrequired ={projects.skillrequired} 
                    photo={projects.photo}
                    image={projects.image}
                    employer={projects?.employer}
                    creationdate={projects.creationdate}
                    note={projects.note}/>
                })}
            </div>
            : <span>No Denied Request so far.</span>}
          </div>
        </div>
    )
}

function Projects(props) {
  const cloud_name = "dzjkgjjut"

    return (
      <div className="card">
        <div className="our-card-top">
          <img src={props.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/w_300,h_200,c_fill,q_85/${props.image}.jpg` : "/fallback.png"} className="card-img-top" alt={`${props.employername} named ${props.title}`}></img>
        </div>
        <div className="card-body">
          <h4><b>{props.type}</b></h4>
          <h5><b>{props.requeststatus}</b></h5>
          <h3>{props.title}</h3>
          <p className="text-muted small">Company: {props.company}</p>
          <p className="text-muted small">Description: {props.description}</p>
          <p className="text-muted small">Skill Required: {props.skillrequired}</p>
          <p className="text-muted small">Employer: {props?.employer?.firstname} {props?.employer?.middlename ? props.employer.middlename.charAt(0).toUpperCase() + ". " : "" }{props?.employer?.lastname}</p>
          <p className="text-muted small">Date submitted: {moment(props.creationdate).format("MMM. DD, YYYY")}</p>
          <p className="text-muted small">Denial Reason: {props.note}</p>
        </div>
      </div>
    )
  }

export default AllDenied