import React, { useState, useEffect, useContext, useRef } from "react"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../home"
import {format} from "timeago.js"
import moment from "moment"

function AllAccounts(){
    const cloud_name = "dzjkgjjut"
    let navigate = useNavigate()
    const { userData, setUserData } = useContext(UserContext)
    const [accounts, setAccounts] = useState([])
    const [query, setQuery] = useState("")
    const [keySearch, setKeySearch] = useState(false)
    const [searchBy, setSearchBy] = useState("Name")
    const [category, setCategory] = useState([])
    const [advSearch, setAdvSearch] = useState(false)
    const [categoryBy, setCategoryBy] = useState("")
    const [categoryPick, setCategoryPick] = useState(false)
    const [filteredCategory, setFilteredCategory] = useState([])
    const [sortBy, setSortBy] = useState("A-Z (First Name)")
    const [result, setResult] = useState([])
    const [page, setPage] = useState(0)
    const [searchCount, setSearchCount] = useState(10)
    const topPage = useRef(null)
    let length = accounts.length
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
        let isCancelled = false
        const getAccounts = async () => {
          try {
            const res = await Axios.get("/api/all-accounts", {
              params: {
                usertype: userData.user.type,
                query: query,
                key: searchBy,
                sort: sortBy
              },
              headers: {'auth-token': userData.token}
            })
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

    async function startConversation(props) {
      const members = [userData.user.id, props]
      try {
            const prevConvo = await Axios.get("/api/get-conversation/", {params: {
                member1: userData.user.id,
                member2: props
            }})
            if (prevConvo.data) {
                navigate("/messages", {state: {_id: prevConvo.data}})
            }
            if (prevConvo.data === null) {
                const createConvo = await Axios.post("/api/create-conversation", members)
                navigate("/messages", {state: {_id: createConvo.data}})
            }
        }catch (err) {
            console.log(err)
        }
    }

    async function deactivateAccount (props) {
        let data
        try {
            const res = await Axios.post(`/api/deactivate-account/${props}`, data, {headers: {'auth-token': userData.token}})
            setAccounts(prev=>
                prev.map(function(account){
                    if (account._id==res.data._id) {
                        return {
                            ...account, skill: []
                        }
                    }
                    return account
                })
            )
        } catch (err) {
            console.log(err)
        }
    }

    async function AdminEdit(props) {
        navigate("/profile/user", {state: {account: props}})
    }
    
    return(
        <div className="accountsList">
            <div ref={topPage}></div>
            <div className="contentTitle">
                <label><b>List of Accounts</b></label>
            </div>
            <br/>
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
                            placeholder={queryPlaceHolder(query)}
                            onChange={(e) => setQuery(e.target.value)}
                        />
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
                        {keySearch && (
                            <div className="flexContent">
                                <div className="dropdownHover">
                                    <button className="btn btn-outline-success allButtons dropbtn" onClick={()=>{searchBy!=="Skill" ? setSearchBy("Skill"): null}}>
                                        {searchBy!=="" ? searchBy+" " : "Search by "} 
                                        <i class="arrow down"></i>
                                    </button>
                                    <div className="dropdown-content">
                                        <label className="dropdownitem" onClick={()=>{setSearchBy("Skill")}}>
                                            Skill
                                        </label>
                                        <label className="dropdownitem" onClick={()=>{
                                            setSearchBy("Name")
                                            setQuery("")
                                            }}>
                                            Name
                                        </label>
                                    </div>
                                </div>

                                <div className="dropdownHover">
                                    <button className="btn btn-outline-success allButtons dropbtn" onClick={()=>{
                                        if (sortBy!=="Highest Rating") {
                                            setSortBy("Highest Rating")
                                        }
                                    }}>
                                        {sortBy!=="" ? sortBy+" " : "Sort by "} 
                                        <i class="arrow down"></i>
                                    </button>
                                    <div className="dropdown-content">
                                        <label className="dropdownitem" onClick={()=>{setSortBy("Highest Rating")}}>
                                            Highest Rating
                                        </label>
                                        <label className="dropdownitem" onClick={()=>{setSortBy("Lowest Rating")}}>
                                            Lowest Rating
                                        </label>
                                        <label className="dropdownitem" onClick={()=>{setSortBy("A-Z (First Name)")}}>
                                            A-Z (First Name)
                                        </label>
                                        <label className="dropdownitem" onClick={()=>{setSortBy("Z-A (First Name)")}}>
                                            Z-A (First Name)
                                        </label>
                                        <label className="dropdownitem" onClick={()=>{setSortBy("A-Z (Last Name)")}}>
                                            A-Z (Last Name)
                                        </label>
                                        <label className="dropdownitem" onClick={()=>{setSortBy("Z-A (Last Name)")}}>
                                            Z-A (Last Name)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                                        return <label className="selectedTagLabel" key={idPlusKey(categoryBy, b)} onClick={()=>{
                                                                    setQuery(b),
                                                                    setSearchBy("Skill")
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
                ): <></>}

            <div className="centerContent">
            <div className="tableList">
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th><div className="constantHW">Type</div></th>
                            <th><div className="constantHW">Photo</div></th>
                            <th><div className="constantHW">First Name</div></th>
                            <th><div className="constantHW">Middle Name</div></th>
                            <th><div className="constantHW">Last Name</div></th>
                            <th><div className="constantHW">Email</div></th>
                            <th><div className="constantHW">Age</div></th>
                            <th><div className="constantHW">Adress</div></th>
                            <th><div className="constantHW">Skill(s)</div></th>
                            <th><div className="constantHW">Last Activity</div></th>
                            
                            <th><div className="constantHW">Profile</div></th>
                            <th><div className="constantHW">Actions</div></th>
                        </tr>
                    </thead>
                    <tbody>
                    {result[0] ? 
                        <>
                        {result[page]?.map((acc) => {
                            return (
                                <tr key={acc._id}>
                                    <td>{((accounts.indexOf(acc))+1)<10 ? "0"+((accounts.indexOf(acc))+1) : ((accounts.indexOf(acc))+1) }</td>
                                    <td><div className="constantHW">{acc.type}</div></td>
                                    <td><div className="constantHW"><img src={acc.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/w_300,h_200,c_fill,q_85/${acc.image}.jpg` : "/fallback.png"} className="messageImg"></img></div></td>
                                    <td><div className="constantHW">{acc.firstname}</div></td>
                                    <td><div className="constantHW">{acc.middlename ? acc.middlename : "-"}</div></td>
                                    <td><div className="constantHW">{acc.lastname}</div></td>
                                    <td><div className="constantHW">{acc.email}</div></td>
                                    <td><div className="constantHW">{acc.age}</div></td>
                                    <td><div className="constantHW">{acc.location?.city}, {acc.location?.province}, {acc.location?.region}</div></td>

                                    <td><div className="constantHW">
                                        {acc.skill[0] ?
                                        <>
                                            {acc.skill.map((a)=>{
                                            return (
                                                <div>
                                                <label>{a},</label>
                                                </div>
                                            )
                                            })}
                                        </>
                                        :<>Not specified.</>}
                                    </div></td>

                                    <td><div className="constantHW">
                                        {acc.lastactive ? moment(acc.lastactive).format("MMM. DD, YYYY"): "No data."}<br />
                                        ({format(acc.lastactive ? acc.lastactive : "No data.")})
                                    </div></td>

                                    <td><div className="constantHW">
                                        <button className="btn btn-outline-success allButtons" onClick={()=> {
                                            navigate("/search-profile", {state: {_id: acc._id, type: acc.type, companyinfo:acc.companyinfo, projectid: ""}})
                                        }}>
                                            Profile
                                        </button>
                                    </div></td>
                                    <td><div className="constantHW">
                                        {acc.type!=="Employer" ? null :
                                        <button className="btn btn-outline-success allButtons" onClick={()=> {
                                            startConversation(acc._id)
                                        }}>
                                            Chat
                                        </button>
                                        }

                                        <button className="btn btn-outline-success allButtons" onClick={()=> {
                                            AdminEdit(acc)
                                        }}>
                                            Edit
                                        </button>
                                        <button className="btn btn-outline-success allButtons" onClick={()=> {
                                            deactivateAccount(acc._id)
                                        }}>
                                            Deactivate
                                        </button>
                                    </div></td>
                                </tr>
                            )
                        }
                        )}
                    </>:<></>}
                    </tbody>
                </table>
            </div>
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

export default AllAccounts