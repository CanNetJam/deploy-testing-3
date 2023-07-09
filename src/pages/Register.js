import React, { useState, useRef, useContext, useEffect } from "react"
import Axios from "axios"
import {UserContext} from "../home"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function RegisterAccount() {
    const { userData, setUserData } = useContext(UserContext)
    const [file, setFile] = useState("")
    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")
    const [middlename, setMiddleName] = useState("")
    const [age, setAge] = useState(0)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [sex, setSex] = useState("Male")
    const [type, setType] = useState("Employer")
    const [candidateType, setCandidateType] = useState()
    const [citizenship, setCitizenship] = useState("Filipino")
    const [phone, setPhone] = useState()
    const [degree, setDegree] = useState("")
    const [school, setSchool] = useState("Cavite State University")
    const [course, setCourse] = useState("")
    const CreatePhotoField = useRef()

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
      if (selectedRegion==="") {
        setRegion("")
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
      if (selectedProvince==="") {
        setProvince("")
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
      if (selectedCity==="") {
        setCity("")
      }
    }, [selectedRegion, selectedProvince, selectedCity])

    function toastErrorNotification() {
      toast.error('Email already exists!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }

    function toastSuccessNotification(props) {
      toast.success(`Successfully registered the ${props} account.`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }

    async function submitHandler(e) {
      e.preventDefault()
      const data = new FormData()
      if (file) {
        data.append("photo", file)
      }
      data.append("firstname", firstname)
      data.append("lastname", lastname)
      data.append("middlename", middlename)
      data.append("sex", sex)
      data.append("age", age)
      data.append("region", selectedRegion)
      data.append("province", selectedProvince)
      data.append("city", selectedCity)
      data.append("email", email)
      data.append("password", password)
      data.append("type", type)
      data.append("citizenship", citizenship)
      data.append("phone", phone)
      data.append("school", school)
      data.append("degree", degree)
      data.append("course", course)
      data.append("candidatetype", candidateType)

      CreatePhotoField.current.value = ""
      const usertype = userData?.user.type
      const res = await Axios.post(`/api/create-account/${usertype}`, data, { headers: { "Content-Type": "multipart/form-data", 'auth-token': userData.token } })
      if (res.data===false) {
        toastErrorNotification()
      }
      if (res.data===true) {
        toastSuccessNotification(type)
        setFile("")
        setFirstName("")
        setLastName("")
        setMiddleName("")
        setSex("Male")
        setAge(0)
        setSelectedRegion("")
        setSelectedProvince("")
        setSelectedCity("")
        setRegion("")
        setProvince("")
        setCity("")
        setEmail("")
        setPassword("")
        setCitizenship("")
        setPhone("")
        setDegree("")
        setSchool("Cavite State University")
        setCourse("")
        setType("Employer")
        setCandidateType()
      }
    }

    return (
      <div className="register">
        <div ref={topPage}></div>
        <form className="registerForm" onSubmit={submitHandler}>
          <div className="contentTitle centerContent">
            <label><b>Account Registration</b></label>
          </div>
          <br />

          <div className="centerLabel">
            <label>Select an account type: </label>
            <select onChange={e => setType(e.target.value)} value={type}>
              <option name="Employer">Employer</option>
              <option name="Candidate">Candidate</option>
              {userData.user?.type==="Super Administrator" && (
                <option name="Employer">Admin</option>
              )}
            </select>
            <p className="requiredAlert"> <b> *</b></p>
          </div>

          {type==="Candidate" && (
            <div>
              <p>Specify Candidate type:</p>
              <label>
                <input required type="radio" name="candidateType" onChange={e => setCandidateType(e.target.value)} value="Undergraduate"/>
                <span> Undergraduate</span>
              </label><br/>
              <label>
                <input required type="radio" name="candidateType" onChange={e => setCandidateType(e.target.value)} value="Alumni"/>
                <span> Alumni</span>
              </label><br/>
              <label>
                <input required type="radio" name="candidateType" onChange={e => setCandidateType(e.target.value)} value="Extension Training Graduates"/>
                <span> Extension Training Graduate</span>
              </label>
            </div>
          )}

          <div className="inputGrid">
            <div className="centerLabel">
              <label>First name:</label>
              <input required onChange={e => setFirstName(e.target.value)} value={firstname} type="text" className="form-control inputGridTextBox" placeholder="Juan, Pedro..." />
              <p className="requiredAlert"> <b> *</b></p>
            </div>
            <div className="centerLabel">
              <label>Last name:</label>
              <input required onChange={e => setLastName(e.target.value)} value={lastname} type="text" className="form-control inputGridTextBox" placeholder="Dela Cruz, Garcia..." />
              <p className="requiredAlert"> <b> *</b></p>
            </div>
            <div className="centerLabel">
              <label>Middle name:</label>
              <input onChange={e => setMiddleName(e.target.value)} value={middlename} type="text" className="form-control inputGridTextBox" placeholder="Reyes, Ramos..." />
            </div>
          </div>
          
          <div className="inputGrid">
            <div className="mb-2 centerLabel">
              <label>Age:</label>
              <input required onChange={e => setAge(e.target.value)} value={age} type="number" className="form-control" placeholder="1-99+" />
              <p className="requiredAlert"> <b> *</b></p>
            </div>
            <div className="mb-2 centerLabel">
              <label>Citizenhsip:</label>
              <input required onChange={e => setCitizenship(e.target.value)} value={citizenship} type="text" className="form-control inputGridTextBox"/>
              <p className="requiredAlert"> <b> *</b></p>
            </div>
            <div className="mb-2 centerLabel">
              <label>Sex:</label>
              <select onChange={e => setSex(e.target.value)} value={type}>
                  <option name="Male">Male</option>
                  <option name="Female">Female</option>
              </select>
              <p className="requiredAlert"> <b> *</b></p>
            </div>
          </div>

          <div>
            <label>Address:</label>
              <div className="inputGrid">
                <div className="centerLabel location">
                  <label>Region:</label>
                  <input required onChange={e => {
                    setSelectedRegion(e.target.value)
                  }} value={selectedRegion} type="text" className="form-control inputGridTextBox" />
                  
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
                  <p className="requiredAlert"> <b> *</b></p>
                </div>

                <div className="centerLabel location">
                  <label>Province:</label>
                  <input required onChange={e => {
                    setSelectedProvince(e.target.value)
                  }} value={selectedProvince} type="text" className="form-control inputGridTextBox" />
                
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
                  <p className="requiredAlert"> <b> *</b></p>
                </div>

                <div className="centerLabel location">
                  <label>City:</label>
                  <input onChange={e => {
                    setSelectedCity(e.target.value)
                  }} value={selectedCity} type="text" className="form-control inputGridTextBox" />
                
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
                  <p className="requiredAlert"> <b> *</b></p>
                </div>
              </div>
          </div>

          <div className="centerContentGridLeft">
            <div className="mb-2 centerLabel">
              <label>Cellphone #:</label>
              <input required onChange={e => setPhone(e.target.value)} value={phone} type="number" className="form-control"/>
              <p className="requiredAlert"> <b> *</b></p>
            </div>
            <div className="mb-2 centerLabel">
              <label>Add photo:</label>
              <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
            </div>
          </div>

          {candidateType==="Alumni" && (
            <div>
              <div className="centerLabel">
                <label>School:</label>
                <input required onChange={e => setSchool(e.target.value)} value={school} type="text" className="form-control" placeholder="Cavite State University" />
                <p className="requiredAlert"> <b> *</b></p>
              </div>
              <div className="centerContentGrid2">
                <div>
                  <div className="centerLabel">
                    <label>Course:</label>
                    <p className="requiredAlert"> <b> *</b></p>
                  </div>
                  <div>
                    <label>
                      <input required type="radio" name="courseType" onChange={e => setCourse(e.target.value)} value="Bachelor of Secondary Education"/>
                      <span> Bachelor of Secondary Education</span>
                    </label><br/>
                    <label>
                      <input required type="radio" name="courseType" onChange={e => setCourse(e.target.value)} value="BS Business Management"/>
                      <span> BS Business Management</span>
                    </label><br/>
                    <label>
                      <input required type="radio" name="courseType" onChange={e => setCourse(e.target.value)} value="BS Computer Engineering"/>
                      <span> BS Computer Engineering</span>
                    </label><br/>
                    <label>
                      <input required type="radio" name="courseType" onChange={e => setCourse(e.target.value)} value="BS Computer Science"/>
                      <span> BS Computer Science</span>
                    </label><br/>
                    <label>
                      <input required type="radio" name="courseType" onChange={e => setCourse(e.target.value)} value="BS Hospitality Management"/>
                      <span> BS Hospitality Management</span>
                    </label><br/>
                    <label>
                      <input required type="radio" name="courseType" onChange={e => setCourse(e.target.value)} value="BS Industrial Technology"/>
                      <span> BS Industrial Technology</span>
                    </label><br/>
                    <label>
                      <input required type="radio" name="courseType" onChange={e => setCourse(e.target.value)} value="BS Information Technology"/>
                      <span> BS Information Technology</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="centerLabel">
                    <label>Degree:</label>
                    <p className="requiredAlert"> <b> *</b></p>
                  </div>
                  <div>
                    <label>
                      <input required type="radio" name="degreeType" onChange={e => setDegree(e.target.value)} value="Associate Degree"/>
                      <span> Associate Degree</span>
                    </label><br/>
                    <label>
                      <input required type="radio" name="degreeType" onChange={e => setDegree(e.target.value)} value="Bachelor's Degree"/>
                      <span> Bachelor's Degree</span>
                    </label><br/>
                    <label>
                      <input required type="radio" name="degreeType" onChange={e => setDegree(e.target.value)} value="Master's Degree"/>
                      <span> Master's Degree</span>
                    </label><br/>
                    <label>
                      <input required type="radio" name="degreeType" onChange={e => setDegree(e.target.value)} value="Doctoral Degree"/>
                      <span> Doctoral Degree</span>
                    </label><br/>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="inputGrid">
            <div className="mb-2 centerLabel">
              <label>Email:</label>
              <input required onChange={e => setEmail(e.target.value)} value={email} type="text" className="form-control" placeholder="ex: juan.delacruz@email.com" />
              <p className="requiredAlert"> <b> *</b></p>
            </div>
            <div className="mb-2 centerLabel">
              <label>Password:</label>
              <input required onChange={e => setPassword(e.target.value)} value={password} type="password" className="form-control" placeholder="ex: j.delacruz2022" />
              <p className="requiredAlert"> <b> *</b></p>
            </div>
          </div>
          <br/>
          <br/>
          <div className="centerButton">
            <button className="btn btn-outline-success allButtons">Complete Registration</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    )
  }

export default RegisterAccount