import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import {UserContext} from "../home"
import {format} from "timeago.js"
import moment from "moment"

function AllRequests({socket}){
    const [ projects, setProjects ] = useState([])
    const [ update, setUpdate ] = useState("")
    const { userData, setUserData } = useContext(UserContext)
    
    useEffect(() => {
      let isCancelled = false
      async function go() {
        const type = userData?.user.type
        const response = await Axios.get(`/api/pending-projects/${type}` , {headers: {'auth-token': userData.token}})
        if (!isCancelled) {
          setProjects(response.data)
        }
      }
      go()
      return ()=> {
        isCancelled = true
      }
    }, [update])

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
                  slots ={projects.slots}
                  skillrequired ={projects.skillrequired} 
                  image={projects.image}
                  employer={projects?.employer}
                  creationdate={projects.creationdate}
                  sallary={projects.sallary}
                  duration={projects.duration}
                  location={projects.location}
                  setUpdate={setUpdate} 
                  socket={socket}/>
                })}
              </div>
            : <span>No Pending Request at the moment.</span>}
          </div>
    )
}

function Projects(props) {
    const cloud_name = "dzjkgjjut"
    const [isEditing, setIsEditing] = useState(false)
    const [draftStatus, setDraftStatus] = useState("")
    const [draftTitle, setDraftTitle] = useState("")
    const [draftCompany, setDraftCompany] = useState("")
    const [draftDescription, setDraftDescription] = useState("")
    const [draftSkillRequired, setDraftSkillRequired] = useState("")
    const [draftEmployer, setDraftEmployer] = useState("")
    const [draftCreationDate, setDraftCreationDate] = useState("")
    const [draftApprovalDate, setDraftApprovalDate] = useState("")
    const [draftType, setDraftType] = useState("")
    const [status, setStatus] = useState("")
    const [draftNote, setDraftNote] = useState("")
    const [draftSallary, setDraftSallary] = useState("")
    const [draftDuration, setDraftDuration] = useState("")
    const [isApproved, setIsApproved] = useState(false)
    const [isDenied, setIsDenied] = useState(false)
    const { userData, setUserData } = useContext(UserContext)

    const [draftRegion, setDraftRegion] = useState("")
    const [draftProvince, setDraftProvince] = useState("")
    const [draftCity, setDraftCity] = useState("")

    async function submitHandler(e) {
      e.preventDefault()
      setIsEditing(false)
      const data = new FormData()
      data.append("_id", props._id)
      data.append("requeststatus", draftStatus)
      data.append("title", draftTitle)
      data.append("company", draftCompany)
      data.append("description", draftDescription)
      data.append("skillrequired", draftSkillRequired)
      data.append("employer", props?.employer?._id)
      data.append("creationdate", draftCreationDate)
      data.append("approvaldate", draftApprovalDate)
      data.append("type", draftType)
      data.append("status", status)
      data.append("note", draftNote)
      data.append("sallary", draftSallary)
      data.append("duration", draftDuration)
      
      data.append("region", draftRegion)
      data.append("province", draftProvince)
      data.append("city", draftCity)
      
      let res
      if (draftStatus==="Approved") {
        res = await Axios.post("/update-project", data, { headers: { "Content-Type": "multipart/form-data" } })
        
        const logType = "APPROVE"
        const subject = props._id
        const type = props.type
        const action = "approved your"
        await Axios.post(`/api/send-notifications/${userData.user.id}/${props?.employer?._id}/${action}/${type}/${subject}`)
        await Axios.post(`/api/admin-logs/${userData.user.id}/${props?.employer?._id}/${subject}/${logType}`)

        props.socket.emit("sendNotification", {
          senderId: userData.user.id,
          receiverId: props?.employer?._id,
          subject: subject,
          type: type,
          action: action,
        })
      }
      if (draftStatus==="Denied") {
        res = await Axios.post("/update-project", data, { headers: { "Content-Type": "multipart/form-data" } })
        
        const logType = "DENY"
        const subject = props._id
        const type = props.type
        const action = "denied your"
        await Axios.post(`/api/send-notifications/${userData.user.id}/${props?.employer?._id}/${action}/${type}/${subject}`)
        await Axios.post(`/api/admin-logs/${userData.user.id}/${props?.employer?._id}/${subject}/${logType}`)
        props.socket.emit("sendNotification", {
          senderId: userData.user.id,
          receiverId: props?.employer?._id,
          subject: subject,
          type: type,
          action: action,
        })
      }
      props.setUpdate(res.data)
    }

    return (
      <div className="requestData card">
        <div className="requestDataTop">
          <img src={props.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${props.image}.jpg` : "/fallback.png"} className="card-img-top" alt={`${props.title}`}></img>
        </div>
        <div>
          <label className="contentSubheading coloredContent"><b>{props.type}</b></label>
        </div>
        <div className="requestDataBot">
          {!isEditing && (
            <>
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
                <div className="rightText">{props?.company ? props.company: "Not specified."}</div>
              </div>
              <div className="paragraphSpaceBetweenOthers">
                <div>Skill Required</div> 
                <div className="rightText">{props.skillrequired}</div>
              </div>
              <div className="paragraphSpaceBetweenOthers">
                <div>Sallary</div> 
                <div className="rightText">₱ {new Intl.NumberFormat().format(props.sallary)}</div>
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
              {!props.readOnly && (
                <div className="centerContent">
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setDraftStatus("Approved")
                      setDraftTitle(props.title)
                      setDraftCompany(props?.employer?.company)
                      setDraftDescription(props.description)
                      setDraftSkillRequired(props.skillrequired)
                      setDraftEmployer(props?.employer?.firstname +" "+ (props?.employer?.middlename ? props.employer.middlename.charAt(0).toUpperCase() + ". " : "") + props?.employer?.lastname)
                      setDraftSallary(props.sallary)
                      setDraftDuration(props.duration)
                      
                      setDraftRegion(props.location.region)
                      setDraftProvince(props.location.province)
                      setDraftCity(props.location.city)

                      setDraftCreationDate(props.creationdate)
                      setDraftApprovalDate(() => new Date().toISOString())
                      setIsApproved(true)
                      if (props.type==="Project Request") {
                        setDraftType("Project")
                      }
                      if (props.type==="Job Request") {
                        setDraftType("Job")
                      }
                      setStatus("Hiring")
                    }}
                    className="btn btn-outline-success allButtons"
                  >
                    Approve
                  </button>{" "}

                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setDraftStatus("Denied")
                      setDraftTitle(props.title)
                      setDraftCompany(props?.employer?.company)
                      setDraftDescription(props.description)
                      setDraftSkillRequired(props.skillrequired)
                      setDraftEmployer(props?.employer?.firstname +" "+ (props?.employer?.middlename ? props.employer.middlename.charAt(0).toUpperCase() + ". " : "") + props?.employer?.lastname)
                      setDraftSallary(props.sallary)
                      setDraftDuration(props.duration)
                      setDraftRegion(props.location.region)
                      setDraftProvince(props.location.province)
                      setDraftCity(props.location.city)
                      setDraftCreationDate(props.creationdate)
                      setIsDenied(true)
                      setDraftType(props.type)
                      setDraftNote("")
                      setStatus("")
                    }}
                    className="btn btn-sm btn-outline-secondary cancelBtn"
                  > 
                    Deny
                  </button>{" "}
                </div>
              )}
            </>
          )}
  
          {isEditing && (
            <form onSubmit={submitHandler}>
              <p><b>Finalize data before saving to the database.</b></p>
              <div className="mb-1">
                <input autoFocus onChange={e => setDraftTitle(e.target.value)} type="text" className="form-control form-control-sm" value={draftTitle}/>
              </div>
              <div className="mb-2">
                <input onChange={e => setDraftEmployer(e.target.value)} type="text" className="form-control form-control-sm" value={draftEmployer}/>
              </div>
              <div className="mb-1">
                <input onChange={e => setDraftCompany(e.target.value)} type="text" className="form-control form-control-sm" value={draftCompany}/>
              </div>

              <div className="mb-1">
                <input onChange={e => setDraftSallary(e.target.value)} type="number" className="form-control form-control-sm" value={draftSallary}/>
              </div>
              <div className="mb-2">
                <input onChange={e => setDraftDuration(e.target.value)} type="numner" className="form-control form-control-sm" value={draftDuration}/>
              </div>

              <div className="mb-2">
                <input onChange={e => setDraftSkillRequired(e.target.value)} type="text" className="form-control form-control-sm" value={draftSkillRequired}/>
              </div>
              <div className="mb-2">
                <input onChange={e => setDraftDescription(e.target.value)} type="text" className="form-control form-control-sm" value={draftDescription}/>
              </div>
              <div className="mb-2">
                <input disabled onChange={e => setDraftCreationDate(e.target.value)} type="text" className="form-control form-control-sm" value={draftCreationDate}/>
              </div>
              <div className="mb-2">
                <input disabled onChange={e => setDraftApprovalDate(e.target.value)} type="text" className="form-control form-control-sm" value={draftApprovalDate}/>
              </div>
              <div className="mb-1">
                <input disabled onChange={e => setDraftType(e.target.value)} type="text" className="form-control form-control-sm" value={draftType}/>
              </div>
              <div className="mb-1">
                <input disabled onChange={e => setDraftStatus(e.target.value)} type="text" className="form-control form-control-sm" value={draftStatus}/>
              </div>
              {isApproved && (
                <>
                    <div className="mb-1">
                        <input disabled onChange={e => setStatus(e.target.value)} type="text" className="form-control form-control-sm" value={status} placeholder="Status"/>
                    </div>
                </>
              )}
              {isDenied && (
                    <div className="mb-1">
                        <input disabled autoFocus onChange={e => setDraftNote(e.target.value)} type="text" className="form-control form-control-sm" value={draftNote} placeholder="Brief explanation on the project termination."/>
                    </div>
              )}

              <div className="centerContent">
                <button className="btn btn-outline-success allButtons">
                  Confirm
                </button>{" "}
                <button onClick={() => [setIsEditing(false), setIsApproved(false), setIsDenied(false)]} className="btn btn-sm btn-outline-secondary cancelBtn">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }

export default AllRequests