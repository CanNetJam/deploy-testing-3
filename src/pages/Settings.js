import React, { useState, useEffect, useContext, useRef } from "react"
import { UserContext } from "../home"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import BugReports from "../components/Bugreports"
import TagsSettings from "../components/TagsSettings"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Settings(){ 
    let navigate = useNavigate()
    const { userData, setUserData } = useContext(UserContext)
    const [ email, setEmail ] = useState(userData?.user?.email ? userData.user.email : "")
    const [ password, setPassword ] = useState("")
    const [ isVerified, setIsVerified ] = useState(false)
    const [ newPassword, setNewPassword ] = useState("")
    const [ confirmPassword, setConfirmPassword ] = useState("")
    const [ isConfirmed, setIsConfirmed ] = useState()
    const [ samePassword, setSamePassword ] = useState(false)
    const [ correctPass, setCorrectPass ] = useState()
    const [ settingsTab, setSettingsTab ] = useState("Account Settings")
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
        const Confirm = async () => {
            if (password!=="") {
                if (password===newPassword) {
                    setSamePassword(true)
                    if (newPassword!=="" || confirmPassword!=="") {
                        if (newPassword===confirmPassword) {
                            setIsConfirmed(true)
                        }
                        if (newPassword!==confirmPassword) {
                            setIsConfirmed(false)
                        }
                    }
                }
                if (password!==newPassword) {
                    setSamePassword(false)
                    if (newPassword!=="" || confirmPassword!=="") {
                        if (newPassword===confirmPassword) {
                            setIsConfirmed(true)
                        }
                        if (newPassword!==confirmPassword) {
                            setIsConfirmed(false)
                        }
                    }
                }
            }
        }
        Confirm()
    }, [newPassword, confirmPassword])

    function toastSuccessNotification() {
        toast.success('Successfully changed password.', {
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
    
    async function submitHandler(e) {
        e.preventDefault()
        if (isVerified===false) {
            const res = await Axios.get(`/api/account-settings/${userData.user.id}/${email}/${password}`)
            setIsVerified(res.data)
            setCorrectPass(res.data)
        }
        if (isVerified===true) {
            setCorrectPass(true)
            if (samePassword===false) {
                if (isConfirmed===true) {
                    const newPass = await Axios.post(`/api/account-settings/change-password/${userData.user.id}/${newPassword}`)
                    if (newPass.data===true) {
                        setCorrectPass(undefined)
                        setPassword("")
                        setNewPassword("")
                        setConfirmPassword("")
                        setIsVerified(false)
                        toastSuccessNotification()
                    }
                }
            }
        }
    }
    
    return (
        <div className="settings">
            <div ref={topPage}></div>
            <div className="centerContentGrid2">
                <div className="contentTitle">
                    <label><b>{settingsTab}</b></label>
                </div>
                {userData.user.type==="Admin" || userData.user.type==="Super Administrator" ?
                    <>
                        <div className="rightContent">
                            <button onClick={()=>setSettingsTab("Account Settings")} className="btn btn-outline-success allButtons">Account Settings</button>
                            <button onClick={()=>setSettingsTab("System Settings")} className="btn btn-outline-success allButtons">System Settings</button>
                        </div>
                    </>
                :null}
            </div>
            {settingsTab==="Account Settings" && (
                <>
                    <div className="horizontal_line"></div>
                    <p className="profileCardName">Password</p>
                    <div>
                        <div className="centerContent">
                            <label><b>Change Password:</b></label>
                        </div>
                        <form className="settingsForm" onSubmit={submitHandler}>
                            <div className="mb-1">
                                <label>Email:</label>
                                <input required autoFocus onChange={e => setEmail(e.target.value)} type="text" className="form-control form-control-sm" value={email} placeholder="..."/>
                            </div>
                            <div className="mb-1">
                                <label>Please enter password to continue:</label>
                                <input required autoFocus onChange={e => setPassword(e.target.value)} type="password" className="form-control form-control-sm" value={password} />
                            </div>
                            {correctPass===false ?
                                <div>
                                    <label>Incorrect Password!</label>
                                </div> 
                            :<></>}
                            {isVerified===true ?
                                <div>
                                    <div>
                                        <label></label>
                                    </div>
                                    <div className="mb-1">
                                        <label>Enter new password:</label>
                                        <input required autoFocus onChange={e => setNewPassword(e.target.value)} type="password" className="form-control form-control-sm" value={newPassword} />
                                    {samePassword===true ? 
                                        <label>Your new password can not be the same with your old password!</label>
                                    : <></>}
                                    </div>
                                    <div className="mb-1">
                                        <label>Confirm new password:</label>
                                        <input required autoFocus onChange={e => setConfirmPassword(e.target.value)} type="password" className="form-control form-control-sm" value={confirmPassword} />
                                        {isConfirmed===false ? 
                                            <label>New password does not match!</label>
                                        : <></>}
                                    </div>
                                </div>
                            : <></>}
                            <br/>
                            <div className="centerContent">
                                <button className="btn btn-outline-success allButtons">Confirm</button>
                                <button type="button" className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=> {
                                    setCorrectPass(undefined)
                                    setPassword("")
                                    setNewPassword("")
                                    setConfirmPassword("")
                                    setIsVerified(false)
                                    navigate(-1)
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                    <br />
                    <div className="horizontal_line"></div>
                    <p className="profileCardName">Bug Report</p>
                    <div className="settingsform">
                        <div className="centerContent">
                            <label><b>Encountered a bug? Submit a report to us so we can fix it immediately!</b></label>
                        </div>
                        <BugReports />
                    </div>
                </>
            )}
            {settingsTab==="System Settings" && (
                <>
                    <TagsSettings />
                </>
            )}
            <ToastContainer 
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}
export default Settings