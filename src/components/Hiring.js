import React, {useState, useEffect, useContext} from "react"
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

    const [btnSearchBy, setBtnSearchBy] = useState("")
    const [btnSortBy, setBtnSortBy] = useState("")
    const [btnFilterSallary, setBtnFilterSallary] = useState("")
    const [btnSearchCount, setBtnSearchCount] = useState()
    
    let length = projects.length
    let index = 0
    console.log(result)
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
    }, [projects, queryLocation, querySallary, searchBy, sortBy, searchCount])
    
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
    }, [searchBy, sortBy, searchCount, queryLocation, querySallary,])
    
    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }

    return (
        <div className="searchComponent">
            <div className="searchTop">
                <div className="quickSearch">
                    <button className="btn btn-sm btn-primary" onClick={()=> {
                                if (advSearch === false) {
                                    setAdvSearch(true)
                                }
                                if (advSearch === true) {
                                    setAdvSearch(false)
                                    setCategoryPick(false)
                                    setCategoryBy("")
                                }
                            }}>
                                Quick Search
                    </button>
                </div>

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
                                        <label>Sallary range: {sortSallaryText}</label>
                                        {querySallary==="" ? 
                                        <>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnFilterSallary("1")
                                            setSortSallaryText("less than ₱ 10, 001")
                                        }}>
                                            <b>less than ₱ 10, 001</b>
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnFilterSallary("2")
                                            setSortSallaryText("₱ 10, 001 to ₱ 25, 000")
                                        }}>
                                            <b>₱ 10, 001 to ₱ 25, 000</b>
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnFilterSallary("3")
                                            setSortSallaryText("₱ 25, 001 to ₱ 50, 000")
                                        }}>
                                            <b>₱ 25, 001 to ₱ 50, 000</b>
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnFilterSallary("4")
                                            setSortSallaryText("₱ 50, 001 to ₱ 100, 000")
                                        }}>
                                            <b>₱ 50, 001 to ₱ 100, 000</b>
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnFilterSallary("5")
                                            setSortSallaryText("more than ₱ 100, 000")
                                        }}>
                                            <b>more than ₱ 100, 000</b>
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
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("Longest Duration")}}>
                                            Longest Duration
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("Shortest Duration")}}>
                                            Shortest Duration
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
                                                    return <button className="btn btn-sm btn-primary" key={idPlusKey(categoryBy, b)} onClick={()=>{
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
            ): <></>}

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
                                        <p>Looking for {a.employmenttype}: {a.skillrequired}</p>
                                    </div>
                                </div>
                                <br />
                                <div className="searchHiringBot">
                                    <p className="text-muted small">
                                        {a?.minimumreq?.what!=="Others" ?
                                            <label>Minimum Requirements: {a?.minimumreq?.what}</label>
                                        :<label>Minimum Requirements: {a?.minimumreq?.note}</label>}
                                        <br />
                                        Company: {a.company!== "undefined" ? a.company : <i>Not specified.</i>}<br />
                                        Sallary: ₱ {a.sallary}<br />
                                        Location: {a.location?.city ? (a.location?.city+", ") : ""} {a.location?.province ? (a.location?.province+", ") : ""} {a.location?.region}<br />
                                        Duration: {a.duration} month(s)
                                    </p>
                                    <p className="text-muted small">Posted {format(a.creationdate)}</p>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                    :<span className="searchList">No Hiring(s) found.</span>}
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
        </div>
    )
}

export default Hiring