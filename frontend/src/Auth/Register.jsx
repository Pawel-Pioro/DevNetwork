import { useEffect, useState } from 'react'
import axios from 'axios'

const baseURL = 'http://127.0.0.1:8000/api/'

const client = axios.create({
    baseURL
  })

export default function Register() {
    
    const [credentialInputs, setCredentialInputs] = useState({email: '', username: '', password: ''})

    const handleSubmit = (e) => {
        e.preventDefault()
        client.post('register/', credentialInputs)
        .then((res) => {
            localStorage.setItem('access', res.data.tokens.access)
            localStorage.setItem('refresh', res.data.tokens.refresh)
        })
    }

    return (
        <>
            <h1>Register</h1>
            <form>
                <label>Email
                <input type="text" id='email' value={credentialInputs.email} onChange={e => setCredentialInputs({...credentialInputs, email: e.target.value})} />
                </label>
                <label>Username
                <input type="text" id='username' value={credentialInputs.username} onChange={e => setCredentialInputs({...credentialInputs, username: e.target.value})} />
                </label>
                <label>Password
                <input type="password" id='password' value={credentialInputs.password} onChange={e => setCredentialInputs({...credentialInputs, password: e.target.value})} />
                </label>
                <button onClick={handleSubmit}>Submit</button>
        </form>
        </>
    )

}