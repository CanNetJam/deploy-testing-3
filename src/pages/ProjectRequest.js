import React, { useState, useRef, useContext, useEffect } from "react"
import { UserContext } from "../home"
import Axios from "axios"
import { useNavigate, useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ProjectProposal({socket}) {
    const location = useLocation()
    let navigate = useNavigate()
    const api_key = "848182664545332"
    const cloud_name = "dzjkgjjut"
    
    const { userData, setUserData } = useContext(UserContext)
    const [ file, setFile ] = useState("")
    const [ requestType, setRequestType ] = useState("")
    const [ employmentType, setEmploymentType ] = useState("")
    const [ minimumreq, setMinimumReq ] = useState([])
    const [ reqSpecified, setReqSpecified ] = useState("")
    const [ title, setTitle ] = useState("")
    const [ company, setCompany ] = useState(userData.user?.companyinfo ? userData.user.companyinfo.companyname : "Not declared")
    const [ description, setDescription ] = useState("")
    const [ skillrequired, setSkillRequired ] = useState("")
    const [ employer, setEmployer ] = useState(userData.user.id)
    const [ sallary, setSallary ] = useState(0.00)
    const [ duration, setDuration ] = useState(0)
    const [ slots, setSlots ] = useState(1)
    const [ others, setOthers ] = useState("")
    const CreatePhotoField = useRef()
    
    const [ category, setCategory ] = useState([])
    const [ advSearch, setAdvSearch ] = useState(false)
    const [ categoryBy, setCategoryBy ] = useState("")
    const [ categoryPick, setCategoryPick ] = useState(false)
    const [ adminId, setAdminId ] = useState()
    const [ filteredCategory, setFilteredCategory ] = useState([])
    const [ isSkill, setIsSkill ] = useState()
    const [ questions, setQuestions] = useState(3)

    const [ question1, setQuestion1 ] = useState("")
    const [ question2, setQuestion2 ] = useState("")
    const [ question3, setQuestion3 ] = useState("")
    const [ question4, setQuestion4 ] = useState("")
    const [ question5, setQuestion5 ] = useState("")
    const [ question6, setQuestion6 ] = useState("")
    const [ question7, setQuestion7 ] = useState("")
    const [ question8, setQuestion8 ] = useState("")
    const [ question9, setQuestion9 ] = useState("")
    const [ question10, setQuestion10 ] = useState("")

    const [ regions, setRegions ] = useState([])
    const [ provinces, setProvinces ] = useState([])
    const [ cities, setCities ] = useState([])
    const [ filteredRegions, setFilteredRegions ] = useState([])
    const [ filteredProvinces, setFilteredProvinces ] = useState([])
    const [ filteredCities, setFilteredCities ] = useState([])
    const [ selectedRegion, setSelectedRegion ] = useState(userData.user?.companyinfo ? userData.user.companyinfo.location.region : "Not declared")
    const [ selectedProvince, setSelectedProvince ] = useState(userData.user?.companyinfo ? userData.user.companyinfo.location.province : "Not declared")
    const [ selectedCity, setSelectedCity ] = useState(userData.user?.companyinfo ? userData.user.companyinfo.location.city : "Not declared")
    const [ region, setRegion ] = useState("")
    const [ province, setProvince ] = useState("")
    const [ city, setCity ] = useState("")

    const [ steps, setSteps ] = useState([1, 2, 3])
    const [ currentStep, setCurrentStep] = useState(1)
    const [ nextBtn, setNextBtn ] = useState(true)
    const topPage = useRef(null)

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
      if (selectedRegion!=="") {
        if (region==="") {
          const data = regions?.filter((item) => item.name.includes(selectedRegion.toUpperCase()))
          setFilteredRegions(data)
        }
      }
    }, [selectedRegion])

    useEffect(() => {
      setFilteredProvinces([])
      if (selectedProvince!=="") {
        if (province==="") {
          const data = provinces?.filter((item) => (item.region_code=== region?.id) 
          && (item.name.includes(selectedProvince.toUpperCase())))
          setFilteredProvinces(data)
        }
      }
    }, [selectedRegion, selectedProvince])

    useEffect(() => {
      setFilteredCities([])
      if (selectedCity!=="") {
        if (city==="") {
          const data = cities?.filter((item) => (item.region_code=== region?.id) && 
          (item.province_code=== province?.id) && 
          (item.name.includes(selectedCity.toUpperCase())))
          setFilteredCities(data)
        }
      }
    }, [selectedRegion, selectedProvince, selectedCity])

    useEffect(() => {
      const tags = category.filter((tags) => tags.name ===categoryBy)
      setFilteredCategory(tags[0]?.tags)
    }, [categoryBy])

    useEffect(() => {
      const getAdmin = async () => {
        try {
          const res = await Axios.get("/api/get-admin")
          setAdminId(res.data._id)
        } catch (err) {
          console.log(err)
        }
      }
      getAdmin()
    }, [])

    async function submitHandler(e) {
      e.preventDefault()
      
      if (!skillrequired) {
        setIsSkill(false)
      }
      if (skillrequired) {
        const loadingNotif = async function myPromise() {
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
      }
      data.append("type", requestType)
      data.append("employmenttype", employmentType)
      for (let i = 0; i < minimumreq.length; i++) {
        data.append("minimumreq[]", minimumreq[i])
      }
      if (reqSpecified) {
        data.append("reqspecified", reqSpecified)
      }
      data.append("title", title)
      data.append("slots", slots)
      data.append("company", company)
      data.append("description", description)
      data.append("skillrequired", skillrequired)
      data.append("employer", employer)
      data.append("sallary", sallary)
      data.append("duration", duration)

      data.append("region", selectedRegion)
      data.append("province", selectedProvince)
      data.append("city", selectedCity)
      data.append("others", others)

      data.append("question1", question1)
      data.append("question2", question2)
      data.append("question3", question3)
      data.append("question4", question4)
      data.append("question5", question5)
      data.append("question6", question6)
      data.append("question7", question7)
      data.append("question8", question8)
      data.append("question9", question9)
      data.append("question10", question10)
      
      const res = await Axios.post("/create-project", data, { headers: { "Content-Type": "multipart/form-data" } })
      
      const subject = res.data._id
      const type = requestType
      const action = "sent a"
      const wait = await Axios.post(`/api/send-notifications/${userData.user.id}/${adminId}/${action}/${type}/${subject}`)

      if (wait) {
        navigate("/start-project")
      }
      socket.emit("sendNotification", {
        senderId: userData.user.id,
        receiverId: adminId,
        subject: res.data._id,
        type: requestType,
        action: "sent a",
      })
      }
      toast.promise(
        loadingNotif,
        {
          pending: 'Processing request...',
          success: 'Request sucessfully sent.',
          error: 'Request failed!'
        }
      )
      }
    }

    function idPlusKey(a, b) {
      const key = a + b 
      return key
    }
    
    useEffect(() => {
      if (skillrequired!=="") {
        step1Check(requestType, employmentType)
      }
    }, [skillrequired, minimumreq])
    
    function step1Check(a, b) {
      if (a!=="" && b!=="") {
        if (minimumreq.includes("Others")) {
          if (reqSpecified!=="") {
            if (skillrequired!=="") {
              return setNextBtn(false)
            }
          }
          return setNextBtn(true)
        }

        if ((minimumreq.includes("College Degree") || minimumreq.includes("Technical Vocaltional Training")) && minimumreq!==[]) {
          if (skillrequired!=="") {
            return setNextBtn(false)
          }
        }
      }
      return setNextBtn(true)
    }
    
    function inputCheck() {
      if (title!=="" && slots!==0 && sallary!==0 && duration!==0 && selectedRegion!=="" && selectedProvince!=="" && selectedCity!=="" && description!=="") {
        return setNextBtn(false)
      }
    }

    function questionCheck() {
      if (question1!=="" && question2!=="" && question3!=="") {
        return setNextBtn(false)
      }
    }

    function putMinimumReq(props) {
      if (minimumreq.includes(props)) {
        const newArray = minimumreq.filter((a) => a !== props)
        setMinimumReq(newArray)
      } else {
        setMinimumReq(prev => prev.concat([props]))
      }
    }
    
    return (
      <div className="projectRequestApplication">
        <div ref={topPage}></div>
        <div className="projectRequestFormTop">
            <label><b>Request Form</b></label> 
            <button className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=> navigate(-1)}>Cancel</button>
        </div>
        <div>
          <div className="progressbar">
            {steps.map((a)=> {
              if (a>currentStep) {
                return <div key={a} className="progress-step" data-title={a==1 ? "Setup" : a==2 ? "Details" : a==3 ? "Questions" : ""}></div>
              } else {
                return <div key={a+"haha"+currentStep} className="progress-step progress-step-active" data-title={a==1 ? "Setup" : a==2 ? "Details" : a==3 ? "Questions" : ""}></div>
              }
            })}
          </div>
        </div>
        <div className="projectRequestFormBot">
          <form className="projectRequestForm" onSubmit={submitHandler}>

          {currentStep===1 && (
            <div>
              <div className="centerContent">
                <label className="contentSubheading"><b>Step 1:</b> Setup your application.</label>
              </div>
              <br/>
              <div className="inputGrid">
                <div>
                  <div className="requiredLabel">
                    <label><b>Select application type.</b><label className="requiredAlert"> <b> *</b></label></label>
                  </div>
                  <div onChange={(e) => {
                      setRequestType(e.target.value)
                      if (e.target.value==="Project Request") {
                        setEmploymentType("Part-time")
                        let z = "Part-time"
                        step1Check(e.target.value, z)
                      }
                      if (e.target.value==="Job Request") {
                        setEmploymentType("")
                        let z = ""
                        step1Check(e.target.value, z)
                      }
                      step1Check(e.target.value, employmentType)
                    }} value={requestType}>
                      <input type="radio" checked={requestType==="Job Request" ? true : false} value="Job Request" name="requestType"/> Job Request<br />
                      <input type="radio" checked={requestType==="Project Request" ? true : false} value="Project Request" name="requestType"/> Project Request<br />
                  </div>

                  <div>
                    {requestType!=="Project Request" ?
                      <div>
                        <label><b>Select Employment status.</b><label className="requiredAlert"> <b> *</b></label></label>
                        <div onChange={(e) => {
                          setEmploymentType(e.target.value)
                          step1Check(requestType, e.target.value)
                        }} value={employmentType}>
                          <input type="radio" checked={employmentType==="Full-time" ? true : false} value="Full-time" name="employmentType" /> Full-time<br />
                          <input type="radio" checked={employmentType==="Part-time" ? true : false} value="Part-time" name="employmentType" /> Part-time<br />
                        </div>
                      </div>
                    :<div>
                      <br/>
                      <label>Selected <b>Project Request</b>, automatically set to <b>Part-time employment</b>.</label>
                    </div>}
                  </div>
                </div>

                <div>
                  <div className="requiredLabel">
                    <label><b>Select the specific skill required.</b><label className="requiredAlert"> <b> *</b></label>                   
                      <button type="button" className="btn btn-outline-success allButtons" onClick={()=> {
                        if (advSearch === false) {
                          setAdvSearch(true)
                        }
                        if (advSearch === true) {
                          setAdvSearch(false)
                          setCategoryPick(false)
                          setCategoryBy("")
                        }
                      }}>
                      Skills List
                      </button>
                    </label>
                  </div>
                  <label>Selected Skill: <b>{skillrequired ? skillrequired : "None"}</b></label>

                  <div >
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
                                                                      setSkillRequired(b)
                                                                      setTitle(b)
                                                                      setCategoryBy("")
                                                                      setIsSkill(true)
                                                                      setCategoryPick(false)
                                                                      setAdvSearch(false)
                                                                  }}>{b}</label>
                                                      })}
                                                  </div>
                                              )}
                                          </div>
                                      : null}
                                  </div>
                              )
                          })}
                      </div>
                  ): null}
                  </div>
                  {isSkill===false && (
                    <label>Please select the skill you are looking for.</label>
                  )}
                </div>
                
                <div>
                  <div className="requiredLabel">
                    <label><b>Indicate minimum qualifications.</b><label className="requiredAlert"> <b> *</b></label></label>
                  </div>
                  
                  <div onChange={e => {
                    putMinimumReq(e.target.value)
                    step1Check(requestType, employmentType)
                  }} value={minimumreq}>
                    <input type="checkbox" checked={minimumreq.includes("College Degree") ? true : false} value="College Degree" name="minimimreq" /> College Degree<br />
                    <input type="checkbox" checked={minimumreq.includes("Technical Vocaltional Training") ? true : false} value="Technical Vocaltional Training" name="minimimreq" /> Technical Vocaltional Training<br />
                    <input type="checkbox" checked={minimumreq.includes("Others") ? true : false} value="Others" name="minimimreq" /> Others<br />
                  </div>
                  {minimumreq.includes("Others") ?
                    <div>
                    <label>Specify: </label>
                    <label className="requiredAlert"> <b> *</b></label>
                    <textarea rows = "3" cols = "60" required onChange={e => {
                      setReqSpecified(e.target.value)
                      step1Check(requestType, employmentType)
                    }} value={reqSpecified} type="text" className="form-control" placeholder="NC I-III passer, High school graduate..."/>
                    
                    </div>
                  :null}
                  <div className="mb-2"> 
                    <label>Additional Requirements: (optional)</label>
                    <textarea rows = "5" cols = "60" onChange={e => setOthers(e.target.value)} value={others} type="text" className="form-control" placeholder="Ex: Years of experience, programming language required, technical trainings..."/>
                  </div>
                </div>
              </div>
            <br/>
              <div className="nextPageBtn">
                <button id="nextBtn" type="button" disabled={nextBtn} className="btn btn-outline-success allButtons" onClick={()=> {
                  setCurrentStep(prev => prev+1)
                  setNextBtn(true)
                }}>Next</button>
              </div>
            </div>
          )}

          {currentStep===2 && (
            <div className="eachStep">
              <div className="centerContent">
                <label className="contentSubheading"><b>Step 2:</b> Add full {requestType} request details.</label>
              </div>
              <br/>
              <div className="mb-2">
                <div className="requiredLabel">
                  <label>{requestType} Title:<label className="requiredAlert"> <b> *</b></label></label>
                </div>
                <input required onChange={e => {
                  setTitle(e.target.value) 
                  inputCheck()
                }} value={title} type="text" className="form-control" />
              </div>
              
              <div className="inputGrid">
                {requestType==="Job Request" ?
                  <div className="mb-2">
                    <div className="requiredLabel">
                      <label>Available slots for hiring:<label className="requiredAlert"> <b> *</b></label></label>
                    </div>
                    <input required onChange={e => {
                      setSlots(e.target.value)
                      inputCheck()
                    }} value={slots} type="number" className="form-control" />
                  </div>
                :
                <div className="mb-2">
                  <div className="requiredLabel">
                    <label>Available slots for hiring:<label className="requiredAlert"> <b> *</b></label></label>
                  </div>
                  <label><b>1</b><i>default for project requests</i></label>
                </div>}

                <div className="mb-2">
                  <div className="requiredLabel">
                    <label>Expected Salary (in Philippine Pesos):<label className="requiredAlert"> <b> *</b></label></label>
                  </div>
                  <input required onChange={e => {
                    setSallary(e.target.value)
                    inputCheck()
                  }} value={sallary} type="number" min="0.00" max="100000000.00" step="1000.00" placeholder='0.00' className="form-control" />
                </div>
                <div className="mb-2"> 
                  <div className="requiredLabel">
                    <label>{requestType} Duration (in Months):<label className="requiredAlert"> <b> *</b></label></label>
                  </div>
                  <input required onChange={e => {
                    setDuration(e.target.value)
                    inputCheck()
                  }} value={duration} type="number" className="form-control" />
                </div>
              </div>
              <br/>
              <label>Work Location</label>
              <div className="inputGrid"> 
                <div className="centerLabel location">
                    <div className="requiredLabel">
                      <label>Region:<label className="requiredAlert"> <b> *</b></label></label>
                    </div>

                    <input required onChange={e => {
                      setSelectedRegion(e.target.value)
                      inputCheck()
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

                <div className="centerLabel location">
                  <div className="requiredLabel">
                    <label>Province:<label className="requiredAlert"> <b> *</b></label></label>
                  </div>
                  
                  <input required onChange={e => {
                    setSelectedProvince(e.target.value)
                    inputCheck()
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

                <div className="centerLabel location">
                  <div className="requiredLabel">
                    <label>City:<label className="requiredAlert"> <b> *</b></label></label>
                  </div>
                  
                  <input required onChange={e => {
                    setSelectedCity(e.target.value)
                    inputCheck()
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
              </div>
              <br />
              <div className="mb-2">
                <div>
                  <label>{requestType} Description:<label className="requiredAlert"> <b> *</b></label></label>
                </div>

                <textarea rows = "5" cols = "60" required onChange={e => {
                  setDescription(e.target.value)
                  inputCheck()
                }} value={description} type="text" className="form-control" placeholder="A brief description of the job responsibilities." />
              </div>

              <label>Add photo (optional)</label>
              <div className="mb-2">
                <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
              </div>
              <br />
              <div className="nextPageBtn">
                <div>
                  <button className="btn btn-sm btn-outline-secondary cancelBtn" type="button" onClick={()=> {
                    setCurrentStep(prev => prev-1)
                    setNextBtn(false)
                  }}>
                    Back
                  </button>
                </div>
                <div>
                  <button id="nextBtn" type="button" disabled={nextBtn} className="btn btn-outline-success allButtons" onClick={()=> {
                    setCurrentStep(prev => prev+1)
                    setNextBtn(true)
                  }}>Next</button>
                </div>
              </div>
            </div>
          )}

          {currentStep===3 && (
            <div className="eachStep">
              <div>
                <div className="centerContent">
                  <label className="contentSubheading"><b>Step 3:</b> Add preliminary questions. </label>
                </div>
                <br/>
                <div className="centerContent">
                  <label>Note: There should be atleast a minimum of 3 preliminary questions, with a maximum of 10.</label>
                </div>
                <div className="rightContent">
                  <button type="button" className="allButtons" onClick={()=>{
                      if (questions<10) {
                        setQuestions(prev=>prev+1)
                      }
                    }}>
                    Add Question
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=>{
                    if(questions>3) {
                      setQuestions(prev=>prev-1)  
                      if(questions===4) {
                        setQuestion4("")
                      }
                      if(questions===5) {
                        setQuestion5("")
                      }
                      if(questions===6) {
                        setQuestion6("")
                      }
                      if(questions===7) {
                        setQuestion7("")
                      }
                      if(questions===8) {
                        setQuestion8("")
                      }
                      if(questions===9) {
                        setQuestion9("")
                      }
                      if(questions===10) {
                        setQuestion10("")
                      }
                    }
                  }}>
                    Remove
                  </button>
                </div>
              </div>
              <div>
                <div className="requiredLabel">
                  <label>Question #1:<label className="requiredAlert"> <b> *</b></label></label>
                </div>
                
                <input required onChange={e => {
                  setQuestion1(e.target.value)
                  questionCheck()
                }} value={question1} type="text" className="form-control"/>
              </div>
              <div>
                <div className="requiredLabel">
                  <label>Question #2:<label className="requiredAlert"> <b> *</b></label></label>
                </div>

                <input required onChange={e => {
                  setQuestion2(e.target.value)
                  questionCheck()
                }} value={question2} type="text" className="form-control"/>
              </div>
              <div>
                <div className="requiredLabel">
                  <label>Question #3:<label className="requiredAlert"> <b> *</b></label></label>
                </div>

                <input required onChange={e => {
                  setQuestion3(e.target.value)
                  questionCheck()
                }} value={question3} type="text" className="form-control"/>
              </div>
              {questions>=4 ?
                <div>
                  <div>
                    <label>Question #4:</label>
                  </div>
                  <br/>
                  <input required onChange={e => setQuestion4(e.target.value)} value={question4} type="text" className="form-control"/>
                </div>
              :null}
              {questions>=5 ?
                <div>
                  <div>
                    <label>Question #5:</label>
                  </div>
                  <br/>
                  <input required onChange={e => setQuestion5(e.target.value)} value={question5} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=6 ?
                <div>
                  <div>
                    <label>Question #6:</label>
                  </div>
                  <br />
                  <input required onChange={e => setQuestion6(e.target.value)} value={question6} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=7 ?
                <div>
                  <div>
                    <label>Question #7:</label>
                  </div>
                  <br />
                  <input required onChange={e => setQuestion7(e.target.value)} value={question7} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=8 ?
                <div>
                  <div>
                    <label>Question #8:</label>
                  </div>
                  <br />
                  <input required onChange={e => setQuestion8(e.target.value)} value={question8} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=9 ?
                <div>
                  <div>
                    <label>Question #9:</label>
                  </div>
                  <br />
                  <input required onChange={e => setQuestion9(e.target.value)} value={question9} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=10 ?
                <div>
                  <div>
                    <label>Question #10:</label>
                  </div>
                  <br />
                  <input required onChange={e => setQuestion10(e.target.value)} value={question10} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=11 ?
                <div>
                  <label>Maximum of 10 questions only!</label>
                </div>
              :<></>}
              <br />
              <div className="nextPageBtn">
                <div>
                  <button className="btn btn-sm btn-outline-secondary cancelBtn" type="button" onClick={()=> {
                    setCurrentStep(prev => prev-1)
                    setNextBtn(false)
                  }}>
                    Back
                  </button>
                </div>
                <div>
                  <button id="nextBtn" disabled={nextBtn} className="btn btn-outline-success allButtons">Complete Job Request Application</button>
                </div>
              </div>
            </div>
          )}
          </form>
        </div>
        <ToastContainer />
      </div>
    )
  }

export default ProjectProposal