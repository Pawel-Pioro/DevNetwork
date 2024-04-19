import { useEffect, useState } from 'react'
import axios from 'axios'
import { useOutletContext } from "react-router-dom"

const baseURL = 'http://127.0.0.1:8000/api/'

const client = axios.create({
    baseURL
  })

export default function Logout() {
    const [tokens, setTokens] = useState({access: '', refresh: ''})

    useEffect(() => {
        localStorage.getItem('access') && setTokens({access: localStorage.getItem('access'), refresh: localStorage.getItem('refresh')})
    },[])

    const logoutFunc = () => {
        console.log(tokens)
        client.get('logout/', {
            headers: {
                Authorization: `Bearer ${tokens.access}`
            }
        })
        .then((res) => {
            setTokens({access: '', refresh: ''})
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
        })
        .catch((err) => {
            console.log(err)
        })
    }

    return(
        <div>
            <button onClick={() => logoutFunc()}>Logout</button>
        </div>
    )
}