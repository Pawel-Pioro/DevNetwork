import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";

const baseURL = "http://127.0.0.1:8000/api/";

const client = axios.create({
  baseURL,
});

export default function Logout() {
  const navigate = useNavigate();
  const [tokens, setTokens] = useOutletContext()

  const logoutFunc = () => {
    client
      .get("logout/", {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      })
      .then((res) => {
        setTokens({ access: "", refresh: "" });
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        navigate("/login")
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }} >
      <div className="alert alert-danger text-center" role="alert" style={{ fontSize: "20px" }}>
        Are you sure you want to logout?
      </div>
      <div className="text-center">
        <button onClick={() => logoutFunc()} className="btn btn-danger" style={{ fontSize: "20px" }}>Logout</button>
      </div>
    </div >
  );
}
