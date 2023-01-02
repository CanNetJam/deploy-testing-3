import React, {useState, useEffect, useContext} from "react"
import Axios from "axios"
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from "../home"
import RatingsAndReviews from "../components/Ratings&Reviews"
import Gallery from "../components/Gallery"
import moment from "moment"

function SearchProfile({socket}) {
    const location = useLocation()
    let navigate = useNavigate()
    const { userData, setUserData } = useContext(UserContext)
    const [ searchInfo, setSearchInfo ] = useState()
    const [ project, setProject ] = useState()
    const [ occupied, setOccupied ] = useState(false)
    const [ currentprj, setCurrentPrj ] = useState(0)
    const [ available, setAvailable ] = useState(true)

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
            if (location?.state?.projecttype==="Job" && occupied) {
                setAvailable(false)
            }
            if (location?.state?.projecttype==="Project" && currentprj>=3) {
                setAvailable(false)
            }
            setProject(location?.state?.projectid ? location.state.projectid : null)
          } catch (err) {
            console.log(err)
          }
        }
        getUserData()
    }, [])

    async function addCandidate() {
        const projectid = project
        const candidate = searchInfo.id
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
                alert(`Successfully sent a ${projecttype} hiring request. You can now wait for the candidate's approval. For the meantime, you can leave a message to them by clicking on the Start Conversation! button.`)
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
                
                alert(`Successfully sent a ${projecttype} hiring request. For the meantime, you can leave a message to them by clicking on the Start Conversation! button.`)
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

    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }
    
    return (
        <div className="profileCard">
            {searchInfo && (
                <div className="searchProfile">
                    <div className="searchProfileTop">
                        <div>
                            <div className="profile-ProfilePhotoWrapper">
                                <img className="card-img-top profile-ProfilePhoto" src={searchInfo.photo ? `/uploaded-photos/${searchInfo.photo}` : "/fallback.png"} alt={`${searchInfo.age} named ${searchInfo.lastname}`} />
                            </div>
                            <br />
                            <div className="searchProfileMid">
                                {available ? 
                                    <div>
                                        {userData?.user?.type==="Employer" && (
                                            <div>
                                                <button className="btn btn-sm btn-primary" onClick={()=>{
                                                    if (project) {
                                                        addCandidate()
                                                    }
                                                    if (!project) {
                                                        alert("Please select the job or project to hire the candidate first.")
                                                        navigate("/project-list")
                                                    }
                                                }}>Hire Now!</button>
                                            </div>
                                        )}
                                    </div>
                                :<>You can not hire this person at the moment because the person is currently occupied.</>}

                                {!userData.token && (
                                    <div>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            alert("Please login to continue."), 
                                            navigate("/login", {})}}>
                                            Hire Now!
                                        </button>
                                    </div>
                                )}

                                {userData?.user?.id!==searchInfo?.id ?
                                    <div>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            if (userData.token === undefined) {
                                                alert("Please login to continue.")
                                                navigate("/login", {})
                                            } else {
                                                startConversation()
                                            }
                                        }}>Start a Conversation!</button>
                                    </div>
                                : <></>}
                            </div>
                        </div>

                        <div className="profileCardTextWrapper">
                            <div className="profileCardText">
                                <h4><b>{searchInfo.type}: </b> {searchInfo.firstname} {searchInfo.middlename?.charAt(0).toUpperCase()}. {searchInfo.lastname}</h4>
                                <p className="text-muted small">Age: {searchInfo.age}</p>
                                <p className="text-muted small">Adress: {searchInfo.address}</p>
                                <p className="text-muted small"> Skills: {searchInfo.skill?.map((a)=> {
                                return <label key={idPlusKey(searchInfo.id, a)}>{a}, </label>
                                })} </p>
                                <p className="text-muted small">About: {searchInfo.about}</p>
                            </div>
                            <div className="profileCardText">
                                {searchInfo.currentprojects[0] ? 
                                    <div>
                                        <div>
                                            {currentprj!==0 ? 
                                                <div>
                                                    <label>Number of Ongoing Projects: {currentprj} Project(s)</label>
                                                    {searchInfo?.currentprojects?.map((a)=> {
                                                        if (a.type ==="Project") {
                                                            return (
                                                                <div key={idPlusKey(searchInfo.id, a.title)}>
                                                                    <p>{a.type}: {a.title}<br />
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
                                        <div>
                                            {occupied ?
                                                <div>
                                                    <label>Number of Ongoing Job: 1 Job</label>
                                                    {searchInfo?.currentprojects?.map((a)=> {
                                                        if (a.type ==="Job") {
                                                            return (
                                                                <div key={idPlusKey(searchInfo.id, a.title)}>
                                                                    <p>{a.type}: {a.title}<br />
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
                        </div>
                    </div>
                    
                    <div>
                        <div>
                            <Gallery candidate={searchInfo?.id}/>
                        </div>
                        <div>
                            <RatingsAndReviews ratings={searchInfo.ratings} averagerating={searchInfo.averagerating} candidate={searchInfo?.id}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchProfile

