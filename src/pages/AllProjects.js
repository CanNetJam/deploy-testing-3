import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"
import moment from "moment"
import { UserContext } from "../home"

function AllProjects(){
    let navigate = useNavigate()
    const { userData, setUserData } = useContext(UserContext)
    const [ projects, setProjects ] = useState([])

    const [query, setQuery] = useState("")
    const [queryLocation, setQueryLocation] = useState("")
    const [querySallary, setQuerySallary] = useState("")
    const [keySearch, setKeySearch] = useState(false)
    const [searchBy, setSearchBy] = useState("")
    const [sortBy, setSortBy] = useState("Latest")
    const [result, setResult] = useState([])
    const [page, setPage] = useState(0)
    const [searchCount, setSearchCount] = useState(10)
    const [sortSallaryText, setSortSallaryText] = useState("")

    const [btnSearchBy, setBtnSearchBy] = useState("")
    const [btnSortBy, setBtnSortBy] = useState("")
    const [btnFilterSallary, setBtnFilterSallary] = useState("")
    const [btnSearchCount, setBtnSearchCount] = useState()
    
    let length = projects.length
    let index = 0

    useEffect(() => {
        const getFiltered = async () => { 
            setResult([])
            let slice = (source, index) => source.slice(index, index + searchCount)
            while (index < length) {
                let temp = [slice(projects, index)]
                setResult(prev=>prev.concat(temp))
                index += searchCount
            }
        }
        getFiltered()
    }, [projects, querySallary, searchBy, sortBy, searchCount])

    async function getProjects() {
        try {
            const res = await Axios.get(`/api/all-approved-projects/`, {
                params: {
                    usertype: userData.user.type,
                    query: query,
                    location: queryLocation,
                    key: searchBy,
                    sort: sortBy,
                    sallary: querySallary,
                },
                    headers: {
                    'auth-token': userData.token
                }
            })
            setProjects(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    
    useEffect(() => {
        try {
            getProjects()
        } catch (err) {
            console.log(err)
        }
    }, [searchBy, sortBy, searchCount, querySallary,])
    
    return(
        <div className="projectsList">
            <div className="contentTitle">
                <label><b>List of Approved Jobs & Projects</b></label>
            </div>
            <br/>
            <div className="searchTop">
                <div className="searchBar">
                    <input
                        type="text"
                        className="searchBox"
                        placeholder={"Skill required or Job title"}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="searchBar">
                    <input
                        type="text"
                        className="searchBox"
                        placeholder={"Region, City or Town"}
                        onChange={(e) => setQueryLocation(e.target.value)}
                    />
                </div>

                <div>
                    <button onClick={()=> getProjects()} className="btn btn-outline-success allButtons">
                        Search
                    </button>
                </div>
                <div className="testing">
                    <div className="searchKey">
                        <button className="btn btn-outline-success allButtons" onClick={()=> {
                            if (keySearch === false) {
                                setKeySearch(true)
                            }
                            if (keySearch === true) {
                                setKeySearch(false)
                            }
                        }}>
                            ...
                        </button>
                    </div>
                
                <div className="keyPicker2">
                        {keySearch && (
                            <div className="advanceSearch">
                                <div>
                                    <h5>Filter by:</h5>
                                    <div className="searchAdvWrapper">
                                        <label>Type: <b>{btnSearchBy}</b></label>
                                        {searchBy==="" ? 
                                            <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSearchBy("Job Hiring")}}>
                                                <b>Job Hiring</b>
                                            </button>
                                        :<></>}
                                        {searchBy==="" ? 
                                            <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSearchBy("Project Hiring")}}>
                                                <b>Project Hiring</b>
                                            </button>
                                        :<></>}
                                        {searchBy!=="" ? 
                                            <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSearchBy("")}}>
                                                <b>Remove type filter</b>
                                            </button>
                                        :<></>}
                                    </div>
                                    <div className="searchAdvWrapper">
                                        <label>Sallary range: <b>{sortSallaryText}</b></label>
                                        {querySallary==="" ? 
                                        <>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnFilterSallary("1")
                                            setSortSallaryText("less than ₱ 10, 001")
                                        }}>
                                            <b>less than ₱10,001</b>
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnFilterSallary("2")
                                            setSortSallaryText("₱ 10, 001 to ₱ 25, 000")
                                        }}>
                                            <b>₱10,001 to ₱25,000</b>
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnFilterSallary("3")
                                            setSortSallaryText("₱ 25, 001 to ₱ 50, 000")
                                        }}>
                                            <b>₱25,001 to ₱50,000</b>
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnFilterSallary("4")
                                            setSortSallaryText("₱ 50, 001 to ₱ 100, 000")
                                        }}>
                                            <b>₱50,001 to ₱100,000</b>
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnFilterSallary("5")
                                            setSortSallaryText("more than ₱ 100, 000")
                                        }}>
                                            <b>more than ₱100,000</b>
                                        </button>
                                        </>
                                        :<></>}
                                        {querySallary!=="" ? 
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnFilterSallary("")
                                            setSortSallaryText("")
                                        }}>
                                            <b>Remove sallary filter</b>
                                        </button>
                                        :<></>}
                                    </div>
                                </div>
                                <div>
                                    <h5>Sort by: {sortBy}</h5>
                                    <div className="searchAdvWrapper">
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("Latest")}}>
                                            Latest
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("Oldest")}}>
                                            Oldest
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("A-Z")}}>
                                            A-Z
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("Z-A")}}>
                                            Z-A
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h5>Show {searchCount} results</h5>
                                    <div className="searchAlign centerContent">
                                        <button className="btn btn-sm btn-primary countBtn" onClick={()=>{setBtnSearchCount(5)}}>
                                            5
                                        </button>
                                        <button className="btn btn-sm btn-primary countBtn" onClick={()=>{setBtnSearchCount(10)}}>
                                            10
                                        </button>
                                        <button className="btn btn-sm btn-primary countBtn" onClick={()=>{setBtnSearchCount(50)}}>
                                            25
                                        </button>
                                        <button className="btn btn-sm btn-primary countBtn" onClick={()=>{setBtnSearchCount(50)}}>
                                            50
                                        </button>
                                    </div>
                                </div>
                                <br />    
                                <div className="centerContent">
                                    <button className="btn btn-sm btn-primary" onClick={()=> {
                                        setSearchBy(btnSearchBy)
                                        if (btnSortBy!=="") {
                                            setSortBy(btnSortBy)
                                        }
                                        setQuerySallary(btnFilterSallary)
                                        if (btnSearchCount!==undefined) {
                                            setSearchCount(btnSearchCount)
                                        }
                                        setPage(0)
                                        setKeySearch(false)
                                    }}>
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="tableList">
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th><div className="constantHW">Type</div></th>
                            <th><div className="constantHW">Title</div></th>
                            <th><div className="constantHW">Employer</div></th>
                            <th><div className="constantHW">Company</div></th>
                            <th><div className="constantHW">Skill</div></th>
                            <th><div className="constantHW">Slots</div></th>
                            <th><div className="constantHW">Sallary</div></th>
                            <th><div className="constantHW">Duration</div></th>
                            <th><div className="constantHW">Location</div></th>
                            <th><div className="constantHW">Employee</div></th>
                            <th><div className="constantHW">Status</div></th>
                            <th><div className="constantHW">Date Requested</div></th>
                            <th><div className="constantHW">Approval Date</div></th>
                            <th><div className="constantHW">Completion Date</div></th>
                            <th><div className="constantHW">Actions</div></th>
                        </tr>
                    </thead>
                    <tbody>
                    {result[0] ? 
                        <>
                        {result[page]?.map((prj) => {
                            return (
                                <tr key={prj._id}>
                                    <td>{((projects.indexOf(prj))+1)<10 ? "0"+((projects.indexOf(prj))+1) : ((projects.indexOf(prj))+1)}</td>
                                    <td><div className="constantHW">{prj.type}</div></td>
                                
                                    <td><div className="constantHW">{prj.title}</div></td>
                                    
                                    <td><div className="constantHW">{prj?.employer?.firstname} {prj?.employer?.middlename ? prj.employer.middlename.charAt(0).toUpperCase() + ". " : "" }{prj?.employer?.lastname}</div></td>
                                    <td><div className="constantHW">{prj.company ? prj.company : ""}</div></td>
                                    <td><div className="constantHW">{prj.skillrequired}</div></td>
                                    <td>
                                        <div className="constantHW">
                                            {prj?.slots!==0 ? prj.slots+" left." :"Fully occupied"}
                                        </div>
                                    </td>
                                    <td><div className="constantHW">₱ {prj.sallary}</div></td>
                                    <td><div className="constantHW">{prj?.duration ? prj.duration+ " month(s)" : "-"}</div></td>
                                    <td><div className="constantHW">{prj.location?.city}, {prj.location?.province}, {prj.location?.region}</div></td>
                                    
                                    <td>
                                        <div className="constantHW">
                                            {prj.employeelist.length!==0 ?
                                                prj.employeelist.map((a)=>{
                                                    return (
                                                        <>
                                                            <label>{a.employeeid?.firstname} {a.employeeid?.middlename ? a.employeeid.middlename.charAt(0).toUpperCase() + ". " : "-" }{a.employeeid?.lastname}</label><br />
                                                        </>
                                                    ) 
                                                })
                                            : null}
                                        </div>
                                    </td>
                                    <td><div className="constantHW">{prj.status}</div></td>
                                    <td><div className="constantHW">{moment(prj.creationdate).format("MM/DD/YY")}</div></td>
                                    <td><div className="constantHW">{moment(prj.approvaldate).format("MM/DD/YY")}</div></td>
                                    <td><div className="constantHW">{prj.completiondate ? moment(prj.completiondate).format("MM/DD/YY") : "-"}</div></td>
                                    <td>
                                        <div className="constantHW">
                                            <button className="btn btn-outline-success allButtons" onClick={(e)=>{navigate("/project", {state: {_id: prj._id}})}}>
                                                Check {prj.type}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </>
                    :<span className="searchList">No Job(s)/Project(s) found.</span>}
                    </tbody>
                </table>
            </div>
            <div className="pageNumber">
                {result?.map((a)=>{
                return (
                    <div key={result?.indexOf(a)}>
                    <button className="btn btn-outline-success allButtons" onClick={()=>setPage(result?.indexOf(a))}>
                        {"Page "+((result?.indexOf(a))+1)}
                    </button>
                    </div>
                )
                })}
            </div>
        </div>
    )
}

export default AllProjects