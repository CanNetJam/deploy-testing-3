import React, { useState, useContext } from "react"
import Axios from "axios"
import {UserContext} from "../home"
import moment from "moment"

function GalleryPhotos(props) {
    const cloud_name = "dzjkgjjut"
    const { userData, setUserData } = useContext(UserContext)
    const [ isEditing, setIsEditing ] = useState(false)
    const [ draftTitle, setDraftTitle ] = useState(props.title ? props.title : "")
    const [ draftDescription, setDraftDescription ] = useState(props.description ? props.description : "")
    
    async function submitHandler(e) {
        e.preventDefault()
        props.setPhotos(prev =>
          prev.map(function (photos) {
            if (photos._id == props._id) {
                return { ...photos, title: draftTitle, description: draftDescription}
            }
            return photos
          })
        )
        const data = new FormData()
        data.append("_id", props._id)
        data.append("title", draftTitle)
        data.append("description", draftDescription)
        await Axios.post(`/api/gallery/update-photo/${props._id}`, data, { headers: { "Content-Type": "multipart/form-data" } })
        setIsEditing(false)
    }
    
    return (
        <div className="galleryCard">
                <div className="galleryPicTop">
                    <img src={props.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_auto:good/${props.image}.jpg` : "/fallback.png"} className="galleryPic" alt={`${props.description} named ${props.title}`}></img>
                </div>
                <div className="galleryPicBot">
                    {!isEditing && (
                        <div>
                            <p>
                            <b>{props.title}</b><br/>
                            {moment(props.createdAt).format("MMM. DD, YYYY")}<br/>
                            Description: {props.description}</p>
                            {userData.user?.id===props.userId && (
                                <div>
                                    <button type="button" className="allButtons" onClick={()=>{ 
                                        setIsEditing(true), 
                                        setDraftTitle(props.title), 
                                        setDraftDescription(props.description)}}>
                                            Edit
                                    </button>{" "}
                                    <button type="button"                  
                                        onClick={async () => {
                                            const test = Axios.delete(`/api/gallery/delete-photo/${props._id}`)
                                            props.setPhotos(prev => {
                                            return prev.filter(photos => {
                                                return photos._id != props._id
                                                })
                                            })
                                        }}
                                    className="btn btn-sm btn-outline-danger">
                                            Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {isEditing && (
                        <div>
                            <form onSubmit={submitHandler}>
                            <div className="mb-1">
                                <label>Title:</label>
                                <input autoFocus onChange={e => setDraftTitle(e.target.value)} type="text" className="form-control form-control-sm" value={draftTitle} placeholder="Edit title..." />
                            </div>
                            <div className="mb-1">
                                <label>Description:</label>
                                <input onChange={e => setDraftDescription(e.target.value)} type="text" className="form-control form-control-sm" value={draftDescription} placeholder="Edit description..."/>
                            </div>
                                <button className="allButtons">Confirm</button>
                                <button onClick={() =>{setIsEditing(false)}} className="btn btn-sm btn-outline-secondary cancelBtn">
                                    Cancel
                                </button>
                            </form>
                        </div>
                    )}
                </div>
        </div>  
    )
}

export default GalleryPhotos