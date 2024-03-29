import React, {useState, useEffect, useContext} from "react"
import Axios from "axios"
import {UserContext} from "../home"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Questions(props) {
    const { userData, setUserData } = useContext(UserContext)
    const [ candidate, setCandidate ] = useState(false)
    const [ answerNow, setAnswerNow ] = useState(true)
    const [ answered, setAnswered ] = useState(false)
    const [ answer1, setAnswer1 ] = useState("")
    const [ answer2, setAnswer2 ] = useState("")
    const [ answer3, setAnswer3 ] = useState("")
    const [ answer4, setAnswer4 ] = useState("")
    const [ answer5, setAnswer5 ] = useState("")
    const [ answer6, setAnswer6 ] = useState("")
    const [ answer7, setAnswer7 ] = useState("")
    const [ answer8, setAnswer8 ] = useState("")
    const [ answer9, setAnswer9 ] = useState("")
    const [ answer10, setAnswer10 ] = useState("")

    useEffect(() => {
        const getCandidate = async () => {
          try {
            props.applicants.map((a)=> {
                if (a.applicantid?._id===userData.user?.id) {
                    setCandidate(true)
                }
            })
          } catch (err) {
            console.log(err)
          }
        }
        getCandidate()
    }, [])

    useEffect(() => {
        const Answered = async () => {
          try {
            const res = await Axios.get(`/api/answers/${userData.user.id}/${props.projectid}`)
            if (res.data) {
                setAnswered(true)
            }
            if (!res.data) {
                setAnswered(false)
            }
          } catch (err) {
            console.log(err)
          }
        }
        Answered()
    }, [])

    async function submitHandler(e) {
        e.preventDefault()
        Axios.post(`/api/answers/${userData.user.id}/${props.projectid}`, {answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10})
        setAnswered(true)
    }

    async function applyNow() {
        const projectid = props.projectid
        const tempfree = userData?.user?.id
        const appliedAt = Date.now()
        try {
          const res = await Axios.post(`/api/update-project/apply/${projectid}/${tempfree}/${appliedAt}`)
          const subject = res.data._id
          const type = `${props.type} Hiring`
          const action = "applied for your"
          await Axios.post(`/api/send-notifications/${userData.user.id}/${props.employer}/${action}/${type}/${subject}`)
  
          props.socket.emit("sendNotification", {
            senderId: userData.user.id,
            receiverId: props.employer,
            subject: subject,
            type: type,
            action: action,
          })
          toastSucessNotification()
          props.setApplied(true)
          props.setToApply(false)
        } catch (err) {
          console.log(err)
        }
    }

    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }

    function toastSucessNotification() {
        toast.success("Sucssfully sent an application request. Wait for the employer's approval.", {
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
        <div>
            <div className="horizontal_line"></div>
            {answerNow==false ?
                <div>
                    <p>Interview Questions</p>
                    {props.questions?.map((a)=> {
                        return (
                            <div key={idPlusKey(props.projectid, props.questions.indexOf(a)) }>
                                <p><label>Question #{1+(props.questions.indexOf(a))}: </label>
                                {a}</p>
                            </div>
                        )
                    })}
                </div>
            :<></>}
            {answerNow===true ?
                <div>
                    <form className="settingsForm" onSubmit={submitHandler}>
                        <p>Please answer the questions provided by the employer carefully.</p>
                        
                        <div className="mb-2">
                            <p>Question #1: {props.questions[0]}</p>
                            <label>Answer:</label>
                            <input required onChange={e => setAnswer1(e.target.value)} value={answer1} type="text" className="form-control"/>
                        </div>
                        <br />
                        <div className="mb-2">
                            <p>Question #2: {props.questions[1]}</p>
                            <label>Answer:</label>
                            <input required onChange={e => setAnswer2(e.target.value)} value={answer2} type="text" className="form-control"/>
                        </div>
                        <br />
                        <div className="mb-2">
                            <p>Question #3: {props.questions[2]}</p>
                            <label>Answer:</label>
                            <input required onChange={e => setAnswer3(e.target.value)} value={answer3} type="text" className="form-control"/>
                        </div>
                        <br />
                        {props.questions[3]!=="" ?
                            <div className="mb-2">
                                <p>Question #4: {props.questions[3]}</p>
                                <label>Answer:</label>
                                <input required onChange={e => setAnswer4(e.target.value)} value={answer4} type="text" className="form-control"/>
                            </div>
                        :<></>}
                        {props.questions[4]!=="" ?
                            <div className="mb-2">
                                <p>Question #5: {props.questions[4]}</p>
                                <label>Answer:</label>
                                <input required onChange={e => setAnswer5(e.target.value)} value={answer5} type="text" className="form-control"/>
                            </div>
                        :<></>}
                        {props.questions[5]!=="" ?
                            <div className="mb-2">
                                <p>Question #6: {props.questions[5]}</p>
                                <label>Answer:</label>
                                <input required onChange={e => setAnswer6(e.target.value)} value={answer6} type="text" className="form-control"/>
                            </div>
                        :<></>}
                        {props.questions[6]!=="" ?
                            <div className="mb-2">
                                <p>Question #7: {props.questions[6]}</p>
                                <label>Answer:</label>
                                <input required onChange={e => setAnswer7(e.target.value)} value={answer7} type="text" className="form-control"/>
                            </div>
                        :<></>}
                        {props.questions[7]!=="" ?
                            <div className="mb-2">
                                <p>Question #8: {props.questions[7]}</p>
                                <label>Answer:</label>
                                <input required onChange={e => setAnswer8(e.target.value)} value={answer8} type="text" className="form-control"/>
                            </div>
                        :<></>}
                        {props.questions[8]!=="" ?
                            <div className="mb-2">
                                <p>Question #9: {props.questions[8]}</p>
                                <label>Answer:</label>
                                <input required onChange={e => setAnswer9(e.target.value)} value={answer9} type="text" className="form-control"/>
                            </div>
                        :<></>}
                        {props.questions[9]!=="" ?
                            <div className="mb-2">
                                <p>Question #10: {props.questions[9]}</p>
                                <label>Answer:</label>
                                <input required onChange={e => setAnswer10(e.target.value)} value={answer10} type="text" className="form-control"/>
                            </div>
                        :<></>}
                        <div>
                            <button onClick={()=> applyNow()} className="btn btn-sm btn-outline-success allButtons">Send Application</button>
                            <button onClick={()=> props.setToApply(false)} type="button" className="btn btn-sm btn-outline-secondary cancelBtn">Cancel</button>
                        </div>
                    </form>
                </div>
            :<></>}
            <ToastContainer />
        </div>
    )
}

export default Questions