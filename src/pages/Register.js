import React, { useState, useRef, useContext } from "react"
import Axios from "axios"
import {UserContext} from "../home"

function RegisterAccount() {
    const { userData, setUserData } = useContext(UserContext)
    const [file, setFile] = useState("")
    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")
    const [middlename, setMiddleName] = useState("")
    const [age, setAge] = useState(0)
    const [address, setAddress] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [sex, setSex] = useState("Male")
    const [type, setType] = useState("Candidate")
    const CreatePhotoField = useRef()
  
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
      data.append("address", address)
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
        setSex("")
        setAge(0)
        setAddress("")
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
          <div className="mb-2 centerLabel">
            <label>Address:</label>
            <input required onChange={e => setAddress(e.target.value)} value={address} type="text" className="form-control" placeholder="Cavite, Laguna..." />
            <p> <b> *</b></p>
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