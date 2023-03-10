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
    const [sortBy, setSortBy] = useState("A-Z")
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
          <div className="centerContent">
            <h3>List of Approved Jobs & Projects</h3>
          </div>

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
                    <button onClick={()=> getProjects()} className="btn btn-sm btn-primary">
                        Search
                    </button>
                </div>
                <div className="testing">
                    <div className="searchKey">
                        <button className="btn btn-sm btn-primary" onClick={()=> {
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
                  {result[0] ? 
                    <>
                      {result[page]?.map((prj) => {
                        return (
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
                              
                              <td>{prj?.candidate?.firstname} {prj?.candidate?.middlename ? prj.candidate.middlename.charAt(0).toUpperCase() + ". " : "-" }{prj?.candidate?.lastname}</td>
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
                  <button className="btn btn-sm btn-primary" onClick={()=>setPage(result?.indexOf(a))}>
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