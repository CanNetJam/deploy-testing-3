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
                    <img src={props.image ? `https://res.cloudinary.com/${cloud_name}/image/upload/w_300,h_200,c_fill,q_85/${props.image}.jpg` : "/fallback.png"} className="galleryPic" alt={`${props.description} named ${props.title}`}></img>
                </div>
                <div className="galleryPicBot card-body">
                    {!isEditing && (
                        <div>
                            <p>{props.username}</p>
                            <p>Date: {moment(props.createdAt).format("MMM. DD, YYYY")}</p>
                            <p>Title: {props.title ? props.title : ""}</p>
                            <p>Description: {props.description ? props.description : ""}</p>
                            {userData.user?.id===props.userId && (
                                <div>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={()=>{ 
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
                            <form className="p-3 bg-success bg-opacity-25 mb-5" onSubmit={submitHandler}>
                            <div className="mb-1">
                                <label>Title:</label>
                                <input autoFocus onChange={e => setDraftTitle(e.target.value)} type="text" className="form-control form-control-sm" value={draftTitle} placeholder="Edit title..." />
                            </div>
                            <div className="mb-1">
                                <label>Description:</label>
                                <input autoFocus onChange={e => setDraftDescription(e.target.value)} type="text" className="form-control form-control-sm" value={draftDescription} placeholder="Edit description..."/>
                            </div>
                                <button className="btn btn-sm btn-primary">Confirm</button>
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