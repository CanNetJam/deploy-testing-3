import React, { useState, useRef, useContext } from "react"
import { UserContext } from "../home"
import Axios from "axios"

function BugReports() {
    const api_key = "848182664545332"
    const cloud_name = "dzjkgjjut"
    const { userData, setUserData } = useContext(UserContext)
    const [ title, setTitle ] = useState("")
    const [ file, setFile ] = useState("")
    const [ description, setDescription ] = useState("")
    const [ isPhoto, setIsPhoto ] = useState()
    const CreatePhotoField = useRef()
    
    async function submitHandler(e) {
        e.preventDefault()
        if (!file) {
            setIsPhoto(false)
        }
        if (file) {
            const data = new FormData()
            data.append("userid", userData?.user.id) 
            data.append("title", title)
            data.append("description", description)

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
    
            data.append("photo", cloud_image)
            data.append("public_id", cloudinaryResponse.data.public_id)
            data.append("version", cloudinaryResponse.data.version)
            data.append("signature", cloudinaryResponse.data.signature)

            CreatePhotoField.current.value = ""
            await Axios.post("/api/bug-report", data, { headers: { "Content-Type": "multipart/form-data" } })
            alert("Successfully sent a bug report. We'll try to fix it as soon as possible. Thank you for your time.")
            setTitle("")
            setFile("")
            setDescription("")
        }
    }
    
    return (
        <div>
            <form className="settingsForm" onSubmit={submitHandler}>
                <label>Select a photo (Required!)</label>
                <div className="mb-2">
                    <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
                </div>
                {isPhoto===false ? <div className="alert"><p>Please select a photo to upload!</p></div> : <></>}
                <div className="mb-2">
                    <input required onChange={e => setTitle(e.target.value)} value={title} type="text" className="form-control" placeholder="Title of the bug report." />
                </div>
                <div className="mb-2">
                    <textarea required rows = "5" cols = "60" onChange={e => setDescription(e.target.value)} value={description} type="text" className="form-control" placeholder="Explain how you think the bug happen." />
                </div>
                <button className="btn btn-sm btn-primary">Send Report</button>
            </form>
        </div>  
    )
}

export default BugReports