import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";

const baseURL = "http://127.0.0.1:8000/api/";

//axios.defaults.xsrfCookieName = 'csrftoken'
//axios.defaults.xsrfHeaderName = 'X-CSRFToken'
//axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL,
});

function LoginForm() {
    const navigate = useNavigate();

    const [tokens, setTokens] = useOutletContext()
    const [credentialInputs, setCredentialInputs] = useState({
        username: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (credentialInputs.username && credentialInputs.password) {
            client.post("login/", credentialInputs).then((res) => {
                setTokens({
                    access: res.data.tokens.access,
                    refresh: res.data.tokens.refresh,
                });
                localStorage.setItem("access", res.data.tokens.access);
                localStorage.setItem("refresh", res.data.tokens.refresh);

                navigate("/")
            });
        }
    };
    return (
        <div className="container" style={{ maxWidth: "500px" }}>
            <h1 className="text-center">Sign In</h1>
            <form className="mt-4">
                <div className="mb-3">
                    <label for="username" className="form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={credentialInputs.username}
                        onChange={(e) =>
                            setCredentialInputs({
                                ...credentialInputs,
                                username: e.target.value,
                            })
                        }
                    />
                </div>

                <label for="password" className="form-label">Password</label>
                <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={credentialInputs.password}
                    onChange={(e) =>
                        setCredentialInputs({
                            ...credentialInputs,
                            password: e.target.value,
                        })
                    }
                />
                <div className="text-center">
                    <button onClick={handleSubmit} className="btn btn-primary mt-3">Sign In</button>
                </div>
            </form>
        </div>
    );
}

function Login() {
    return (
        <div>
            <LoginForm />
        </div>
    );
}

export default Login;
