"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useGlobalContext } from "@/app/Context/store";
import { HomeLink } from "@/app/commons";

export default function AccountLogin () {
    const { setNotification, authenticated } = useGlobalContext();
    const [localUsername, setLocalUsername] = useState<string>("");
    const [localPassword, setLocalPassword] = useState<string>("");

    useEffect(() => {
        if(authenticated) {
            location.href = "/account";
        }
    }, [authenticated]);

    const handleLocalLogin = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/login/",
            data: {
                username: localUsername,
                password: localPassword,
            },
            withCredentials: true
        })
            .then((response) => {
                setNotification("Logged in!");
                const token = response.data.access;
                const refreshToken = response.data.refresh;
                localStorage.setItem("token", token);
                localStorage.setItem("refreshToken", refreshToken);
                location.href = "/account";
            })
            .catch(() => {
                setNotification("Invalid login!");
            });
    };

    return (
        <div>
            <h1>Login</h1>
            <div className="formtab">
                    <input className="form"
                    type="text"
                    placeholder="username"
                    value={localUsername}
                    onChange={(e) => setLocalUsername(e.target.value)}
                    />
                    <input className="form"
                        type="password"
                        placeholder="password"
                        value={localPassword}
                        onChange={(e) => setLocalPassword(e.target.value)}
                    />
                    <button className="form" onClick={handleLocalLogin}>Login</button>
                    <Link className="form centertext" href="/account/register">Register instead?</Link>
            </div>
            <HomeLink/>
        </div>
    );
}