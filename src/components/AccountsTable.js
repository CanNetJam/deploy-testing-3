import React, { useState, useContext } from "react"
import { UserContext } from "../home"
import Axios from "axios"
import { useNavigate } from "react-router-dom"

function AccountsTable({accounts}) {
    let navigate = useNavigate()
    const { userData, setUserData } = useContext(UserContext)

    async function startConversation(props) {
        const members = [userData.user.id, props]
        try {
            const prevConvo = await Axios.get("/api/get-conversation/", {params: {
                member1: userData.user.id,
                member2: props
            }})
            if (prevConvo.data) {
                navigate("/messages", {state: {_id: prevConvo.data}})
            }
            if (prevConvo.data === null) {
                const createConvo = await Axios.post("/api/create-conversation", members)
                navigate("/messages", {state: {_id: createConvo.data}})
            }
        }catch (err) {
            console.log(err)
        }
    }

    async function AdminEdit(props) {
        navigate("/profile/user", {state: {account: props}})
    }
    
    return (
        <div className="tableList">
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Type</th>
                        <th>Photo</th>
                        <th>First Name</th>
                        <th>Middle Name</th>
                        <th>Last Name</th>
                        <th>Age</th>
                        <th>Adress</th>
                        
                        <th>Profile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((acc)=> (
                        <tr key={acc._id}>
                            <td>{((accounts.indexOf(acc))+1)<10 ? "0"+((accounts.indexOf(acc))+1) : ((accounts.indexOf(acc))+1) }</td>
                            <td>{acc.type}</td>
                            <td><img className="messageImg" src={acc.photo ? `/uploaded-photos/${acc.photo}` : "/fallback.png"} alt=""/></td>
                            <td>{acc.firstname}</td>
                            <td>{acc.middlename ? acc.middlename : "-"}</td>
                            <td>{acc.lastname}</td>
                            <td>{acc.age}</td>
                            <td>{acc.address}</td>

                            <td>
                                <button className="btn btn-sm btn-primary" onClick={()=> {
                                    navigate("/search-profile", {state: {_id: acc._id, projectid: ""}})
                                }}>
                                    Profile
                                </button>
                            </td>
                            <td className="twoContent">
                                <button className="btn btn-sm btn-primary" onClick={()=> {
                                    startConversation(acc._id)
                                }}>
                                    Chat
                                </button>
                                <button className="btn btn-sm btn-primary" onClick={()=> {
                                    AdminEdit(acc)
                                }}>
                                    Edit Profile
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AccountsTable

/*  <td>{acc.skill.map((a)=> {
        return (
            <div key={idPlusKey(a, userData.user.id)}>
                <label>{a}</label>
            </div>
        )
    })}</td>*/