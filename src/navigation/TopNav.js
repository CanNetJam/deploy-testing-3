import React, {useContext} from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../home"
import LeftNavFree from "./LeftNavFree"
import LeftNavEmp from "./LeftNavEmp"
import LeftNavAdmin from "./LeftNavAdmin"

function TopNav({savedNotifications, setNumber}){
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
                <div className="leftButtons" onClick={()=>{navigate("/")}}>
                    <><img className="webIcons" src={"/WebPhoto/webicon4.png"} alt={"website icon"} /></>
                </div>
                <div className="leftButtons hovertext" data-hover="About" onClick={()=>{navigate("/about")}}>
                    <><img src={"/WebPhoto/about.png"} alt={"about icon"} /></>
                </div>
            </div>
                {userData?.user ? (
                    <>
                        {userData?.user?.type==="Candidate" ? 
                            <LeftNavFree savedNotifications={savedNotifications} setNumber={setNumber}/>
                        :<></>}
                        {userData?.user?.type==="Employer" ? 
                            <LeftNavEmp savedNotifications={savedNotifications} setNumber={setNumber}/>
                        :<></>}
                        {userData?.user?.type==="Admin" || userData?.user?.type==="Super Administrator" ? 
                            <LeftNavAdmin savedNotifications={savedNotifications} setNumber={setNumber}/>
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