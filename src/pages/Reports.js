import React, { useState, useEffect, useRef} from "react"
import Axios from "axios"
import moment from "moment"
import { useReactToPrint } from "react-to-print"
import { useNavigate } from "react-router-dom"
import PieChart from "../charts/PieChart"
import BarChart from "../charts/BarChart"
import DateRangePickerComp from "../components/DateRangePicker"
import AllProjectsTable from "../components/AllProjectsTable"

function Reports() {
    const cloud_name = "dzjkgjjut"
    let navigate = useNavigate()
    let monthNow = moment(Date.now()).format("MMMM")
    let yearNow = moment(Date.now()).format("YYYY")
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026,2027, 2028, 2029, 2030]
    const [ currentView, setCurrentView] = useState("View Monthly Reports")
    const [ viewData, setViewData] = useState(false)
    const [ openHeader, setOpenHeader] = useState(false)
    const topPage = useRef(null)
    const [ selectedMonth, setSelectedMonth] = useState(monthNow)
    const [ selectedYear, setSelectedYear] = useState(yearNow)
    const [ numMonth, setNumMonth] = useState(moment(Date.now()).format("MM"))
    const [ dateRange, setDateRange] = useState({
        startDate: undefined,
        endDate: undefined
    })
    const [ allApprovedRequestData, setAllApprovedRequestData ] = useState([])
    const [ allDeniedRequestData, setAllDeniedRequestData ] = useState([])
    const [ allPendingRequestData, setAllPendingRequestData ] = useState([])
    const [ pie1Total, setPie1Total] = useState(0)

    const [ allAccomplishedJobsData, setAllAccomplishedJobsData ] = useState([])
    const [ allAccomplishedProjectsData, setAllAccomplishedProjectsData ] = useState([])
    const [ pie2Total, setPie2Total] = useState(0)

    const [ allOngoingProjectsData, setAllOngoingProjectsData ] = useState([])
    const [ allOngoingJobsData, setAllOngoingJobsData ] = useState([])
    const [ pie3Total, setPie3Total] = useState(0)

    const [ allAnnualRequestData, setAllAnnualRequestData ] = useState([])
    const [ allAnnualApprovedData, setAllAnnualApprovedData ] = useState([])
    const [ allAnnualDeniedData, setAllAnnualDeniedData ] = useState([])
    const [ allAnnualAccomplishedData, setAllAnnualAccomplishedData ] = useState([])
    
    const [ emptyRequest, setEmptyRequest] = useState(false)
    const [ requestData, setRequestData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }], 
    })
    const [ emptyOngoing, setEmptyOngoing] = useState(false)
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
        }],
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
        }],
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

    const [ emptyNewUser, setEmptyNewUser] = useState(false)
    const [ pie7Total, setPie7Total] = useState(0)
    const [ newUserData, setNewUserData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })
    const [ emptyNewUserCandidate, setEmptyNewUserCandidate] = useState(false)
    const [ pie8Total, setPie8Total] = useState(0)
    const [ newUserCandidateTypeData, setNewUserCandidateTypeData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })
    const [ emptyNewUserAlumni, setEmptyNewUserAlumni] = useState(false)
    const [ pie9Total, setPie9Total] = useState(0)
    const [ newUserAlumniDegreeData, setNewUserAlumniDegreeData ] = useState({
        labels: "",
        datasets: [{
            label: "",
            data: "",
        }]
    })
    
    const handlePrint = useReactToPrint({
        onBeforeGetContent: async ()=> setOpenHeader(true),
        content: () => componentRef.current,
        documentTitle: "System Report",
        onAfterPrint: ()=> setOpenHeader(false)
    })

    const scrollToSection = (elementRef) => {
        window.scrollTo({
          top: elementRef.current.offsetTop,
          behavior: "smooth",
        })
    }

    useEffect(()=> {
        const windowOpen = () => {   
            scrollToSection(topPage)
        }
        windowOpen()
    }, [])
    
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
                setAllAnnualRequestData([])
                res1.data.requestReport.map((a)=> {
                    if (a.count!==0) {
                        a.data.map((b)=> {
                            setAllAnnualRequestData(prev=>prev.concat([b]))
                        })
                    }
                })

                setAnnualApprovedData({
                    labels: res1.data?.approvedReport.map((data)=> months[data.id-1]),
                    datasets: [{
                        label: `Annual Approved Data of ${selectedYear}`,
                        data: res1.data?.approvedReport.map((data)=> data.count)
                    }]
                })
                setAllAnnualApprovedData([])
                res1.data.approvedReport.map((a)=> {
                    if (a.count!==0) {
                        a.data.map((b)=> {
                            setAllAnnualApprovedData(prev=>prev.concat([b]))
                        })
                    }
                })

                setAnnualDeniedData({
                    labels: res1.data?.deniedReport.map((data)=> months[data.id-1]),
                    datasets: [{
                        label: `Annual Denied Data of ${selectedYear}`,
                        data: res1.data?.deniedReport.map((data)=> data.count)
                    }]
                })
                setAllAnnualDeniedData([])
                res1.data.deniedReport.map((a)=> {
                    if (a.count!==0) {
                        a.data.map((b)=> {
                            setAllAnnualDeniedData(prev=>prev.concat([b]))
                        })
                    }
                })

                setAnnualAccomplishedData({
                    labels: res1.data?.accomplishedReport.map((data)=> months[data.id-1]),
                    datasets: [{
                        label: `Annual Accomplished Data of ${selectedYear}`,
                        data: res1.data?.accomplishedReport.map((data)=> data.count)
                    }]
                })
                setAllAnnualAccomplishedData([])
                res1.data.accomplishedReport.map((a)=> {
                    if (a.count!==0) {
                        a.data.map((b)=> {
                            setAllAnnualAccomplishedData(prev=>prev.concat([b]))
                        })
                    }
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
                data:  allActiveUsersTally?.map((data)=> data.count),
                backgroundColor: ["#DA8B40", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"]
            }]
        })
        setActiveUsersGenderData({
            labels: allActiveUsersGenderTally?.map((data)=> data.type),
            datasets: [{
                label: "Sex",
                data:  allActiveUsersGenderTally?.map((data)=> data.count),
                backgroundColor: ["#3e95cd", "#FF00FF"]
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

    useEffect(() => {
        const getProjectReports = async () => {
          try {
            const res = await Axios.get(`/api/reports/all-requests`, {params: {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            }})
            if (res.data.requests.data.length!==0) {
                setPie1Total(res.data.requests.data.length)
                setRequestData({
                    labels: res.data.subtotal.map((data)=> data.type),
                    datasets: [{
                        data: res.data.subtotal.map((data)=> data.count)
                    }]
                })
                res.data.subtotal.map((a)=> {
                    if (a.type==="Approved") {
                        setAllApprovedRequestData(a.data)
                    }
                    if (a.type==="Denied") {
                        setAllDeniedRequestData(a.data)
                    }
                    if (a.type==="Pending") {
                        setAllPendingRequestData(a.data)
                    }
                })
                setEmptyRequest(false)
            }
            if (res.data.requests.data.length===0) {
                setEmptyRequest(true)
            }

            const res2 = await Axios.get("/api/reports/all-completed-jobs&projects", {params: {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            }})
            if (res2.data.jobs.data.length!==0) {
                setPie2Total(res2.data.jobs.data.length)
                setAccomplishedData({
                    labels: res2.data.subtotal.map((data)=> data.type),
                    datasets: [{
                        data: res2.data.subtotal.map((data)=> data.count)
                    }]
                })
                res2.data.subtotal.map((a)=> {
                    if (a.type==="Project") {
                        setAllAccomplishedProjectsData(a.data)
                    }
                    if (a.type==="Job") {
                        setAllAccomplishedJobsData(a.data)
                    }
                })
                setEmptyAccomplished(false)
            }
            if (res2.data.jobs.data.length===0) {
                setEmptyAccomplished(true)
            }

            const res3 = await Axios.get(`/api/reports/ongoing-projects`)
            if (res3.data.total!==0) {
                setOngoingData({
                    labels: res3.data?.partial.map((data)=> data.type),
                    datasets: [{
                        data: res3.data?.partial.map((data)=> data.count)
                    }]
                })
                setPie3Total(res3.data.total)
                res3.data.partial.map((a)=> {
                    if (a.type==="Project") {
                        setAllOngoingProjectsData(a.data)
                    }
                    if (a.type==="Job") {
                        setAllOngoingJobsData(a.data)
                    }
                })
                setEmptyOngoing(false)
            }
            if (res3.data.total===0) {
                setEmptyOngoing(true)
            }

            const res4 = await Axios.get(`/api/reports/monthly-new-user`, {params: {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            }})
            if (res4.data.newUsers.data.length!==0) {
                setPie7Total(res4.data.newUsers.data.length)
                setNewUserData({
                    labels: res4.data.subtotal.map((data)=> data.type),
                    datasets: [{
                        data: res4.data.subtotal.map((data)=> data.count)
                    }]
                })
                setEmptyNewUser(false)
            }
            if (res4.data.newUsers.data.length===0) {
                setEmptyNewUser(true)
            }

            const res5 = await Axios.get(`/api/reports/monthly-new-user-candidatetype`, {params: {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            }})
            if (res5.data.allCandidates.data.length!==0) {
                setPie8Total(res5.data.allCandidates.data.length)
                setNewUserCandidateTypeData({
                    labels: res5.data.subtotal.map((data)=> data.type),
                    datasets: [{
                        data: res5.data.subtotal.map((data)=> data.count)
                    }]
                })
                setEmptyNewUserCandidate(false)
            }
            if (res5.data.allCandidates.data.length===0) {
                setEmptyNewUserCandidate(true)
            }

            const res6 = await Axios.get(`/api/reports/monthly-new-user-candidate-degree`, {params: {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            }})
            if (res6.data.allAlumni.data.length!==0) {
                setPie9Total(res6.data.allAlumni.data.length)
                setNewUserAlumniDegreeData({
                    labels: res6.data.subtotal.map((data)=> data.type),
                    datasets: [{
                        data: res6.data.subtotal.map((data)=> data.count)
                    }]
                })
                setEmptyNewUserAlumni(false)
            }
            if (res6.data.allAlumni.data.length===0) {
                setEmptyNewUserAlumni(true)
            }
          } catch (err) {
            console.log(err)
          }
        }
        getProjectReports()
    }, [dateRange])
    
    useEffect(() => {
        const setEmptyData = async () => {
            try {
                if (requestData===[]) {
                    setEmptyRequest(true)
                }
                if (accomplishedData===[]) {
                    setEmptyAccomplished(true)
                }
            } catch(err) {
                console.log(err)
            }
        }
        setEmptyData()
    }, [requestData, accomplishedData])

    return (
        <div className="reports">
            <div ref={topPage}></div>
                <div className="reportsTop">
                    <div className="contentTitle">
                        <label><b>System Reports</b></label>
                    </div>
                    <br />
                    <div className="sideContent">
                        <div className="leftContent">
                            <div>
                                <select className="selectCategory" onChange={e => {
                                    setCurrentView(e.target.value)}} 
                                value={currentView}>
                                    <option>View Monthly Reports</option>
                                    <option>View Annual Reports</option>
                                </select>
                            </div>
                            {currentView==="View Annual Reports" && (
                            <div className="leftContent">
                                <div>
                                    <label>Set Year:</label>
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
                            )}
                            {currentView==="View Monthly Reports" && (
                            <div>
                                <DateRangePickerComp setDateRange={setDateRange}/>
                            </div>
                            )}
                        </div>
                        <div>
                            <button onClick={handlePrint} className="btn btn-outline-success allButtons">Print Report</button>
                            <button onClick={()=> {
                                if (viewData===true) {
                                    setViewData(false)
                                }
                                if (viewData===false) {
                                    setViewData(true)
                                }
                            }} className="btn btn-outline-success allButtons">
                                {viewData===true ? "Hide Data" : "View Data"}
                            </button>
                            <button onClick={()=> navigate("/system-logs")} className="btn btn-outline-success allButtons">
                                View System Logs
                            </button>
                            <button onClick={()=> navigate("/bug-reports")} className="btn btn-outline-success allButtons">
                                View Bug Reports
                            </button>
                        </div>
                    </div>
                </div>
                <br />
                {currentView==="View Monthly Reports" && (
                <div className="toPrint" ref={componentRef}>
                    {openHeader && (
                    <div className="printHeader">
                        <div className="cvsuHeaderWrapper">
                            <div className="cvsuHeaderLeft">
                                <img src={"/WebPhoto/About/CVSU-logo.png"}/>
                            </div>
                            <div className="cvsuHeaderRight">
                                <div className="cvsuHeader1">
                                    Republic of the Philippines
                                </div>
                                <div className="cvsuHeader2">
                                    <b>CAVITE STATE UNIVERSITY</b>
                                </div>
                                <div className="cvsuHeader1">
                                    <b>Carmona Campus</b>
                                </div>
                                <div className="cvsuHeader3">
                                    Market Road. Carmona, Cavite
                                </div>
                                <div className="cvsuHeader4">
                                    (046) 487-6328/cvsucarmona@cvsu.edu.ph
                                </div>
                                <div className="cvsuHeader3">
                                    www.cvsu.edu.ph
                                </div>
                            </div>
                        </div>
                        <div className="contentTitle">
                            <label><b>TRABAWHO? MONTHLY REPORT</b></label>
                        </div>
                    </div>
                    )}
                    <div>
                        <p>Monthly Report: {moment(dateRange.startDate).format("MM/DD/YY")} to {moment(dateRange.endDate).format("MM/DD/YY")}</p>
                    </div>
                    <br />
                    <br />
                    <div className="requests-grid">
                        <div className="reportContent">
                            <div className="reportContentTop">
                                <label clasName="contentSubheading">Requests</label>
                            </div>
                            <div className="reportContentBot">
                                {emptyRequest!==true ?
                                    <div style={{ width: 300 }}>
                                        <PieChart chartData={requestData} />
                                        <br/>
                                        <div className="centerContent">
                                            <p><b>{pie1Total}</b> request recieved.</p>
                                        </div>
                                    </div>
                                :<div className="pieChartFiller"><b>No data.</b></div>}
                            </div>
                        </div>
                        
                        <div className="reportContent">
                            <div className="reportContentTop">
                                <label clasName="contentSubheading">Accomplished Jobs & Projects</label>
                            </div>
                            <div className="reportContentBot">
                                {emptyAccomplished!==true ?
                                    <div style={{ width: 300 }}>
                                        <PieChart chartData={accomplishedData} />
                                        <br/>
                                        <div className="centerContent">
                                            <p><b>{pie2Total}</b> accomplished jobs & projects.</p>
                                        </div>
                                    </div>
                                :<div className="pieChartFiller"><b>No data.</b></div>}
                            </div>
                        </div>

                        <div className="reportContent">
                            <div className="reportContentTop">
                                <label clasName="contentSubheading">Ongoing Jobs & Projects </label>
                            </div>
                            <div className="reportContentBot">
                                {emptyOngoing!==true ?
                                    <div style={{ width: 300 }}>
                                        <PieChart chartData={ongoingData} />
                                        <br/>
                                        <div className="centerContent">
                                            <p><b>{pie3Total}</b> ongoing jobs & projects.</p>
                                        </div>
                                    </div>
                                :<div className="pieChartFiller"><b>No data.</b></div>}
                            </div>
                        </div>

                        <div className="reportContent">
                            <div className="reportContentTop">
                                <label clasName="contentSubheading">New Users</label>
                            </div>
                            <div className="reportContentBot">
                                {emptyNewUser!==true ?
                                    <div style={{ width: 300 }}>
                                        <PieChart chartData={newUserData} />
                                        <br/>
                                        <div className="centerContent">
                                            <p><b>{pie7Total}</b> new user(s) this month.</p>
                                        </div>
                                    </div>
                                :<div className="pieChartFiller"><b>No data.</b></div>}
                            </div>
                        </div>

                        <div className="reportContent">
                            <div className="reportContentTop">
                                <label clasName="contentSubheading">Candidate Type (New Users)</label>
                            </div>
                            <div className="reportContentBot">
                                {emptyNewUserCandidate!==true ?
                                    <div style={{ width: 300 }}>
                                        <PieChart chartData={newUserCandidateTypeData} />
                                        <br/>
                                        <div className="centerContent">
                                            <p><b>{pie8Total}</b> new candidate user(s) this month.</p>
                                        </div>
                                    </div>
                                :<div className="pieChartFiller"><b>No data.</b></div>}
                            </div>
                        </div>

                        <div className="reportContent">
                            <div className="reportContentTop">
                                <label clasName="contentSubheading">Alumni Type (New Users)</label>
                            </div>
                            <div className="reportContentBot">
                                {emptyNewUserAlumni!==true ?
                                    <div style={{ width: 300 }}>
                                        <PieChart chartData={newUserAlumniDegreeData} />
                                        <br/>
                                        <div className="centerContent">
                                            <p><b>{pie9Total}</b> new alumni users this month.</p>
                                        </div>
                                    </div>
                                :<div className="pieChartFiller"><b>No data.</b></div>}
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div>
                    {viewData===true && (
                    <div>
                        <div className="horizontal_line"></div>
                        <div>
                            <div className="centerContent">
                                <p className="contentSubheading"><b>Request Reports</b></p>
                            </div>
                            <div>
                                <AllProjectsTable tableType={"Approved Requests"} allTableData={allApprovedRequestData}/>
                            </div>
                            <br />
                            <div>
                                <AllProjectsTable tableType={"Denied Requests"} allTableData={allDeniedRequestData}/>
                            </div>
                            <br />
                            <div>
                                <AllProjectsTable tableType={"Pending Requests"} allTableData={allPendingRequestData}/>
                            </div>
                        </div>
                        <br/>
                        <div className="horizontal_line"></div>
                        <div>
                            <div className="centerContent">
                                <p className="contentSubheading"><b>Accomplished Data</b></p>
                            </div>
                            <div>
                                <AllProjectsTable tableType={"Accomplished Jobs"} allTableData={allAccomplishedJobsData}/>
                            </div>
                            <br />
                            <div>
                                <AllProjectsTable tableType={"Accomplished Projects"} allTableData={allAccomplishedProjectsData}/>
                            </div>
                        </div>
                        <br/>
                        <div className="horizontal_line"></div>
                        <div>
                            <div className="centerContent">
                                <p className="contentSubheading"><b>Ongoing Data</b></p>
                            </div>
                            <div>
                                <AllProjectsTable tableType={"Ongoing Jobs"} allTableData={allOngoingJobsData}/>
                            </div>
                            <br />
                            <div>
                                <AllProjectsTable tableType={"Ongoing Projects"} allTableData={allOngoingProjectsData}/>
                            </div>
                        </div>
                    </div>
                    )}
                    </div>
                </div>
                )}
                {currentView==="View Annual Reports" && (
                    <div className="toPrint" ref={componentRef}>
                        {openHeader && (
                            <div className="printHeader">
                                <div className="cvsuHeaderWrapper">
                                    <div className="cvsuHeaderLeft">
                                        <img src={"/WebPhoto/About/CVSU-logo.png"}/>
                                    </div>
                                    <div className="cvsuHeaderRight">
                                        <div className="cvsuHeader1">
                                            Republic of the Philippines
                                        </div>
                                        <div className="cvsuHeader2">
                                            <b>CAVITE STATE UNIVERSITY</b>
                                        </div>
                                        <div className="cvsuHeader1">
                                            <b>Carmona Campus</b>
                                        </div>
                                        <div className="cvsuHeader3">
                                            Market Road. Carmona, Cavite
                                        </div>
                                        <div className="cvsuHeader4">
                                            (046) 487-6328/cvsucarmona@cvsu.edu.ph
                                        </div>
                                        <div className="cvsuHeader3">
                                            www.cvsu.edu.ph
                                        </div>
                                    </div>
                                </div>
                                <div className="contentTitle">
                                    <label><b>TRABAWHO? ANNUAL REPORT</b></label>
                                </div>
                            </div>
                        )}
                        <div>
                            <div>
                                <p>Annual Report of year {selectedYear}</p>
                            </div>
                            <br />
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
                            <br />
                            {viewData===true && (
                                <div>
                                    <div className="horizontal_line"></div>
                                    <div>
                                        <div className="centerContent">
                                            <p className="contentSubheading"><b>Request Reports</b></p>
                                        </div>
                                        <div>
                                            <AllProjectsTable tableType={"Annual Requests"} allTableData={allAnnualRequestData}/>
                                        </div>
                                        <br />
                                        <div>
                                            <AllProjectsTable tableType={"Approved Requests"} allTableData={allAnnualApprovedData}/>
                                        </div>
                                        <br />
                                        <div>
                                            <AllProjectsTable tableType={"Denied Requests"} allTableData={allAnnualDeniedData}/>
                                        </div>
                                        <br/>
                                        <div>
                                            <AllProjectsTable tableType={"Accomplished Jobs & Projects"} allTableData={allAnnualAccomplishedData}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <br />
                        <br />
                        <div>
                            <div>
                                <h3>User Reports:</h3>
                            </div>
                            <div className="requests-grid">
                                <div className="reportContent">
                                    <h4>User Count: </h4>
                                    <div style={{ width: 300 }}>
                                        <PieChart chartData={usersData} />
                                    </div>
                                </div>
                                <div className="reportContent">
                                    <h4>Active Users Type: </h4>
                                    <div style={{ width: 300 }}>
                                        <PieChart chartData={activeUsersData} />
                                    </div>
                                </div>
                                <div className="reportContent">
                                    <h4>Active Users Sex: </h4>
                                    <div style={{ width: 300 }}>
                                        <PieChart chartData={activeUsersGenderData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div> 
    )
}

export default Reports