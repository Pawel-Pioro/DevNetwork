import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const baseURL = "http://127.0.0.1:8000/api/";

const client = axios.create({
    baseURL,
});

export default function Profile() {
    const navigate = useNavigate();

    const [tokens, setTokens, user] = useOutletContext()
    const { username } = useParams();
    const [profile, setProfile] = useState({});
    const [profileInput, setProfileInput] = useState({ "bio": "" });
    const [status, setStatus] = useState("");
    const [ownerProfile, setOwnerProfile] = useState(false);
    const [unselectedSkills, setUnselectedSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState("");
    const [dmsList, setDmsList] = useState([]);

    useEffect(() => {
        client.get(`profile/${username}/`).then((res) => {
            setProfile(res.data)
            setProfileInput({ "bio": res.data.bio, "experience": res.data.experience, "github": res.data.github, "message": "" })
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    useEffect(() => {
        if (profile.skills) {
            client.get("allSkills/").then((res) => {
                setUnselectedSkills(res.data.skills.filter((skill) => !profile.skills.includes(skill)))
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [profile.skills])

    useEffect(() => {
        if (tokens.access) {
            if (user.username === username) {
                setOwnerProfile(true)
            }
        }
    })

    useEffect(() => {
        if (localStorage.getItem('access')) {
            client.get("openedDMs/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                setDmsList(res.data.users)
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [])

    const update_profile = () => {
        client.post("update-profile/",
            {
                bio: profileInput.bio,
                experience: profileInput.experience,
                skills: profile.skills,
                github: profileInput.github
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
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        update_profile()
    };


    const updateSkills = (skill, action) => {
        if (action === "remove") {
            const newSkillArray = profile.skills.filter(s => s !== skill)

            client.post("update-profile/",
                {
                    skills: newSkillArray,
                    bio: profileInput.bio,
                    experience: profileInput.experience,
                    github: profileInput.github
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
                setProfile({ ...profile, "skills": newSkillArray })
            }).catch((err) => {
                console.log(err);
            })
        }
        else if (action === "add" && skill) {
            const newSkillArray = [...profile.skills, skill]
            client.post("update-profile/",
                {
                    skills: newSkillArray,
                    bio: profileInput.bio,
                    experience: profileInput.experience,
                    github: profileInput.github
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
                setProfile({ ...profile, "skills": newSkillArray })
                setSelectedSkill("")
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    function messageButton() {

        if (profileInput.message) {
            client.post(`openedDMs/`,
                {
                    content: profileInput.message,
                    otherUser: username
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${tokens.access}`,
                    },
                }
            ).then((res) => {
                navigate("/")
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    return (
        <>
            {status && <div className="alert alert-success alert-dismissible fade show" role="alert">
                {status}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>}
            <div className="container mt-5" style={{ maxWidth: "700px" }}>
                <div className="alert alert-primary text-center" role="alert" style={{ fontSize: "20px" }}>
                    Profile of {profile.username}
                    {!ownerProfile && !dmsList.includes(username) && tokens.access &&
                        <>
                            <button className="btn btn-primary ml-5" data-bs-toggle="modal" data-bs-target="#messageModal">Message</button>

                            <div className="modal fade" id="messageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Send first message</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <input type="text" className="form-control" value={profileInput.message || ''} onChange={(e) => setProfileInput({ ...profileInput, "message": e.target.value })} />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={messageButton}>Send Message</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
                <div className="alert alert-secondary" role="alert" style={{ fontSize: "20px" }}>
                    Email: {profile.email}
                    {ownerProfile ?
                        <>
                            <br />
                            Github:
                            <input type="text" className="form-control" value={profileInput.github} onChange={(e) => setProfileInput({ ...profileInput, "github": e.target.value })}></input>
                        </>
                        :
                        <>
                            {profile.github &&
                                <>
                                    <br />
                                    Github:
                                    <a href={profile.github}>{profile.github}</a>
                                </>
                            }

                        </>
                    }
                    <br />
                    Bio:
                    {ownerProfile ?
                        <>
                            <input type="text" className="form-control" value={profileInput.bio} onChange={(e) => setProfileInput({ ...profileInput, "bio": e.target.value })}></input>
                        </>
                        :
                        <>
                            {profile.bio ? profile.bio : "(No bio)"}
                        </>
                    }
                    <br />
                    Experience:
                    {ownerProfile ?
                        <>
                            <select className="form-select" value={profileInput.experience} onChange={(e) => setProfileInput({ ...profileInput, experience: e.target.value })}>
                                <option value="Beginner">Beginner</option>
                                <option value="Amateur">Amateur</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </>
                        :
                        <>
                            {profileInput.experience}
                        </>
                    }
                    <br />
                    Skills:

                    <ul className="list-group">

                        {profile.skills !== undefined && profile.skills.length > 0 ? profile.skills.map((skill) => (
                            <li key={skill} className="list-group-item">{skill}
                                {ownerProfile &&
                                    <span className="float-end button-group">
                                        <button type="button" className="btn btn-danger" onClick={() => updateSkills(skill, "remove")}>Delete</button>
                                    </span>}
                            </li>
                        ))
                            :
                            <>
                                <li className="list-group-item">No skills added</li>
                            </>
                        }

                        {ownerProfile &&
                            <>
                                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addSkill">Add Skill</button>

                                <div className="modal fade" id="addSkill" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Add Skill</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <select className="form-select" aria-label="Default select example" onChange={(e) => setSelectedSkill([e.target.value])}>
                                                    <option value="">Select Skill</option>
                                                    {unselectedSkills &&
                                                        unselectedSkills.map((skill) => {
                                                            return <option key={skill} value={skill} > {skill}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => updateSkills(selectedSkill[0], "add")}>Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </ul>
                    {ownerProfile && <button className="btn btn-primary mt-1" onClick={handleSubmit}>Save</button>}
                </div>
            </div >
        </>
    );
}