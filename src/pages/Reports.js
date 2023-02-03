import React, { useState, useEffect, useRef} from "react"
import Axios from "axios"
import moment from "moment"
import { useReactToPrint } from "react-to-print"
import { useNavigate } from "react-router-dom"
import PieChart from "../charts/PieChart"
import BarChart from "../charts/BarChart"

function Reports() {
    const cloud_name = "dzjkgjjut"
    let navigate = useNavigate()
    let monthNow = moment(Date.now()).format("MMMM")
    let yearNow = moment(Date.now()).format("YYYY")
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const theMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026,2027, 2028, 2029, 2030]
    
    const [ selectedMonth, setSelectedMonth] = useState(monthNow)
    const [ selectedYear, setSelectedYear] = useState(yearNow)
    const [ numMonth, setNumMonth] = useState(moment(Date.now()).format("MM"))

    const [ requestData, setRequestData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })
    const [ ongoingData, setOngoingData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })
    const [ emptyAccomplished, setEmptyAccomplished] = useState(false)
    const [ accomplishedData, setAccomplishedData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })

    const [ annualRequestData, setAnnualRequestData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })
    const [ annualApprovedData, setAnnualApprovedData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })
    const [ annualDeniedData, setAnnualDeniedData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })
    const [ annualAccomplishedData, setAnnualAccomplishedData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })

    const [ usersData, setUsersData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })
    const [ allActiveUsers, setAllActiveUsers ] = useState([])
    const [ allActiveUsersTally, setAllActiveUsersTally ] = useState([])
    const [ activeUsersData, setActiveUsersData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })
    const [ allActiveUsersGenderTally, setAllActiveUsersGenderTally ] = useState([])
    const [ activeUsersGenderData, setActiveUsersGenderData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }],
    })
    
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Print Testing",
        //onAfterPrint: ()=> alert("Successfully printed a soft copy.")
    })
    
    useEffect(() => {
        const getProject = async () => {
          try {
            const res = await Axios.get(`/api/reports/request-reports/${numMonth}/${selectedYear}`)
            setRequestData({
                labels: res.data?.partial.map((data)=> data.type),
                datasets: [{
                    data: res.data?.partial.map((data)=> data.count)
                }]
            })
            const res2 = await Axios.get(`/api/reports/accomplished-reports/${numMonth}/${selectedYear}`)
            if (res2.data.total!==0) {
                setAccomplishedData({
                    labels: res2.data?.partial.map((data)=> data.type),
                    datasets: [{
                        data: res2.data?.partial.map((data)=> data.count)
                    }]
                })
            }
            if (res2.data.total===0) {
                setEmptyAccomplished(true)
            }
            const res3 = await Axios.get(`/api/reports/ongoing-projects`)
            setOngoingData({
                labels: res3.data?.partial.map((data)=> data.type),
                datasets: [{
                    data: res3.data?.partial.map((data)=> data.count)
                }]
            })
          } catch (err) {
            console.log(err)
          }
        }
        getProject()
    }, [numMonth, selectedYear])

    useEffect(() => {
        const getRecords = async () => {  
            try {
                const res1 = await Axios.get(`/api/reports/annual-reports/${numMonth}/${selectedYear}`)
                setAnnualRequestData({
                    labels: res1.data?.requestReport.map((data)=> months[data.id-1]),
                    datasets: [{
                        label: `Annual Request Data of ${selectedYear}`,
                        data: res1.data?.requestReport.map((data)=> data.count)
                    }]
                })
                setAnnualApprovedData({
                    labels: res1.data?.approvedReport.map((data)=> months[data.id-1]),
                    datasets: [{
                        label: `Annual Approved Data of ${selectedYear}`,
                        data: res1.data?.approvedReport.map((data)=> data.count)
                    }]
                })
                setAnnualDeniedData({
                    labels: res1.data?.deniedReport.map((data)=> months[data.id-1]),
                    datasets: [{
                        label: `Annual Denied Data of ${selectedYear}`,
                        data: res1.data?.deniedReport.map((data)=> data.count)
                    }]
                })
                setAnnualAccomplishedData({
                    labels: res1.data?.accomplishedReport.map((data)=> months[data.id-1]),
                    datasets: [{
                        label: `Annual Accomplished Data of ${selectedYear}`,
                        data: res1.data?.accomplishedReport.map((data)=> data.count)
                    }]
                })
            } catch (err) {
                console.log(err)
            }
        }
        getRecords()
    }, [selectedYear])

    useEffect(() => {
        const getUserReports = async () => {
          try {
            const res = await Axios.get(`/api/reports/account-reports/${numMonth}/${selectedYear}`)
            setUsersData({
                labels: res.data?.users.map((data)=> data.type),
                datasets: [{
                    label: "System user statistics",
                    data: res.data?.users.map((data)=> data.count)
                }]
            })
            setAllActiveUsers(res.data.allUsers)
          } catch (err) {
            console.log(err)
          }
        }
        getUserReports()
    }, [numMonth, selectedYear ])

    useEffect(() => {
        setAllActiveUsersTally([])
        const data1 = allActiveUsers?.filter((user) => user.type ==="Employer")
        setAllActiveUsersTally(prev=> prev.concat(
            {
                id: 1,
                type: "Employer",
                count: data1.length
            }
        ))
        const data2 = allActiveUsers?.filter((user) => user.type ==="Candidate")
        setAllActiveUsersTally(prev=> prev.concat(
            {
                id: 2,
                type: "Candidate",
                count: data2.length
            }
        ))

        setAllActiveUsersGenderTally([])
        const data3 = allActiveUsers?.filter((user) => user.sex ==="Male")
        setAllActiveUsersGenderTally(prev=> prev.concat([
            {
                id: 1,
                type: "Male",
                count: data3.length
            }
        ]))
        const data4 = allActiveUsers?.filter((user) => user.sex ==="Female")
        setAllActiveUsersGenderTally(prev=> prev.concat([
            {
                id: 2,
                type: "Female",
                count: data4.length
            }
        ]))
    }, [allActiveUsers])

    useEffect(() => {
        setActiveUsersData({
            labels: allActiveUsersTally?.map((data)=> data.type),
            datasets: [{
                label: "User type",
                data:  allActiveUsersTally?.map((data)=> data.count)
            }]
        })
        setActiveUsersGenderData({
            labels: allActiveUsersGenderTally?.map((data)=> data.type),
            datasets: [{
                label: "Sex",
                data:  allActiveUsersGenderTally?.map((data)=> data.count)
            }]
        })
    }, [allActiveUsersTally])

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

    return (
        <>  
            <div className="reports">
                <div className="centerContent">
                    <h1>System Reports</h1>
                </div>
                <br />
                <div className="sideContent">
                    <div>
                        <h4>Set Month and Year:</h4>
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
                            }} 
                            value={selectedYear}>
                                {years.map((a)=> {
                                    return <option className="selectedCategory" key={a}>{a}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div>
                        <button onClick={handlePrint} className="btn btn-sm btn-primary">Print System Report</button>
                        <button onClick={()=> navigate("/bug-reports")} className="btn btn-sm btn-primary">
                            View Bug Reports
                        </button>
                    </div>
                </div>
                <br />
            <div className="toPrint" ref={componentRef} style={{width: '100%', height: '100%'}}>
                <div>
                    <h2>Monthly Report: {selectedMonth}, {selectedYear}</h2>
                </div>
                <br />
                <div className="requests-grid">
                    <div className="reportContent">
                        <h4>Requests </h4>
                        <label>Reports throughout the month of {selectedMonth}, {selectedYear}</label>
                        <br />
                        <div style={{ width: 300 }}>
                            <PieChart chartData={requestData} />
                        </div>
                    </div>
                    
                    <div className="reportContent">
                        <h4>Accomplished Jobs & Projects</h4>
                        <label>Reports throughout the month of {selectedMonth}, {selectedYear}</label>
                        <br />
                        {emptyAccomplished!==true ?
                            <div style={{ width: 300 }}>
                                <PieChart chartData={accomplishedData} />
                            </div>
                        :<div><b>No data.</b></div>}
                    </div>

                    <div className="reportContent">
                        <h4>Ongoing Jobs & Projects </h4>
                        <label>Reports throughout the month of {selectedMonth}, {selectedYear}</label>
                        <br />
                        {ongoingData!==[] ?
                            <div style={{ width: 300 }}>
                                <PieChart chartData={ongoingData} />
                            </div>
                        :<></>}
                    </div>
                </div>
                <br />
                <br />
                <div>
                    <div>
                        <h2>Annual Report: {selectedYear}</h2>
                    </div>
                    <div className="annual-report-grid">
                        <div className="reportContentBar" style={{ width: 700 }}>
                            <BarChart chartData={annualRequestData} />
                        </div>
                        <div className="reportContentBar" style={{ width: 700 }}>
                            <BarChart chartData={annualApprovedData} />
                        </div>
                        <div className="reportContentBar" style={{ width: 700 }}>
                            <BarChart chartData={annualDeniedData} />
                        </div>
                        <div className="reportContentBar" style={{ width: 700 }}>
                            <BarChart chartData={annualAccomplishedData} />
                        </div>
                    </div>
                </div>
                <br />
                <br />
                <div>
                    <div>
                        <h3>User Reports:</h3>
                    </div>
                    <div className="requests-grid">
                        <div className="reportContent">
                            <label>User Count: </label>
                            <div style={{ width: 300 }}>
                                <PieChart chartData={usersData} />
                            </div>
                        </div>
                        <div className="reportContent">
                            <label>Active Users Type: </label>
                            <div style={{ width: 300 }}>
                                <PieChart chartData={activeUsersData} />
                            </div>
                        </div>
                        <div className="reportContent">
                            <label>Active Users Sex: </label>
                            <div style={{ width: 300 }}>
                                <PieChart chartData={activeUsersGenderData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default Reports