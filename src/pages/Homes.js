import React from "react"
import { useNavigate } from "react-router-dom"

function Home(){ 
    let navigate = useNavigate()

    return (
        <div className="homes dashboard">
            <div className="infoCard">
                <div className="centerContent">
                    <p className="infoCardTitle"><b>Looking for the best applicant for your job opening?</b></p>
                </div>                
                <div className="centerContent topButtons" onClick={()=>{navigate("/search")}}>
                    <img className="infoCardPhoto" src={"/WebPhoto/Employee1.png"} alt={"Employee photo"} />
                </div>                
                <div className="centerContent">
                    <p className="infoCardFooter">Click to Search Potential Employees! </p>
                </div>
            </div>
            <div className="infoCard">
                <div className="centerContent">
                    <p className="infoCardTitle"><b>Start your professional career with us!</b></p>
                </div>              
                <div className="centerContent topButtons" onClick={()=>{navigate("/hiring")}}>
                    <img className="infoCardPhoto" src={"/WebPhoto/Hiring1.webp"} alt={"Hiring photo"} />
                </div>               
                <div className="centerContent">
                    <p className="infoCardFooter">Click to Search Job Hirings! </p>
                </div>               
            </div>
        </div>
    )
}
export default Home