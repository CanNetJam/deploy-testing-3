import React from "react"

function About(){
    return (
    <div className="about">
        <div className="aboutTopic">
            <p className="aboutTitle"><b>What is TrabaWho?</b></p>
            <div className="aboutTopic1">
                <p className="aboutContent text-muted small">
                    TrabaWho? is an undergraduate project of the BSIT students of Cavite State University Carmona Campus, which aims to help the beneficiaries of Extension Services and Job Placement Office to find and work on different jobs offered by the its linkages.
                </p>
            </div>
        </div>
        <br />
        <div className="aboutTopic">
            <p className="aboutTitle"><b>About the Organization</b></p>
            <div className="aboutTopic2">
                <div className="aboutTopic2Content">
                <p className="aboutContent text-muted small">
                    The Job Placement Office under the Cavite State University-Campus was engaged in teaching people in new era of technology and to help them find a permanent and proper work. They aid people to find an employer according to the skill they learn at the University that been under the program of the office.
                </p>
                </div>
                <br />
                <div className="aboutTopic2Options">
                <div>
                    <p>
                        <b>Call Us</b>
                        <br />
                        09897623478
                    </p>
                </div>
                <div>
                    <p>
                        <b>Location</b>
                        <br />
                        Carmona, Cavite.
                    </p>
                </div>
                <div>
                    <p>
                        <b>Office Hours</b>
                        <br />
                        8:00 AM - 5:00 PM
                    </p>
                </div>
            </div>
            </div>
            <br />
        </div>
        <br />
        <div className="aboutTopic">
            <p className="aboutTitle"><b>About the University</b></p>
            <div className="aboutTopic3">
                <p className="aboutContent text-muted small">
                    The system was developed as a curricular requirement of two students under the course of Bachelor of Science in Information Technology. The system was established to help fresh graduate student of Cavite State University-Carmona Campus, its main motive was to assist the fresh graduate to get the proper match of work base on their finished course.
                </p>
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
        <br />
        <div className="aboutTopic">
            <p className="aboutTitle"><b>About the Developers</b></p>
            <p className="aboutContent text-muted small">
                The system was developed as a curricular requirement of two students under the course of Bachelor of Science in Information Technology. The system was established to help fresh graduate student of Cavite State University-Carmona Campus, its main motive was to assist the fresh graduate to get the proper match of work base on their finished course.
            </p>
            <br />
            <div className="centerContentGrid">
                <div className="aboutDeveloper">
                    <img src={"/WebPhoto/About/Kenneth.jpg"} alt={"male-developer icon"} />
                    <p className="contentSubheading">
                    <b>Kenneth John Saracho</b><br/>
                    Full Stack Developer
                    </p>
                </div>
                <br />
                <div className="aboutDeveloper">
                    <img src={"/WebPhoto/About/Pamela.jpg"} alt={"female-developer icon"} />
                    <p className="contentSubheading">
                    <b>Pamela Lopez</b><br/>
                    Web Designer
                    </p>
                </div>
            </div>
        </div>
        <br/>
        <br/>
        <br/>
    </div>
    )
}

export default About