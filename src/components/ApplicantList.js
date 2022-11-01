import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../home"
import { useNavigate } from "react-router-dom"
import {format} from "timeago.js"
import moment from "moment"
import Axios from "axios"

function ApplicantList(props) {
    let navigate = useNavigate()
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
                    <img className="messageImg" src={props.applicantid.photo ? `/uploaded-photos/${props.applicantid.photo}` : "/fallback.png"} alt={`${props.applicantid.lastname}`} />
                </div>
                <div>
                    {props.applicantid?.firstname} {props.applicantid.middlename ? props.applicantid.middlename.charAt(0).toUpperCase() + ". " : "" }{props.applicantid?.lastname}
                </div>
            </div>
            <div>
                <button type="button" onClick={()=>redirectTo()} className="btn btn-sm btn-primary">
                    View Profile
                </button>
            </div>
            <div>
                <button type="button" onClick={()=>{
                    if (allAnswers===false) {
                        setAllAnswers(true)
                    }
                    if (allAnswers===true) {
                        setAllAnswers(false)
                    }
                }} className="btn btn-sm btn-primary">
                    View Answers
                </button>
            </div>
            <div className="notifBot">
                {moment(props.appliedAt).format("ddd: MMM. DD, YYYY")} <br></br>({format(props.appliedAt)})
            </div>
        </div>

        <div>
            {allAnswers ?
                <div>
                    <p>{props.applicantid?.firstname}'s Answers:</p>
                    {answers[0]?.answers.map((a)=> {
                        if (a!=="") {
                            return (
                                <div key={idPlusKey(a , props.applicantid?._id)}>
                                    <label>Question #{1+(props.questions.indexOf(props.questions[answers[0].answers.indexOf(a)]))}: {props.questions[answers[0].answers.indexOf(a)]}</label>
                                    <p> Ans: {a}</p>
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