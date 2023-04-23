import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import {UserContext} from "../home"
import moment from "moment"
import {format} from "timeago.js"

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
            {projects[0] ? 
              <div className="requests-grid">
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
                    image={projects.image}
                    employer={projects?.employer}
                    creationdate={projects.creationdate}
                    note={projects.note}/>
                })}
            </div>
            : <span>No Denied Request so far.</span>}
          </div>
    )
}

function Projects(props) {
  const cloud_name = "dzjkgjjut"

    return (
      <div className="requestData card">
        <div className="requestDataTop">
          <img src={props.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${props.image}.jpg` : "/fallback.png"} className="card-img-top" alt={`${props.employername} named ${props.title}`}></img>
        </div>
        <div>
          <label className="contentSubheading coloredContent"><b>{props.type}</b></label>
        </div>
        <div className="requestDataBot">
              <p className="contentSubheading centerContent"><b>{props.title}</b></p>
              <div className="paragraphSpaceBetweenOthers">
                <div>Slots</div> 
                <div className="rightText">{props.slots ? props.slots : "Not specified."}</div>
              </div>
              <div className="paragraphSpaceBetweenOthers">
                <div>Employer</div> 
                <div className="rightText">{props?.employer?.firstname} {props?.employer?.middlename ? props.employer.middlename.charAt(0).toUpperCase() + ". " : "" }{props?.employer?.lastname}</div>
              </div>
              <div className="paragraphSpaceBetweenOthers">
                <div>Company</div> 
                <div className="rightText">{props?.employer?.company ? props.employer.company: "None"}</div>
              </div>
              <div className="paragraphSpaceBetweenOthers">
                <div>Skill Required</div> 
                <div className="rightText">{props.skillrequired}</div>
              </div>
              <div className="paragraphSpaceBetweenOthers">
                <div>Sallary</div> 
                <div className="rightText">₱ {props.sallary}</div>
              </div>
              <div className="paragraphSpaceBetweenOthers">
                <div>Duration</div> 
                <div className="rightText">{props.duration} month(s)</div>
              </div>
              <div className="paragraphSpaceBetweenOthers">
                <div>Location</div> 
                <div className="rightText">{props.location?.city}, {props.location?.province}, <br/>{props.location?.region}</div>
              </div>
              <div className="paragraphSpaceBetweenOthers">
                <div>Date submitted</div> 
                <div className="rightText">{moment(props.creationdate).format("MMM. DD, YYYY")} | {format(props.creationdate)}</div>
              </div>
              <p>Description <br/>{props.description}</p>
              <br/>
              <p><b>Denial Reason</b>: <br/> {props.note}</p>
        </div>
      </div>
    )
  }

export default AllDenied