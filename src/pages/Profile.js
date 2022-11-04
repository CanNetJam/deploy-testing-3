import React, { useState, useEffect, useContext } from "react"
import {UserContext} from "../home"
import Axios from "axios"
import RatingsAndReviews from "../components/Ratings&Reviews"
import Gallery from "../components/Gallery"
import { useLocation } from 'react-router-dom'
import moment from "moment"

function Profile(){
  const location = useLocation()
  const { userData, setUserData } = useContext(UserContext)
  const [ accounts, setAccounts ] = useState([location.state?.account ? location.state.account : userData.user])
  const [ theFree, setTheFree ] = useState(false)
  
  useEffect(()=> {
    const whatType = async () => {
      if(userData.user.type==="Candidate" || location.state?.account.type==="Candidate") {
          setTheFree(prev => prev=true)
      }
    }
    whatType()
  }, [])
  
  return(
    <div>
      {accounts.map(function(Accounts) {
        return <UserProfile 
          key={location.state?.account ? location.state?.account._id : Accounts.id} 
          firstname ={Accounts.firstname} 
          lastname ={Accounts.lastname} 
          middlename ={Accounts.middlename} 
          age ={Accounts.age} 
          address ={Accounts.address} 
          photo={Accounts.photo} 
          id={location.state?.account ? location.state?.account._id : Accounts.id} 
          about ={Accounts.about} 
          company ={Accounts.company} 
          position={Accounts.position} 
          type ={Accounts.type} 
          ratings={Accounts.ratings} 
          averagerating={Accounts.averagerating} 
          currentprojects={Accounts.currentprojects}
          theFree={theFree}
          setAccounts={setAccounts} />
      })}
    </div>
  )
}

