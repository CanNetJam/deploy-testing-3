import React, {useRef, useEffect} from "react"
import { useNavigate } from "react-router-dom"

function Home(props){ 
    let navigate = useNavigate()
    const candidate = useRef(null)
    const hiring = useRef(null)
    const about = useRef(null)
    const contact = useRef(null)
    const topPage = useRef(null)

    const scrollToSection = (elementRef) => {
        window.scrollTo({
          top: elementRef.current.offsetTop,
          behavior: "smooth",
        })
    }
    
    useEffect(()=> {
        const windowOpen = () => {   
            if (props.currentWindow==="candidate") {
                scrollToSection(candidate)
            }
            if (props.currentWindow==="hiring") {
                scrollToSection(hiring)
            }
            if (props.currentWindow==="about") {
                scrollToSection(about)
            }
            if (props.currentWindow==="contact") {
                scrollToSection(contact)
            }
            if (props.currentWindow==="") {
                scrollToSection(topPage)
            }
        }
        windowOpen()
    }, [props.currentWindow])

    return (
        <div className="homeDashboardWrapper">
            <div >
                <div ref={topPage} className="homeDashboard">
                    <div className="homeDashboardCenter">
                        <div className="homeDashboardTitle"><b>TRABAWHO?</b></div>
                        <div className="homeDashboardText">
                            <label>Extension Services and Job Placement Office</label>
                            <label>Cavite State University Carmona Campus</label>
                        </div>
                        <div className="centerContent">
                            <button onClick={() => {
                                props.setCurrentWindow("about")
                            }} className="allButtons limitWideButtons">Discover More</button>
                        </div>
                    </div>
                </div>
            </div>
        <div className="homes">
            
            <div ref={candidate} className="windowContainer">
                <div className="infoCard">
                    <div>
                        <div className="centerContent topButtons" onClick={()=>{
                            navigate("/search"),
                            props.setCurrentWindow("")}}>
                            <img className="infoCardPhoto" src={"/WebPhoto/Employee1.png"} alt={"Employee photo"} />
                        </div>                
                        <div className="centerContent">
                            <p className="infoCardFooter">Click here to search for potential employees! </p>
                        </div>
                    </div>
                    <div>
                        <div className="centerContent infoCardTitleWrapper">
                            <p className="infoCardTitle"><b>Looking for the best applicant for your job opening?</b></p>
                        </div>     
                        <div className="centerContent infoCardTextWrapper">
                            <p className="infoCardText">Find the best employees here at TrabaWho? an online job placement system. TrabaWho? aims to help the beneficiaries of the Extention Services and Job Placement Office to find and work on different jobs offered by its linkages. Why seek employees here? Because applicants here are:
                                <ul>
                                    <li>- Professionally Trained</li>
                                    <li>- Technically Skilled</li>
                                    <li>- Morally Upright</li>
                                    <li>- Globally Competetive</li>
                                </ul>
                            </p>  
                        </div>           
                    </div>
                </div>
            </div>
            <div ref={hiring} className="windowContainer">
                <div className="infoCard">
                    <div>
                        <div className="centerContent infoCardTitleWrapper">
                            <p className="infoCardTitle"><b>Start your professional career with us!</b></p>
                        </div> 
                        <div className="centerContent infoCardTextWrapper">
                            <p className="infoCardText">Trying to prove yourself? Looking for your your first job? Searching for the right company to hone your skills and experience? Look no furthur, here in TrabaWho? your dream job or projects awaits! The best jobs and project oppurtunity is available here, but you got to have what it takes. Remember, nothing special comes from something so easy. So, hurry up and apply now.</p>    
                        </div>  
                    </div> 
                    <div>            
                        <div className="centerContent topButtons" onClick={()=>{
                            navigate("/hiring"),
                            props.setCurrentWindow("")}}>
                            <img className="infoCardPhoto" src={"/WebPhoto/Hiring1.webp"} alt={"Hiring photo"} />
                        </div>               
                        <div className="centerContent">
                            <p className="infoCardFooter">Click to Search Job Hirings! </p>
                        </div> 
                    </div>
                </div>              
            </div>

        <div ref={about} className="aboutTopic windowContainer">
    
            <p className="aboutTitle"><b>What is TrabaWho?</b></p>
            <div className="aboutTopic1">
                <p className="aboutContent text-muted small">
                    TrabaWho? is an undergraduate project of the BSIT students of Cavite State University Carmona Campus, which aims to help the beneficiaries of Extension Services and Job Placement Office to find and work on different jobs offered by the its linkages.
                </p>
            </div>
            <br/>
            <div className="universityDashboard">
                <p className="aboutTitle"><b>About the University</b></p>
                <div className="aboutTopic3">
                    <div className="aboutTopic3Title"><b>Cavite State University</b></div>
                    <div className="aboutContentTopic3">
                        The system was developed as a curricular requirement of two students under the course of Bachelor of Science in Information Technology. The system was established to help fresh graduate student of Cavite State University-Carmona Campus, its main motive was to assist the fresh graduate to get the proper match of work base on their finished course.
                    </div>
                </div>
                <br />
                <div className="missionVission"> 
                    <div className="missionVissionContent">
                        <div>
                        <p><b>Mission</b></p>
                        <p>Cavite State University shall provide excellent, equitable and relevant educational opportunities in the arts, sciences and technology through quality instruction and responsive research and development activities. It shall produce professional, skilled and morally upright individuals for global competitiveness.</p>
                        </div>
                    </div>
                    <div className="missionVissionContent">
                        <div>
                        <p><b>Vission</b></p>
                        <p>The premier university in historic Cavite recognized for excellence in the development of globally competitive and morally upright individuals.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div ref={contact} className="aboutTopic windowContainer">
            <p className="aboutTitle"><b>About the Organization</b></p>
            <div className="aboutTopic2">
                <div className="aboutTopic2Content">
                    <div className="aboutTopic2Title"><b>Extension Services and Job Placement Office</b></div>
                    <div className="aboutContentTopic2">
                        <p className="aboutContent">
                            The Extension Services of Cavite State University shall be geared towards the improvement of the lives of the community especially those that belong to economically and socially disadvantaged sectors through the conduct of relevant education and training; farm and business advisory activities; demonstration projects; and information, communication, and technology services.
                        </p>
                    </div>
                </div>
                <br />
                <div className="aboutTopic2Options">
                    <div className="aboutTopic2Options1">
                        <p>
                            <b>Call Us</b>
                            <br />
                            (046) 430 2610 
                        </p>
                    </div>
                    <div className="aboutTopic2Options2">
                        <p>
                            <b>Location</b>
                            <br />
                            Market Road, Carmona, Cavite.
                        </p>
                    </div>
                    <div className="aboutTopic2Options3">
                        <p>
                            <b>Office Hours</b>
                            <br />
                            8:00 AM - 5:00 PM |
                            Monday to Friday
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </div>
        </div>
    )
}
export default Home