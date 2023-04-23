import React, { useState } from "react"

function Help(){
    const [ question1, setQuestion1 ] = useState(false)
    const [ question2, setQuestion2 ] = useState(false)
    const [ question3, setQuestion3 ] = useState(false)
    const [ question4, setQuestion4 ] = useState(false)
    const [ question5, setQuestion5 ] = useState(false)
    const [ question6, setQuestion6 ] = useState(false)
    const [ question7, setQuestion7 ] = useState(false)
    
    return (
        <div className="help">
            <div className="contentTitle centerContent">
                <label><b>Help Center</b></label>
            </div>
            <br />
            <div>
                <button onClick={()=> {
                    if (question1===true) {
                        setQuestion1(false)
                    }
                    if (question1===false) {
                        setQuestion1(true)
                    }
                }} className="helpTitle">Where do I find the job hirings?</button>
                {question1===true ? 
                    <div className="helpContent">
                        <div>
                            This is Front page of the website where you can choice on searching for potential employees or search for job hiring.
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/Homepage.png"} alt={"Homepage Photo"} />
                        </div>
                    </div>
                :<></>}
            </div>
            <div>
                <button onClick={()=> {
                    if (question2===true) {
                        setQuestion2(false)
                    }
                    if (question2===false) {
                        setQuestion2(true)
                    }
                }}className="helpTitle">How do I promote myself to the potential employers?</button>
                {question2===true ? 
                    <div className="helpContent">
                        <div>
                            <p>
                                In order to promote themselves, candidates are adviced to edit their profile because this is what the employers are going to see during the employment process. 
                                To do that, the candidate can check the upper right side of the website and click the avatar icon. 
                                This will open a menu that contains several options including the the user's <b>Profile Page</b>.
                                Click the <b>My Profile</b>.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/UserMenu.png"} alt={"User Menu Photo"} />
                        </div>
                        <div>
                            <p>
                                This will redirect the candidate to their own <b>Profile Page</b>. 
                                Their input during the registration in visible here.
                                At this point, the candidate should edit thier profile by clicking the <b>Edit</b> button. 
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/Profile.png"} alt={"Edit Profile Photo"} />
                        </div>
                        <div>
                            <p>
                                The <b>Profile Page</b> would temporarily change its appearance. 
                                The labels earlier would become editable text that the candidate could now change appropriately.
                                There is also an option to upload an image to change one's display profile. 
                                Additionally, in the buttom of the editing menu, there is also a <b>Skill</b> edit option where the candidate can add or remove their skills. 
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/EditProfile.png"} alt={"Edit Profile Photo"} />
                        </div>
                        <div className="text-muted small">
                            <label>
                                <b>Note:</b> A candidate without a specified skill would not be listed on the available candidates, so please put atleast one of your skills within your profile.
                            </label>
                        </div>
                    </div>
                :<></>}
            </div>
            <div>
                <button onClick={()=> {
                    if (question3===true) {
                        setQuestion3(false)
                    }
                    if (question3===false) {
                        setQuestion3(true)
                    }
                }}className="helpTitle">Where do I upload my personal photos?</button>
                {question3===true ? 
                    <div className="helpContent">
                        <div>
                            <p>
                                Users can upload images of their previous or current jobs and projects in their <b>Profile Page</b>. 
                                It is located below the the personal information of the user. 
                                Click the <b>Upload Photo</b> button to continue.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/Gallery.png"} alt={"Gallery Photo"} />
                        </div>
                        <div>
                            <p>
                                The user should provide an image, a title, and a description for their file upload. 
                                After entering the neccessary informations, click the <b>Upload Now</b> button to finalize the image upload.
                                Please do not be afraid to make spelling or grammatical mistakes because the users can <b>Edit</b> or <b>Delete</b> their uploaded images.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/GalleryUpload.png"} alt={"Gallery Upload Photo"} />
                        </div>
                        <div className="text-muted small">
                            <label>
                                <b>Note:</b> Uploaded images should not exceed the maximum size of 10mb.
                            </label>
                        </div>
                    </div>
                :<></>}
            </div>
            <div>
                <button onClick={()=> {
                    if (question4===true) {
                        setQuestion4(false)
                    }
                    if (question4===false) {
                        setQuestion4(true)
                    }
                }}className="helpTitle">How can I manage my current jobs/projects?</button>
                {question4===true ? 
                    <div className="helpContent">
                        <div>
                            <p>
                                The users can manage their previous and current jobs and projects on their <b>My Jobs</b> tab located at the upper right side of the webpage. 
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/TopNavProjects.png"} alt={"Navigation Bar Photo"} />
                        </div>
                        <br />
                        <div>
                            <p>
                                Clicking the <b>My Jobs</b> label would redirect the users to their jobs and projects list. 
                                This list contains the informations about the job/project that they are working on or had worked for.
                                The latest job/projects would always appear at the top of the list.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/ProjectList.png"} alt={"Project List Photo"} />
                        </div>
                        <br />
                        <div>
                            <p>
                                The <b>My Jobs</b> tab is further devided into three (3) diferent tabs.
                                This tabs represent the status of their jobs/projects in the list.
                                The <b>Hiring</b> tab would be the location of jobs/projects that are currently on the hiring process. 
                                The <b>Ongoing</b> tab would be the location of jobs/projects that are currently on motion. 
                                The <b>Concluded</b> tab would be the location of jobs/projects that are officially completed or are terminated by the system admin. 
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/ProjectListNav.png"} alt={"Project List Navigation Photo"} />
                        </div>
                    </div>
                :<></>}
            </div>
            <div>
                <button onClick={()=> {
                    if (question5===true) {
                        setQuestion5(false)
                    }
                    if (question5===false) {
                        setQuestion5(true)
                    }
                }}className="helpTitle">What is the difference between a job and a project?</button>
                {question5===true ? 
                    <div className="helpContent">
                        <div>
                            <p>
                                During their hiring application, the system provides the employers the option to choose wether it is a job or a project.
                                This is done in order to classify the type of employment that they are trying to provide.
                            </p>
                        </div>
                        <div>
                            <p>
                                <b>Jobs</b> within the system, means that the employer is searching for a full-time/part-time employee that will be offically be a part of the company and would probably be paid in hourly rates and are subject to that same company's policies and benefits.
                                This includes monitored working times, holidays, and health benefits if available. 
                                Typically, this hirings meant that the employees would work on site.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/Job.png"} alt={"Job Photo"} />
                        </div>
                        <br />
                        <div>
                            <p>
                                <b>Projects</b> within the system, means that the employer is searching for a part-time employee that can finish a specific task within the project duration. 
                                After employment, the employee has the freedom on how to approch the specific project task. 
                                It is like a commission. 
                                They can work on it during midnight hours, or even during weekends.
                                All of that in exchange of not being included on the company's benefits if there is any.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/Project.png"} alt={"Project Photo"} />
                        </div>
                        <br />
                        <div>
                            <p>
                                Additionally, <b>Projects</b> have one (1) more feature that the <b>Job</b> do not have. 
                                It is the <b>Project Update</b> options, that would be used to track the work progress of an employee since they would not be a part of the company offically.
                                This is included to ensure that the employee works on the project continuously without constant supervision.
                                To access it, the user should click the <b>View Project Progress</b> button.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/ProjectOptions.png"} alt={"Project Options Photo"} />
                        </div>
                        <br />
                        <div>
                            <img src={"/WebPhoto/Help/ProjectUpdate.png"} alt={"Project Update Photo"} />
                        </div>
                    </div>
                :<></>}
            </div>
            <div>
                <button onClick={()=> {
                    if (question6===true) {
                        setQuestion6(false)
                    }
                    if (question6===false) {
                        setQuestion6(true)
                    }
                }}className="helpTitle">What is a project update?</button>
                {question6===true ? 
                    <div className="helpContent">
                        <div>
                            <p>
                                A <b>Project Update</b> is a way for the employer to monitor their employee that they hire to finish a specific project.
                                It is composed of an image, a title, and a desription to explain the current progress of the project. 
                                Additionally, the dates when the project update is requested and when it is fulfilled is also recorded.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/ProjectUpdate.png"} alt={"Project Update Photo"} />
                        </div>
                        <br />
                        <div>
                            <p>
                                A <b>Project Update</b> is initiated by the employer. 
                                They can do this by clicking on the <b>Request Project Update</b> button at the right side of the <b>Project Updates</b> tab.
                                Before sending the request, the employer can specify what they are expecting for the contents of the project update that the employee would send.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/ProjectUpdateRequest.png"} alt={"Request Project Update Photo"} />
                        </div>
                        <br />
                        <div>
                            <p>
                                The image below is an example of the <b>Project Update Request</b> sent by the employer. 
                                The image, title and the description are waiting to be updated by the employee.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/ProjectUpdateExample.png"} alt={"Request Project Update Example Photo"} />
                        </div>
                        <br />
                        <div>
                            <p>
                                On the employee's end, the <b>Project Update Request</b> is now ready to be edited.
                                the contents of their current work progress is put in here.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/ProjectUpdateSend.png"} alt={"Send Project Update Photo"} />
                        </div>
                    </div>
                :<></>}
            </div>
            <div>
                <button onClick={()=> {
                    if (question7===true) {
                        setQuestion7(false)
                    }
                    if (question7===false) {
                        setQuestion7(true)
                    }
                }}className="helpTitle">Why can't I hire this specific person?</button>
                {question7===true ? 
                    <div className="helpContent">
                        <div>
                            <p>
                                The system imposes a limit on to how much jobs/projects an individual can simultaneously have. 
                                This is done to ensure that the employers can get the highest quality output and attention from their future employees.
                                To check about the current activities of an employee, go to their <b>Profile</b>.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/Profile.png"} alt={"Profile Photo"} />
                        </div>
                        <br />
                        <div>
                            <p>
                                Below their personal informations, there is a list of their current jobs/projects. 
                                A person can only have a maximum of one (1) job, and three (3) projects that they can work all at the same time.
                                If the limit is reached, the system would remove the option for the specific individual to be employed.
                                They can be employed again after they had finished a job/project and they are below the individual limit.
                            </p>
                        </div>
                        <div>
                            <img src={"/WebPhoto/Help/MaxJobs.png"} alt={"Maximum Jobs/Projects Photo"} />
                        </div>
                        <div className="text-muted small">
                            <label>
                                <b>Note:</b> The list also contains the estimated end date of the candidate's job/project.
                                Use it to your advantage.
                            </label>
                        </div>
                    </div>
                :<></>}
            </div>
        </div>
    )
}

export default Help