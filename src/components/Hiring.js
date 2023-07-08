import React, {useState, useEffect, useContext, useRef} from "react"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../home"
import {format} from "timeago.js"

function Hiring() {
    const cloud_name = "dzjkgjjut"
    let navigate = useNavigate()
    const { userData, setUserData } = useContext(UserContext)
    const [ projects, setProjects ] = useState([])
    const [query, setQuery] = useState("")
    const [queryLocation, setQueryLocation] = useState("")
    const [querySallary, setQuerySallary] = useState("")
    const [keySearch, setKeySearch] = useState(false)
    const [searchBy, setSearchBy] = useState("")
    const [category, setCategory] = useState([])
    const [advSearch, setAdvSearch] = useState(false)
    const [categoryBy, setCategoryBy] = useState("")
    const [categoryPick, setCategoryPick] = useState(false)
    const [filteredCategory, setFilteredCategory] = useState([])
    const [sortBy, setSortBy] = useState("A-Z")
    const [result, setResult] = useState([])
    const [page, setPage] = useState(0)
    const [searchCount, setSearchCount] = useState(10)
    const [sortSallaryText, setSortSallaryText] = useState("")
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
    
    useEffect(() => {
        const getCategory = async () => {
          try {
            const res = await Axios.get("/api/categories")
            setCategory(res.data)
          } catch (err) {
            console.log(err)
          }
        }
        getCategory()
    }, [])

    useEffect(() => {
        const tags = category.filter((tags) => tags.name ===categoryBy)
        setFilteredCategory(tags[0]?.tags)
    }, [categoryBy])

    async function getProjects() {
        try {
            const res = await Axios.get("/api/hiring-search", {params: {
                query: query,
                location: queryLocation,
                key: searchBy,
                sort: sortBy,
                sallary: querySallary,
            }})
            setPage(0),
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
    
    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }

    return (
        <div className="searchComponent">
            <div ref={topPage}></div>
            <div className="searchTop">
                <div className="searchTopSearch">
                    <div className="quickSearch">
                        <button className="btn btn-outline-success allButtons" onClick={()=> {
                                    if (advSearch === false) {
                                        setAdvSearch(true)
                                    }
                                    if (advSearch === true) {
                                        setAdvSearch(false)
                                        setCategoryPick(false)
                                        setCategoryBy("")
                                    }
                                }}>
                                    Categories
                        </button>
                    </div>
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
                            <img src={"/WebPhoto/search.png"} alt={"search icon"} />
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
                                {searchBy==="" ? <i class="arrow down"></i>: <label className="closeIcon"><b>&times;</b></label>}
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
                                {querySallary==="" ? <i class="arrow down"></i>: <label className="closeIcon"><b>&times;</b></label>}
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
                                if (sortBy!=="A-Z") {
                                    setSortBy("A-Z")
                                }
                            }}>
                                {sortBy!=="" ? sortBy+" " : "Sort by "} 
                                <i class="arrow down"></i>
                            </button>
                            <div className="dropdown-content">
                                <label className="dropdownitem" onClick={()=>{setSortBy("Longest Duration")}}>
                                    Longest Duration
                                </label>
                                <label className="dropdownitem" onClick={()=>{setSortBy("Shortest Duration")}}>
                                    Shortest Duration
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
                                                        return <label className="selectedTagLabel" key={idPlusKey(categoryBy, b)} onClick={()=>{
                                                                    setQuery(b),
                                                                    setCategoryBy("")
                                                                    setCategoryPick(false)
                                                                    setAdvSearch(false)
                                                                }}>{b}</label>
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

            <div className="searchBot">
                {result[0] ? 
                    <div className="searchHiringList">
                    {result[page]?.map((a) => {
                        return (
                            <div className="searchHiring" key={a._id} onClick={()=>{
                                if (userData?.user?.id===a?.employer?._id) {
                                    navigate("/project", {state: {_id: a._id}})
                                } 
                                if (userData?.user?.id!==undefined && userData?.user?.id!==a?.employer?._id) {
                                    navigate("/project", {state: {_id: a._id, applicantid: userData?.user?.id ? userData.user.id : null, usertype: userData.user.type}})
                                }
                                if (userData?.user?.id===undefined) {
                                    navigate("/project", {state: {_id: a._id, applicantid: userData?.user?.id ? userData.user.id : null, usertype: null}})
                                }
                            }}>
                                <div className="searchHiringTop">
                                    <img src={a.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/w_300,h_200,c_fill,q_85/${a.image}.jpg` : "/fallback.png"} className="hiringImg" alt={`${a.company} named ${a.title}`}></img>
                                    <div>
                                        <p><b>{a.type}</b>: {a.skillrequired} (<i>{a.employmenttype}</i>)</p>
                                        <p>Hiring <b>{a?.slots ? a.slots : "unspecified"}</b> people for this position.</p>
                                    </div>
                                </div>
                                <br />
                                <div className="searchHiringBot">
                                    <p className="text-muted small">
                                        Company: {a.company!== "undefined" ? a.company : <i>Not specified.</i>}<br />
                                        Location: {a.location?.city ? (a.location?.city+", ") : ""} {a.location?.province ? (a.location?.province+", ") : ""} {a.location?.region}<br />
                                        Duration: {a.duration} month(s)
                                    </p>
                                    <p className="text-muted small">Posted {format(a.approvaldate)}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                    :<span className="searchList">No Hiring(s) found.</span>}
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
        </div>
    )
}

export default Hiring