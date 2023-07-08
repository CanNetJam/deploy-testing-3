import React, {useState, useEffect} from "react"
import Axios from "axios"
import {format} from "timeago.js"

function RatingsAndReviews(props) {
    const cloud_name = "dzjkgjjut"
    const [ reviews, setReviews ] = useState([])
    let ratings = [1, 2, 3, 4, 5]

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

    function idPlusKey(a, b) {
        const key = a + b 
        return key
    }
    
    return (
        <div className="reviews">
            <p className="profileCardName">Reviews</p>
            <p><b>Average Rating: {props?.averagerating ? props.averagerating : "No records yet."}</b> <img src={"/WebPhoto/star.png"} style={{height: 24, width: 24 }} alt={"star icon"} /> | ({props.ratings?.length}) review(s).</p>
            <br/>
            {reviews[0] ?
                <div className="reviewList">
                    {reviews.map((a)=> {
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
                                <img className="profile-ProfilePhoto" src={a.photo ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_85/${a.photo}.jpg` : "/fallback.png"} alt={"Rating image"}></img>
                                <p>{a.description}</p>
                            </div>
                        )
                    })}
                </div>
            : <div className="reviewList">No reviews yet.</div>}
        </div>
    )
}

export default RatingsAndReviews