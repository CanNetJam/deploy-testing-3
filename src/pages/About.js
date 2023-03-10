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
            <div className="aboutDeveloperCenter">
                <div className="aboutDeveloper">
                    <img src={"/WebPhoto/About/Kenneth.jpg"} alt={"male-developer icon"} />
                    <p>
                    Kenneth John Saracho, was born on May 16, 1999 at called Imus, Cavite and is currently 21 years old. He is the youngest child of Mr. Edwin Saracho and Ms. Jenneth Saracho. He is currently residing at Paliparan I Dasmariñas, Cavite.
                    He obtained his primary education at Paliparan II Elementary School in 2012. He finished his Secondary education with the K to 12 program at Paliparan II Integrated High School in 2016. In the following year, he enrolled at Cavite State University Carmona Campus for his college education in Bachelor of Science taking Information Technology program. 
                    </p>
                </div>
                <br />
                <div className="aboutDeveloper">
                    <p>
                    Pamela Lopez, was born on March 02, 2000 in Carmona, Cavite. She is the youngest among the four children of Mr. Pablito B. Alvarez a blinds installer, and Ms. Melia B. Lopez a housewife. She is currently residing at 11521 E. Reyes St. Mabuhay Carmona, Cavite. She obtained her primary education at Mabuhay Elementary School, Carmona, Cavite in year 2012.
                    She finished her study at Carmona National High School, Carmona, Cavite in 2016 with National Certification in Bread and Pastry Production, and Senior High in Angelo Levardo Loyola Senior High School, Carmona, Cavite in 2018. She is an Animation NCII passer. 
                    In the following year, she enrolled at Cavite State University Carmona Campus for her college education in Bachelor of Science taking Information Technology program. She obtained her degree in 2022.
                    </p>
                    <img src={"/WebPhoto/About/Pamela.jpg"} alt={"female-developer icon"} />
                </div>
            </div>
        </div>
    </div>
    )
}

export default About