import React, { useState, useRef, useContext } from "react"
import {UserContext} from "../home"
import Axios from "axios"

function SendUpdate(props) {
    const api_key = "848182664545332"
    const cloud_name = "dzjkgjjut"
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
          <div className="mb-2">
            <label><b>Add photo (optional)</b></label>
            <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
          </div>
          <div className="mb-2">
            <input onChange={e => setTitle(e.target.value)} value={title} type="text" className="form-control" placeholder="Update Title" />
          </div>
          <div className="mb-2">
            <input onChange={e => setDescription(e.target.value)} value={description} type="text" className="form-control" placeholder="A brief description of the project update." />
          </div>
          <button className="btn btn-outline-success allButtons">Complete Project Update</button>
        </form>
      </div>
    )
  }

export default SendUpdate