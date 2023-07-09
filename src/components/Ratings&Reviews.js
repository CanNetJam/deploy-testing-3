import React, {useState, useEffect} from "react"
import Axios from "axios"
import {format} from "timeago.js"

function RatingsAndReviews(props) {
    const cloud_name = "dzjkgjjut"
    const [ reviews, setReviews ] = useState([])
    const [ result, setResult ] = useState([])
    const [ page, setPage ] = useState(0)
    const [ searchCount, setSearchCount ] = useState(4)
    const [ resultsResult, setResultsResult ] = useState([])
    let ratings = [1, 2, 3, 4, 5]

    let length = reviews.length
    let index = 0

    useEffect(() => {
        const getReviews = async () => {
            const candidate = props.candidate
            try {
                const res = await Axios.get(`/api/all-reviews/${candidate}`)
                setReviews(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getReviews()
    }, [])

    useEffect(() => {
        const getFiltered = () => { 
            setResult([])
            let slice = (source, index) => source.slice(index, index + searchCount)
            while (index < length) {
                let temp = [slice(reviews, index)]
                setResult(prev=>prev.concat(temp))
                index += searchCount
            }
        }
        getFiltered()
    }, [reviews])

    useEffect(() => {
        const getFiltered = () => { 
            result[0] ? setResultsResult(result[0]) : <></>
        }
        getFiltered()
    }, [result])

    useEffect(() => {
        const getFiltered = () => { 
            result[page] !== undefined ?
                resultsResult!==[] ? setResultsResult(prev=>prev.concat(result[page])) : <></>
            : <></>
        }
        getFiltered()
    }, [page])

    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }
    
    return (
        <div className="reviews">
            <p className="profileCardName">Reviews</p>
            <p><b>Average Rating: {props?.averagerating ? props.averagerating : "No records yet."}</b> {props?.averagerating ? <img src={"/WebPhoto/star.png"} style={{height: 24, width: 24 }} alt={"star icon"} /> : null} | ({props.ratings?.length}) review(s).</p>
            <br/>
            {resultsResult[0] ?
                <div className="reviewList">
                    {resultsResult.map((a)=> {
                        return (
                            <div className="eachReview" key={idPlusKey(a._id, props.candidate)}>
                                <p>{a.empname}<br />
                                {ratings.map((b)=> {
                                    return (
                                        <label key={b}>
                                            {a.rating>=b ?
                                                <img src={"/WebPhoto/star.png"} style={{height: 24, width: 24 }} alt={"star icon"} />
                                            : 
                                                <img src={"/WebPhoto/dim-star.png"} style={{height: 24, width: 24 }} alt={"dim star icon"} />
                                            }
                                        </label>
                                    )
                                })}
                                 | {format(a.createdAt)}</p>
                                <img className="profile-ProfilePhoto" src={a.photo ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_55/${a.photo}.jpg` : "/fallback.png"} alt={"Rating image"}></img>
                                <p>{a.description}</p>
                            </div>
                        )
                    })}
                    <div className="centerContent">
                        {result[page+1]!==undefined ?
                            <button className="allButtons" onClick={()=> {
                                scrollToEnd()
                            }}>View More</button>
                        :null}
                    </div>
                </div>
            : <div className="reviewList">No reviews yet.</div>}
        </div>
    )
}

export default RatingsAndReviews