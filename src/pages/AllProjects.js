import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import { UserContext } from "../home"
import ProjectsTable from "../components/ProjectsTable"

function AllProjects(){
    const { userData, setUserData } = useContext(UserContext)
    const [ projects, setProjects ] = useState([])
    
    useEffect(() => {
      let isCancelled = false
      async function go() {
        const response = await Axios.get(`/api/all-projects/${userData.user.type}`, {headers: {'auth-token': userData.token}})
        if (!isCancelled) {
          setProjects(response.data)
        }
      }
      go()
      return ()=> {
        isCancelled = true
      }
    }, [])

    return(
        <div className="projectsList">
          <div className="centerContent">
            <h3>List of Jobs</h3>
          </div>
          <div className="centerContent">
            <ProjectsTable projects={projects}/>
          </div>
        </div>
    )
}

export default AllProjects