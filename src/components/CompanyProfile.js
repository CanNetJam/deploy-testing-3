import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../home"
import Axios from "axios"
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function CompanyProfile(props) {
    const location = useLocation()
    const cloud_name = "dzjkgjjut"
    const api_key = "848182664545332"
    const { userData, setUserData } = useContext(UserContext)
    const [companyInfo, setCompanyInfo] = useState(location?.state?.companyinfo ? location.state.companyinfo : userData.user.companyinfo)
    const [isEditing, setIsEditing] = useState(false)
    const [file, setFile] = useState()
    const [putFile, setPutFile] = useState(false)
    const [draftCompanyName, setDraftCompanyName] = useState("")
    const [draftCompanySize, setDraftCompanySize] = useState(0)
    const [draftInfo, setDraftInfo] = useState("")
    const [draftDate, setDraftDate] = useState(undefined)
    
    const [ regions, setRegions ] = useState([])
    const [ provinces, setProvinces ] = useState([])
    const [ cities, setCities ] = useState([])
    const [ filteredRegions, setFilteredRegions ] = useState([])
    const [ filteredProvinces, setFilteredProvinces ] = useState([])
    const [ filteredCities, setFilteredCities ] = useState([])
    const [ selectedRegion, setSelectedRegion ] = useState("")
    const [ selectedProvince, setSelectedProvince ] = useState("")
    const [ selectedCity, setSelectedCity ] = useState("")
    const [ region, setRegion ] = useState("")
    const [ province, setProvince ] = useState("")
    const [ city, setCity ] = useState("")
    const [ word, setWord ] = useState("more")
    const [ expand, setExpand ] = useState(false)

    function readMore(text) {
        const resultString = !expand ? text.slice(0, 1000) :text
        return (
            <p>
                {expand==false ? resultString+"...": resultString}
                <br/>
                <br/>
                <button className="btn btn-outline-success allButtons" onClick={()=> {
                    if (expand===false) {
                        setExpand(true) 
                        setWord("less")
                    }
                    if (expand===true) {
                        setExpand(false) 
                        setWord("more")
                    }
                }}>{`Read ${word}`}</button>
            </p>
        )
    }

    useEffect(() => {
      const getLocations = async () => {
        try {
          const res1 = await Axios.get("https://ph-locations-api.buonzz.com/v1/regions")
          setRegions(res1.data.data)
          const res2 = await Axios.get("https://ph-locations-api.buonzz.com/v1/provinces")
          setProvinces(res2.data.data)
          const res3 = await Axios.get("https://ph-locations-api.buonzz.com/v1/cities")
          setCities(res3.data.data)
        } catch (err) {
          console.log(err)
        }
      }
      getLocations()
    }, [])
    
    useEffect(() => {
        setFilteredRegions([])
        if (selectedRegion!=="" && selectedRegion!==companyInfo?.location?.region) {
          if (region==="") {
            const data = regions?.filter((item) => item.name.includes(selectedRegion.toUpperCase()))
            setFilteredRegions(data)
          }
        }
        if (selectedRegion==="" && isEditing===true) {
          setRegion("")
        }
    }, [selectedRegion])
    
    useEffect(() => {
        setFilteredProvinces([])
        if (selectedProvince!=="" && selectedProvince!==companyInfo?.location?.province) {
          if (province==="") {
            const data = provinces?.filter((item) => (item.region_code=== region?.id) 
            && (item.name.includes(selectedProvince.toUpperCase())))
            setFilteredProvinces(data)
          }
        }
        if (selectedProvince==="" && isEditing===true) {
          setProvince("")
        }
    }, [selectedRegion, selectedProvince])
    
    useEffect(() => {
        setFilteredCities([])
        if (selectedCity!=="" && selectedCity!==companyInfo?.location?.city) {
          if (city==="") {
            const data = cities?.filter((item) => (item.region_code=== region?.id) && 
            (item.province_code=== province?.id) && 
            (item.name.includes(selectedCity.toUpperCase())))
            setFilteredCities(data)
          }
        }
        if (selectedCity==="" && isEditing===true) {
          setCity("")
        }
    }, [selectedRegion, selectedProvince, selectedCity])
    
    async function submitHandler(e) {
        e.preventDefault()
        setCompanyInfo(prevState => ({
            companyInfo: {
                ...prevState.companyInfo, companyname: draftCompanyName, 
                companysize: draftCompanySize, 
                details: draftInfo,
                establishdate : draftDate,
                location: {
                    region: region ? region.name : companyInfo?.location?.region, 
                    province: province ? province.name : companyInfo?.location?.province, 
                    city: city ? city.name : companyInfo?.location?.city
                }
            }
        }))
        const loadingNotif = async function myPromise() {
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
                
                if (cloudinaryResponse) {
                    setCompanyInfo(prevState => ({
                        ...prevState.companyInfo, logo: cloud_image
                    }))
                }
            }
            data.append("employerid", userData.user?.id)
            data.append("companyname", draftCompanyName)
            data.append("companysize", draftCompanySize)
            data.append("companyinfo", draftInfo)
            data.append("establishdate", draftDate)
            data.append("region", region ? region.name : companyInfo?.location?.region)
            data.append("province", province ? province.name : companyInfo?.location?.province)
            data.append("city", city ? city.name : companyInfo?.location?.city)

            await Axios.post("/api/upload/company-details", data, { headers: { "Content-Type": "multipart/form-data" } })
        }
        toast.promise(
            loadingNotif,
            {
                pending: 'Updating company profile...',
                success: 'Company profile updated.',
                error: 'Company profile update failed!'
            }
        )
        setIsEditing(false)
    }

    return (
        <div className="companyProfile">
            <div className="companyProfileContent">
                {userData?.user && (
                    <div className="sideContent">
                        <div className="contentTitle">
                            <label><b>Company Profile</b></label>
                        </div>
                        {props.employer===userData?.user.id && (
                            <div className="rightContent">
                                <button className="btn btn-outline-success allButtons" onClick={()=> {
                                    setIsEditing(true)
                                    setDraftCompanyName(companyInfo.companyname)
                                    setDraftCompanySize(companyInfo.companysize)
                                    setDraftDate(companyInfo.establishdate)
                                    setDraftInfo(companyInfo.details)
                                    setSelectedRegion(companyInfo.location.region)
                                    setSelectedProvince(companyInfo.location.province)
                                    setSelectedCity(companyInfo.location.city)
                                }}>Edit</button>
                                {isEditing===true && (
                                    <button className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=> {
                                        setIsEditing(false)
                                    }}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <div className="companyProfileTop">
                    <div className="companyProfileTopHeader">
                        {isEditing && (
                            <div className="our-custom-input">
                                <div className="our-custom-input-interior">
                                    <input onChange={e => setFile(e.target.files[0])} className="form-control form-control-sm" type="file" />
                                </div>
                            </div>
                        )}
                        <img src={companyInfo?.logo ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_60/${companyInfo.logo}.jpg` : "/fallback.png"} className="companyLogo"></img>
                    </div>
                    {isEditing===false && (
                        <div className="companyProfileTopBot">
                            <div>
                                <label className="contentTitle"><b>{companyInfo.companyname!=="" ? companyInfo.companyname : "Not yet specified."}</b></label>
                            </div>
                            <br/>
                            <div className="companyProfileMid">
                                <div className="paragraphSpaceBetween">
                                    <div><label className="companyDetailsLogo"><img src={"/WebPhoto/people.png"}/> <b>Company Size: </b></label></div> 
                                    <div className="rightText">{companyInfo.companysize ? " "+companyInfo.companysize+" Employees" : <i>Not specified.</i>}</div>
                                </div>
                                <div className="paragraphSpaceBetween">
                                    <div><label className="companyDetailsLogo"><img src={"/WebPhoto/calendar.png"}/> <b>Established at: </b></label></div>
                                    <div className="rightText">{companyInfo.establishdate ? " "+companyInfo.establishdate : <i>Not specified.</i>}</div>
                                </div>
                                <div className="paragraphSpaceBetween">
                                    <div><label className="companyDetailsLogo"><img src={"/WebPhoto/map.png"}/> <b>Location: </b></label></div>
                                    <div className="rightText">{companyInfo.location ? companyInfo.location?.city+", " + companyInfo.location?.province+", " + companyInfo.location?.region: <i>Not specified.</i>}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <br/>
                {isEditing===false && (
                    <div className="companyProfileMidBot">
                        <div className="companyProfileBot">
                            <label><b>Company Overview: </b></label><br />
                            <div className="fromTextAreaContainer">
                                <p className="fromTextArea">{companyInfo.details ?
                                    <>
                                        {companyInfo.details.length>1000 ? 
                                        readMore(companyInfo.details)
                                        : companyInfo.details}
                                    </>
                                : <i>No data.</i>}</p>
                            </div>
                        </div>
                    </div>
                )}      
                {isEditing==true && (
                    <form className="editCompanyProfileForm" onSubmit={submitHandler}>
                        <div>
                            <div className="mb-1">
                                <label>Company Name:</label>
                                <input onChange={e => setDraftCompanyName(e.target.value)} type="text" className="form-control form-control-sm" value={draftCompanyName}/>
                            </div>
                            <div className="inputGrid">
                                <div className="mb-1">
                                    <label>Company Size:</label>
                                    <input onChange={e => setDraftCompanySize(e.target.value)} type="number" className="form-control form-control-sm" value={draftCompanySize}/>
                                </div>
                                <div className="mb-1">
                                    <label>Establish Year: </label>
                                    <input onChange={e => setDraftDate(e.target.value)} type="number" min="1900" max="2099" step="1"  className="form-control form-control-sm" value={draftDate}/>
                                </div>
                            </div>
                            <label>Company Location:</label>
                            <div className="inputGrid">
                                <div className="centerLabel location">
                                <label>Region:</label>
                                <input required onChange={e => {
                                    setSelectedRegion(e.target.value)
                                }} value={selectedRegion} type="text" className="form-control inputGridTextBox" />
                                
                                {filteredRegions.length != 0 && (
                                    <div className="dataResult">
                                    {filteredRegions.map((a) => {
                                        return (
                                        <a key={a.id} className="dataItem" onClick={()=> {
                                        setSelectedRegion(a.name)
                                        setRegion(a)
                                        setFilteredRegions([])}}>
                                            <p>{a.name} </p>
                                        </a>
                                        )
                                    })}
                                    </div>
                                )}
                                <p className="requiredAlert"> <b> *</b></p>
                                </div>

                                <div className="centerLabel location">
                                <label>Province:</label>
                                <input required onChange={e => {
                                    setSelectedProvince(e.target.value)
                                }} value={selectedProvince} type="text" className="form-control inputGridTextBox" />
                                
                                {filteredProvinces.length != 0 && (
                                    <div className="dataResult">
                                    {filteredProvinces.map((a) => {
                                        return (
                                        <a key={a.id} className="dataItem" onClick={()=> {
                                        setSelectedProvince(a.name)
                                        setProvince(a)
                                        setFilteredProvinces([])}}>
                                            <p>{a.name} </p>
                                        </a>
                                        )
                                    })}
                                    </div>
                                )}
                                <p className="requiredAlert"> <b> *</b></p>
                                </div>

                                <div className="centerLabel location">
                                <label>City:</label>
                                <input onChange={e => {
                                    setSelectedCity(e.target.value)
                                }} value={selectedCity} type="text" className="form-control inputGridTextBox" />
                                
                                {filteredCities.length != 0 && (
                                    <div className="dataResult">
                                    {filteredCities.map((a) => {
                                        return (
                                        <a key={a.id} className="dataItem" onClick={()=> {
                                        setSelectedCity(a.name)
                                        setCity(a)
                                        setFilteredCities([])}}>
                                            <p>{a.name} </p>
                                        </a>
                                        )
                                    })}
                                    </div>
                                )}
                                <p className="requiredAlert"> <b> *</b></p>
                                </div>
                            </div>

                            <div className="mb-1">
                                <label>Company Details:</label>
                                <textarea rows = "10" cols = "60" onChange={e => setDraftInfo(e.target.value)} type="text" className="form-control form-control-sm" value={draftInfo}/>
                            </div>
                            <br />
                            <div className="centerContent">
                                <button className="btn btn-outline-success allButtons">Submit</button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
            <ToastContainer />
        </div>
    )
}

export default CompanyProfile