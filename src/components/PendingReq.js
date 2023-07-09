import React, { useState, useEffect, useContext, useRef } from "react"
import Axios from "axios"
import {UserContext} from "../home"
import moment from "moment"

function AllRequests({socket}){
    const [ projects, setProjects ] = useState([])
    const [ update, setUpdate ] = useState("")
    const { userData, setUserData } = useContext(UserContext)
    const [ result, setResult ] = useState([])
    const [ page, setPage ] = useState(0)
    const [ searchCount, setSearchCount ] = useState(10)
    const [ toUpdate, setToUpdate ] = useState("")
    const [ requestModalOpen, setRequestModalOpen ] = useState(false)
    const [ isApproved, setIsApproved ] = useState(false)
    const [ isDenied, setIsDenied ] = useState(false)
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
      <div className="requestTable">
        <div ref={topPage}></div>
        <div className="requestModal">
          {requestModalOpen && 
            <ApproveRequestModal 
            setRequestModalOpen={setRequestModalOpen} 
            toUpdate={toUpdate} 
            socket={socket}
            isApproved={isApproved}
            setIsApproved={setIsApproved}
            isDenied={isDenied}
            setIsDenied={setIsDenied}
            setUpdate={setUpdate} />
          }
        </div>
        <div className="tableList">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th><div className="constantHW">Type</div></th>
                <th><div className="constantHW">Title</div></th>
                <th><div className="constantHW">Employer</div></th>
                <th><div className="constantHW">Company</div></th>
                <th><div className="constantHW">Skill</div></th>
                <th><div className="constantHW">Slots</div></th>
                <th><div className="constantHW">Sallary</div></th>
                <th><div className="constantHW">Duration</div></th>
                <th><div className="constantHW">Location</div></th>
                <th><div className="constantHW">Date Requested</div></th>
                <th><div className="constantHW">Actions</div></th>
              </tr>
            </thead>
            <tbody>
              {result[0] ? 
                <>
                  {result[page]?.map((prj) => {
                    return (
                      <tr key={prj._id}>
                              <td>{((projects.indexOf(prj))+1)<10 ? "0"+((projects.indexOf(prj))+1) : ((projects.indexOf(prj))+1)}</td>
                              <td><div className="constantHW">{prj.type==="Job Request" || prj.type==="Project Request" ? prj.type : "Extend Post Request"}</div></td>
                          
                              <td><div className="constantHW">{prj.title}</div></td>
                              
                              <td><div className="constantHW">{prj?.employer?.firstname} {prj?.employer?.middlename ? prj.employer.middlename.charAt(0).toUpperCase() + ". " : "" }{prj?.employer?.lastname}</div></td>
                              <td><div className="constantHW">{prj.company ? prj.company : ""}</div></td>
                              <td><div className="constantHW">{prj.skillrequired}</div></td>
                              <td>
                                <div className="constantHW">
                                  {prj?.slots!==0 ? prj.slots :"Fully occupied"}
                                </div>
                              </td>
                              <td><div className="constantHW">₱ {new Intl.NumberFormat().format(prj.sallary)}</div></td>
                              <td><div className="constantHW">{prj?.duration ? prj.duration+ " month(s)" : "-"}</div></td>
                              <td><div className="constantHW">{prj.location?.city}, {prj.location?.province}, {prj.location?.region}</div></td>
                              
                              <td><div className="constantHW">{moment(prj.creationdate).format("MM/DD/YY")}</div></td>
                              <td>
                                  <div className="leftButtons">
                                    <div className="leftButtons hovertext" data-hover="Approve" onClick={()=>{
                                      result[page]?.map((a)=> {
                                        if (a._id===prj._id) {
                                          setToUpdate(a)
                                        }
                                      })
                                      setRequestModalOpen(true)
                                      setIsApproved(true)
                                      }}>
                                        <img src={"/WebPhoto/check.png"} alt={"check icon"} />
                                    </div>

                                    <div className="leftButtons hovertext" data-hover="Deny" onClick={()=>{
                                      result[page]?.map((a)=> {
                                        if (a._id===prj._id) {
                                          setToUpdate(a)
                                        }
                                      })
                                      setRequestModalOpen(true)
                                      setIsDenied(true)
                                      }}>
                                        <img src={"/WebPhoto/x.png"} alt={"x icon"} />
                                    </div>
                                  </div>
                              </td>
                      </tr>
                    )
                  })}
                </>
              :<span className="searchList">No Job(s)/Project(s) found.</span>}
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

function ApproveRequestModal({ setRequestModalOpen, toUpdate, socket, isApproved, setIsApproved, isDenied, setIsDenied, setUpdate }) {
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
  const { userData, setUserData } = useContext(UserContext)

  const [draftRegion, setDraftRegion] = useState("")
  const [draftProvince, setDraftProvince] = useState("")
  const [draftCity, setDraftCity] = useState("")

  useEffect(() => {
    if (isApproved===true) {
      setDraftStatus("Approved")
      setDraftApprovalDate(() => new Date().toISOString())
      if (toUpdate.type==="Project Request" || toUpdate.type==="Project") {
        setDraftType("Project")
      }
      if (toUpdate.type==="Job Request" || toUpdate.type==="Job") {
        setDraftType("Job")
      }
      setStatus("Hiring")
    }
    if (isDenied===true) {
      setDraftType(toUpdate.type)
      setDraftStatus("Denied")
      setDraftNote("")
      setStatus("")
    }
    setDraftTitle(toUpdate.title)
    setDraftCompany(toUpdate?.company)
    setDraftDescription(toUpdate.description)
    setDraftSkillRequired(toUpdate.skillrequired)
    setDraftEmployer(toUpdate?.employer?.firstname +" "+ (toUpdate?.employer?.middlename ? toUpdate.employer.middlename.charAt(0).toUpperCase() + ". " : "") + toUpdate?.employer?.lastname)
    setDraftSallary(toUpdate.sallary)
    setDraftDuration(toUpdate.duration)
    
    setDraftRegion(toUpdate.location.region)
    setDraftProvince(toUpdate.location.province)
    setDraftCity(toUpdate.location.city)

    setDraftCreationDate(toUpdate.creationdate)
  }, [])
  
  async function submitHandler(e) {
    e.preventDefault()
    setIsEditing(false)
    const data = new FormData()
    data.append("_id", toUpdate._id)
    data.append("requeststatus", draftStatus)
    data.append("title", draftTitle)
    data.append("company", draftCompany)
    data.append("description", draftDescription)
    data.append("skillrequired", draftSkillRequired)
    data.append("employer", toUpdate?.employer?._id)
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
      const subject = toUpdate._id
      const type = toUpdate.type==="Job Request" || toUpdate.type==="Project Request" ? toUpdate.type : (toUpdate.type+" post extension")
      const action = "approved your"
      await Axios.post(`/api/send-notifications/${userData.user.id}/${toUpdate?.employer?._id}/${action}/${type}/${subject}`)
      await Axios.post(`/api/admin-logs/${userData.user.id}/${toUpdate?.employer?._id}/${subject}/${logType}`)

      socket.emit("sendNotification", {
        senderId: userData.user.id,
        receiverId: toUpdate?.employer?._id,
        subject: subject,
        type: type,
        action: action,
      })
    }
    if (draftStatus==="Denied") {
      res = await Axios.post("/update-project", data, { headers: { "Content-Type": "multipart/form-data" } })
      
      const logType = "DENY"
      const subject = toUpdate._id
      const type = toUpdate.type
      const action = "denied your"
      await Axios.post(`/api/send-notifications/${userData.user.id}/${toUpdate?.employer?._id}/${action}/${type}/${subject}`)
      await Axios.post(`/api/admin-logs/${userData.user.id}/${toUpdate?.employer?._id}/${subject}/${logType}`)
      socket.emit("sendNotification", {
        senderId: userData.user.id,
        receiverId: toUpdate?.employer?._id,
        subject: subject,
        type: type,
        action: action,
      })
    }
    setRequestModalOpen(false)
    setUpdate(res.data)
    setIsApproved(false) 
    setIsDenied(false)
  }
  
  return (
    <div className="approveModalBackground">
        <div className="approveModalContainer">
          <form className="modalForm" onSubmit={submitHandler}>
            <div>
              {isApproved===true ? <h5><b>Approved</b></h5> : <h5><b>Denied</b></h5>}
            </div>
            <div>
              <img src={toUpdate.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${toUpdate.image}.jpg` : "/fallback.png"} className="requestModalPhoto" alt={`${toUpdate.title}`}></img>
            </div>
            <div>
              <label><b>Finalize data before saving to the database.</b></label>
            </div>
            <div>
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
                <input hidden disabled onChange={e => setDraftCreationDate(e.target.value)} type="text" className="form-control form-control-sm" value={draftCreationDate}/>
              </div>
              <div className="mb-2">
                <input hidden disabled onChange={e => setDraftApprovalDate(e.target.value)} type="text" className="form-control form-control-sm" value={draftApprovalDate}/>
              </div>
              <div className="mb-1">
                <input hidden disabled onChange={e => setDraftType(e.target.value)} type="text" className="form-control form-control-sm" value={draftType}/>
              </div>
              <div className="mb-1">
                <input hidden disabled onChange={e => setDraftStatus(e.target.value)} type="text" className="form-control form-control-sm" value={draftStatus}/>
              </div>
              {isApproved && (
                <div className="mb-1">
                  <input hidden disabled onChange={e => setStatus(e.target.value)} type="text" className="form-control form-control-sm" value={status} placeholder="Status"/>
                </div>
              )}
              {isDenied && (
                <div className="mb-1">
                  <textarea rows = "3" autoFocus onChange={e => setDraftNote(e.target.value)} type="text" className="form-control form-control-sm" value={draftNote} placeholder="Brief explanation on the project termination."/>
                </div>
              )}
            </div>
              <div className="centerContent">
                <button className="btn btn-outline-success allButtons">
                  Confirm
                </button>{" "}
                <button type="button" onClick={() => [setRequestModalOpen(false), setIsApproved(false), setIsDenied(false)]} className="btn btn-sm btn-outline-secondary cancelBtn">
                  Cancel
                </button>
              </div>
            </form>
        </div>
    </div>
  )
}

export default AllRequests