import React from "react"
import moment from "moment"

function AllProjectsTable(props) {

    return (
        <div className="reportsProjectsList">
            <div>
                <label><b>{props.tableType} Data</b></label>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th><div className="smallHW">Type</div></th>
                            <th><div className="smallHW">Title</div></th>
                            <th><div className="smallHW">Company</div></th>
                            <th><div className="smallHW">Duration</div></th>
                            <th><div className="smallHW">Status</div></th>
                            <th><div className="smallHW">Request Date</div></th>
                            {props.tableType==="Approved Requests" || 
                            props.tableType==="Accomplished Jobs" || 
                            props.tableType==="Accomplished Projects" || 
                            props.tableType==="Ongoing Projects" || 
                            props.tableType==="Ongoing Jobs"? 
                                <th><div className="smallHW">Approval Date</div></th>
                            :null}
                            {props.tableType==="Approved Requests" || props.tableType==="Accomplished Jobs" || props.tableType==="Accomplished Projects" ?
                                <th><div className="smallHW">Completion Date</div></th>
                            :null}
                        </tr>
                    </thead>
                    <tbody>
                    {props.allTableData[0] ? 
                        <>
                        {props.allTableData?.map((prj) => {
                            return (
                                <tr key={prj._id}>
                                    <td>{((props.allTableData.indexOf(prj))+1)<10 ? "0"+((props.allTableData.indexOf(prj))+1) : ((props.allTableData.indexOf(prj))+1)}</td>
                                    <td><div className="smallHW">{prj.type}</div></td>
                                    <td><div className="smallHW">{prj.title}</div></td>
                                    <td><div className="smallHW">{prj.company ? prj.company : ""}</div></td>
                                    <td><div className="smallHW">{prj?.duration ? prj.duration+ " month(s)" : "-"}</div></td>
                                    <td><div className="smallHW">{prj.status ? prj.status : prj.requeststatus}</div></td>
                                    <td><div className="smallHW">{moment(prj.creationdate).format("MM/DD/YY")}</div></td>
                                    {props.tableType==="Approved Requests" || 
                                    props.tableType==="Accomplished Jobs" || 
                                    props.tableType==="Accomplished Projects" || 
                                    props.tableType==="Ongoing Projects" || 
                                    props.tableType==="Ongoing Jobs" ?
                                        <td><div className="smallHW">{prj.approvaldate ? moment(prj.approvaldate).format("MM/DD/YY") : "-"}</div></td>
                                    :null}
                                    {props.tableType==="Approved Requests" || props.tableType==="Accomplished Jobs" || props.tableType==="Accomplished Projects" ?
                                        <td><div className="smallHW">{prj.completiondate ? moment(prj.completiondate).format("MM/DD/YY") : "-"}</div></td>
                                    :null}
                                </tr>
                            )
                        })}
                        </>
                    :<div>No Job(s)/Project(s) found.</div>}
                    </tbody>
                </table> 
            </div>   
        </div>
    )
}

export default AllProjectsTable