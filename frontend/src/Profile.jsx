import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const baseURL = "http://127.0.0.1:8000/api/";

const client = axios.create({
    baseURL,
});

export default function Profile() {
    const [tokens, setTokens] = useOutletContext()
    const { username } = useParams();
    const [profile, setProfile] = useState({});
    const [profileInput, setProfileInput] = useState({ "bio": "" });
    const [status, setStatus] = useState("");
    const [ownerProfile, setOwnerProfile] = useState(false);

    useEffect(() => {
        client.get(`profile/${username}/`).then((res) => {
            setProfile(res.data)
            setProfileInput({ ...profileInput, "bio": res.data.bio })
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    useEffect(() => {
        if (tokens.access) {
            client.get('user/', {
                headers: {
                    Authorization: `Bearer ${tokens.access}`
                }
            }).then((res) => {
                if (res.data.username === username) {
                    setOwnerProfile(true)
                }
            })
                .catch((err) => {
                    console.log(err);
                })
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        client.post("update-profile/",
            {
                bio: profileInput.bio
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${tokens.access}`,
                },
            }
        ).then((res) => {
            setStatus(res.data.message)
        }).catch((err) => {
            console.log(err);
        })
    };

    return (
        <>
            {status && <div className="alert alert-success" role="alert">{status}</div>}
            <div className="container mt-5" style={{ maxWidth: "700px" }}>
                <div className="alert alert-primary text-center" role="alert" style={{ fontSize: "20px" }}>
                    Profile of {profile.username}
                </div>
                <div className="alert alert-secondary" role="alert" style={{ fontSize: "20px" }}>
                    Email: {profile.email}
                    <br></br>
                    Bio:
                    {ownerProfile ?
                        <>
                            <input type="text" value={profileInput.bio} onChange={(e) => setProfileInput({ ...profileInput, "bio": e.target.value })}></input>
                            <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
                        </>
                        :
                        <>
                            {profileInput.bio}
                        </>
                    }
                </div>
            </div >
        </>
    );
}