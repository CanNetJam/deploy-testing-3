import React, { useState, useRef, useContext, useEffect } from "react"
import Axios from "axios"
import {UserContext} from "../home"

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
    const [type, setType] = useState("Candidate")
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
      CreatePhotoField.current.value = ""
      const usertype = userData?.user.type
      const res = await Axios.post(`/api/create-account/${usertype}`, data, { headers: { "Content-Type": "multipart/form-data", 'auth-token': userData.token } })
      if (res.data===false) {
        alert("Email already exists.")
      }
      if (res.data===true) {
        alert("Successfully registered " + (type==="Candidate" ? "a " : "an ") +type+" account.")
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
        setType("Candidate")
      }
    }

    return (
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <div className="titleLabel"><h3><b>Account Registration</b></h3></div>
          <div className="mb-2 centerLabel">
            <label>Select an account type: </label>
            <select onChange={e => setType(e.target.value)} value={type}>
                <option name="Candidate">Candidate</option>
                <option name="Employer">Employer</option>
            </select>
            <p> <b> *</b></p>
          </div>
          <div className="mb-2 centerLabel">
            <label>First name:</label>
            <input required onChange={e => setFirstName(e.target.value)} value={firstname} type="text" className="form-control" placeholder="Juan, Pedro..." />
            <p> <b> *</b></p>
          </div>
          <div className="mb-2 centerLabel">
            <label>Last name:</label>
            <input required onChange={e => setLastName(e.target.value)} value={lastname} type="text" className="form-control" placeholder="Dela Cruz, Garcia..." />
            <p> <b> *</b></p>
          </div>
          <div className="mb-2 centerLabel">
            <label>Middle name:</label>
            <input onChange={e => setMiddleName(e.target.value)} value={middlename} type="text" className="form-control" placeholder="Reyes, Ramos..." />
          </div>
          <div className="mb-2 centerLabel">
            <label>Sex:</label>
            <select onChange={e => setSex(e.target.value)} value={type}>
                <option name="Male">Male</option>
                <option name="Female">Female</option>
            </select>
            <p> <b> *</b></p>
          </div>
          <div className="mb-2 centerLabel">
            <label>Age:</label>
            <input required onChange={e => setAge(e.target.value)} value={age} type="number" className="form-control" placeholder="1-99+" />
            <p> <b> *</b></p>
          </div>
          <div className="mb-2 locationWrapper"> 
                <label>Address:</label>
                <div className="location">
                  <div className="requiredLabel">
                    <label>Region:</label>
                    <p className="requiredAlert"> <b> *</b></p>
                  </div>
                  
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

                <div className="location">
                  <div className="requiredLabel">
                    <label>Province:</label>
                    <p className="requiredAlert"> <b> *</b></p>
                  </div>
                  
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

                <div className="location">
                  <div className="requiredLabel">
                    <label>City:</label>
                    <p className="requiredAlert"> <b> *</b></p>
                  </div>
                  
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
              </div>

          <div className="mb-2 centerLabel">
            <label>Add photo:</label>
            <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
          </div>
          <br />
          <div className="mb-2 centerLabel">
            <label>Email:</label>
            <input required onChange={e => setEmail(e.target.value)} value={email} type="text" className="form-control" placeholder="ex: juan.delacruz@email.com" />
            <p> <b> *</b></p>
          </div>
          <div className="mb-2 centerLabel">
            <label>Password:</label>
            <input required onChange={e => setPassword(e.target.value)} value={password} type="text" className="form-control" placeholder="ex: j.delacruz2022" />
            <p> <b> *</b></p>
          </div>
          <div className="centerButton">
            <button className="btn btn-sm btn-primary">Complete Registration</button>
          </div>
        </form>
      </div>
    )
  }

export default RegisterAccount