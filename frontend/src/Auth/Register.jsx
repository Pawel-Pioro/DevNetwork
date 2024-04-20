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
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    client.post("register/", credentialInputs).then((res) => {
      setTokens({
        access: res.data.tokens.access,
        refresh: res.data.tokens.refresh,
      })
      localStorage.setItem("access", res.data.tokens.access);
      localStorage.setItem("refresh", res.data.tokens.refresh);

      navigate("/")
    });
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>

      <h1 className="text-center">Create Account</h1>
      <form className="mt-4">
        <div className="mb-3">
          <label for="email" className="form-label">Email</label>
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
            <button onClick={handleSubmit} className="btn btn-primary mt-3">Join the Community</button>
          </div>
        </div>
      </form >
    </div >
  );
}
