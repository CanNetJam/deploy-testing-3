import React, { useState, useEffect} from "react"
import Axios from "axios"
import moment from "moment"

function Reports() {
    let monthNow = moment(Date.now()).format("MMMM")
    let yearNow = moment(Date.now()).format("YYYY")
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const theMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026,2027, 2028, 2029, 2030]

    const [ requests, setRequests] = useState()
    const [ projects, setProjects] = useState()
    const [ ongoing, setOngoing] = useState()
    const [ approved, setApproved] = useState([])
    const [ denied, setDenied] = useState([])
    const [ selectedMonth, setSelectedMonth] = useState(monthNow)
    const [ selectedYear, setSelectedYear] = useState(yearNow)
    const [ numMonth, setNumMonth] = useState(moment(Date.now()).format("MM"))
    const [ allRecords, setAllRecords] = useState([])
    const [ bugReports, setBugReports] = useState([])

    useEffect(() => {
        const getRecords = async () => {  
            try {
                for(let i = 1; i<13 ; i++){
                    const obj = {
                        month: i,
                    }
                    const res1 = await Axios.get(`/api/reports/projects/${i}/${selectedYear}`)
                        obj.projects = res1?.data ? res1.data.length : 0
                    const res2 = await Axios.get(`/api/reports/requests/${i}/${selectedYear}`)
                        obj.requests = res2?.data ? res2.data.length : 0
                        let data1 = res2?.data?.filter((req) => (req.requeststatus === "Approved"))
                        obj.approved = data1 ? data1.length : 0
                        let data2 = res2?.data?.filter((req) => (req.requeststatus === "Denied"))
                        obj.denied = data2 ? data2.length : 0
                        setAllRecords(prev => prev.concat(obj))
                }
            } catch (err) {
                console.log(err)
            }
        }
        getRecords()
    }, [selectedYear])
    
    useEffect(() => {
        const getProject = async () => {
          try {
            const res1 = await Axios.get(`/api/reports/projects/${numMonth}/${selectedYear}`)
            setProjects(res1.data)
            const res2 = await Axios.get(`/api/reports/requests/${numMonth}/${selectedYear}`)
            setRequests(res2.data)
            const res3 = await Axios.get(`/api/reports/ongoing-projects`)
            setOngoing(res3.data)
          } catch (err) {
            console.log(err)
          }
        }
        getProject()
    }, [numMonth, selectedYear])

    useEffect(() => {
        const getBugReports = async () => {
          try {
            const res = await Axios.get("/api/all-bug-report")
            setBugReports(res.data)
          } catch (err) {
            console.log(err)
          }
        }
        getBugReports()
    }, [])

    useEffect(() => {
        const setMonth = async () => {
            if (selectedMonth==="January") {
                setNumMonth(1)
            }
            if (selectedMonth==="February") {
                setNumMonth(2)
            }
            if (selectedMonth==="March") {
                setNumMonth(3)
            }
            if (selectedMonth==="April") {
                setNumMonth(4)
            }
            if (selectedMonth==="May") {
                setNumMonth(5)
            }
            if (selectedMonth==="June") {
                setNumMonth(6)
            }
            if (selectedMonth==="July") {
                setNumMonth(7)
            }
            if (selectedMonth==="August") {
                setNumMonth(8)
            }
            if (selectedMonth==="September") {
                setNumMonth(9)
            }
            if (selectedMonth==="October") {
                setNumMonth(10)
            }
            if (selectedMonth==="November") {
                setNumMonth(11)
            }
            if (selectedMonth==="December") {
                setNumMonth(12)
            }
        }
        setMonth()
    }, [selectedMonth])

    useEffect(() => {
        const data = projects?.filter((req) => (req.requeststatus === "Approved"))
        setApproved(data)
    }, [projects])

    useEffect(() => {
        const data = requests?.filter((req) => (req.requeststatus === "Denied"))
        setDenied(data)
    }, [requests])

    return (
        <div className="reports">
            <div>
                <h1>Reports</h1>
            </div>
            <div>
                <h3>Set Month and Year:</h3>
                <div>
                    <select className="selectCategory" onChange={e => {
                        setSelectedMonth(e.target.value)}} 
                    value={selectedMonth}>
                        {months.map((a)=> {
                            return <option className="selectedCategory" key={a}>{a}</option>
                        })}
                    </select>
                </div>
                <div>
                    <select className="selectCategory" onChange={e => {
                        setSelectedYear(e.target.value)
                        setAllRecords([])
                    }} 
                    value={selectedYear}>
                        {years.map((a)=> {
                            return <option className="selectedCategory" key={a}>{a}</option>
                        })}
                    </select>
                </div>
            </div>
            <div className="card">
                <h3>Requests Count: </h3>
                <label>Request(s) sent during the month of {selectedMonth}, {selectedYear}: {requests ? <b>{requests.length}</b> : 0}</label>
                <br />
                <label>Request(s) approved during the month of {selectedMonth}, {selectedYear}: {approved ? <b>{approved?.length}</b> : 0}</label>
                <br />
                <label>Request(s) denied during the month of {selectedMonth}, {selectedYear}: {denied ? <b>{denied?.length}</b> : 0}</label>
                <br />
                <h3>Jobs and Projects Count: </h3>
                <label>Job(s) and Project(s) completed during the month of {selectedMonth}, {selectedYear}: {projects ? <b>{projects.length}</b> : 0}</label>
                <br />

                <h3>Ongoing Job(s): </h3>
                <label>Number of Job(s): {ongoing ? <b>{ongoing.length}</b> : 0}</label>
            </div>
            <div>
                <h2>Annual Report: {selectedYear}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th># of Request</th>
                            <th># of Approved</th>
                            <th># of Denied</th>
                            <th># of Jobs Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allRecords.map((a)=> (
                            <tr key={a.month}>
                                <td>{a.month}</td>
                                <td>{a.requests}</td>
                                <td>{a.approved}</td>
                                <td>{a.denied}</td>
                                <td>{a.projects}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h2>Bug Reports</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Sender</th>
                            <th>Title</th>
                            <th>Photo</th>
                            <th>Desription</th>
                            <th>Report Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bugReports.map((a)=> (
                            <tr key={a.month}>
                                <td>{a.userid}</td>
                                <td>{a.title}</td>
                                <td><img className="messageImg" src={a.photo ? `/uploaded-photos/${a.photo}` : "/fallback.png"} alt=""/></td>
                                <td>{a.description}</td>
                                <td>{a._id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Reports