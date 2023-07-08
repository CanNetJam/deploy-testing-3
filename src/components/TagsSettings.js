import React, { useState, useEffect} from "react"
import Axios from "axios"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function TagsSettings() {
    const [category, setCategory] = useState([])
    const [tag, setTag] = useState("")
    const [addingTag, setAddingTag] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState()
    const [removingTag, setRemovingTag] = useState(false)
    const [accessSettings, setAccessSettings] = useState(false)

    useEffect(() => {
        const getCategory = async () => {
          try {
            const res = await Axios.get("/api/categories")
            setCategory(res.data)
          } catch (err) {
            console.log(err)
          }
        }
        getCategory()
    }, [])

    async function addTag (e) {
        e.preventDefault()
        try {
            const res = await Axios.post(`/api/add-tag/${selectedCategory}/${tag}`)
            if (res) {
                toastAddSuccessNotification()
            }
            let capitalize = tag?.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
            setCategory(prev =>
                prev.map(function (t) {
                    if (t._id == selectedCategory) {
                        let tags = t.tags
                        return { 
                            ...t, tags: [...tags, capitalize] 
                        }
                    }
                    return t
                })
            )
        } catch (err) {
            console.log(err)
        }
        setAddingTag(false)
        setTag("")
    }

    async function removeTag() {
        try {
            const res = await Axios.post(`/api/remove-tag/${selectedCategory}/${tag}`)
            if (res) {
                toastRemoveSuccessNotification(res.data)
            }
            setCategory(prev =>
                prev.map(function (t) {
                  if (t._id == selectedCategory) {
                    let oldTags = t.tags
                    const newTags = oldTags.filter((t)=>t!==tag)
                    return { 
                        ...t, tags: newTags
                    }
                  }
                  return t
                })
            )
        } catch (err) {
            console.log(err)
        }
        setRemovingTag(false)
        setTag("")
    }
    
    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }

    function toastAddSuccessNotification() {
        toast.success('Successfully added a new tag.', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            })
    }

    function toastRemoveSuccessNotification(props) {
        toast.success(`${props}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            })
    }
    
    return (
        <div>
            <div className="horizontal_line"></div>
            <p className="profileCardName">Tags Settings</p>
            <div className="settingsCategoryWrapper">
                {category.map((a)=> {
                    return (
                        <div className="settingsCategory" key={a._id}>
                            <div className="settingsCategoryTop">
                                <div className="selectedCategoryLabel">
                                    <label className="selectedCategory"><b>{a.name}</b></label>
                                </div>
                                <div className="accessSettings">
                                    <label className="selectedCategorySettings" onClick={()=> {
                                        if (accessSettings===false) {
                                            setAccessSettings(true)
                                            setSelectedCategory(a._id)
                                        } else if (accessSettings===true) {
                                            setAccessSettings(false)
                                            setSelectedCategory()
                                            setAddingTag(false)
                                            setRemovingTag(false)
                                            setTag("")
                                        }
                                    }}>
                                        <img src={"/WebPhoto/settings.png"} alt={"settings icon"} />
                                    </label>
                                    {accessSettings===true && selectedCategory===a?._id?
                                        <div className="accessSettingsOpen">
                                            {removingTag!==true ?
                                                <label onClick={()=>{
                                                    setAddingTag(true)
                                                    setAccessSettings(false)
                                                }} className="accessSettingsLabel">Add Tag</label >
                                            :<></>}

                                            {addingTag!==true && removingTag===false?
                                                <label  onClick={()=>{
                                                    setRemovingTag(true)
                                                    setAccessSettings(false)
                                                }} className="accessSettingsLabel">Remove Tag</label >
                                            :<></>}
                                        </div>
                                    :<></>}
                                </div>
                            </div>
                            {addingTag===true && selectedCategory===a._id?
                                <div className="newModalBackground2">
                                    <form className="addTag" onSubmit={addTag}>
                                        <div>
                                            <label style={{fontSize: 18}}>Adding a new tag to <b>{a.name}</b>.</label>
                                        </div>
                                        <br/>
                                        <div><label>Input new tag to be added.</label></div>
                                        <div>
                                            <input autoFocus required onChange={e => setTag(e.target.value)} type="text" className="form-control form-control-sm" value={tag}/>
                                        </div>
                                        <br/>
                                        <div>
                                            <button className="btn btn-outline-success allButtons">Confirm</button>
                                            <button type="button" className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=> {
                                                setTag(""),
                                                setAddingTag(false),
                                                setAccessSettings(false),
                                                setSelectedCategory()
                                            }}>
                                            Close
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            :null}
                            <br />
                            <div className="settingsCategoryBot">
                                <div className="searchTabs">
                                    {a?.tags?.map((b)=> {
                                        return <label className="selectedSettingsTagLabel" key={idPlusKey(a.name, b)}>{b}</label>
                                    })}
                                </div>
                            </div>
                            {removingTag===true && selectedCategory===a?._id?
                                <div className="newModalBackground2">
                                    <div className="removeTag">
                                        <div className="removeTagLabel">
                                            <div><label style={{fontSize: 18}}>Removing a tag on <b>{a.name}</b>.</label></div>
                                            {removingTag===true ?
                                                <button onClick={()=>{
                                                    setTag(""),
                                                    setRemovingTag(false),
                                                    setAccessSettings(false),
                                                    setSelectedCategory()
                                                }} className="btn btn-sm btn-outline-secondary cancelBtn">Close</button>
                                            :null}
                                        </div>
                                        <br/>
                                        <div className="searchTabsDelete">
                                            {a?.tags?.map((b)=> {
                                                return <label className="selectedTagLabel" key={idPlusKey(a.name, b)} onClick={()=>{
                                                            setTag(b)
                                                        }}>{b}</label >
                                            })}
                                        </div>
                                        {tag!=="" ?
                                            <div>
                                                <label>Remove <b>{tag}</b> from the <b>{a?.name}</b> category?</label>
                                                <br/>
                                                <br/>
                                            <div className="confirmRemoveLabel">
                                                <button onClick={()=> {
                                                    removeTag()
                                                }}
                                                className="btn btn-outline-success allButtons">Confirm</button>
                                                <button onClick={()=> {
                                                    setTag("")
                                                }}className="btn btn-sm btn-outline-secondary cancelBtn">Cancel</button>
                                            </div>
                                            </div>
                                        :null}
                                    </div>
                                </div>
                                :
                            null}
                        </div>
                    )
                })}
            </div>
            <ToastContainer />
        </div>
    )
}

export default TagsSettings