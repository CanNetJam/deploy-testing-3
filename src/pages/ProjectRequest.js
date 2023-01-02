import React, { useState, useRef, useContext, useEffect } from "react"
import { UserContext } from "../home"
import Axios from "axios"
import { useNavigate, useLocation } from 'react-router-dom'

function ProjectProposal({socket}) {
    const location = useLocation()
    let navigate = useNavigate()
    const api_key = "848182664545332"
    const cloud_name = "dzjkgjjut"

    const { userData, setUserData } = useContext(UserContext)
    const [ file, setFile ] = useState("")
    const [ requestType, setRequestType ] = useState("")
    const [ employmentType, setEmploymentType ] = useState("")
    const [ minimumreq, setMinimumReq ] = useState("")
    const [ reqSpecified, setReqSpecified ] = useState("")
    const [ title, setTitle ] = useState("")
    const [ company, setCompany ] = useState(userData.user?.company ? userData.user.company : "Not declared")
    const [ description, setDescription ] = useState("")
    const [ skillrequired, setSkillRequired ] = useState("")
    const [ employer, setEmployer ] = useState(userData.user.id)
    const [ sallary, setSallary ] = useState(0)
    const [ duration, setDuration ] = useState(0)
    const [ others, setOthers ] = useState("")
    const CreatePhotoField = useRef()

    const [ category, setCategory ] = useState([])
    const [ advSearch, setAdvSearch ] = useState(true)
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
    const [ selectedRegion, setSelectedRegion ] = useState("")
    const [ selectedProvince, setSelectedProvince ] = useState("")
    const [ selectedCity, setSelectedCity ] = useState("")
    const [ region, setRegion ] = useState("")
    const [ province, setProvince ] = useState("")
    const [ city, setCity ] = useState("")

    const [ steps, setSteps ] = useState([1, 2, 3, 4, 5])
    const [ currentStep, setCurrentStep] = useState(1)
    const [ nextBtn, setNextBtn ] = useState(true)

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
      data.append("minimumreq", minimumreq)
      if (reqSpecified) {
        data.append("reqspecified", reqSpecified)
      }
      data.append("title", title)
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
      await Axios.post(`/api/send-notifications/${userData.user.id}/${adminId}/${action}/${type}/${subject}`)

      socket.emit("sendNotification", {
        senderId: userData.user.id,
        receiverId: adminId,
        subject: res.data._id,
        type: requestType,
        action: "sent a",
      })

      setFile("")
      setRequestType("")
      setEmploymentType("")
      setMinimumReq("")
      setTitle("")
      setCompany("")
      setDescription("")
      setSkillRequired("")
      setEmployer("")
      setSallary(0)
      setDuration(0)
      setSelectedRegion("")
      setSelectedProvince("")
      setSelectedCity("")
      setOthers("")
      setQuestion1("")
      setQuestion2("")
      setQuestion3("")
      setQuestion4("")
      setQuestion5("")
      setQuestion6("")
      setQuestion7("")
      setQuestion8("")
      setQuestion9("")
      setQuestion10("")
    
      navigate("/start-project")
      }
    }

    function idPlusKey(a, b) {
      const key = a + b 
      return key
    }

    function  step1Check(a, b) {
      if (a!=="" && b!=="") {
        return setNextBtn(false)
      }
    }

    function step3Check(props) {
      if (props!=="Others") {
        return setNextBtn(false)
      }
      if (props==="Others") {
        setNextBtn(true)
        if (reqSpecified!=="") {
          return setNextBtn(false)
        }
      }
    }

    function inputCheck() {
      if (title!=="" && sallary!==0 && duration!==0 && selectedRegion!=="" && selectedProvince!=="" && selectedCity!=="" && description!=="") {
        return setNextBtn(false)
      }
    }

    function questionCheck() {
      if (question1!=="" && question2!=="" && question3!=="") {
        return setNextBtn(false)
      }
    }

    return (
      <div className="projectRequestApplication">
        <div className="projectRequestFormTop">
            <h3>Request Form</h3> 
            <button className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=> navigate(-1)}>Cancel</button>
        </div>
        <div>
          <p>Progress: </p>
          <div className="progressbar">
            {steps.map((a)=> {
              if (a>currentStep) {
                return <div key={a} className="progress-step" data-title={a==1 ? "Type" : a==2 ? "Skill" : a==3 ? "Minimum" : a==4 ? "Details" : a==5 ? "Questions" : ""}></div>
              } else {
                return <div key={a+"haha"+currentStep} className="progress-step progress-step-active" data-title={a==1 ? "Type" : a==2 ? "Skill" : a==3 ? "Minimum" : a==4 ? "Details" : a==5 ? "Questions" : ""}></div>
              }
            })}
          </div>
        </div>
        <div className="projectRequestFormBot">
          <form className="projectRequestForm" onSubmit={submitHandler}>
          {currentStep===1 && (
            <div className="eachStep">
              <div className="requiredLabel">
                <h4><b>Step 1:</b> Select application type.</h4>
                <p className="requiredAlert"> <b> *</b></p>
              </div>
              <br />
              <div onChange={(e) => {
                  setRequestType(e.target.value)
                  if (e.target.value==="Project Request") {
                    setEmploymentType("Part-time")
                    let z = "Part-time"
                    step1Check(e.target.value, z)
                  }
                  step1Check(e.target.value, employmentType)
                }} value={requestType}>
                  <input type="radio" value="Job Request" name="requestType"/> Job Request<br />
                  <input type="radio" value="Project Request" name="requestType"/> Project Request<br />
              </div>
              <br />

              <div className="eachStep">
                {requestType!=="Project Request" ?
                  <div>
                    <h4> Select Employment status.</h4>
                    <div onChange={(e) => {
                      setEmploymentType(e.target.value)
                      step1Check(requestType, e.target.value)
                    }} value={employmentType}>
                      <input type="radio" value="Full-time" name="employmentType" /> Full-time<br />
                      <input type="radio" value="Part-time" name="employmentType" /> Part-time<br />
                    </div>
                  </div>
                :<div className="mb-2 eachStep">
                  <label>Selected Project Request, automatically set to <b>Part-time employment</b>.</label>
                </div>}
              </div>

              <div className="nextPageBtn">
                <button id="nextBtn" type="button" disabled={nextBtn} className="btn btn-sm btn-primary" onClick={()=> {
                  setCurrentStep(prev => prev+1)
                  setNextBtn(true)
                }}>Next</button>
              </div>
            </div>
          )}

          {currentStep===2 && (
            <div className="eachStep">
              <div className="requiredLabel">
                <h4><b>Step 2:</b> Select the specific skill required.</h4>
                <p className="requiredAlert"> <b> *</b></p>
              </div>
              {isSkill===false && (
                <label>Please select the skill you are looking for.</label>
              )}

              <div >
                <button type="button" className="btn btn-sm btn-primary" onClick={()=> {
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
                                                      return <div className="tagButton" key={idPlusKey(categoryBy, b)} onClick={()=>{
                                                                  setSkillRequired(b)
                                                                  setTitle(b)
                                                                  setCategoryBy("")
                                                                  setIsSkill(true)
                                                                  setCategoryPick(false)
                                                                  setAdvSearch(false)
                                                                  setNextBtn(false)
                                                              }}>{b}</div>
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
              <br />
              <label>Selected Skill: <b>{skillrequired ? skillrequired : "None"}</b></label>
              <br />
              <div className="nextPageBtn">
                <div>
                  <button className="btn btn-sm btn-outline-secondary cancelBtn" type="button" onClick={()=> {
                    setSkillRequired("")
                    setTitle("")
                    setCategoryBy("")
                    setIsSkill(false)
                    setCategoryPick(false)
                    setAdvSearch(false)
                    setCurrentStep(prev => prev-1)
                    setNextBtn(true)
                  }}>
                    Back
                  </button>
                </div>
                <div>
                  <button id="nextBtn" type="button" disabled={nextBtn} className="btn btn-sm btn-primary" onClick={()=> {
                    setCurrentStep(prev => prev+1)
                    setNextBtn(true)
                  }}>Next</button>
                </div>
              </div>
            </div>
          )}

          {currentStep===3 && (
            <div className="eachStep">
              <div className="requiredLabel">
                <h4><b>Step 3:</b> Indicate minimum qualifications. </h4>
                <p className="requiredAlert"> <b> *</b></p>
              </div>
              
              <br />
              <div onChange={e => {
                setMinimumReq(e.target.value)
                step3Check(e.target.value)
              }} value={minimumreq}>
                <input type="radio" value="College Degree" name="minimimreq" /> College Degree<br />
                <input type="radio" value="Technical Vocaltional Training" name="minimimreq" /> Technical Vocaltional Training<br />
                <input type="radio" value="Others" name="minimimreq" /> Others<br />
              </div>
              {minimumreq==="Others" ?
                <div>
                <label>Specify: </label>
                <input required onChange={e => {
                  setReqSpecified(e.target.value)
                  step3Check(e.target.value)
                }} value={reqSpecified} type="text" className="form-control" placeholder="NC I-III passer, High school graduate..."/>
                <p className="requiredAlert"> <b> *</b></p>
                </div>
              :<></>}
              <br />
              <div className="nextPageBtn">
                <div>
                  <button className="btn btn-sm btn-outline-secondary cancelBtn" type="button" onClick={()=> {
                    setMinimumReq("")
                    setReqSpecified("")
                    setCurrentStep(prev => prev-1)
                    setNextBtn(true)
                  }}>
                    Back
                  </button>
                </div>
                <div>
                  <button id="nextBtn" type="button" disabled={nextBtn} className="btn btn-sm btn-primary" onClick={()=> {
                    setCurrentStep(prev => prev+1)
                    setNextBtn(true)
                  }}>Next</button>
                </div>
              </div>
            </div>
          )}

          {currentStep===4 && (
            <div className="eachStep">
              <div className="requiredLabel">
                <h4><b>Step 4:</b> Add full {requestType} request details.</h4>
                <p className="requiredAlert"> <b> *</b></p>
              </div>
              <div className="mb-2">
                <div className="requiredLabel">
                  <label>{requestType} Title:</label>
                  <p className="requiredAlert"> <b> *</b></p>
                </div>
                <input required onChange={e => {
                  setTitle(e.target.value) 
                  inputCheck()
                }} value={title} type="text" className="form-control" />
              </div>
              <div className="mb-2">
                <div className="requiredLabel">
                  <label>Expected Sallary (in Philippine Pesos):</label>
                  <p className="requiredAlert"> <b> *</b></p>
                </div>
                <input required onChange={e => {
                  setSallary(e.target.value)
                  inputCheck()
                }} value={sallary} type="number" className="form-control" />
              </div>
              <div className="mb-2"> 
                <div className="requiredLabel">
                  <label>{requestType} Duration (in Months):</label>
                  <p className="requiredAlert"> <b> *</b></p>
                </div>
                <input required onChange={e => {
                  setDuration(e.target.value)
                  inputCheck()
                }} value={duration} type="number" className="form-control" />
              </div>

              <div className="locationWrapper"> 
                <label>Location:</label>
                <div className="location">
                    <div className="requiredLabel">
                      <label>Region:</label>
                      <p className="requiredAlert"> <b> *</b></p>
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

                <div className="location">
                  <div className="requiredLabel">
                    <label>Province:</label>
                    <p className="requiredAlert"> <b> *</b></p>
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

                <div className="location">
                  <div className="requiredLabel">
                    <label>City:</label>
                    <p className="requiredAlert"> <b> *</b></p>
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
                <div className="requiredLabel">
                  <label>{requestType} Description:</label>
                  <p className="requiredAlert"> <b> *</b></p>
                </div>

                <input required onChange={e => {
                  setDescription(e.target.value)
                  inputCheck()
                }} value={description} type="text" className="form-control" placeholder="A brief description of the job responsibilities." />
              </div>
              <div className="mb-2"> 
                <label>Additional Requirements: (optional)</label>
                <input onChange={e => setOthers(e.target.value)} value={others} type="text" className="form-control" placeholder="Ex: Years of experience, programming language required, technical trainings..."/>
              </div>

              <h5>Add photo (optional)</h5>
              <div className="mb-2">
                <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
              </div>
              <br />
              <div className="nextPageBtn">
                <div>
                  <button className="btn btn-sm btn-outline-secondary cancelBtn" type="button" onClick={()=> {
                    setSelectedRegion("")
                    setSelectedProvince("")
                    setSelectedCity("")
                    setRegion("")
                    setProvince("")
                    setCity("")
                    setTitle("")
                    setSallary("")
                    setDuration("")
                    setSelectedRegion("")
                    setSelectedProvince("")
                    setSelectedCity("")
                    setDescription("")
                    setOthers("")
                    setFile("")
                    setCurrentStep(prev => prev-1)
                    setNextBtn(true)
                  }}>
                    Back
                  </button>
                </div>
                <div>
                  <button id="nextBtn" type="button" disabled={nextBtn} className="btn btn-sm btn-primary" onClick={()=> {
                    setCurrentStep(prev => prev+1)
                    setNextBtn(true)
                  }}>Next</button>
                </div>
              </div>
            </div>
          )}

          {currentStep===5 && (
            <div className="mb-2 eachStep">
              <div>
                <div>
                  <h4><b>Step 5:</b> Add preliminary questions. </h4>
                  <label>Note: There should be atleast a minimum of 3 preliminary questions, with a maximum of 10.</label>
                </div>
                <div>
                  <button type="button" className="btn btn-sm btn-primary" onClick={()=>{
                      if (questions<10) {
                        setQuestions(prev=>prev+1)
                      }
                    }}>
                    Add
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
                  <label>Question #1:</label>
                  <p className="requiredAlert"> <b> *</b></p>
                </div>
                
                <input required onChange={e => {
                  setQuestion1(e.target.value)
                  questionCheck()
                }} value={question1} type="text" className="form-control"/>
              </div>
              <div>
                <div className="requiredLabel">
                  <label>Question #2:</label>
                  <p className="requiredAlert"> <b> *</b></p>
                </div>

                <input required onChange={e => {
                  setQuestion2(e.target.value)
                  questionCheck()
                }} value={question2} type="text" className="form-control"/>
              </div>
              <div>
                <div className="requiredLabel">
                  <label>Question #3:</label>
                  <p className="requiredAlert"> <b> *</b></p>
                </div>

                <input required onChange={e => {
                  setQuestion3(e.target.value)
                  questionCheck()
                }} value={question3} type="text" className="form-control"/>
              </div>
              {questions>=4 ?
                <div>
                  <label>Question #4:</label>
                  <input required onChange={e => setQuestion4(e.target.value)} value={question4} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=5 ?
                <div>
                  <label>Question #5:</label>
                  <input required onChange={e => setQuestion5(e.target.value)} value={question5} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=6 ?
                <div>
                  <label>Question #6:</label>
                  <input required onChange={e => setQuestion6(e.target.value)} value={question6} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=7 ?
                <div>
                  <label>Question #7:</label>
                  <input required onChange={e => setQuestion7(e.target.value)} value={question7} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=8 ?
                <div>
                  <label>Question #8:</label>
                  <input required onChange={e => setQuestion8(e.target.value)} value={question8} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=9 ?
                <div>
                  <label>Question #9:</label>
                  <input required onChange={e => setQuestion9(e.target.value)} value={question9} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=10 ?
                <div>
                  <label>Question #10:</label>
                  <input required onChange={e => setQuestion10(e.target.value)} value={question10} type="text" className="form-control"/>
                </div>
              :<></>}
              {questions>=11 ?
                <div>
                  <label>Maximum of 10 questions only!</label>
                </div>
              :<></>}
              <div className="nextPageBtn">
                <div>
                  <button className="btn btn-sm btn-outline-secondary cancelBtn" type="button" onClick={()=> {
                    setQuestions(3)
                    setQuestion1("")
                    setQuestion2("")
                    setQuestion3("")
                    setQuestion4("")
                    setQuestion5("")
                    setQuestion6("")
                    setQuestion7("")
                    setQuestion8("")
                    setQuestion9("")
                    setQuestion10("")
                    setCurrentStep(prev => prev-1)
                    setNextBtn(true)
                  }}>
                    Back
                  </button>
                </div>
                <div>
                  <button id="nextBtn" disabled={nextBtn} className="btn btn-sm btn-primary">Complete Job Request Application</button>
                </div>
              </div>
            </div>
          )}
          </form>
        </div>
      </div>
    )
  }

export default ProjectProposal