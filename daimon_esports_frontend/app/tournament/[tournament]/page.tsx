"use client"

import { HomeLink } from "@/app/commons";
import axios from "axios";
import { useState, useEffect } from "react";

export default function TournamentPage ({ params }: { params: { tournament: string } }) {
    const [tournament, setTournament] = useState<any>(null);

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament)
            .then(response => {
                setTournament(response.data);
            })
    }, []);

    return (
        <div>
            <h1>Tournament</h1>
            <h2>{tournament?.name}</h2>
            <HomeLink/>
        </div>
    );
}