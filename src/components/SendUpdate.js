import React, { useState, useRef, useContext } from "react"
import {UserContext} from "../home"
import Axios from "axios"

function SendUpdate(props) {
    const { userData, setUserData } = useContext(UserContext)

    const [ title, setTitle ] = useState(props.title)
    const [ file, setFile ] = useState("")
    const [ description, setDescription ] = useState(props.description)
    const [ uploadedby, setUploadedBy ] = useState(userData.user.id)
    const CreatePhotoField = useRef()
    
    async function submitHandler(e) {
      e.preventDefault()
      const data = new FormData()
      data.append("_id", props.projectid)
      data.append("title", title)
      if (file) {
        data.append("photo", file)
      }
      data.append("description", description)
      data.append("uploadedby", uploadedby)
      setTitle("")
      setFile("")
      setDescription("")
      setUploadedBy("")
      CreatePhotoField.current.value = ""
      const res =await Axios.post("/api/project-update/edit", data, { headers: { "Content-Type": "multipart/form-data" } })
      const subject = res.data.projectId
      const type = "Project Update"
      const action = "sent a"
      await Axios.post(`/api/send-notifications/${userData.user.id}/${props.employer}/${action}/${type}/${subject}`)

      props.socket.emit("sendNotification", {
        senderId: userData.user.id,
        receiverId: props.employer,
        subject: subject,
        type: type,
        action: action,
      })
      props.setAddUpdate(res.data)
      props.setSendUpdate(false)
    }
    
    return (
      <div>
        <form className="projectUpdate" onSubmit={submitHandler}>
          <h3>Add photo (optional)</h3>
          <div className="mb-2">
            <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
          </div>
          <div className="mb-2">
            <input onChange={e => setTitle(e.target.value)} value={title} type="text" className="form-control" placeholder="Update Title" />
          </div>
          <div className="mb-2">
            <input onChange={e => setDescription(e.target.value)} value={description} type="text" className="form-control" placeholder="A brief description of the project update." />
          </div>
          <button className="btn btn-sm btn-primary">Complete Project Update</button>
        </form>
      </div>
    )
  }

export default SendUpdate