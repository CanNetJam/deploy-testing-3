import React from "react"
import Axios from "axios"

function EndContractModal({ setOpenModal, projectInfo, toEndContract, setReload }) {
    async function endContract() {
        try {
            const res = await Axios.post(`/api/end-contract/${projectInfo._id}/${toEndContract._id}`)
            setReload(res)
        }   catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="title">
                    <p>Are you sure you want to end the contract of <b>{toEndContract.firstname} {toEndContract.lastname}</b>?</p>
                </div>
                <div className="body">
                    <p className="text-muted small">Warning: This action is irreversible!</p>
                </div>
                <div className="footer">
                    <button className="btn btn-outline-success allButtons" onClick={() => {endContract(), setOpenModal(false)}}>Confirm</button>
                    <button className="btn btn-sm btn-outline-secondary cancelBtn" onClick={() => {setOpenModal(false)}} id="cancelBtn">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EndContractModal