"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import { useEffect } from "react";

export default function AccountInbox () {
    const { authenticated } = useGlobalContext();

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    return (
        <div>
            <h1>Inbox</h1>
            <HomeLink/>
        </div>
    );
}