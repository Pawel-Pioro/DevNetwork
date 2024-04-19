import { useEffect, useState } from 'react'
import axios from 'axios'

const baseURL = 'http://127.0.0.1:8000/api/'

//axios.defaults.xsrfCookieName = 'csrftoken'
//axios.defaults.xsrfHeaderName = 'X-CSRFToken'
//axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL
})

function LoginForm() {
    const [tokens, setTokens] = useState({access: '', refresh: ''})
    const [credentialInputs, setCredentialInputs] = useState({username: '', password: ''})

    useEffect(() => {
        localStorage.getItem('access') && setTokens({access: localStorage.getItem('access'), refresh: localStorage.getItem('refresh')})
    },[])

    const getUser = () => {
      client.get('user/', {
        headers: {
          Authorization: `Bearer ${tokens.access}`
        }
      })
      .then((res) => {
        console.log(res.data)
      })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (credentialInputs.username && credentialInputs.password) {
          client.post('login/', credentialInputs)
          .then((res) => {
            setTokens({access: res.data.tokens.access, refresh: res.data.tokens.refresh})
            localStorage.setItem('access', res.data.tokens.access)
            localStorage.setItem('refresh', res.data.tokens.refresh)
            console.log(res.data)
        })
        }
    }
    console.log(tokens)
    return (
        <div>
            <button onClick={() => getUser()}>Get User</button>
            <form>
                <label>Username
                <input type="text" id='username' value={credentialInputs.username} onChange={e => setCredentialInputs({...credentialInputs, username: e.target.value})} />
                </label>
                <label>Password
                <input type="password" id='password' value={credentialInputs.password} onChange={e => setCredentialInputs({...credentialInputs, password: e.target.value})} />
                </label>
                <button onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    )
}

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm /> 
    </div>
  )
}

export default Login;
