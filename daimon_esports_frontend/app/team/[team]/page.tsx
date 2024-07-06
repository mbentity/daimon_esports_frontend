"use client"

import { HomeLink } from "@/app/commons";
import axios from "axios";
import { useState, useEffect } from "react";

export default function TeamPage ({ params }: { params: { team: string } }) {
    const [team, setTeam] = useState<any>(null);

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+params.team)
            .then(response => {
                setTeam(response.data);
            })
    }, []);

    return (
        <div>
            <h1>Team</h1>
            <h2>{team?.name}</h2>
            <HomeLink/>
        </div>
    );
}