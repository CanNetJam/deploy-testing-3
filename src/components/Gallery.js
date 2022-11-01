import React, { useState, useEffect, useRef, useContext } from "react"
import { UserContext } from "../home"
import Axios from "axios"
import GalleryPhotos from "./GalleryPhotos"

function Gallery(props) {
    const { userData, setUserData } = useContext(UserContext)
    const [ addPhoto, setAddPhoto ] = useState(false)
    const [ title, setTitle ] = useState("")
    const [ file, setFile ] = useState("")
    const [ description, setDescription ] = useState("")
    const [ freeInfo, setFreeInfo ] = useState("")
    const [ freeFirstName, setFreeFirstName ] = useState("")
    const [ photos, setPhotos ] = useState([])
    const [ isPhoto, setIsPhoto ] = useState()
    const CreatePhotoField = useRef()
    
    useEffect(() => {
        let userId
        if (props.candidate) {
            userId = props.candidate
        }
        if (!props.candidate) {
            userId = userData?.user.id
        }
        const getUserData = async () => {
            try {
                const res = await Axios.get(`/api/gallery/${userId}`)
                setPhotos(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getUserData()
    }, [])
 
    useEffect(() => {
        let user
        if (props.candidate) {
            user = props.candidate
        }
        if (!props.candidate) {
            user = userData?.user.id
        }
        const getUserData = async () => {
            try {
                const res = await Axios.get(`/api/search-profile/${user}`)
                const name = (res.data.firstname)+" "+(res.data.middlename ? (res.data.middlename).charAt(0).toUpperCase()+". " : "")+(res.data.lastname)
                setFreeInfo(name)
                setFreeFirstName(res.data.firstname)
            } catch (err) {
                console.log(err)
            }
        }
        getUserData()
    }, [])
    
    async function submitHandler(e) {
        e.preventDefault()

        if (!file) {
            setIsPhoto(false)
        }
        if (file) {

        const data = new FormData()
        data.append("userId", userData?.user.id) 
        data.append("username", freeInfo)
        if (title) {
            data.append("title", title)
        }
        if (file) {
            data.append("photo", file)
        }
        if (description) {
            data.append("description", description)
        }
        setTitle("")
        setFile("")
        setDescription("")
        CreatePhotoField.current.value = ""
        const res = await Axios.post(`/api/gallery/upload-photo/${userData?.user.id}`, data, { headers: { "Content-Type": "multipart/form-data" } })
        setAddPhoto(false)
        setPhotos(prev => prev.concat([res.data]))
        }
    }
    
    return (
        <div className="gallery">
            <div className="galleryTop">
                <div>
                    <h3><b>{(freeFirstName)+"'s "}Gallery</b></h3>
                </div>
                {!props.admin && (
                    <div>
                        {props.candidate===userData?.user?.id && (
                            <div className="toUpload">
                                <button className="btn btn-sm btn-primary" onClick={()=>{setAddPhoto(true)}}>
                                    Upload Photo
                                </button>
                                {addPhoto && (
                                    <button className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=>{setAddPhoto(false)}}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
                <div>
                    {addPhoto && (
                        <div className="galleryForm">
                            <form className="p-3 bg-success bg-opacity-25 mb-5" onSubmit={submitHandler}>
                                <h3>Select a photo (Required!)</h3>
                                    <div className="mb-2">
                                        <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
                                    </div>
                                    {isPhoto===false ? <div className="alert"><p>Please select a photo to upload!</p></div> : <></>}
                                    <div className="mb-2">
                                        <input required onChange={e => setTitle(e.target.value)} value={title} type="text" className="form-control" placeholder="Title of your photo..." />
                                    </div>
                                    <div className="mb-2">
                                        <input required onChange={e => setDescription(e.target.value)} value={description} type="text" className="form-control" placeholder="A brief description of your photo..." />
                                    </div>
                                <button className="btn btn-sm btn-primary">Upload Now</button>
                            </form>
                        </div>
                    )}
                </div>
            <div className="galleryBot">
                {photos[0] ?
                    <div className="accounts-grid">
                        {photos.map(function(photo) {
                        return <GalleryPhotos 
                        key={photo._id} 
                        _id={photo._id}
                        userId={photo.userId}
                        title={photo.title}
                        username={photo.username}
                        photo={photo.photo}
                        description={photo.description}
                        createdAt={photo.createdAt}
                        setPhotos={setPhotos}/>
                        })}
                    </div>
                : <div className="accounts-grid">No photo available.</div>}
            </div>
        </div>  
    )
}

export default Gallery