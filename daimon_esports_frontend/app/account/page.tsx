"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import { useEffect } from "react";
import axios from "axios";

export default function Account () {
    const { setUser, authenticated, setAuthenticated } = useGlobalContext();

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem("token");

        // Clear user state
        setUser("");

        // Reset authenticated state
        setAuthenticated(false);

        // Redirect to login page or any other page after logout
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

    return (
        <div>
            <h1>Account</h1>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleDeleteAccount}>Delete Account</button>
            <HomeLink/>
        </div>
    );
}