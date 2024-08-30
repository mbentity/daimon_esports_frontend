"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import { useEffect, useState } from "react";

export default function GameCreate ({ params }: { params: { tournament: string } }) {
    const { user, authenticated } = useGlobalContext();
    const [tournament, setTournament] = useState<any>(null);
    const [team1, setTeam1] = useState<any>(null);
    const [team2, setTeam2] = useState<any>(null);

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/",
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);
                setTournament(response.data);
                if(user&&user!==response.data.user.id) {
                    location.href = "/tournament/"+params.tournament;
                }
            });
    }, [user]);

    return (
        <div>
            <h1>Create Game</h1>
            <div className="card">
                <p>Tournament:</p>
                <p>{tournament?.name}</p>
            </div>
            <div className="card">
            </div>
            <HomeLink/>
        </div>
    );
}