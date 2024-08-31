"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";

export default function AccountRegister () {
    const { setNotification, authenticated } = useGlobalContext();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
   
    useEffect(() => {
        if(authenticated) {
            location.href = "/account";
        }
    }, [authenticated]);

    const handleLocalRegister = () => {
		if(password!==confirmPassword||password.length<0||username.length<0||confirmPassword.length<0) {
			return;
		}
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/register/",
            data: {
                username: username,
                password: password,
                name: name
            },
            withCredentials: true
        })
            .then(() => {
                axios({
                    method: "post",
                    url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/login/",
                    data: {
                        username: username,
                        password: password,
                    },
                    withCredentials: true
                })
                    .then((response) => {
                        setNotification("Registered and logged in!");
                        const token = response.data.access;
                        const refreshToken = response.data.refresh;
                        localStorage.setItem("token", token);
                        localStorage.setItem("refreshToken", refreshToken);
                        location.href = "/account";
                    });
            })
            .catch((error) => {
                console.log(error);
                setNotification("Invalid registration: "+error.response.data);
            });
    };
   
    return (
        <div>
            <h1>Register</h1>
			<>
                <div className="formtab">
                    <input className="form"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                    <input className="form"
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                    <input className="form"
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
					<input className="form"
						type="password"
						placeholder="confirm password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
                    <button className="form" onClick={handleLocalRegister}>Register</button>
					<Link className="form centertext" href="/account/login">Login instead?</Link>
                </div>
            </>
			{password!==confirmPassword&&confirmPassword.length>0&&<h3 className="error">Passwords do not match</h3>}
			<HomeLink/>
        </div>
    );
}