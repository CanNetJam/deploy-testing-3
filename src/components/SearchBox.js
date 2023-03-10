import React, {useState, useEffect, useContext} from "react"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../home"

function SearchBox({projectid, projecttype}) {
    const cloud_name = "dzjkgjjut"
    let navigate = useNavigate()
    const { userData, setUserData } = useContext(UserContext)
    const [accounts, setAccounts] = useState([])
    const [query, setQuery] = useState("")
    const [keySearch, setKeySearch] = useState(false)
    const [searchBy, setSearchBy] = useState("Skill")
    const [category, setCategory] = useState([])
    const [advSearch, setAdvSearch] = useState(false)
    const [categoryBy, setCategoryBy] = useState("")
    const [categoryPick, setCategoryPick] = useState(false)
    const [filteredCategory, setFilteredCategory] = useState([])
    const [sortBy, setSortBy] = useState("A-Z (First Name)")
    const [result, setResult] = useState([])
    const [page, setPage] = useState(0)
    const [searchCount, setSearchCount] = useState(10)

    const [btnSearchBy, setBtnSearchBy] = useState("")
    const [btnSortBy, setBtnSortBy] = useState("")
    const [btnSearchCount, setBtnSearchCount] = useState()

    let length = accounts.length
    let index = 0

    useEffect(() => {
        let isCancelled = false
        const getAccounts = async () => {
          try {
            const res = await Axios.get("/api/employee-search", {params: {
                query: query,
                key: searchBy,
                sort: sortBy
            }})
            if (!isCancelled) {
                setAccounts(res.data)
            }
          } catch (err) {
            console.log(err)
          }
        }
        if (query.length === 0 || query.length > 1) getAccounts()
        
        return ()=> {
            isCancelled = true
        }
    }, [query, searchBy, sortBy, searchCount])

    useEffect(() => {
        const getFiltered = async () => {
            setResult([])
            let slice = (source, index) => source.slice(index, index + searchCount)
            while (index < length) {
                let temp = [slice(accounts, index)]
                setResult(prev=>prev.concat(temp))
                index += searchCount
            }
        }
        getFiltered()
    }, [accounts, searchBy, sortBy, searchCount])
    
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

    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }

    function queryPlaceHolder(a) {
        if (!a) {
            return `Search by ${searchBy}...`
        }
        if (a) {
            return `${a}...`
        }
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
                                Categories
                    </button>
                </div>

                <div className="searchBar">
                    <input
                        type="text"
                        className="searchBox"
                        placeholder={queryPlaceHolder(query)}
                        onChange={(e) => setQuery(e.target.value)}
                    />
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

                    <div className="keyPicker">
                        {keySearch && (
                            <div className="advanceSearch">
                                <div>
                                    <h4>Search by:</h4>
                                    <div className="searchAdvWrapper">
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSearchBy("Skill")}}>
                                            <b>Skill</b>
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{
                                            setBtnSearchBy("Name")
                                            setQuery("")
                                            }}>
                                            <b>Name</b>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h4>Sort by:</h4>
                                    <div className="searchAdvWrapper">
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("Highest Rating")}}>
                                            Highest Rating
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("Lowest Rating")}}>
                                            Lowest Rating
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("A-Z (First Name)")}}>
                                            A-Z (First Name)
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("Z-A (First Name)")}}>
                                            Z-A (First Name)
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("A-Z (Last Name)")}}>
                                            A-Z (Last Name)
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={()=>{setBtnSortBy("Z-A (Last Name)")}}>
                                            Z-A (Last Name)
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h4>Show results by:</h4>
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
                                        if (btnSearchBy!=="") {
                                            setSearchBy(btnSearchBy)
                                        }
                                        if (btnSortBy!=="") {
                                            setSortBy(btnSortBy)
                                        }
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
                    <div className="searchList">
                    {result[page]?.map((a) => {
                        return (
                            <div className="searchItem" key={a._id} onClick={()=>{
                                if (userData?.user?.id===a._id) {
                                    navigate("/profile/user")
                                } 
                                if (userData?.user?.id!==a._id) {
                                    navigate("/search-profile", {state: {_id: a._id, projectid: projectid ? projectid : null,
                                        projecttype: projecttype, toHire: "No"}})
                                }
                                if (userData?.user===undefined) {
                                    navigate("/search-profile", {state: {_id: a._id, projectid: projectid ? projectid : null, toHire: "No"}})
                                }
                            }}>
                                <div className="searchBoxProfileTop">
                                    <img src={a.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/w_300,h_200,c_fill,q_85/${a.image}.jpg` : "/fallback.png"} className="searchImg" ></img>
                                    {a.ratings[0] ? 
                                        <div>
                                            <p>Average Rating: <b>{a.averagerating}</b> <br></br>({a.ratings.length}) review(s).</p>
                                        </div>
                                    : 
                                    <div>
                                        <p>No ratings yet.</p>
                                    </div>}
                                </div>
                                <div className="searchBoxProfileBot">
                                    <p className="p1">{a.firstname} {a.middlename ? a.middlename?.charAt(0).toUpperCase()+". " : " "} {a.lastname}</p>
                                    <p className="p2">
                                        {a.skill.map((b)=> {
                                            return (
                                                <div>
                                                    <label key={idPlusKey(a._id, b)}>{b},</label>
                                                </div>
                                            )  
                                        })}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                    :<span className="searchList">No Applicant(s) found.</span>}
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

export default SearchBox