import { useEffect, useState } from 'react'
import axios from 'axios'

const baseURL = 'http://127.0.0.1:8000/api/'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL
})


function LoginForm() {
    const [currentUser, setCurrentUser] = useState({username: '', email: ''})
    const [credentialInputs, setCredentialInputs] = useState({username: '', password: ''})

    useEffect(() => {
        client.get('user/')
        .then((res) => {
            console.log(res.data)
            setCurrentUser(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])

   

    const handleSubmit = (e) => {
        e.preventDefault()
        if (credentialInputs.username && credentialInputs.password) {
          client.post('login/', credentialInputs, {withCredentials: true})
          .then((res) => {
            setCurrentUser(res.data)
            client.get('user/')
            .then((res) => {
                console.log(res.data)
                setCurrentUser(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
        })
        }
    }
    console.log(currentUser)
    return (
        <div>
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
