import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";

const baseURL = "http://127.0.0.1:8000/api/";

const client = axios.create({
  baseURL,
});

export default function Register() {
  const navigate = useNavigate();
  const [tokens, setTokens] = useOutletContext();
  const [credentialInputs, setCredentialInputs] = useState({
    email: "",
    username: "",
    experience: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentialInputs.email && credentialInputs.username && credentialInputs.password) {
      client.post("register/", credentialInputs).then((res) => {
        setTokens({
          access: res.data.tokens.access,
          refresh: res.data.tokens.refresh,
        })
        localStorage.setItem("access", res.data.tokens.access);
        localStorage.setItem("refresh", res.data.tokens.refresh);

        navigate("/")
      }).catch((err) => {
        setError(err.response.data[Object.keys(err.response.data)[0]][0])
      })
    }
    else {
      setError("All fields are required")
    }
  };

  return (
    <>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="container" style={{ maxWidth: "500px" }}>

        <h1 className="text-center">Create Account</h1>
        <form className="mt-4">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="text"
              id="email"
              className="form-control"
              value={credentialInputs.email}
              onChange={(e) =>
                setCredentialInputs({
                  ...credentialInputs,
                  email: e.target.value,
                })
              }
            />
            <label className="form-label">Username</label>
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
            <label className="form-label">What would you say is your experience?</label>
            <select className="form-select" value={credentialInputs.experience} onChange={(e) => setCredentialInputs({ ...credentialInputs, experience: e.target.value })}>
              <option value="Beginner">Beginner</option>
              <option value="Amateur">Amateur</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <label className="form-label">Password</label>
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
              <button onClick={handleSubmit} className="btn btn-primary mt-3">Join the Community</button>
            </div>
          </div>
        </form >
      </div >
    </>
  );
}
