import React, { useState, useEffect, useRef, useContext } from "react"
import {UserContext} from "../home"
import Axios from "axios"

function Review(props) {
    const api_key = "848182664545332"
    const cloud_name = "dzjkgjjut"
    const { userData, setUserData } = useContext(UserContext)
    const [ file, setFile ] = useState("")
    const [ description, setDescription ] = useState("")
    const [ uploadedby, setUploadedBy ] = useState(userData.user.id)
    const [ rating, setRating ] = useState("")
    const [ empInfo, setEmpInfo ] = useState()
    const [ freeInfo, setFreeInfo ] = useState()
    const [ isRated, setIsRated ] = useState()
    const CreatePhotoField = useRef()
    
    let ratings = [1, 2, 3, 4, 5]

    useEffect(() => {
      const user = userData.user.id
      const getUserData = async () => {
        try {
          const res = await Axios.get(`/api/search-profile/${user}`)
          setEmpInfo(res.data)
        } catch (err) {
          console.log(err)
        }
      }
      getUserData()
    }, [])

    useEffect(() => {
      const user = props?.candidate
      const getFreeData = async () => {
        try {
          const res = await Axios.get(`/api/search-profile/${user}`)
          setFreeInfo(res.data)
        } catch (err) {
          console.log(err)
        }  
      }
      getFreeData()
    }, [])

    async function submitHandler(e) {
      e.preventDefault()
      if (!rating) {
        setIsRated(false)
      }
      if (rating) {
      const projectid = props.projectid
      const candidate = props.candidate
      const empname = (empInfo?.firstname)+" "+(empInfo?.middlename ? (empInfo.middlename).charAt(0).toUpperCase()+", ": "")+(empInfo?.lastname)
      const freename = (freeInfo?.firstname)+" "+(freeInfo?.middlename ? (freeInfo.middlename).charAt(0).toUpperCase()+", ": "")+(freeInfo?.lastname)
      
      const data = new FormData()
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
      data.append("rating", rating)
      data.append("uploadedby", uploadedby)
      data.append("candidate", candidate)
      if (empInfo) {
        data.append("empname", empname)
      }
      if (freeInfo) {
        data.append("freename", freename)
      }
      
      setFile("")
      setDescription("")
      setRating("")
      setUploadedBy("")

      await Axios.post(`/api/reviews/${projectid}/${candidate}`, data, { headers: { "Content-Type": "multipart/form-data" } })
      props.setWriteReview(false)
      props.setReviewed(true)
      }
    }
    
    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }

    return (
      <div>
        <form className="settingsForm" onSubmit={submitHandler}>
            <h2>Writing a review about {freeInfo?.firstname} { freeInfo?.middlename ? freeInfo?.middlename?.charAt(0).toUpperCase() + "." : ""} {freeInfo?.lastname}...</h2>
            <div className="mb-2">
                <input required onChange={e => setDescription(e.target.value)} value={description} type="text" className="form-control" placeholder="Write what you think about your partner's work performance." />
            </div>

            <h4>Add photo (optional)</h4>
            <div className="mb-2">
                <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
            </div>

            <p>Rate your Employee. (5 is the Highest...1 is the Lowest)</p>
            {isRated===false && <label>Please select a rating below!</label>}
            <div>
                {ratings.map((a)=> {
                    return <button type="button" className="btn btn-sm btn-primary" key={idPlusKey(a, userData.user.id)} onClick={()=> {setRating(a), setIsRated(true)}}>{a}</button>
                })}
            </div>
            <div>
              {rating && (
                <div>
                  <label>Give 
                    {ratings.map((a)=>{
                      if(a<=rating) {
                        return <img key={a}src={"/WebPhoto/star.png"} alt={"star icon"} />
                      }
                    })} to {freeInfo?.firstname} { freeInfo?.middlename ? freeInfo?.middlename?.charAt(0).toUpperCase() + "." : ""} {freeInfo?.lastname}?</label>
                </div>
              )}
            </div>
            <button className="btn btn-sm btn-primary">Confirm</button>
        </form>
      </div>
    )
  }

export default Review