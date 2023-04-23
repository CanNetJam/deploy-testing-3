import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../home"
import { useNavigate } from "react-router-dom"
import {format} from "timeago.js"
import moment from "moment"
import Axios from "axios"

function ApplicantList(props) {
    let navigate = useNavigate()
    const cloud_name = "dzjkgjjut"
    const { userData, setUserData } = useContext(UserContext)
    const [ answers, setAnswers ] = useState([])
    const [ allAnswers, setAllAnswers ] = useState(false)
    
    useEffect(() => {
        const Answered = async () => {
          try {
            const res = await Axios.get(`/api/answers/${props.applicantid?._id}/${props.projectid}`)
            setAnswers([res.data])
          } catch (err) {
            console.log(err)
          }
        }
        Answered()
    }, [])

    async function redirectTo() {
        if (userData.user.id===props.employer) {
            navigate("/search-profile", {state: {_id: props.applicantid?._id, projectid: props.projectid ? props.projectid : null, toHire: "Yes", applicants: props.applicants }})
        }
    }

    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }

    return (
        <div>
        <div className="notif">
            <div className="notifTop">
                <div>
                    <img className="messageImg" src={props.applicantid.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${props.applicantid.image}.jpg` : "/fallback.png"} alt={`${props.applicantid.lastname}`}></img>
                </div>
                <div>
                    <b>{props.applicantid?.firstname} {props.applicantid.middlename ? props.applicantid.middlename.charAt(0).toUpperCase() + ". " : "" }{props.applicantid?.lastname}</b>
                </div>
                <div>
                    {moment(props.appliedAt).format("ddd: MMM. DD, YYYY")} | ({format(props.appliedAt)})
                </div>
            </div>
            <div className="notifBot">
                <div>
                    <button type="button" onClick={()=>redirectTo()} className="btn btn-outline-success allButtons">
                        Profile
                    </button>
                    <button type="button" onClick={()=>{
                        if (allAnswers===false) {
                            setAllAnswers(true)
                        }
                        if (allAnswers===true) {
                            setAllAnswers(false)
                        }
                    }} className="btn btn-outline-success allButtons">
                        Answers
                    </button>
                </div>
            </div>
        </div>

        <div>
            {allAnswers ?
                <div className="currentProjectList">
                    {answers[0]?.answers.map((a)=> {
                        if (a!=="") {
                            return (
                                <div className="currentProject" key={idPlusKey(a , props.applicantid?._id)}>
                                    <label>Question {1+(props.questions.indexOf(props.questions[answers[0].answers.indexOf(a)]))}: {props.questions[answers[0].answers.indexOf(a)]}</label>
                                    <p>{props.applicantid?.firstname}: {a}</p>
                                </div>
                            )
                        }
                    })}
                </div>
            :<></>}
        </div>

        </div>
    )
}

export default ApplicantList