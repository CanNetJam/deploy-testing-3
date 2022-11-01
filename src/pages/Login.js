import React, { useState, useContext} from "react"
import {UserContext} from "../home"
import Axios from "axios"
import { useLocation } from 'react-router-dom'

function Login() {
    const location = useLocation()
    const { userData, setUserData } = useContext(UserContext)
    const [ legit, setLegit ] = useState()

    const [user, setUser] = useState({
        email: "",
        password: "",
      });
      const [errorMsg, setErrorMsg] = useState()
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const newUser = {
            email: user.email,
            password: user.password,
          }

          const loginResponse = await Axios.post("/api/login", newUser)
            if (loginResponse.data===false) {
              setLegit(false)
            }
            if (loginResponse.data) {
              setUserData({
                token: loginResponse.data.token,
                user: loginResponse.data.user,
              })
              localStorage.setItem("auth-token", loginResponse.data.token)
              setUser({
                email: "",
                password: "",
              })
              window.location = "/"
            }
        } catch (err) {
          err.response.data.msg
            ? setErrorMsg(err.response.data.msg)
            : setErrorMsg("We have an error!")
        }
      }
    
      const handleChange = (e) => {
        const { name, value } = e.target
        setUser((oldUser) => {
          return {
            ...oldUser,
            [name]: value,
          }
        })
      }

      return (
        <div className="homes dashboardCopy">
          <div className="loginWrapper">
            <div className="loginTop">
              <h1>Log In</h1>
            </div>
            <div className="loginBot">
              <form className="loginForm" onSubmit={handleSubmit}>
                {legit===false && (
                  <div>
                    <p>Incorrect Email or Password.</p>
                  </div>
                )}
                <div className="genericInput">
                  <label>Email:&nbsp; </label>
                  <input type="text" name="email" value={user.email} required onChange={handleChange}/>
                </div>
                
                <div className="genericInput">
                  <label>Password:&nbsp; </label>
                  <input type="password" name="password" value={user.password} onChange={handleChange}/>
                </div>
                <br />
                <div className="centerContent">
                  <button className="btn btn-sm btn-primary" variant="success" type="submit">Log In</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
}

export default Login