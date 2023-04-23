import React, { useState, useEffect} from "react"
import Axios from "axios"

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
            alert(res.data)
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
            alert(res.data)
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
    
    return (
        <div>
            <div>
                {category.map((a)=> {
                    return (
                        <div className="settingsCategory" key={a._id}>
                            <div className="settingsCategoryTop">
                                <div className="selectedCategoryLabel">
                                    <label className="selectedCategory"><b>{a.name}</b></label>
                                </div>
                                <div className="selectedCategorySettings">
                                    <button onClick={()=> {
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
                                    </button>
                                </div>
                                {accessSettings===true && selectedCategory===a?._id?
                                    <div>
                                        {removingTag!==true ?
                                            <button onClick={()=>{
                                                setAddingTag(true)
                                            }} className="btn btn-sm btn-primary">Add Tag</button>
                                        :<></>}

                                        {addingTag!==true && removingTag===false?
                                            <button onClick={()=>{
                                                setRemovingTag(true)
                                            }} className="btn btn-sm btn-outline-secondary cancelBtn">Remove Tag</button>
                                        :<></>}

                                        {removingTag===true ?
                                            <button onClick={()=>{
                                                setTag(""),
                                                setRemovingTag(false),
                                                setAccessSettings(false),
                                                setSelectedCategory()
                                            }} className="btn btn-sm btn-outline-secondary cancelBtn">Cancel</button>
                                        :<></>}
                                    </div>
                                :<></>}
                            </div>
                            {addingTag===true && selectedCategory===a._id?
                                <form className="addTag" onSubmit={addTag}>
                                    <br />
                                    <input autoFocus required onChange={e => setTag(e.target.value)} type="text" className="form-control form-control-sm" value={tag}/>
                                    <button className="btn btn-sm btn-primary">Confirm</button>
                                    <button type="button" className="btn btn-sm btn-outline-secondary cancelBtn" onClick={()=> {
                                        setTag(""),
                                        setAddingTag(false),
                                        setAccessSettings(false),
                                        setSelectedCategory()
                                    }}>
                                    Cancel
                                </button>
                            </form>
                            :<></>}
                            <br />
                            <div className="settingsCategoryBot">
                                {removingTag===true && selectedCategory===a?._id?
                                <div>
                                    <div className="searchTabs">
                                        {a?.tags?.map((b)=> {
                                            return <button className="btn btn-sm btn-primary" key={idPlusKey(a.name, b)} onClick={()=>{
                                                        setTag(b)
                                                    }}>{b}</button>
                                        })}
                                    </div>
                                    {tag!=="" ?
                                    <div className="confirmRemoveLabel">
                                        <label>Remove <b>{tag}</b> from the <b>{a?.name}</b> category?</label>
                                        <div>
                                            <button onClick={()=> {
                                                removeTag()
                                            }}
                                            className="btn btn-sm btn-primary">Confirm</button>
                                            <button onClick={()=> {
                                                setTag("")
                                            }}className="btn btn-sm btn-outline-secondary cancelBtn">Cancel</button>
                                        </div>
                                    </div>
                                    :<></>}
                                </div>
                                :
                                    <div className="searchTabs">
                                        {a?.tags?.map((b)=> {
                                            return <label className="tagLabel" key={idPlusKey(a.name, b)}>{b}</label>
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default TagsSettings