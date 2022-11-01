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
                    <p><img className="webIcons" src={"/WebPhoto/webicon4.png"} alt={"website icon"} /></p>
                </div>
                <div className="leftButtons hovertext" data-hover="About" onClick={()=>{navigate("/about")}}>
                    <p><img src={"/WebPhoto/about.png"} alt={"about icon"} /></p>
                </div>
            </div>
            <div>
                {userData?.user ? (
                    <div>
                        {userData?.user?.type==="Candidate" ? 
                            <LeftNavFree savedNotifications={savedNotifications} setNumber={setNumber}/>
                        :<></>}
                        {userData?.user?.type==="Employer" ? 
                            <LeftNavEmp savedNotifications={savedNotifications} setNumber={setNumber}/>
                        :<></>}
                        {userData?.user?.type==="Admin" ? 
                            <LeftNavAdmin savedNotifications={savedNotifications} setNumber={setNumber}/>
                        :<></>}
                    </div>
                ) : (
                    <div className="leftButtons" onClick={()=>{ logOut(), navigate("/login")}}>
                        <p>Login</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TopNav