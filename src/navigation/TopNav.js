import React, {useContext} from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../home"
import LeftNavFree from "./LeftNavFree"
import LeftNavEmp from "./LeftNavEmp"
import LeftNavAdmin from "./LeftNavAdmin"

function TopNav({savedNotifications, setNumber, setCurrentWindow}){
    const { userData, setUserData } = useContext(UserContext)
    let navigate = useNavigate()

    const logOut = () => {
        setUserData({
          token: undefined,
          user: undefined,
        });
        localStorage.setItem("auth-token", "")
    }
      
    return (
        <div className="topnav">
            <div className="topnavLeft">
                <label onClick={() => {setCurrentWindow(""), navigate("/")}} className="topnavLabel ropnavLabelTitle"><b>TRABAWHO?</b></label>
                <label onClick={() => {setCurrentWindow("candidate"), navigate("/")}} className="topnavLabel">Hire Now!</label>
                <label onClick={() => {setCurrentWindow("hiring"), navigate("/")}} className="topnavLabel">Apply Here!</label>
                <label onClick={() => {setCurrentWindow("about"), navigate("/")}} className="topnavLabel">About</label>
                <label onClick={() => {setCurrentWindow("contact"), navigate("/")}} className="topnavLabel">Contact Us</label>
            </div>
                {userData?.user ? (
                    <>
                        {userData?.user?.type==="Candidate" ? 
                            <LeftNavFree savedNotifications={savedNotifications} setNumber={setNumber} />
                        :<></>}
                        {userData?.user?.type==="Employer" ? 
                            <LeftNavEmp savedNotifications={savedNotifications} setNumber={setNumber} />
                        :<></>}
                        {userData?.user?.type==="Admin" || userData?.user?.type==="Super Administrator" ? 
                            <LeftNavAdmin savedNotifications={savedNotifications} setNumber={setNumber} />
                        :<></>}
                    </>
                ) : (
                    <div className="topnavRight" onClick={()=>{ logOut(), navigate("/login")}}>
                        <label className="allButtons">Login</label>
                    </div>
                )}
        </div>
    )
}

export default TopNav