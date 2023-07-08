import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../home"
import { useNavigate } from "react-router-dom"
import Axios from "axios"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from "moment"

function EmployeeList(props) {
    let navigate = useNavigate()
    const cloud_name = "dzjkgjjut"
    const { userData, setUserData } = useContext(UserContext)
    const [ reviewed, setReviewed ] = useState(false)
    const [ openEmployee, setOpenEmployee ] = useState(false)

    useEffect(() => {
        const projectid = props.projectid
        const candidate = props.employeeid?._id 
        const getReviewData = async () => {
            try {
                const res = await Axios.get(`/api/reviews/${projectid}/${candidate}`)
                setReviewed(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getReviewData()
    }, [])

    async function redirectTo() {
        if (userData.user.id===props.employer) {
            navigate("/search-profile", {state: {_id: props.employeeid?._id, projectid: props.projectid ? props.projectid : null, toHire: "Yes"}})
        }
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

    async function startConversation() {
        const members = [props.employeeid?._id, userData.user?.id]
        try {
            const prevConvo = await Axios.get("/api/get-conversation/", {params: {
                member1: props.employeeid?._id,
                member2: userData.user?.id
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
    
    return (
        <div className="employeeListWrapper">
            <div className="employeeList">
                <div className="employeeListTop">
                    <div>
                        <img className="messageImg" src={props.employeeid.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${props.employeeid.image}.jpg` : "/fallback.png"} alt={`${props.employeeid.lastname}`}></img>
                    </div>
                    <div>
                        {props.employeeid?.firstname} {props.employeeid.middlename ? props.employeeid.middlename.charAt(0).toUpperCase() + ". " : "" }{props.employeeid?.lastname}
                    </div>
                </div>
                <div className="employeeListBot">
                    <label className="employeeListMore" onClick={()=> {
                        if (openEmployee===false) {
                            setOpenEmployee(true)
                        }
                        if (openEmployee===true) {
                            setOpenEmployee(false)
                        }
                    }}><b>...</b></label>
                </div>
            </div>
            {openEmployee===true ? 
                <div className="employeeList">
                    <div className="employeeListTop">
                        <label>Employment date: {moment(props.beganAt).format("MMM. DD, YYYY")} </label>
                    </div>
                    <div className="employeeListBot">
                        <div>
                            <button type="button" onClick={()=>redirectTo()} className="btn btn-outline-success allButtons">
                                Profile
                            </button>
                        </div>
                        <div>
                            <button className="btn btn-outline-success allButtons" onClick={()=>{
                                if (userData.token === undefined) {
                                    toastWarningNotification()
                                    navigate("/login", {})
                                } else {
                                    startConversation()
                                }
                            }}>Chat</button>
                        </div>
                    {props.employmentstatus==="Ongoing" &&(
                        <div>
                            <button onClick={() => {
                                props.setModalOpen(true)
                                props.setToEndContract(props.employeeid)
                            }}
                            type="button" className="btn btn-outline-success allButtons">
                                End Contract
                            </button>
                        </div>
                    )}
                    {props.employmentstatus==="Concluded" && reviewed===false && props.theEmp && (
                        <div>
                            <button className="btn btn-outline-success allButtons" onClick={()=> {
                                if(props.writeReview===false) {
                                    props.setWriteReview(true)
                                    props.setToEndContract(props.employeeid)
                                    props.setStatusToReview(props.employmentstatus)
                                }
                                if(props.writeReview===true) {
                                    props.setWriteReview(false)
                                }
                            }}>
                                Write a Review
                            </button>
                        </div>
                    )}
                    </div>
                </div>
            : null}
            <ToastContainer />
        </div>
    )
}

export default EmployeeList