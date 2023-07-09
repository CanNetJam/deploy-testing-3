import React, {useState, useEffect, useContext, useRef } from "react"
import Axios from "axios"
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from "../home"
import RatingsAndReviews from "../components/Ratings&Reviews"
import Gallery from "../components/Gallery"
import CompanyProfile from "../components/CompanyProfile"
import moment from "moment"
import {format} from "timeago.js"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function SearchProfile({socket}) {
    const cloud_name = "dzjkgjjut"
    const location = useLocation()
    let navigate = useNavigate()
    const { userData, setUserData } = useContext(UserContext)
    const [ searchInfo, setSearchInfo ] = useState()
    const [ project, setProject ] = useState()
    const [ occupied, setOccupied ] = useState(false)
    const [ currentprj, setCurrentPrj ] = useState(0)
    const [ available, setAvailable ] = useState(true)
    const [ requested, setRequested ] = useState(false)
    const [ reload, setReload ] = useState()
    const topPage = useRef(null)

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
        const user = location?.state?._id
        const getUserData = async () => {
          try {
            const res = await Axios.get(`/api/search-profile/${user}`)
            res.data.currentprojects.map((a)=> {
                if (a.type==="Job") {
                    setOccupied(true)
                }
                if (a.type==="Project") {
                    setCurrentPrj(prev => prev+1)
                }
            })
            setSearchInfo(res.data)
            setProject(location?.state?.projectid ? location.state.projectid : null)
          } catch (err) {
            console.log(err)
          }
        }
        getUserData()
    }, [])

    useEffect(() => {
        const user = location?.state?._id
        const getUserData = async () => {
          try {
            if (!userData.token) {
                setAvailable(true)
            }
            if (location?.state?.projecttype==="Job" && occupied) {
                setAvailable(false)
            }
            if (location?.state?.projecttype==="Project" && currentprj>=3) {
                setAvailable(false)
            }
            location?.state?.projectInfo?.tempcandidate.map((a)=> {
                if (a.applicantid._id===user) {
                    setRequested(true)
                }
            })
            setProject(location?.state?.projectid ? location.state.projectid : null)
          } catch (err) {
            console.log(err)
          }
        }
        getUserData()
    }, [occupied, currentprj, reload])

    async function addCandidate() {
        const projectid = project
        const candidate = searchInfo._id
        const toHire = location?.state?.toHire
        const projecttype = location?.state?.projecttype ? location.state.projecttype : ""
        
        if (location?.state?.toHire==="No") {
            try {
                const res = await Axios.post(`/api/add-candidate/${projectid}/${candidate}`)
                const subject = res.data._id
                const type = `${projecttype} Hiring Request`
                const action = "sent a"
                await Axios.post(`/api/send-notifications/${userData.user.id}/${candidate ? candidate : ""}/${action}/${type}/${subject}`)
                socket.emit("sendNotification", {
                    senderId: userData.user.id,
                    receiverId: candidate,
                    subject: subject,
                    type: type,
                    action: action,
                })
                setReload(res.data)
                
                toastSucessNotification(projecttype)
            } catch (err) {
                console.log(err)
            }  
        }
        if (location?.state?.toHire==="Yes") {
            try {
                const res = await Axios.post(`/api/update-project/accepted/${projectid}/${candidate}/${toHire}`)
                //notif for the hired candidate
                const subject = res.data._id
                const type = `${projecttype} Hiring Request`
                let action = "accepted your"
                await Axios.post(`/api/send-notifications/${userData.user.id}/${candidate}/${action}/${type}/${subject}`)
        
                socket.emit("sendNotification", {
                  senderId: userData.user.id,
                  receiverId: candidate,
                  subject: subject,
                  type: type,
                  action: action,
                })

                //notif for not hired candidate
                location?.state?.applicants?.map(async (a)=> {
                    if (a.applicantid._id !== candidate) {
                        action = "declined"
                        await Axios.post(`/api/send-notifications/${userData.user.id}/${a.applicantid._id}/${action}/${type}/${subject}`)

                        socket.emit("sendNotification", {
                            senderId: userData.user.id,
                            receiverId: a.applicantid._id,
                            subject: subject,
                            type: type,
                            action: action,
                        })
                    }
                })
                toastHireSucessNotification()
            } catch (err) {
                console.log(err)
            }
        }
    }

    async function startConversation() {
        const members = [userData.user.id, searchInfo?.id]
        try {
            const prevConvo = await Axios.get("/api/get-conversation/", {params: {
                member1: userData.user.id,
                member2: searchInfo?.id
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

    function expectedMonth(props){
        let a = Number(moment(props.acceptdate).format("MM"))
        let c = Number(moment(props.acceptdate).format("YYYY"))
        let d = props.duration
        let total = a
        if (d<=12) {
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

    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }

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

    function toastWarning2Notification() {
        toast.warn('Select a job or project first to hire the candidate.', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })
    }

    function toastSucessNotification(props) {
        toast.success(`Successfully sent a ${props} hiring request.`, {
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

    function toastHireSucessNotification() {
        toast.success(`Hiring success.`, {
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
    
    return (
        <div className="profileCard">
            <div ref={topPage}></div>
            {searchInfo && (
                <div className="searchProfile">
                    <div className="searchProfileTop">
                        <div>
                            <div className="profile-ProfilePhotoWrapper">
                                <img src={searchInfo.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${searchInfo.image}.jpg` : "/fallback.png"} className="card-img-top profile-ProfilePhoto" alt={`${searchInfo.age} named ${searchInfo.lastname}`}></img>
                            </div>
                        </div>
                        <div className="profileCardTextWrapper">
                            <div className="profileCardText">
                                <p className="profileCardName"> {searchInfo.firstname} {searchInfo.middlename ? searchInfo.middlename?.charAt(0).toUpperCase()+ ". " : null} {searchInfo.lastname}</p>
                                <p className="text-muted small">Active {format(searchInfo.lastactive)}.</p>
                                <p>Designation: {searchInfo.type}<br/>
                                Location: {searchInfo.location?.region}<br/>
                                Skills: {searchInfo.skill?.map((a)=> {
                                return <label key={idPlusKey(searchInfo._id, a)}>{a}, </label>
                                })}<br/>
                                Member since: {searchInfo.createdAt ? searchInfo.createdAt : "Not specified."}<br/>
                                About: {searchInfo.about}</p>
                            </div>
                        </div>

                        <div>
                            {userData?.user?.type==="Employer" && (
                                <>
                                    {available ?
                                        <>
                                            {requested===false ? 
                                                <div className="searchProfileMidOptions">
                                                    <button className="btn btn-outline-success allButtons" onClick={()=>{
                                                        if (project) {
                                                            addCandidate()
                                                        }
                                                        if (!project) {
                                                            toastWarning2Notification(),
                                                            window.setTimeout(()=>navigate("/project-list", {}), 4000)
                                                        }
                                                    }}>Hire Now!</button>
                                                </div>
                                            : <>
                                                <button className="btn btn-sm btn-outline-secondary cancelBtn">Cancel Request</button>
                                            </>}
                                        </>
                                    :<div className="searchProfileMidOptions">
                                        <p className="notAvailable"><i>Fully occupied, cannot be hired right now.</i></p>
                                    </div>}
                                </>
                            )}

                            {!userData.token && available && (
                                <div className="searchProfileMidOptions">
                                    <button className="btn btn-outline-success allButtons" onClick={()=>{
                                        toastWarningNotification(),
                                        window.setTimeout(()=>navigate("/login", {}), 3000)}}>
                                        Hire Now!
                                    </button>
                                </div>
                            )}

                            {userData?.user?.id!==searchInfo?.id ?
                                <div className="searchProfileMidOptions">
                                    <button className="btn btn-outline-success allButtons" onClick={()=>{
                                        if (userData.token === undefined) {
                                            toastWarningNotification(),
                                            window.setTimeout(()=>navigate("/login", {}), 3000)
                                        } else {
                                            startConversation()
                                        }
                                    }}>Start a Conversation!</button>
                                </div>
                            : <></>}
                        </div>
                    </div>
                    
                    <div className="horizontal_line"></div>
                    <div className="profileCardText">
                        {searchInfo.currentprojects[0] ? 
                            <div>
                                <div>
                                    {currentprj!==0 ? 
                                        <div>
                                            <label className="currentProjectLabel">Current Project(s)</label>
                                            <div className="currentProjectList">
                                            {searchInfo?.currentprojects?.map((a)=> {
                                                if (a.type ==="Project") {
                                                    return (
                                                        <div className="currentProject" key={idPlusKey(searchInfo.id, a.title)}>
                                                            <p>{a.type}: <b>{a.title}</b><br />
                                                            Duration: {a.duration} month(s)<br />
                                                            Began at: {moment(a.acceptdate).format("MMM. DD, YYYY")}<br />
                                                            Expected to end at: {moment(expectedMonth(a)).format("MMM. YYYY")}</p>
                                                        </div>
                                                    )
                                                }
                                            })}
                                            </div>
                                        </div>
                                    :<></>}
                                </div>
                                <div>
                                    {occupied ?
                                        <div>
                                            <label className="currentProjectLabel">Current Job</label>
                                            {searchInfo?.currentprojects?.map((a)=> {
                                                if (a.type ==="Job") {
                                                    return (
                                                        <div className="currentProject" key={idPlusKey(searchInfo.id, a.title)}>
                                                            <p>{a.type}: <b>{a.title}</b><br />
                                                            Duration: {a.duration} month(s)<br />
                                                            Began at: {moment(a.acceptdate).format("MMM. DD, YYYY")}<br />
                                                            Expected to end at: {moment(expectedMonth(a)).format("MMM. YYYY")}</p>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    :<></>}
                                </div>
                            </div>
                        : <>This user has no ongoing jobs or projects.</>}
                    </div>
                    {location.state.type && location.state.type==="Employer" ? 
                        <CompanyProfile employer={location.state._id}/>
                    :
                    <div>
                        <div>
                            <Gallery candidate={searchInfo._id}/>
                        </div>
                        <div>
                            <RatingsAndReviews ratings={searchInfo.ratings} averagerating={searchInfo.averagerating} candidate={searchInfo._id}/>
                        </div>
                    </div>
                    }
                </div>
            )}
            <ToastContainer />
        </div>
    )
}

export default SearchProfile

