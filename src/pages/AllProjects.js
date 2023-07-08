import React, { useState, useEffect, useContext, useRef } from "react"
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
    const [advSearch, setAdvSearch] = useState(false)
    const topPage = useRef(null)
    let length = projects.length
    let index = 0

    const scrollToSection = (elementRef) => {
        window.scrollTo({
          top: elementRef.current.offsetTop,
          behavior: "smooth",
        })
    }

    useEffect(()=> {
        const windowOpen = () => {   
            scrollToSection(topPage)
        }
        windowOpen()
    }, [])

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
            <div ref={topPage}></div>
            <div className="contentTitle">
                <label><b>List of Approved Jobs & Projects</b></label>
            </div>
            <br/>

            <div className="searchTop">
                <div className="searchTopSearch">
                    <div className="searchBar">
                        <input
                            type="text"
                            className="searchBox"
                            placeholder={"Skill required or Job title"}
                            value={query}
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
                        <div className="searchKey leftNewButtons hovertext" data-hover="Filter" onClick={()=> {
                            if (keySearch === false) {
                                setKeySearch(true)
                            }
                            if (keySearch === true) {
                                setKeySearch(false)
                            }
                        }}>
                            <img src={"/WebPhoto/filter.png"} alt={"filter icon"} />
                        </div>
                    </div>
                </div>

                {keySearch===true ? (
                    <div className="flexContent">
                        <div className="dropdownHover">
                            <button className="btn btn-outline-success allButtons dropbtn" onClick={()=>{searchBy!=="" ? setSearchBy(""): null}}>
                                {searchBy!=="" ? searchBy+" " : "Search by "} 
                                {searchBy==="" ? <i class="arrow down"></i>: <label className="closeIcon"><b>X</b></label>}
                            </button>
                            <div className="dropdown-content"> 
                                <label className="dropdownitem" onClick={()=>{setSearchBy("Job Hiring")}}>
                                    Job Hiring
                                </label>
                                <label className="dropdownitem" onClick={()=>{setSearchBy("Project Hiring")}}>
                                    Project Hiring
                                </label>
                            </div>
                        </div>

                        <div className="dropdownHover">
                            <button className="btn btn-outline-success allButtons dropbtn" onClick={()=>{
                                if ( querySallary!=="") {
                                    setQuerySallary("")
                                    setSortSallaryText("")
                                }
                            }}>
                                {sortSallaryText!=="" ? sortSallaryText+" " : "Sallary range "} 
                                {querySallary==="" ? <i class="arrow down"></i>: <label className="closeIcon"><b>X</b></label>}
                            </button>
                            <div className="dropdown-content">
                                        <label className="dropdownitem" onClick={()=>{
                                            setQuerySallary("1")
                                            setSortSallaryText("less than ₱ 10, 001")
                                        }}>
                                            less than ₱10,001
                                        </label>
                                        <label className="dropdownitem" onClick={()=>{
                                            setQuerySallary("2")
                                            setSortSallaryText("₱ 10, 001 to ₱ 25, 000")
                                        }}>
                                            ₱10,001 ~ ₱25,000
                                        </label>
                                        <label className="dropdownitem" onClick={()=>{
                                            setQuerySallary("3")
                                            setSortSallaryText("₱ 25, 001 to ₱ 50, 000")
                                        }}>
                                            ₱25,001 ~ ₱50,000
                                        </label>
                                        <label className="dropdownitem" onClick={()=>{
                                            setQuerySallary("4")
                                            setSortSallaryText("₱ 50, 001 to ₱ 100, 000")
                                        }}>
                                            ₱50,001 ~ ₱100,000
                                        </label>
                                        <label className="dropdownitem" onClick={()=>{
                                            setQuerySallary("5")
                                            setSortSallaryText("more than ₱ 100, 000")
                                        }}>
                                            more than ₱100,000
                                        </label>
                            </div>
                        </div>

                        <div className="dropdownHover">
                            <button className="btn btn-outline-success allButtons dropbtn" onClick={()=>{
                                if (sortBy!=="Latest") {
                                    setSortBy("Latest")
                                }
                            }}>
                                {sortBy!=="" ? sortBy+" " : "Sort by "} 
                                <i class="arrow down"></i>
                            </button>
                            <div className="dropdown-content">
                                <label className="dropdownitem" onClick={()=>{setSortBy("Latest")}}>
                                    Latest
                                </label>
                                <label className="dropdownitem" onClick={()=>{setSortBy("Oldest")}}>
                                    Oldest
                                </label>
                                <label className="dropdownitem" onClick={()=>{setSortBy("A-Z")}}>
                                    A-Z
                                </label>
                                <label className="dropdownitem" onClick={()=>{setSortBy("Z-A")}}>
                                    Z-A
                                </label>
                            </div>
                        </div>
                    </div>
                ): null}

                {advSearch===true? (
                    <div className="searchAdv">
                        {category.map((a)=> {
                            return (
                                <div key={a._id}>
                                    <label className="selectedCategory" onClick={()=>{
                                        setCategoryBy(a.name)
                                        setCategoryPick(true) 
                                    }}><b>{a.name}</b></label>
                                    {a.name===categoryBy ? 
                                        <div>
                                            {categoryPick && (
                                                <div className="searchTabs">
                                                    {filteredCategory?.map((b)=> {
                                                        return <button className="btn btn-outline-success allButtons" key={idPlusKey(categoryBy, b)} onClick={()=>{
                                                                    setQuery(b),
                                                                    setCategoryBy("")
                                                                    setCategoryPick(false)
                                                                    setAdvSearch(false)
                                                                }}>{b}</button>
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    : <></>}
                                </div>
                            )
                        })}
                    </div>
                ): null}
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
                            <th><div className="constantHW">Salary</div></th>
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
            {result[0] ? 
                <div className="pageNumber">
                    <button disabled={page===0? true : false} className="btn btn-outline-success pageButtons" onClick={()=>setPage(page-1)}>Previous</button>
                    {result?.map((a)=>{
                        return (
                            <button key={result?.indexOf(a)} disabled={result?.indexOf(a)===page ? true : false} className="btn btn-outline-success pageButtons" onClick={()=>setPage(result?.indexOf(a))}>
                                {(result?.indexOf(a))+1}
                            </button>
                        )
                    })}
                    <button disabled={page===(result.length-1)? true : false} className="btn btn-outline-success pageButtons" onClick={()=>setPage(page+1)}>Next</button>
                </div>
            : null}
        </div>
    )
}

export default AllProjects