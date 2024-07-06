"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import { useEffect } from "react";

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

    return (
        <div>
            <h1>Account</h1>
            <button onClick={handleLogout}>Logout</button>
            <HomeLink/>
        </div>
    );
}