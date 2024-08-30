"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Account () {
    const { setMessage, setUser, authenticated, setAuthenticated } = useGlobalContext();
    const [userData, setUserData] = useState<any>();

    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    
    const [nameChange, toggleNameChange] = useState<boolean>(false);
    const [usernameChange, toggleUsernameChange] = useState<boolean>(false);
    const [passwordChange, togglePasswordChange] = useState<boolean>(false);

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/",
            withCredentials: true
        })
            .then((res) => {
                setUserData(res.data);
            })
            .catch(() => {
            });
    }, [nameChange, usernameChange, passwordChange]);

    const handleLogout = () => {
        setMessage("Logged out");
        localStorage.removeItem("token");
        setUser("");
        setAuthenticated(false);
        location.href = "/account/login";
    };

    const handleDeleteAccount = () => {
        axios({
            method: "delete",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/",
            withCredentials: true
        })
            .then(() => {
                location.href = "/";
            });
    }

    const handleChangeName = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/name/",
            withCredentials: true,
            data: {
                name: name
            }
        })
            .then(() => {
                toggleNameChange(false);
            })
    }

    const handleChangeUsername = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/username/",
            withCredentials: true,
            data: {
                username: username,
                password: password
            }
        })
            .then(() => {
                toggleUsernameChange(false);
            });
    }

    const handleChangePassword = () => {
        if(newPassword !== confirmNewPassword) {
            return;
        }
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/password/",
            withCredentials: true,
            data: {
                password: password,
                newPassword: newPassword
            }
        })
            .then(() => {
                togglePasswordChange(false);
            });
    }

    return (
        <div>
            <h1>Account</h1>
            {<div className="card">
                <p>Name</p>
                {!nameChange&&<>
                    <p className="text">{userData?.name}</p>
                    <button onClick={() => toggleNameChange(true)}>Edit</button>
                </>}
                {nameChange&&<>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                    <button onClick={handleChangeName}>Save</button>
                    <button onClick={() => toggleNameChange(false)}>Cancel</button>
                </>}
                {!usernameChange&&<>
                    <p>Username</p>
                    <p className="text">@{userData?.username}</p>
                </>}
                {usernameChange&&<>
                    <p>Username</p>
                    <input type="text" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
                    <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
                </>}
                {!passwordChange&&<>
                    <p>Password</p>
                    <p className="text">********</p>
                </>}
                {passwordChange&&<>
                    <p>Password</p>
                    <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
                    <input type="password" placeholder="new password" onChange={e => setNewPassword(e.target.value)} />
                    <input type="password" placeholder="confirm new password" onChange={e => setConfirmNewPassword(e.target.value)} />
                    {newPassword!==confirmNewPassword&&confirmNewPassword.length>0&&<h3 className="error">Passwords do not match</h3>}
                </>}
                {!usernameChange&&<>
                    <button onClick={() => toggleUsernameChange(true)}>Edit Username</button>
                </>}
                {usernameChange&&<>
                    <button onClick={handleChangeUsername}>Save</button>
                    <button onClick={() => toggleUsernameChange(false)}>Cancel</button>
                </>}
                {!passwordChange&&<>
                    <button onClick={() => togglePasswordChange(true)}>Edit Password</button>
                </>}
                {passwordChange&&<>
                    <button onClick={handleChangePassword}>Save</button>
                    <button onClick={() => togglePasswordChange(false)}>Cancel</button>
                </>}
                <button className="button" onClick={handleLogout}>Logout</button>
                <button className="button" onClick={handleDeleteAccount}>Delete Account</button>
                {userData?.organizer?<Link href="/account/tournaments"><button className="button">Your Tournaments</button></Link>:<></>}
                <Link href="/account/teams"><button className="button">Your Teams</button></Link>
                <Link href="/account/inbox"><button className="button">Inbox</button></Link>
            </div>}
            <HomeLink/>
        </div>
    );
}