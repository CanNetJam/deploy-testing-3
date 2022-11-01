import React from "react"
import { useNavigate } from "react-router-dom"
import moment from "moment"

function ProjectsTable({projects}) {
    let navigate = useNavigate()

    return (
        <div className="tableList">
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Employer</th>
                        <th>Company</th>
                        <th>Skill</th>
                        <th>Sallary</th>
                        <th>Duration</th>
                        <th>Location</th>
                        <th>Employee</th>
                        <th>Status</th>
                        <th>Date Requested:</th>
                        <th>Approval Date:</th>
                        <th>Completion Date:</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((prj)=> (
                        <tr key={prj._id}>
                            <td>{((projects.indexOf(prj))+1)<10 ? "0"+((projects.indexOf(prj))+1) : ((projects.indexOf(prj))+1) }</td>
                            <td>{prj.type}</td>
                        
                            <td>{prj.title}</td>
                            
                            <td>{prj?.employer?.firstname} {prj?.employer?.middlename ? prj.employer.middlename.charAt(0).toUpperCase() + ". " : "" }{prj?.employer?.lastname}</td>
                            <td>{prj.company ? prj.company : ""}</td>
                            <td>{prj.skillrequired}</td>
                            <td>₱ {prj.sallary}</td>
                            <td>{prj?.duration ? prj.duration+ " month(s)" : "-"}</td>
                            <td>{prj.location?.city}, {prj.location?.province}, {prj.location?.region}</td>
                            
                            <td>{prj?.freelancer?.firstname} {prj?.freelancer?.middlename ? prj.freelancer.middlename.charAt(0).toUpperCase() + ". " : "-" }{prj?.freelancer?.lastname}</td>
                            <td>{prj.status}</td>
                            <td>{moment(prj.creationdate).format("MM/DD/YY")}</td>
                            <td>{moment(prj.approvaldate).format("MM/DD/YY")}</td>
                            <td>{prj.completiondate ? moment(prj.completiondate).format("MM/DD/YY") : "-"}</td>
                            <td>
                                <button className="btn btn-sm btn-primary" onClick={(e)=>{navigate("/project", {state: {_id: prj._id}})}}>
                                    Check {prj.type}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ProjectsTable