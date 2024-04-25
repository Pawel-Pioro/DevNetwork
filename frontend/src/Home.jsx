import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const baseURL = "http://127.0.0.1:8000/api/";

const client = axios.create({
    baseURL,
})


export default function Home() {
    const [tokens, setTokens, user] = useOutletContext()
    const navigate = useNavigate();

    const [openedDMList, SetOpenedDMList] = useState([]);
    const [currentlyOpenedDM, SetCurrentlyOpenedDM] = useState({
        "user": "",
        "dms": [],
        "messageInput": ""
    });

    // detect if user is not logged in and redirect to login
    useEffect(() => {
        try {
            const jwt = localStorage.getItem('access')

            if (!jwt) {
                navigate('/login')
            }
            else {
                client.get("openedDMs/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access')}`
                    }
                }).then((res) => {
                    SetOpenedDMList(res.data.users)

                }).catch((err) => {
                    console.log(err)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    function openDM(user) {
        client.get(`dms/${user}/`, {
            headers: {
                Authorization: `Bearer ${tokens.access}`
            }
        }).then((res) => {
            SetCurrentlyOpenedDM({
                "user": user,
                "dms": res.data.dms
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    function sendMessage() {
        if (currentlyOpenedDM.messageInput) {
            client.post(`dms/${currentlyOpenedDM.user}/`, {
                content: currentlyOpenedDM.messageInput
            }, {
                headers: {
                    Authorization: `Bearer ${tokens.access}`
                }
            }).then((res) => {
                openDM(currentlyOpenedDM.user)
                SetCurrentlyOpenedDM({
                    ...currentlyOpenedDM,
                    "messageInput": ""
                })
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    return (
        <div>
            <h2 className="text-center">Welcome, {user.username}</h2>

            <div className="container-fluid p-0 border border-dark-subtle border-2 rounded" style={{ backgroundColor: "#e9ecef", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }} >
                {
                    openedDMList.length > 0 ?
                        <div className="btn-group p-2" style={{ width: "100%", backgroundColor: "white" }} role="group" aria-label="Basic radio toggle button group">

                            {openedDMList.map((dm) => {
                                return (
                                    <div key={dm} className="btn-group" >
                                        <input type="radio" className="btn-check" name="btnradio" id={dm} autoComplete="off"></input>
                                        <label className="btn btn-outline-primary" htmlFor={dm} onClick={() => openDM(dm)}>{dm}</label>
                                    </div>
                                )
                            })}
                        </div>
                        :
                        <h3>No DMs Found</h3>
                }

                {!currentlyOpenedDM.user &&
                    <h3 className="text-center">Open a DM to view messages</h3>
                }

                <div style={{ height: "70vh", overflow: "auto", display: "flex", flexDirection: "column-reverse" }}>

                    {currentlyOpenedDM.user &&
                        <>
                            <div className="input-group ps-3 pe-3 mb-2">
                                <input type="text" placeholder={"Message " + currentlyOpenedDM.user} className="form-control border-dark-subtle border-2" value={currentlyOpenedDM.messageInput || ''} onChange={(e) => SetCurrentlyOpenedDM({ ...currentlyOpenedDM, "messageInput": e.target.value })} />
                                <button onClick={sendMessage} className="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                                </svg></button>
                            </div>

                            <div className="ms-3 me-3">
                                {currentlyOpenedDM.dms.map((dm, i) => {

                                    return <p key={i}>({dm.timestamp}) <b>{dm.sender}</b>: {dm.content}</p>
                                })}
                            </div>
                            <hr ></hr>

                        </>

                    }
                </div>
            </div>
        </div >
    )

}