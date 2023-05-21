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
import EmployeeList from "./EmployeeList"
import EndContractModal from "./EndContractModal"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Project({socket}) {
    const location = useLocation()
    let navigate = useNavigate()
    const cloud_name = "dzjkgjjut"
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
    const [ applied, setApplied ] = useState(false)
    const [ aJob, setAJob ] = useState(false)
    const [ waiting, setWaiting ] = useState(false)
    const [ toCancel, setToCancel ] = useState(false)
    const [ note, setNote ] = useState("")
    const [ reload, setReload ] = useState("")
    const [ toApply, setToApply ] = useState(false)
    const [ openApplicants, setOpenApplicants ] = useState(false)
    const [ openEmployees, setOpenEmployees ] = useState(false)
    const [ modalOpen, setModalOpen ] = useState(false)
    const [ toEndContract, setToEndContract ] = useState()
    const [ statusToReview, setStatusToReview ] = useState()
    
    useEffect(() => {
        const projectid = location.state._id
        const getProject = async () => {
          try {
            const res = await Axios.get(`/api/search-project/${projectid}`)
            setProjectInfo(res.data)
            if (!res.data.slots<=0) {
              setIsFree(true)
              setFreeInfo(false)
            }
            if (res.data?.tempcandidate) {
              let data = res.data?.tempcandidate ?  res.data.tempcandidate : []
              let length = data.length
              for (let i = 0; i<length; i++ ) {
                if (data[i].applicantid._id===userData.user?.id) {
                  setTheFree(true)
                  setApplied(true)
                }
              }
            }
            if (res.data?.employeelist) {
              let data = res.data?.employeelist ?  res.data.employeelist : []
              let length = data.length
              for (let i = 0; i<length; i++ ) {
                if (data[i].employeeid._id===userData.user?.id) {
                  setTheFree(true)
                  setApplied(true)
                }
              }
            }

            if (res.data?.type==="Project"){
              if (res.data.employeelist.length !==0) {
                setAccepted(true)
              }
            }

            if (res.data?.employeelist.length !==0){
              let data = res.data?.employeelist ?  res.data.employeelist : []
              let length = data.length
              for (let i = 0; i<length; i++ ) {
                if (data[i].employmentstatus==="Ongoing") {
                  setOngoing(true)
                }
              }
            }
            
            if (res.data.employer._id===userData.user?.id) {
              setTheEmp(true)
            }
            if (res.data.status==="Hiring") {
              setHiring(true)
              setOngoing(true)
            }

            if (res.data.status==="Concluded" || res.data.requeststatus==="Denied") {
              setOngoing(false)
              setHiring(false)
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
      const members = [userData.user?.id, projectInfo?.employer._id]
      try {
          const prevConvo = await Axios.get("/api/get-conversation/", {params: {
              member1: userData.user?.id,
              member2: projectInfo?.employer._id
          }})
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
    
    async function acceptedYes() {
      const projectid = location.state._id
      const tempfree = userData.user?.id
      const toHire = "Yes"
      try {
        const res = await Axios.post(`/api/update-project/accepted/${projectid}/${tempfree}/${toHire}`)
        setReload(res.data)
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
          let logType = "CONCLUDE"
          const subject = theEnd.data._id
          const type = projectInfo?.type
          const action = "concluded your"
          await Axios.post(`/api/send-notifications/${userData.user.id}/${projectInfo?.employer?._id}/${action}/${type}/${subject}`)
          await Axios.post(`/api/admin-logs/${userData.user.id}/${projectInfo?.employer?._id}/${subject}/${logType}`)
          socket.emit("sendNotification", {
            senderId: userData.user.id,
            receiverId: projectInfo?.employer?._id,
            subject: subject,
            type: type,
            action: action,
          })
          //notif for all non-concluded hired candidate
          projectInfo.employeelist?.map(async (a)=> {
            if (a.employmentstatus !== "Concluded") {
              await Axios.post(`/api/send-notifications/${userData.user.id}/${a.employeeid._id}/${action}/${type}/${subject}`)
                
              socket.emit("sendNotification", {
                senderId: userData.user.id,
                receiverId: a.employeeid._id,
                subject: subject,
                type: type,
                action: action,
              })
            }
          })
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
          //notif for all non-concluded hired candidate
          projectInfo.employeelist?.map(async (a)=> {
            if (a.employmentstatus !== "Concluded") {
              await Axios.post(`/api/send-notifications/${userData.user.id}/${a.employeeid._id}/${action}/${type}/${subject}`)
                
              socket.emit("sendNotification", {
                senderId: userData.user.id,
                receiverId: a.employeeid._id,
                subject: subject,
                type: type,
                action: action,
              })
            }
          })
        }
      } else {
        toastErrorNotification()
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
      if (d<12) {
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
      if (d>12) {
        total = d%12
        let yeartotal = parseInt(d/12)
        c= c+yeartotal
        return {
          month: Number(total-1),
          year: Number(c)
        }
      }
    }
    let expectedDate = expectedMonth()
    
    function idPlusKey(a, b) {
      const key = a + b 
      return key
    }

    function daysRemaining(props) {
      var eventdate = moment(props)
      var todaysdate = moment()
      return eventdate.diff(todaysdate, 'days')
    }

    useEffect(() => {
      const getDaysRemaining = async () => {
        try {
          if (projectInfo) {
            if (theEmp===true) {
              let daysBetween = daysRemaining(projectInfo?.expirationdate)
              let slots = projectInfo?.slots
              if (daysBetween<=5) {
                toastDueDateWarningNotification(daysBetween, slots)
              }
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
      getDaysRemaining()
    }, [projectInfo])
    
    function toastWarningNotification() {
      toast.warn('Please login to continue.', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }

    function toastDueDateWarningNotification(daysbetween, slots) {
      toast.warn(`${daysbetween} more days before the post expires. You still have ${slots} more slots to fill up.`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }

    function toastErrorNotification() {
      toast.error('Please enter the specific word required!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }

    return (
        <div className="projects">
            {modalOpen && <EndContractModal setOpenModal={setModalOpen} projectInfo={projectInfo} toEndContract={toEndContract} setReload={setReload}/>}
            {projectInfo && (
                  <div className="projectCard">
                    <div className="contentTitle sideContent">
                      <label><b>{projectInfo.type}</b></label>
                      <label>{projectInfo.status!=="" ? <b>{projectInfo.status}</b> : "Not approved."}</label>
                    </div>
                    <br/>
                    <p className="profileCardName">{projectInfo.title}</p>
                    <div className="projectCardTop">
                      <div className="projectCardTopPhoto">
                        <img src={projectInfo.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${projectInfo.image}.jpg` : "/fallback.png"} className="projectPhoto" alt={`${projectInfo.company} named ${projectInfo.title}`}></img>
                      </div>
                      <div className="projectCardTopDetails">
                        {projectInfo.status==="Hiring" ?
                          <div className="paragraphSpaceBetween">
                            <p>Hiring <b>{projectInfo.slots ? projectInfo.slots : "unspecified"}</b> people.</p>
                            {projectInfo.expirationdate ? (daysRemaining(projectInfo.expirationdate)>1 ? <p><b>{daysRemaining(projectInfo.expirationdate)}</b> days before post expires.</p>: <b>{`${projectInfo.type} Expired.`}</b>) : "unspecified"}
                          </div>
                        :<></>}
                        <div className="paragraphSpaceBetween">
                          <div>Skill Required</div> 
                          <div className="rightText">{projectInfo.skillrequired}</div>
                        </div>
                        <div className="paragraphSpaceBetween">
                          <div>Employment type</div> 
                          <div className="rightText">{projectInfo.employmenttype}</div>
                        </div>
                        {projectInfo.company!=="undefined" ?
                          <div className="paragraphSpaceBetween">
                            <div>Company</div> 
                            <div className="rightText companyLink" onClick={()=> navigate("/company-profile", {state: {companyinfo: projectInfo.employer?.companyinfo, employer: projectInfo.employer._id}})}><u>{projectInfo.employer?.companyinfo?.companyname}</u></div>
                          </div>
                        : 
                        <div className="paragraphSpaceBetween">
                          <div>Company</div> 
                          <div className="rightText"><i>Not specified.</i></div>
                        </div>
                        }
                        <div className="paragraphSpaceBetween">
                          <div>Sallary</div> 
                          <div className="rightText">₱ {new Intl.NumberFormat().format(projectInfo.sallary.toFixed(2))}
                          </div>
                        </div>
                        <div className="paragraphSpaceBetween">
                          <div>Duration</div> 
                          <div className="rightText">{projectInfo.duration} months</div>
                        </div>
                        <div className="paragraphSpaceBetween">
                          <div>Location</div> 
                          <div className="rightText">
                            {projectInfo.location?.city}, {projectInfo.location?.province}, <br/>
                            {projectInfo.location?.region}
                          </div>
                        </div>
                        <div className="paragraphSpaceBetween">
                          <div>Minimum requirements</div> 
                          <div className="rightText">
                            {projectInfo.minimumreq.map((a)=> {
                              if (a.what==="Others") {
                                return <><label>{a.note}</label><br/></>
                              } else {
                                return <><label>{a.what}</label><br/></>
                              }
                            })}
                          </div>
                        </div>
                        <div>
                          <label>Description:</label>
                          <div className="fromTextAreaContainer">
                          <p className="fromTextArea">{projectInfo.description}</p>
                          </div>
                        </div>
                        {accepted ? 
                          <>
                            <div className="paragraphSpaceBetween">
                              <div>Start</div> 
                              <div className="rightText">{moment(projectInfo.acceptdate).format("MMM. DD, YYYY")}</div>
                            </div>
                            <div className="paragraphSpaceBetween">
                              <div>Expected end</div> 
                              <div className="rightText">{moment(expectedDate).format("MMM. YYYY")}</div>
                            </div>
                          </>
                        :<></>}
                        {!ongoing && !hiring ? 
                          <div className="paragraphSpaceBetween">
                            <div>Date concluded</div> 
                            <div className="rightText">{moment(projectInfo.completiondate).format("MMM. DD, YYYY")}</div>
                          </div>
                        :<></>}
                      </div> 
                    </div>
                    <br/>
                    <div className="projectCardMid">
                      {hiring && isFree && theEmp ?
                        <div className="actionButtonWrapper">
                          <button className="btn btn-outline-success allButtons" onClick={()=> {
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
                      :<></>}

                      {(ongoing || !ongoing) && (theEmp || theAdmin) ? 
                        <div className="actionButtonWrapper">
                          <button className="btn btn-outline-success allButtons" onClick={()=>{
                            if (openApplicants===false) {
                              setOpenApplicants(true)
                            }
                            if (openApplicants===true) {
                              setOpenApplicants(false)
                            }
                          }}>
                            Applicant(s)
                          </button>
                        </div>
                      :<></>}
                    
                      {(ongoing || !ongoing) && (theEmp || theAdmin) ? 
                        <div className="actionButtonWrapper">
                          <button className="btn btn-outline-success allButtons" onClick={()=>{
                            if (openEmployees===false) {
                              setOpenEmployees(true)
                            }
                            if (openEmployees===true) {
                              setOpenEmployees(false)
                            }
                          }}>
                            Employee(s)
                          </button>
                        </div>
                      :<></>}
                  
                      {!aJob && (ongoing || !ongoing) && accepted ?
                        <div className="actionButtonWrapper">
                          <button className="btn btn-outline-success allButtons" onClick={()=>{
                            if (openProgress===false) {
                              setOpenProgress(true)
                            }
                            if (openProgress===true) {
                              setOpenProgress(false)
                            }
                          }}>
                            Project Progress
                          </button>
                        </div>
                      :<></>}

                      {ongoing && theEmp && (
                        <div className="actionButtonWrapper">
                          <button className="btn btn-outline-success allButtons" onClick={()=>{
                            if (ending===false) {
                              setEnding(true)
                            }
                            if (ending===true) {
                              setEnding(false)
                            }
                          }}>
                            Accomplish {projectInfo.type}
                          </button>
                          {ending && (
                                  <form onSubmit={endProject}>
                                    <div>
                                      <p>Please type "Accomplished" to proceed.</p>
                                      <input onChange={e => setEnd(e.target.value)} value={end} type="text"/>
                                    </div>
                                    <div>
                                      <button className="allButtons">Confirm</button>
                                    </div>
                                  </form>
                                )}
                              </div>
                              )}

                            {ongoing && theAdmin && (
                              <div className="actionButtonWrapper">
                                <button className="allButtons actionButton" onClick={()=>{
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
                                    <button className="allButtons">Confirm</button>
                                  </form>
                                )}
                              </div>
                            )}
                        
                        
                        {ongoing && theFree ?
                          <div className="actionButtonWrapper">
                            <button className="allButtons actionButton" onClick={()=>{
                              if (userData.token === undefined) {
                                toastWarningNotification(),
                                window.setTimeout(()=>navigate("/login", {}), 3000)
                              } else {
                                startConversation()
                              }
                            }}>
                              Chat Employer
                            </button>
                          </div>
                        : <></>}
                    </div>

                    <div className="centerContent">
                      {hiring && !accepted && !rejected && theFree ?
                        <div>
                          <p>Looks like you got the attention of {projectInfo.company}, and they want to hire you directly. Decide now what happens to the offer. 
                          <button className="btn btn-outline-success allButtons" onClick={()=> {acceptedYes(), setAccepted(true)}}>
                            Accept {projectInfo.type}
                          </button>
                          <button className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=> setToCancel(true)}>
                            Reject {projectInfo.type}
                          </button>
                          </p>
                        </div>
                      :<></>}
                    </div>

                    <div className="centerContent">
                      {toCancel ?
                        <div className="projectCardTopDetails">
                          <div>
                            <label>Please explain why are you declining the offer.</label>
                          </div>
                          <div>
                            <textarea required rows = "5" cols = "40" onChange={e => setNote(e.target.value)} value={note} type="text" className="" placeholder="Your explanation..." />
                          </div>
                          <div className="centerContent">
                            <button className="btn btn-sm btn-outline-success allButtons limitWideButtons" onClick={()=>acceptedNo()}>Confirm</button>
                          </div>
                        </div>
                      :<></>}
                    </div>

                    <div>
                      {hiring && toApply===true ?
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
                                  projectInfo={projectInfo}
                                  setProjectInfo={setProjectInfo}
                                  projecttype={projectInfo?.type}/>
                                </div>
                              )} 
                            </div>  
                            )}
                          </div>

                          <div className="centerContent">
                            {!applied ? 
                              <div>
                                {toApply!==true ?
                                  <div>
                                {userData?.user?.type==="Candidate" ?
                                  <div>
                                    <button className="btn btn-sm btn-outline-success applyButton" onClick={()=> {setToApply(true)}}>
                                      Apply Now!
                                    </button>
                                  </div>
                                :<></>}
                                  </div>
                                :<></>}
                              </div>
                            :<></>}
                          </div>

                          <div className="centerContent">
                            {!userData.token ? 
                              <div>
                                  <button className="btn btn-sm btn-outline-success applyButton" onClick={()=>{
                                      toastWarningNotification(),
                                      window.setTimeout(()=>navigate("/login", {}), 2000)
                                  }}>
                                      Apply Now!
                                  </button>
                              </div>
                            :<></>}
                          </div>
                        </div>
                      : <></>} 
                    </div>

                        {theEmp ?
                          <div>
                            {openApplicants==true ?
                              <div>
                                <div className="horizontal_line"></div>
                                <div className="contentTitle">
                                  <label><b>Current Applications: </b></label>
                                </div>
                                <br/>
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
                          </div>
                        :<></>}
                        <br />
                        <div>
                          {theEmp ?
                            <div>
                              {projectInfo?.notes ?
                                <div>
                                  {projectInfo?.notes.map(function(a) {
                                    <p><b>Request refusal:</b></p>
                                    return (
                                      <div className="notif" key={a._id}>
                                        <div className="notifTop">
                                            <div>
                                              <img className="messageImg" src={a.notesender.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${a.notesender.image}.jpg` : "/fallback.png"}></img>
                                            </div>
                                            <div>
                                                {a.notesender?.firstname} {a.notesender.middlename ? a.notesender.middlename.charAt(0).toUpperCase() + ". " : "" }{a.notesender?.lastname} declined your offer with a reason of: { a.note}
                                            </div>
                                        </div>
                                        <div className="notifBot">
                                            <button className="btn btn-outline-success allButtons" onClick={()=> {
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

                    {(openEmployees===true) && (theEmp || theAdmin) ?
                      <div>
                        <div className="horizontal_line"></div>
                        <div className="contentTitle">
                          <label><b>List of Employee(s): </b></label>
                        </div>
                        {projectInfo?.employeelist[0] ? 
                          <div className="notifList">
                            {projectInfo?.employeelist.map(function(a) {
                              return <EmployeeList 
                                      _id={a._id}
                                      beganAt={a.beganAt}
                                      key={idPlusKey(a._id, userData.user.id)} 
                                      employeeid ={a.employeeid} 
                                      employer ={projectInfo?.employer?._id} 
                                      projectid={location.state._id} 
                                      isFree={isFree}
                                      employmentstatus={a.employmentstatus}
                                      setModalOpen={setModalOpen}
                                      setToEndContract={setToEndContract}
                                      theEmp={theEmp}
                                      writeReview={writeReview}
                                      setWriteReview={setWriteReview}
                                      setStatusToReview={setStatusToReview}
                                      />
                              })}
                          </div>
                        : <span>No employee at the moment.</span>}
                      </div>
                    :<></>}

                    {!aJob && (ongoing || !ongoing) && accepted ?
                      <div>
                        {openProgress && (
                          <div className="centerContent">
                            <ProjectUpdates 
                              projectid={location.state._id} 
                              employer={projectInfo?.employer ? projectInfo.employer._id : ""} 
                              freelancer={projectInfo?.employeelist[0] ? projectInfo.employeelist[0].employeeid : ""}
                              ongoing={ongoing}
                              socket={socket}/>
                          </div>
                        )}
                      </div>
                    :<></>}

                    <div>
                      {statusToReview==="Concluded" && theEmp && writeReview ?
                          <div>
                            <Review 
                              projectid={location.state._id}  
                              toEndContract={toEndContract}
                              setWriteReview={setWriteReview}
                            />
                          </div>
                      :<></>}
                    </div> 
              </div>
            )}
            <ToastContainer />
        </div>
    )
}

export default Project

/*
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
                        </div>*/