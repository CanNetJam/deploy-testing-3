import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from "../home"
import SearchBox from "./SearchBox"
import ProjectUpdates from "./ProjectUpdates"
import Review from "./Review"
import ApplicantList from "./ApplicantList"
import moment from "moment"
import Questions from "./Questions"

function Project({socket}) {
    const location = useLocation()
    let navigate = useNavigate()
    const { userData, setUserData } = useContext(UserContext)
    const [ projectInfo, setProjectInfo ] = useState(null)
    const [ freeInfo, setFreeInfo ] = useState(false)
    const [ isFree, setIsFree ] = useState(false)
    const [ searchOn, setSearchOn ] = useState(false)
    const [ accepted, setAccepted ] = useState(false)
    const [ theFree, setTheFree ] = useState(false)
    const [ rejected, setRejected ] = useState(false)
    const [ theEmp, setTheEmp ] = useState(false)
    const [ openProgress, setOpenProgress ] = useState(false)
    const [ writeReview, setWriteReview ] = useState(false)
    const [ theAdmin, setTheAdmin ] = useState(userData.user?.type==="Admin" ? true : false)
    const [ recieverId, setRecieverId ] = useState()
    const [ hiring, setHiring ] = useState(false)
    const [ ongoing, setOngoing ] = useState(false)
    const [ ending, setEnding ] = useState(false)
    const [ end, setEnd ] = useState("")
    const [ done, setDone ] = useState("")
    const [ reviewed, setReviewed ] = useState(false)
    const [ applied, setApplied ] = useState(false)
    const [ aJob, setAJob ] = useState(false)
    const [ waiting, setWaiting ] = useState(false)
    const [ toCancel, setToCancel ] = useState(false)
    const [ note, setNote ] = useState("")
    const [ reload, setReload ] = useState("")
    const [ toApply, setToApply ] = useState(false)

    useEffect(() => {
        const projectid = location.state._id
        const getProject = async () => {
          try {
            const res = await Axios.get(`/api/search-project/${projectid}`)
            setProjectInfo(res.data)
            if (!res.data.tempfree) {
              setIsFree(true)
              setFreeInfo()
            }
            if (res.data?.tempfree) {
              if (res.data.tempfree===userData.user?.id) {
                setTheFree(true)
                setApplied(true)
              }
            }
            if (res.data?.tempfree) {
              if (res.data.tempfree!=="") {
                setWaiting(true)
              }
            }
            if (res.data.employer._id===userData.user?.id) {
              setTheEmp(true)
            }
            if (res.data.accepted==="No") {
              setAccepted(false)
            }
            if (res.data.accepted==="Yes") {
              setAccepted(true)
            }
            if (res.data.status==="Hiring") {
              setHiring(true)
            }
            if (res.data.status==="Ongoing") {
              setOngoing(true)
            }
            if (res.data.status==="Concluded" || res.data.requeststatus==="Denied") {
              setOngoing(false)
              setHiring(false)
            }
            if (res.data.candidate) {
              setFreeInfo(true)
            }
            if (res.data.type==="Job") {
              setAJob(true)
            }
            if (res.data.type==="Project") {
              setAJob(false)
            }
            res.data.applicants.map((a)=> {
              if (a.applicantid?._id===userData.user?.id) {
                setApplied(true)
              }
            })
          } catch (err) {
            console.log(err)
          }
        }
        getProject()
    }, [accepted, rejected, done, applied, reload])

    async function startConversation() {
      const members = [projectInfo?.candidate._id, projectInfo?.employer._id]
      try {
          const prevConvo = await Axios.get("/api/get-conversation/", {params: {
              member1: projectInfo?.candidate._id,
              member2: projectInfo?.employer._id
          }})
          console.log(prevConvo.data)
          if (prevConvo.data) {
              navigate("/messages", {state: {_id: prevConvo.data}})
          }
          if (prevConvo.data === null) {
              const createConvo = await Axios.post("/api/create-conversation", members)
              navigate("/messages", {state: {_id: createConvo.data}})
          }
      }catch (err) {
          console.log(err)
      }
    }

    useEffect(() => {
      const getAdmin = async () => {
        try {
          const res = await Axios.get("/api/get-admin")
          setRecieverId(res.data)
        } catch (err) {
          console.log(err)
        }
      }
      getAdmin()
    }, [])

    useEffect(() => {
        const projectid = projectInfo?._id
        const candidate = projectInfo?.candidate?._id 
        const getReviewData = async () => {
        try {
          const res = await Axios.get(`/api/reviews/${projectid}/${candidate}`)
          setReviewed(res.data)
        } catch (err) {
          console.log(err)
        }
      }
      getReviewData()
    }, [projectInfo])
    
    async function acceptedYes() {
      const projectid = location.state._id
      const tempfree = projectInfo.tempfree
      const toHire = "Yes"
      try {
        const res = await Axios.post(`/api/update-project/accepted/${projectid}/${tempfree}/${toHire}`)
        const subject = res.data._id
        const type = `${projectInfo?.type} Request`
        const action = "accepted your"
        await Axios.post(`/api/send-notifications/${userData.user.id}/${projectInfo?.employer?._id}/${action}/${type}/${subject}`)

        socket.emit("sendNotification", {
          senderId: userData.user.id,
          receiverId: projectInfo?.employer?._id,
          subject: subject,
          type: type,
          action: action,
        })
      } catch (err) {
        console.log(err)
      }
    }

    async function acceptedNo() {
      const projectid = location.state._id
      const employer = projectInfo?.employer?._id
      try {
        const res = await Axios.post(`/api/update-project/rejected/${projectid}/${employer}/${userData.user?.id}`, {note: note})
        
        if (userData.user.id!==projectInfo?.employer?._id) {
          const subject = res.data._id
          const type = `${projectInfo?.type} Request`
          const action = "declined your"
          await Axios.post(`/api/send-notifications/${userData.user.id}/${projectInfo?.employer?._id}/${action}/${type}/${subject}`)
          socket.emit("sendNotification", {
            senderId: userData.user.id,
            receiverId: projectInfo?.employer?._id,
            subject: subject,
            type: type,
            action: action,
          })
        }
        setWaiting(false)
        setToCancel(false)
        setRejected(true)
        navigate("/")
      } catch (err) {
        console.log(err)
      }
    }

    async function endProject (e) {
      e.preventDefault()
      const projectid = location.state._id
      if (end==="Accomplished") {
        const theEnd = await Axios.post(`/api/end-project/${projectid}`)
        setDone(theEnd.data)
        if (theAdmin) {
          //notif for employer
          const subject = theEnd.data._id
          const type = projectInfo?.type
          const action = "concluded your"
          await Axios.post(`/api/send-notifications/${userData.user.id}/${projectInfo?.employer?._id}/${action}/${type}/${subject}`)
          socket.emit("sendNotification", {
            senderId: userData.user.id,
            receiverId: projectInfo?.employer?._id,
            subject: subject,
            type: type,
            action: action,
          })
          //notif for candidate
          if (accepted) {
            await Axios.post(`/api/send-notifications/${userData.user.id}/${projectInfo?.candidate?._id  ? projectInfo.candidate._id  : ""}/${action}/${type}/${subject}`)
            socket.emit("sendNotification", {
              senderId: userData.user.id,
              receiverId: projectInfo?.candidate?._id,
              subject: subject,
              type: type,
              action: action,
            })
          }
        }
        if (!theAdmin) {
          //notif for admin
          const subject = theEnd.data._id
          const type = projectInfo?.type
          const action = "concluded their"
          await Axios.post(`/api/send-notifications/${userData.user.id}/${recieverId ? recieverId._id : ""}/${action}/${type}/${subject}`)
          socket.emit("sendNotification", {
            senderId: userData.user.id,
            receiverId: recieverId._id,
            subject: subject,
            type: type,
            action: action,
          })
          //notif for candidate
          if (accepted) {
            await Axios.post(`/api/send-notifications/${userData.user.id}/${projectInfo?.candidate?._id  ? projectInfo.candidate._id  : ""}/${action}/${type}/${subject}`)
            socket.emit("sendNotification", {
              senderId: userData.user.id,
              receiverId: projectInfo?.candidate?._id,
              subject: subject,
              type: type,
              action: action,
            })
          }
        }
      } else {
        alert("Please eneter the specific word required.")
      }
    } 

    async function readAll(a, b) {
      try {
        const res = await Axios.post(`/api/update-project/read-note/${a}/${b}`)
        setReload(res.data)
      } catch (err) {
          console.log(err)
      }
    }

    function expectedMonth(){
      let a = Number(moment(projectInfo?.acceptdate).format("MM"))
      let c = Number(moment(projectInfo?.acceptdate).format("YYYY"))
      let d = projectInfo?.duration
      let total = a
      for(let i = 0; i<d ; i++){
        total += 1
      }
      if (total>12) {
        total= total-12,
        c= c+1
      }
      return {
        month: Number(total-1),
        year: Number(c)
      }
    }
    let expectedDate = expectedMonth()
    
    function idPlusKey(a, b) {
      const key = a + b 
      return key
    }
    
    return (
        <div className="projects">
            {projectInfo && (
                  <div className="projectCard">
                    <div className="projectCardTop">
                      <div>
                        <div>
                          <img className="card-img-top projectPhoto" src={projectInfo.photo ? `/uploaded-photos/${projectInfo.photo}` : "/fallback.png"} alt={`${projectInfo.company} named ${projectInfo.title}`} />
                        </div>
                        <br />

                        <div>
                          {hiring ? 
                            <div>
                              {isFree && (
                                <div>
                                  {theEmp && (
                                    <div className="actionButtonWrapper">
                                      <button className="btn btn-sm btn-primary actionButton" onClick={()=> {
                                        if (searchOn) {
                                          setSearchOn(false)
                                        }
                                        if (!searchOn) {
                                          setSearchOn(true)
                                        }
                                      }}>
                                        Hire Now!
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          :<></>}
                        </div>
                        <br />

                        <div>
                            {!aJob ? 
                              <div>
                                {ongoing || !ongoing ? 
                                  <div>
                                    {accepted && (
                                      <div className="actionButtonWrapper">
                                        <button className="btn btn-sm btn-primary actionButton" onClick={()=>{
                                          if (openProgress===false) {
                                            setOpenProgress(true)
                                          }
                                          if (openProgress===true) {
                                            setOpenProgress(false)
                                          }
                                        }}>
                                          View Project Progress
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                :<></>}
                              </div>
                            :<></>}
                        </div>
                        <br />
                        <div>
                          {ongoing && (
                            <div>
                              {theEmp && (
                              <div className="actionButtonWrapper">
                                <button className="btn btn-sm btn-primary actionButton" onClick={()=>{
                                  if (ending===false) {
                                    setEnding(true)
                                  }
                                  if (ending===true) {
                                    setEnding(false)
                                  }
                                  }}>Accomplish {projectInfo.type}</button>
                                {ending && (
                                  <form onSubmit={endProject}>
                                    <p>Please type "Accomplished" to proceed.</p>
                                    <input onChange={e => setEnd(e.target.value)} value={end} type="text"/>
                                    <button className="btn btn-sm btn-primary">Confirm</button>
                                  </form>
                                )}
                              </div>
                              )}
                            {theAdmin && (
                              <div className="actionButtonWrapper">
                                <button className="btn btn-sm btn-primary actionButton" onClick={()=>{
                                  if (ending===false) {
                                    setEnding(true)
                                  }
                                  if (ending===true) {
                                    setEnding(false)
                                  }
                                  }}>Accomplish {projectInfo.type}</button>
                                {ending && (
                                  <form onSubmit={endProject}>
                                    <p>Please type "Accomplished" to proceed.</p>
                                    <input onChange={e => setEnd(e.target.value)} value={end} type="text"/>
                                    <button className="btn btn-sm btn-primary">Confirm</button>
                                  </form>
                                )}
                              </div>
                            )}
                          </div>
                          )}
                        </div>
                        <br />
                        <div>
                          {theEmp ?
                            <div>
                              {!ongoing ?
                                <div>
                                  {hiring ?
                                    <div>
                                      {waiting ?
                                        <div className="actionButtonWrapper">
                                          <div>
                                            <label>Waiting for candidate's response. </label>
                                          </div>
                                          <button className="btn btn-sm btn-primary actionButton" onClick={()=> acceptedNo()}>
                                            Cancel {projectInfo.type} Request
                                          </button>
                                          <br />
                                        </div>
                                      :<></>}
                                    </div>
                                  :<></>}
                                </div>
                              :<></>}
                            </div>
                          :<></>}
                        </div>
                        
                        {ongoing ?
                          <div>
                            {userData.user?.id === projectInfo.employer._id || userData.user?.id === projectInfo?.candidate?._id ?
                              <div className="actionButtonWrapper">
                                <button className="btn btn-sm btn-primary actionButton" onClick={()=>{
                                    if (userData.token === undefined) {
                                        alert("Please login to continue.")
                                        navigate("/login", {})
                                    } else {
                                        startConversation()
                                    }
                                }}>Chat</button>
                              </div>
                            :<></>}
                          </div>
                        : <></>}
                        <br />

                        <div>
                          {!ongoing && (
                            <div>
                              {!isFree && (
                                <div>
                                  {!reviewed && (
                                    <div>
                                      {accepted && (
                                        <div>
                                          {theEmp && (
                                            <div className="actionButtonWrapper">
                                              <button className="btn btn-sm btn-primary actionButton" onClick={()=> {
                                                if(writeReview===false) {
                                                  setWriteReview(true)
                                                }
                                                if(writeReview===true) {
                                                  setWriteReview(false)
                                                }
                                              }}>
                                                Write an Employee Review
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          {hiring ?
                            <div>
                              {!accepted && (
                                <div>
                                  {!rejected && (
                                    <div>
                                      {theFree && (
                                        <div>
                                          <p>Decide what happens to the offer: </p>
                                          <button className="btn btn-sm btn-primary" onClick={()=> {acceptedYes(), setAccepted(true)}}>
                                            Accept {projectInfo.type}
                                          </button>
                                          <button className="btn btn-sm btn-primary" onClick={()=> setToCancel(true)}>
                                            Reject {projectInfo.type}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          :<></>}
                        </div>
                      </div>
                      <div className="profileCardTextWrapper profileCardText">
                        <p><b>Status: {projectInfo.status}</b></p>
                        <h3>{projectInfo.employmenttype}: {projectInfo.title}</h3>
                        {projectInfo.company!=="undefined" ?
                          <p className="text-muted small">Company: {projectInfo.company}</p>
                        :<p className="text-muted small">Company: <i>Not specified.</i></p>}
                        <p className="text-muted small">Description: {projectInfo.description}</p>
                        <p className="text-muted small">Skill Required: {projectInfo.skillrequired}</p>
                        {projectInfo.minimumreq?.what!=="Others" ?
                          <p className="text-muted small">Minimum requirements: {projectInfo.minimumreq.what}</p>
                        :<p className="text-muted small">Minimum requirements: {projectInfo.minimumreq.note}</p>}
                        <p className="text-muted small">Sallary: ₱ {projectInfo.sallary}</p>
                        <p className="text-muted small">Duration: {projectInfo.duration} months</p>
                        <p className="text-muted small">Location: {projectInfo.location?.city}, {projectInfo.location?.province}, {projectInfo.location?.region}</p>
                        <p className="text-muted small">Other qualifications: {projectInfo.others}</p>
                        <p className="text-muted small">Employer: {projectInfo?.employer?.firstname} {projectInfo.employer.middlename ? projectInfo.employer.middlename.charAt(0).toUpperCase() + ". " : "" }{projectInfo?.employer?.lastname}</p>
                        {freeInfo && (
                          <div>
                            <p className="text-muted small">Employee: {projectInfo?.candidate?.firstname} {projectInfo.candidate.middlename ? projectInfo.candidate.middlename.charAt(0).toUpperCase() + ". " : "" }{projectInfo?.candidate?.lastname}</p>
                          </div>
                        )}
                        <p className="text-muted small">Date submitted: {moment(projectInfo.creationdate).format("MMM. DD, YYYY")}</p>
                        <p className="text-muted small">Date approved: {moment(projectInfo.approvaldate).format("MMM. DD, YYYY")}</p>
                        {accepted ? 
                          <div>
                            <p className="text-muted small">Began at: {moment(projectInfo.acceptdate).format("MMM. DD, YYYY")}</p>
                            <p className="text-muted small">Expected to end at: {moment(expectedDate).format("MMM. YYYY")}</p>
                          </div>
                        :<></>}
                        {!ongoing && !hiring ? 
                          <p className="text-muted small">Date concluded: {moment(projectInfo.completiondate).format("MMM. DD, YYYY")}</p>
                        :<></>}
                      </div>  
                    </div>

                    <div>
                      {hiring ?
                        <div>
                          {toApply===true ?
                            <div>
                              <Questions 
                                setApplied={setApplied}
                                setToApply={setToApply}
                                socket={socket}
                                projectid={location.state._id} 
                                type={projectInfo?.type} 
                                questions={projectInfo.questions} 
                                employer={projectInfo.employer._id}
                                applicants={projectInfo.applicants}/>
                            </div>
                          :<></>}
                        </div>
                      :<></>}
                    </div>

                    <div>
                      {toCancel ?
                        <div>
                          <div className="p-3 bg-success bg-opacity-25 mb-5">
                            <label>Explain why you decline the offer:</label>
                            <input required onChange={e => setNote(e.target.value)} value={note} type="text" className="form-control" placeholder="Your reason..." />
                            <button className="btn btn-sm btn-primary" onClick={()=>acceptedNo()}>Confirm</button>
                          </div>
                        </div>
                      :<></>}
                    </div>

                    <div>
                      {hiring ? 
                        <div>
                          <div>
                            {isFree && (
                            <div>
                              {searchOn && (
                                <div>
                                  <SearchBox 
                                  projectid={location.state._id}
                                  projecttype={projectInfo?.type}/>
                                </div>
                              )} 
                            </div>  
                            )}
                          </div>
                          <div>
                            {!applied ? 
                              <div>
                                {userData?.user?.type==="Candidate" ?
                                  <div>
                                    <button className="btn btn-sm btn-primary" onClick={()=> {setToApply(true)}}>
                                      Apply Now!
                                    </button>
                                  </div>
                                :<></>}
                              </div>
                            :<></>}
                          </div>
                          <div>
                            {!userData.token ? 
                              <div>
                                  <button className="btn btn-sm btn-primary" onClick={()=>{
                                      alert("Please login to continue."), 
                                      navigate("/login", {})}}>
                                      Apply Now!
                                  </button>
                              </div>
                            :<></>}
                          </div>
                        </div>
                      : <></>} 
                    </div>
                    {hiring ?
                      <div>
                        {theEmp ?
                          <div>
                            <h3><b>Current Applications: </b></h3>
                            {projectInfo?.applicants[0] ? 
                              <div className="notifList">
                                  {projectInfo?.applicants.map(function(a) {
                                      return <ApplicantList 
                                      _id={a._id}
                                      key={idPlusKey(a._id, userData.user.id)} 
                                      questions={projectInfo.questions}
                                      applicantid ={a.applicantid} 
                                      applicants ={projectInfo.applicants} 
                                      appliedAt ={a.appliedAt} 
                                      employer ={projectInfo?.employer?._id} 
                                      projectid={location.state._id} />
                                  })}
                              </div>
                            : <span>No applications at the moment.</span>}
                          </div>
                        :<></>}
                        <br />
                        <div>
                          {theEmp ?
                            <div>
                              {projectInfo?.notes ?
                                <div>
                                  {projectInfo?.notes.map(function(a) {
                                    <h3><b>Request refusal:</b></h3>
                                    return (
                                      <div className="notif" key={a._id}>
                                        <div className="notifTop">
                                            <div>
                                                <img className="messageImg" src={a.notesender.photo ? `/uploaded-photos/${a.notesender.photo}` : "/fallback.png"} alt={`${a.notesender.lastname}`} />
                                            </div>
                                            <div>
                                                {a.notesender?.firstname} {a.notesender.middlename ? a.notesender.middlename.charAt(0).toUpperCase() + ". " : "" }{a.notesender?.lastname} declined your offer with a reason of: { a.note}
                                            </div>
                                        </div>
                                        <div className="notifBot">
                                            <button className="btn btn-sm btn-primary" onClick={()=> {
                                              readAll(projectInfo._id, a._id)
                                            }}>
                                              Mark as Read
                                            </button>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              :<></>}
                            </div>
                          :<></>}
                        </div>
                      </div>
                    :<></>}

                    {!aJob ? 
                      <div>
                        {ongoing || !ongoing ? 
                          <div>
                            {accepted && (
                              <div>
                                {openProgress && (
                                  <div className="centerContent">
                                    <ProjectUpdates 
                                    projectid={location.state._id} 
                                    employer={projectInfo?.employer ? projectInfo.employer._id : ""} 
                                    freelancer={projectInfo?.candidate ? projectInfo.candidate._id : ""}
                                    ongoing={ongoing}
                                    socket={socket}/>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        : <></>}
                      </div>
                    :<></>}

                    <div>
                      {!ongoing && (
                        <div>
                          {!isFree && (
                            <div>
                              {!reviewed && (
                                <div>
                                  {accepted && (
                                    <div>
                                      {theEmp && (
                                        <div>
                                          <button className="btn btn-sm btn-primary" onClick={()=> {
                                            if(writeReview===false) {
                                              setWriteReview(true)
                                            }
                                            if(writeReview===true) {
                                              setWriteReview(false)
                                            }
                                          }}>
                                            Write an Employee Review
                                          </button>
                                          {writeReview && (
                                            <div>
                                              <Review 
                                                projectid={location.state._id}  
                                                candidate={projectInfo?.candidate ? projectInfo.candidate._id : ""}
                                                setWriteReview={setWriteReview}
                                                setReviewed={setReviewed}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div> 
              </div>
            )}
        </div>
    )
}

export default Project