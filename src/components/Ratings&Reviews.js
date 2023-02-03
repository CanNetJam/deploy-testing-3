import React, {useState, useEffect} from "react"
import Axios from "axios"
import moment from "moment"

function RatingsAndReviews(props) {
    const cloud_name = "dzjkgjjut"
    const [ reviews, setReviews ] = useState([])

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
            <h3><b>Reviews</b></h3>
            <p><b>Average Rating: {props?.averagerating ? props.averagerating : "No records yet."}</b> <br></br>({props.ratings?.length}) review(s).</p>
            <br></br>
            {reviews[0] ?
                <div className="reviewList">
                    {reviews.map((a)=> {
                        return (
                            <div className="eachReview" key={idPlusKey(a._id, props.candidate)}>
                                <p>Rating: <b>{a.rating} star(s)</b></p>
                                <p>{a.empname}<br />
                                Date: {moment(a.createdAt).format("MMM. DD, YYYY")}<br />
                                Description: {a.description}</p>
                                <div className="eachReviewImage">
                                    <img src={a.photo ? `https://res.cloudinary.com/${cloud_name}/image/upload/q_85/${a.photo}.jpg` : "/fallback.png"} className="profile-ProfilePhoto" alt={"Rating image"}></img>
                                </div>
                            </div>
                        )
                    })}
                </div>
            : <span>No reviews yet.</span>}
        </div>
    )
}

export default RatingsAndReviews