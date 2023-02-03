import React, { useState, useEffect, useContext } from "react"
import {UserContext} from "../home"
import Axios from "axios"
import RatingsAndReviews from "../components/Ratings&Reviews"
import Gallery from "../components/Gallery"
import { useLocation } from 'react-router-dom'
import moment from "moment"
import {format} from "timeago.js"

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
          location ={Accounts.location} 
          photo={Accounts.photo} 
          image={Accounts.image} 
          id={location.state?.account ? location.state?.account._id : Accounts.id} 
          about ={Accounts.about} 
          company ={Accounts.company} 
          position={Accounts.position} 
          type ={Accounts.type} 
          ratings={Accounts.ratings} 
          averagerating={Accounts.averagerating} 
          currentprojects={Accounts.currentprojects}
          theFree={theFree}
          lastactive ={Accounts.lastactive} 
          setAccounts={setAccounts} />
      })}
    </div>
  )
}

function UserProfile(props) {
  const location = useLocation()
  const api_key = "848182664545332"
  const cloud_name = "dzjkgjjut"
  const { userData, setUserData } = useContext(UserContext)
  const [isEditing, setIsEditing] = useState(false)
  const [file, setFile] = useState()
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

  const [ regions, setRegions ] = useState([])
  const [ provinces, setProvinces ] = useState([])
  const [ cities, setCities ] = useState([])
  const [ filteredRegions, setFilteredRegions ] = useState([])
  const [ filteredProvinces, setFilteredProvinces ] = useState([])
  const [ filteredCities, setFilteredCities ] = useState([])
  const [ selectedRegion, setSelectedRegion ] = useState("")
  const [ selectedProvince, setSelectedProvince ] = useState("")
  const [ selectedCity, setSelectedCity ] = useState("")
  const [ region, setRegion ] = useState("")
  const [ province, setProvince ] = useState("")
  const [ city, setCity ] = useState("")

  useEffect(() => {
    const getLocations = async () => {
      try {
        const res1 = await Axios.get("https://ph-locations-api.buonzz.com/v1/regions")
        setRegions(res1.data.data)

        const res2 = await Axios.get("https://ph-locations-api.buonzz.com/v1/provinces")
        setProvinces(res2.data.data)
        
        const res3 = await Axios.get("https://ph-locations-api.buonzz.com/v1/cities")
        setCities(res3.data.data)
      } catch (err) {
        console.log(err)
      }
    }
    getLocations()
  }, [])

  useEffect(() => {
    setFilteredRegions([])
    if (selectedRegion!=="" && selectedRegion!==props.location?.region) {
      if (region==="") {
        const data = regions?.filter((item) => item.name.includes(selectedRegion.toUpperCase()))
        setFilteredRegions(data)
      }
    }
    if (selectedRegion==="" && isEditing===true) {
      setRegion("")
    }
  }, [selectedRegion])

  useEffect(() => {
    setFilteredProvinces([])
    if (selectedProvince!=="" && selectedProvince!==props.location?.province) {
      if (province==="") {
        const data = provinces?.filter((item) => (item.region_code=== region?.id) 
        && (item.name.includes(selectedProvince.toUpperCase())))
        setFilteredProvinces(data)
      }
    }
    if (selectedProvince==="" && isEditing===true) {
      setProvince("")
    }
  }, [selectedRegion, selectedProvince])

  useEffect(() => {
    setFilteredCities([])
    if (selectedCity!=="" && selectedCity!==props.location?.city) {
      if (city==="") {
        const data = cities?.filter((item) => (item.region_code=== region?.id) && 
        (item.province_code=== province?.id) && 
        (item.name.includes(selectedCity.toUpperCase())))
        setFilteredCities(data)
      }
    }
    if (selectedCity==="" && isEditing===true) {
      setCity("")
    }
  }, [selectedRegion, selectedProvince, selectedCity])
  
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
          return { ...Accounts, firstname: draftFirstName, lastname: draftLastName, 
            middlename: draftMiddleName, age: draftAge, 
            address: draftAddress, about: draftAbout, 
            company: draftCompany, position: draftPosition,
            location: {region: region.name, province: province.name, city: city.name} }
        }
        return Accounts
      })
    )
    const data = new FormData()
    if (file) {
      data.append("photo", file)
      const signatureResponse = await Axios.get("/get-signature")

      const image = new FormData()
      image.append("file", file)
      image.append("api_key", api_key)
      image.append("signature", signatureResponse.data.signature)
      image.append("timestamp", signatureResponse.data.timestamp)
    
      const cloudinaryResponse = await Axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, image, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: function (e) {
          console.log(e.loaded / e.total)
        }
      })
      let cloud_image = cloudinaryResponse.data.public_id
  
      data.append("image", cloud_image)
      data.append("public_id", cloudinaryResponse.data.public_id)
      data.append("version", cloudinaryResponse.data.version)
      data.append("signature", cloudinaryResponse.data.signature)

      if (cloudinaryResponse) {
        props.setAccounts(prev => {
          return prev.map(function (Accounts) {
            if (Accounts.id == props.id) {
              return { ...Accounts, image: cloud_image }
            }
            return Accounts
          })
        })
      }
    }
    data.append("_id", props.id)
    data.append("firstname", draftFirstName)
    data.append("lastname", draftLastName)
    data.append("middlename", draftMiddleName)
    data.append("age", draftAge)
    data.append("address", draftAddress)
    data.append("region", region.name)
    data.append("province", province.name)
    data.append("city", city.name)
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
  }

  function expectedMonth(props){
    let a = Number(moment(props.acceptdate).format("MM"))
    let c = Number(moment(props.acceptdate).format("YYYY"))
    let d = props.duration
    let total = a
    if (d<12) {
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
    if (d>12) {
      total = d%12
      let yeartotal = parseInt(d/12)
      c= c+yeartotal
      return {
        month: Number(total-1),
        year: Number(c)
      }
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
          <img src={props.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/w_300,h_200,c_fill,q_85/${props.image}.jpg` : "/fallback.png"} className="profile-ProfilePhoto" alt={`${props.company} named ${props.title}`}></img>
        </div>
        
        <div className="profileCardTextWrapper">
          {!isEditing && (
            <div className="profileCardText">
              <h4><b>{props.type}: </b> {props.firstname} {props.middlename ? props.middlename?.charAt(0).toUpperCase()+". " : " "} {props.lastname} </h4>
              <p>Active {format(props.lastactive)}.</p>
              <p>Age: {props.age} <br/>
              Address: {props.location?.city ? (props.location?.city+", ") : ""} {props.location?.province ? (props.location?.province+", ") : ""} {props.location?.region}
              {props?.theFree ? 
                <div> Skill(s): {userSkill.skill?.map((a)=> {
                return <label key={idPlusKey(props.id, a)}>{a ? (a)+", " : <></>} </label>
                })} </div>
              :<br />}
              {props.type==="Employer" ? 
                <div>
                  <p>Company: {props?.company ? props.company : ""}<br />
                  Position: {props?.position ? props.position : ""}</p>
                </div>
              :<br />}
              About: {props.about}</p>
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
                      setSelectedRegion(props.location?.region)
                      setSelectedProvince(props.location?.province)
                      setSelectedCity(props.location?.city)
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
                          <p>{a.type}: {a.title}<br />
                          Duration: {a.duration} month(s)<br />
                          Began at: {moment(a.acceptdate).format("MMM. DD, YYYY")}<br />
                          Expected to end at: {moment(expectedMonth(a)).format("MMM. YYYY")}</p>
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
                <label>Region:</label>
                <input required onChange={e => {
                    setSelectedRegion(e.target.value)
                  }} value={selectedRegion} type="text" className="form-control" />
                  
                  {filteredRegions.length != 0 && (
                    <div className="dataResult">
                      {filteredRegions.map((a) => {
                        return (
                          <a key={a.id} className="dataItem" onClick={()=> {
                          setSelectedRegion(a.name)
                          setRegion(a)
                          setFilteredRegions([])}}>
                            <p>{a.name} </p>
                          </a>
                        )
                      })}
                    </div>
                  )}
              </div>
              <div className="mb-2">
                <label>Province:</label>
                  <input required onChange={e => {
                    setSelectedProvince(e.target.value)
                  }} value={selectedProvince} type="text" className="form-control" />
                
                  {filteredProvinces.length != 0 && (
                    <div className="dataResult">
                      {filteredProvinces.map((a) => {
                        return (
                          <a key={a.id} className="dataItem" onClick={()=> {
                          setSelectedProvince(a.name)
                          setProvince(a)
                          setFilteredProvinces([])}}>
                            <p>{a.name} </p>
                          </a>
                        )
                      })}
                    </div>
                  )}
              </div>
              <div className="mb-2">
                <label>City:</label>
                  <input onChange={e => {
                    setSelectedCity(e.target.value)
                  }} value={selectedCity} type="text" className="form-control" />
                
                  {filteredCities.length != 0 && (
                    <div className="dataResult">
                      {filteredCities.map((a) => {
                        return (
                          <a key={a.id} className="dataItem" onClick={()=> {
                          setSelectedCity(a.name)
                          setCity(a)
                          setFilteredCities([])}}>
                            <p>{a.name} </p>
                          </a>
                        )
                      })}
                    </div>
                  )}
              </div>
              <div className="mb-2">
                <label>About:</label>
                <textarea rows = "5" cols = "60" onChange={e => setDraftAbout(e.target.value)} type="text" className="form-control form-control-sm" value={draftAbout} placeholder="about"/>
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
                        <button type="button" className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=> {
                          setTheTag(btnTheTag), setRemoveTag(false)
                        }}>Remove?</button>
                      </div>
                    )}

                    {theTag && (
                      <div>
                        <p>
                          Removing "{btnTheTag}" to your skills list.
                        </p>
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
                        Adding "{addTag}" to your skills list.
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