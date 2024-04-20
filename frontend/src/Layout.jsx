import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api/";

const client = axios.create({
    baseURL,
});

function Layout() {
    const [tokens, setTokens] = useState({ access: '', refresh: '' })
    const [user, setUser] = useState({})

    useEffect(() => {
        if (localStorage.getItem('access')) {
            setTokens({ access: localStorage.getItem('access'), refresh: localStorage.getItem('refresh') })
        }
    }, [])


    useEffect(() => {
        if (tokens.access) {
            client.get('user/', {
                headers: {
                    Authorization: `Bearer ${tokens.access}`
                }
            }).then((res) => {
                setUser(res.data)
            })
                .catch((err) => {
                    client.post('token/refresh/', {
                        refresh: tokens.refresh
                    }).then((res) => {
                        setTokens({ access: res.data.access, refresh: tokens.refresh })
                        localStorage.setItem('access', res.data.access)
                    })
                })
        }
    }, [tokens])


    return (
        <>
            <nav className="navbar navbar-expand-sm sticky-top bg-body-tertiary">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <a className="navbar-brand" href="/">DevNetwork</a>

                    <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                        <ul className="nav navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            {tokens.access ?
                                <>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {user.username}
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li><a className="dropdown-item" href="#">Profile</a></li>
                                            <li><Link className="dropdown-item" to="/logout">Logout</Link></li>
                                        </ul>
                                    </li>
                                </>
                                :
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" aria-current="page" to="/login">Sign In</Link>
                                    </li>
                                    <li>
                                        <div className="btn-nav">
                                            <Link className="btn btn-primary btn-small navbar-btn" to="/register">Create Account</Link>
                                        </div>
                                    </li>
                                </>
                            }
                        </ul>

                    </div>
                    <br />
                </div>
            </nav >

            <Outlet context={[tokens, setTokens]} />
        </>
    )
}

export default Layout;
