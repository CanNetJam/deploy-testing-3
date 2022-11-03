import React, { useState, useRef, useContext } from "react"
import { UserContext } from "../home"
import Axios from "axios"

function BugReports() {
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
            data.append("photo", file)
            data.append("description", description)
            CreatePhotoField.current.value = ""
            await Axios.post("/api/bug-report", data, { headers: { "Content-Type": "multipart/form-data" } })
            alert("Successfully sent a bug report. We'll try to fix it as soon as possible. Thank you for your time.")
            setTitle("")
            setFile("")
            setDescription("")
        }
    }
    
    return (
        <div >
            <h3>Bug Report</h3>
                        <div className="galleryForm">
                            <form className="p-3 bg-success bg-opacity-25 mb-5" onSubmit={submitHandler}>
                                <h3>Select a photo (Required!)</h3>
                                    <div className="mb-2">
                                        <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
                                    </div>
                                    {isPhoto===false ? <div className="alert"><p>Please select a photo to upload!</p></div> : <></>}
                                    <div className="mb-2">
                                        <input required onChange={e => setTitle(e.target.value)} value={title} type="text" className="form-control" placeholder="Title of the bug report." />
                                    </div>
                                    <div className="mb-2">
                                        <input required onChange={e => setDescription(e.target.value)} value={description} type="text" className="form-control" placeholder="Explain how you think the bug happen." />
                                    </div>
                                <button className="btn btn-sm btn-primary">Send Report</button>
                            </form>
                        </div>
        </div>  
    )
}

export default BugReports