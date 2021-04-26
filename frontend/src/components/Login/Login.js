import React, { useState, useContext }  from 'react'
import { useHistory } from "react-router-dom"
import "./Login.css";
import { UserContext } from "../../App";

function Login() {
    const { state, dispatch } = useContext(UserContext);

    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const postData = () => {
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
                console.log(data)
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("jwt", data.token);
                history.push("/")
                dispatch({ type: "USER", payload: data.user })
        })
        .catch(err => console.log(err));
    }

    return (
        <div>
            <div class="card auth_card">
                <h2>Login Here!</h2>
                <span>Email</span>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <span>Password</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <a onClick={() => postData()} class="waves-effect waves-light btn" type="submit">Sign In</a>
            </div>
        </div>
    )
}

export default Login;
