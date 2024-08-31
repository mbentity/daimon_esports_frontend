"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import { useEffect, useState } from "react";

export default function GameCreate ({ params }: { params: { tournament: string } }) {
    const { setNotification, user, authenticated } = useGlobalContext();
    const [tournament, setTournament] = useState<any>(null);
    const [team1, setTeam1] = useState<any>(null);
    const [team2, setTeam2] = useState<any>(null);
    const [time, setTime] = useState<string>("");
    const [minutes, setMinutes] = useState<number>();

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
                setTournament(response.data);
                if(user&&user!==response.data.user.id) {
                    location.href = "/tournament/"+params.tournament;
                }
            });
    }, [user, params.tournament]);

    const handlePost = () => {
        const data = {
            team1: team1,
            team2: team2,
            score1: 0,
            score2: 0,
            tournament: params.tournament,
            timestamp: time,
            minutes: minutes
        }
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/create/",
            data: data,
            withCredentials: true
        })
            .then(() => {
                setNotification("Game created!");
                location.href = "/tournament/"+params.tournament+"/settings";
            })
            .catch((error) => {
                console.log(error);
                setNotification("Invalid game creation: "+error.response.data);
            });
    }

    return (
        <div>
            <h1>Create Game</h1>
            <div className="formtab">
                <select className="form" onChange={(e) => setTeam1(e.target.value)}>
                    <option>Select Team 1</option>
                    {tournament&&tournament.teams.map((team: any) => {
                        return <option key={team.id} value={team.id}>{team.name}</option>
                    })}
                </select>
                <select className="form" onChange={(e) => setTeam2(e.target.value)}>
                    <option>Select Team 2</option>
                    {tournament&&tournament.teams.map((team: any) => {
                        return <option key={team.id} value={team.id}>{team.name}</option>
                    })}
                </select>
            </div>
            <div className="formtab">
                <label className="form" >Time:</label>
                <input className="form" type="datetime-local" onChange={(e) => setTime(e.target.value)}/>
                <input className="form" type="number" placeholder="Predicted Duration (in minutes)" onChange={(e) => setMinutes(parseInt(e.target.value))}/>
            </div>
            <button className="button" onClick={handlePost}>Create Game</button>
            <HomeLink/>
        </div>
    );
}