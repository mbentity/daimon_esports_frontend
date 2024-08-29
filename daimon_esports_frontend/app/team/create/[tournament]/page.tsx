"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import { useEffect } from "react";
import axios from "axios";

export default function TeamCreate ({ params }: { params: { tournament: string } }) {
    const { user, authenticated } = useGlobalContext();

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    useEffect(() => {
        // if user is the same as the tournament creator, send them back to the tournament page
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/",
            withCredentials: true
        })
            .then((res) => {
                if(user&&res.data.user.id==user) {
                    location.href = "/tournament/"+params.tournament;
                }
            });
    }, [user]);

    return (
        <div>
            <h1>Create Team</h1>
            <HomeLink/>
        </div>
    );
}