import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import { UserContext } from "../home"
import AccountsTable from "../components/AccountsTable"

function AllAccounts(){
    const { userData, setUserData } = useContext(UserContext)
    const [ accounts, setAccounts ] = useState([])
    
    useEffect(() => {
        let isCancelled = false
        const type = userData?.user.type
        const getAccountsData = async () => {
          try {
            const res = await Axios.get(`/api/all-accounts/${type}`, {headers: {'auth-token': userData.token}})
            if (!isCancelled) {
              setAccounts(res.data)
            }
          } catch (err) {
            console.log(err)
          }
        }
        getAccountsData()
        return ()=> {
          isCancelled = true
        }
    }, [])
    
    return(
      <div className="accountsList">
        <div className="centerContent">
          <h3>List of Accounts</h3>
        </div>
        <div className="centerContent">
          <AccountsTable accounts={accounts} />
        </div>
      </div>
    )
}

export default AllAccounts