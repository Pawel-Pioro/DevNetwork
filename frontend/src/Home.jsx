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

    return (
        <div>
            <h2>Welcome, {user.username}</h2>

            {
                openedDMList.length > 0 ?
                    <div>
                        {openedDMList.map((dm) => {
                            return <button onClick={() => openDM(dm)} key={dm}>{dm}</button>
                        })}
                    </div>
                    :
                    <h3>No Open DMs</h3>
            }

            {currentlyOpenedDM.user &&
                <div>
                    <p>DM with {currentlyOpenedDM.user}:</p>
                    {currentlyOpenedDM.dms.map((dm, i) => {

                        return <p key={i}>({dm.timestamp}) <b>{dm.sender}</b>: {dm.content}</p>
                    })}

                    <input type="text" value={currentlyOpenedDM.messageInput || ''} onChange={(e) => SetCurrentlyOpenedDM({ ...currentlyOpenedDM, "messageInput": e.target.value })} />
                    <button onClick={sendMessage}>Send</button>
                </div>
            }
        </div>
    )

}