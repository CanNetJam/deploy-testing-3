import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../home"
import Axios from "axios"
import { useNavigate } from "react-router-dom"

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
                        alert("Successfully changed your password.")
                    }
                }
            }
        }
    }
    
    return (
    <div className="settings">
        <div>
            <h1>Change Password:</h1>
        </div>
        <div>
            <form className="settingsForm" onSubmit={submitHandler}>
                <div className="mb-1">
                    <label>Email:</label>
                    <input required autoFocus onChange={e => setEmail(e.target.value)} type="text" className="form-control form-control-sm" value={email} placeholder="..."/>
                </div>
                <div className="mb-1">
                    <label>Please enter password to continue:</label>
                    <input required autoFocus onChange={e => setPassword(e.target.value)} type="text" className="form-control form-control-sm" value={password} />
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
                            <input required autoFocus onChange={e => setNewPassword(e.target.value)} type="text" className="form-control form-control-sm" value={newPassword} />
                        {samePassword===true ? 
                            <label>Your new password can not be the same with your old password!</label>
                        : <></>}
                        </div>
                        <div className="mb-1">
                            <label>Confirm new password:</label>
                            <input required autoFocus onChange={e => setConfirmPassword(e.target.value)} type="text" className="form-control form-control-sm" value={confirmPassword} />
                            {isConfirmed===false ? 
                                <label>New password does not match!</label>
                            : <></>}
                        </div>
                    </div>
                : <></>}
                <button className="btn btn-sm btn-primary">Confirm</button>
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
            </form>
        </div>
    </div>
    )
}
export default Settings