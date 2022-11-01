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
        </div>
    )
}

function Projects(props) {
    const [isEditing, setIsEditing] = useState(false)
    const [file, setFile] = useState()
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
      if (file) {
        data.append("photo", file)
      }
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
        
        const subject = props._id
        const type = props.type
        const action = "approved your"
        await Axios.post(`/api/send-notifications/${userData.user.id}/${props?.employer?._id}/${action}/${type}/${subject}`)
        
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
        
        const subject = props._id
        const type = props.type
        const action = "denied your"
        await Axios.post(`/api/send-notifications/${userData.user.id}/${props?.employer?._id}/${action}/${type}/${subject}`)

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
      <div className="card">
        <div className="our-card-top">
          {isEditing && (
            <div className="our-custom-input"></div>
          )}
          <img src={props.photo ? `/uploaded-photos/${props.photo}` : "/fallback.png"} className="card-img-top" alt={`${props.employername} named ${props.title}`} />
        </div>
        <div className="card-body">
          {!isEditing && (
            <>
              <h4><b>{props.type}</b></h4>
              <h5><b>{props.requeststatus}</b></h5>
              <h3>{props.title}</h3>
              <p className="text-muted small">Employer: {props?.employer?.firstname} {props?.employer?.middlename ? props.employer.middlename.charAt(0).toUpperCase() + ". " : "" }{props?.employer?.lastname}</p>
              <p className="text-muted small">Company: {props?.employer?.company ? props.employer.company: "None"}</p>
              <p className="text-muted small">Skill Required: {props.skillrequired}</p>
              <p className="text-muted small">Sallary: {props.sallary}</p>
              <p className="text-muted small">Duration: {props.duration} month(s)</p>
              <p className="text-muted small">Location: {props.location?.city}, {props.location?.province}, {props.location?.region}</p>
              <p className="text-muted small">Date submitted: {moment(props.creationdate).format("MMM. DD, YYYY")} <br></br>({format(props.creationdate)})</p>
              <p className="text-muted small">Description: {props.description}</p>
              {!props.readOnly && (
            <>
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
                      setDraftApprovalDate(() => Date.now())
                      setFile(props.photo)
                      setIsApproved(true)
                      if (props.type==="Project Request") {
                        setDraftType("Project")
                      }
                      if (props.type==="Job Request") {
                        setDraftType("Job")
                      }
                      setStatus("Hiring")
                    }}
                    className="btn btn-sm btn-primary"
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
                      setFile(props.photo) 
                      setIsDenied(true)
                      if (props.type==="Project Request") {
                        setDraftType("Project")
                      }
                      if (props.type==="Job Request") {
                        setDraftType("Job")
                      }
                      setDraftNote("")
                      setStatus("")
                    }}
                    className="btn btn-sm btn-primary"
                  > 
                    Deny
                  </button>{" "}
                </>
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
                <input autoFocus onChange={e => setDraftCompany(e.target.value)} type="text" className="form-control form-control-sm" value={draftCompany}/>
              </div>

              <div className="mb-1">
                <input autoFocus onChange={e => setDraftSallary(e.target.value)} type="number" className="form-control form-control-sm" value={draftSallary}/>
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
                <input onChange={e => setDraftCreationDate(e.target.value)} type="text" className="form-control form-control-sm" value={draftCreationDate}/>
              </div>
              <div className="mb-2">
                <input onChange={e => setDraftApprovalDate(e.target.value)} type="text" className="form-control form-control-sm" value={draftApprovalDate}/>
              </div>
              <div className="mb-1">
                <input autoFocus onChange={e => setDraftType(e.target.value)} type="text" className="form-control form-control-sm" value={draftType}/>
              </div>
              <div className="mb-1">
                <input autoFocus onChange={e => setDraftStatus(e.target.value)} type="text" className="form-control form-control-sm" value={draftStatus}/>
              </div>
              {isApproved && (
                <>
                    <div className="mb-1">
                        <input autoFocus onChange={e => setStatus(e.target.value)} type="text" className="form-control form-control-sm" value={status} placeholder="Status"/>
                    </div>
                </>
              )}
              {isDenied && (
                    <div className="mb-1">
                        <input autoFocus onChange={e => setDraftNote(e.target.value)} type="text" className="form-control form-control-sm" value={draftNote} placeholder="Brief explanation on the project termination."/>
                    </div>
              )}
              <button className="btn btn-sm btn-success">
                Confirm
              </button>{" "}
              <button onClick={() => [setIsEditing(false), setIsApproved(false), setIsDenied(false)]} className="btn btn-sm btn-outline-secondary">
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

export default AllRequests