function UserProfile(props) {
  const location = useLocation()
  const { userData, setUserData } = useContext(UserContext)
  const [isEditing, setIsEditing] = useState(false)
  const [file, setFile] = useState()
  const [file2, setFile2] = useState()
  const [draftFirstName, setDraftFirstName] = useState("")
  const [draftLastName, setDraftLastName] = useState("")
  const [draftMiddleName, setDraftMiddleName] = useState("")
  const [draftAge, setDraftAge] = useState(0)
  const [draftAddress, setDraftAddress] = useState("")
  const [draftAbout, setDraftAbout] = useState("")
  const [draftCompany, setDraftCompany] = useState("")
  const [draftPosition, setDraftPosition] = useState("")

  const [category, setCategory] = useState([])
  const [categoryBy, setCategoryBy] = useState("")
  const [advSearch, setAdvSearch] = useState(false)
  const [categoryPick, setCategoryPick] = useState(false)
  const [removeTag, setRemoveTag] = useState(false)
  const [theTag, setTheTag] = useState("")
  const [btnTheTag, setBtnTheTag] = useState("")
  const [addTag, setAddTag] = useState("")
  const [addTagSelected, setAddTagSelected] = useState(false)

  const [userSkill, setUserSkill] = useState([])
  const [filteredCategory, setFilteredCategory] = useState([])
  
  useEffect(() => {
    const user = location.state?.account ? location.state.account._id : userData.user.id
    const getSkill = async () => {
      try {
        const res = await Axios.get("/api/user-skill/"+ user)
        setUserSkill(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getSkill()
  }, [])

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

  async function submitHandler(e) {
    e.preventDefault()
    setIsEditing(false)
    setRemoveTag(false)
    setAddTagSelected(false)
    setCategoryPick(false)
    setCategoryBy("")
    setAdvSearch(false)
    props.setAccounts(prev =>
      prev.map(function (Accounts) {
        if (Accounts.id == props.id) {
          return { ...Accounts, firstname: draftFirstName, lastname: draftLastName, middlename: draftMiddleName, age: draftAge, address: draftAddress, about: draftAbout, company: draftCompany, position: draftPosition}
        }
        return Accounts
      })
    )
    const data = new FormData()
    if (file) {
      data.append("photo", file)
    }
    data.append("_id", props.id)
    data.append("firstname", draftFirstName)
    data.append("lastname", draftLastName)
    data.append("middlename", draftMiddleName)
    data.append("age", draftAge)
    data.append("address", draftAddress)
    data.append("about", draftAbout)
    data.append("company", draftCompany)
    data.append("position", draftPosition)
    
    const newPhoto = await Axios.post("/update-account", data, { headers: { "Content-Type": "multipart/form-data" } })

    if (theTag) {
      try {
        const rmvTag = await Axios.post("/api/remove-tag/", {params: {
          user: userSkill._id,
          tag: theTag
        }})
        setUserSkill(rmvTag.data)
      } catch (err) {
        console.log(err)
      }
    }

    if (addTag) {
      try {
        const adTag = await Axios.post("/api/add-tag/", {params: {
          user: userSkill._id,
          tag: addTag
        }})
        setUserSkill(adTag.data)
      } catch (err) {
        console.log(err)
      }
    }
   
    if (newPhoto.data) {
      props.setAccounts(prev => {
        return prev.map(function (Accounts) {
          if (Accounts.id == props.id) {
            return { ...Accounts, photo: newPhoto.data }
          }
          return Accounts
        })
      })
    }
  }

  function expectedMonth(props){
    let a = Number(moment(props.acceptdate).format("MM"))
    let c = Number(moment(props.acceptdate).format("YYYY"))
    let d = props.duration
    let total = a
    for(let i = 0; i<d ; i++){
      total += 1
    }
    if (total>12) {
      total= total-12,
      c= c+1
    }
    return {
      month: Number(total-1),
      year: Number(c)
    }
  }

  function idPlusKey(a, b) {
    const key = a + b 
    return key
  }
  
  return (
    <div className="profileCard">
      <div className="profileCardTop">
        <div className="profile-ProfilePhotoWrapper">
          {isEditing && (
            <div className="our-custom-input">
              <div className="our-custom-input-interior">
                <input onChange={e => setFile(e.target.files[0])} className="form-control form-control-sm" type="file" />
              </div>
            </div>
          )}
          <img className="profile-ProfilePhoto"src={props.photo ? `/uploaded-photos/${props.photo}` : "/fallback.png"} alt={`${props.age} named ${props.lastname}`} />
        </div>
        
        <div className="profileCardTextWrapper">
          {!isEditing && (
            <div className="profileCardText">
              <h4><b>{props.type}: </b> {props.firstname} {props.middlename ? props.middlename?.charAt(0).toUpperCase()+". " : " "} {props.lastname} </h4>
              <p>Age: {props.age}</p>
              <p>Adress: {props.address}</p>
              {props?.theFree && (
                <p> Skill(s): {userSkill.skill?.map((a)=> {
                return <label key={idPlusKey(props.id, a)}>{a ? (a)+", " : <></>} </label>
                })} </p>
              )}
              {props.type==="Employer" ? 
                <div>
                  <p>Company: {props?.company ? props.company : ""}</p>
                  <p>Position: {props?.position ? props.position : ""}</p>
                </div>
              :<></>}
              <p>About: {props.about}</p>
              {!props.readOnly && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setDraftFirstName(props.firstname)
                      setDraftLastName(props.lastname)
                      setDraftMiddleName(props.middlename)
                      setDraftAge(props.age)
                      setDraftAddress(props.address)
                      setDraftAbout(props.about)
                      setDraftCompany(props.company)
                      setDraftPosition(props.position)
                      setFile("")
                    }}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </button>{" "}
                </>
              )}
              <div className="profileCardText">
                {props?.currentprojects[0] ? 
                  <div>
                    <p>Currently Occupied!</p>
                    {props?.currentprojects?.map((a)=> {
                      return (
                        <div key={idPlusKey(props?.id, a.title)}>
                          <p>{a.type}: {a.title}</p>
                          <p>Duration: {a.duration} month(s)</p>
                          <p>Began at: {moment(a.acceptdate).format("MMM. DD, YYYY")}</p>
                          <p>Expected to end at: {moment(expectedMonth(a)).format("MMM. YYYY")}</p>
                        </div>
                      )
                    })}
                  </div>
                : <>This user has no ongoing job or projects.</>}
              </div>
            </div>
          )}

          {isEditing && (
            <form className="settingsForm" onSubmit={submitHandler}>
              <div className="mb-1">
                <label>First Name:</label>
                <input autoFocus onChange={e => setDraftFirstName(e.target.value)} type="text" className="form-control form-control-sm" value={draftFirstName} placeholder="firstname" />
              </div>
              <div className="mb-1">
                <label>Last Name:</label>
                <input autoFocus onChange={e => setDraftLastName(e.target.value)} type="text" className="form-control form-control-sm" value={draftLastName} placeholder="lastname"/>
              </div>
              <div className="mb-1">
                <label>Middle Name: (Optional)</label>
                <input autoFocus onChange={e => setDraftMiddleName(e.target.value)} type="text" className="form-control form-control-sm" value={draftMiddleName} placeholder="middlename"/>
              </div>
              <div className="mb-2">
                <label>Age:</label>
                <input onChange={e => setDraftAge(e.target.value)} type="number" className="form-control form-control-sm" value={draftAge} placeholder="age"/>
              </div>
              <div className="mb-2">
                <label>Adress:</label>
                <input onChange={e => setDraftAddress(e.target.value)} type="text" className="form-control form-control-sm" value={draftAddress} placeholder="address"/>
              </div>
              <div className="mb-2">
                <label>About:</label>
                <input onChange={e => setDraftAbout(e.target.value)} type="text" className="form-control form-control-sm" value={draftAbout} placeholder="about"/>
              </div>

              {props.type==="Employer" ? 
                <div>
                  <div className="mb-1">
                    <label>Company: </label>
                    <input autoFocus onChange={e => setDraftCompany(e.target.value)} type="text" className="form-control form-control-sm" value={draftCompany} placeholder="Company Name"/>
                  </div>
                  <div className="mb-2">
                    <label>Current Position:</label>
                    <input onChange={e => setDraftPosition(e.target.value)} type="text" className="form-control form-control-sm" value={draftPosition} placeholder="Job/Postion at work"/>
                  </div>
                </div>
              :<></>}

              {props?.theFree && (
                <div className="mb-2">
                  <label>Skill(s):</label>
                  <div>
                    {userSkill.skill?.map((a)=> {
                      return (
                        <button type="button" className="btn btn-sm btn-primary" key={idPlusKey(props.id, a)} onClick={()=> {
                          setRemoveTag(true), setBtnTheTag(a)
                        }}>{a}</button>
                      )
                    })}
                    {removeTag && (
                      <div>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={()=> {
                          setTheTag(btnTheTag), setRemoveTag(false)
                        }}>Remove?</button>
                      </div>
                    )}
                  </div>

                  <button type="button" className="btn btn-sm btn-primary" onClick={()=>{
                    if (advSearch===false) {
                      setAdvSearch(true)
                    }
                    if (advSearch===true) {
                      setAdvSearch(false)
                    }
                  }}>Add Skill.</button>

                  {addTagSelected && (
                    <div>
                      <p>
                        Adding "{addTag}" to your skill list.
                      </p>
                    </div>
                  )}

                  {advSearch===true? (
                    <div className="searchAdv">
                        {category.map((a)=> {
                            return (
                                <div key={a._id}>
                                    <label className="selectedCategory" onClick={()=>{
                                        setCategoryBy(a.name)
                                        setCategoryPick(true) 
                                    }}>{a.name}</label>
                                    {a.name===categoryBy ? 
                                        <div>
                                            {categoryPick && (
                                                <div className="searchTabs">
                                                    {filteredCategory?.map((b)=> {
                                                        return <button className="tagButton" key={idPlusKey(categoryBy, b)} onClick={()=>{
                                                                    setAddTag(b),
                                                                    setAddTagSelected(true)
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

                </div>
              )}
              
              <button className="btn btn-sm btn-primary">Save</button>{" "}
              <button onClick={() =>{
                setIsEditing(false), 
                setRemoveTag(false), 
                setAddTagSelected(false),
                setCategoryPick(false),
                setCategoryBy("Select Category"),
                setAdvSearch(false)
              }} className="btn btn-sm btn-outline-secondary">
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="profileCardMid">
        <Gallery candidate={props.id} admin={location.state ? location.state : null}/>
      </div>
      <div className="profileCardBot">
        {props.theFree && (
          <RatingsAndReviews ratings={props.ratings} averagerating={props.averagerating} candidate={props.id}/>
        )}
      </div>
    </div>
  )
}

export default Profile