"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TournamentCreate () {
    const { setNotification, authenticated } = useGlobalContext();
    const [ disciplines, setDisciplines ] = useState<any[]>([]);
    const [ name, setName ] = useState<string>();
    const [ discipline, setDiscipline ] = useState<string>();
    const [ teamCount, setTeamCount ] = useState<number>();
    const [ playerCount, setPlayerCount ] = useState<number>();
    const [ meetingPlatform, setMeetingPlatform ] = useState<string>();
    const [ streamingPlatform, setStreamingPlatform ] = useState<string>();
    const [ subStart, setSubStart ] = useState<Date>();
    const [ subStop, setSubStop ] = useState<Date>();
    const [ gamesStart, setGamesStart ] = useState<Date>();
    const [ gamesStop, setGamesStop ] = useState<Date>();

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/disciplines/",
            withCredentials: true
        })
            .then((res) => {
                setDisciplines(res.data);
            }
        );
        }, []);
   
    const handlePost = () => {
        const data = {
            name: name,
            discipline: discipline,
            sub_start: subStart?.toISOString(),
            sub_stop: subStop?.toISOString(),
            games_start: gamesStart?.toISOString(),
            games_stop: gamesStop?.toISOString(),
            team_count: teamCount,
            player_count: playerCount,
            meeting_platform: meetingPlatform,
            streaming_platform: streamingPlatform
        }
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/create/",
            data: data,
            withCredentials: true
        })
            .then(() => {
                setNotification("Tournament created!");
                location.href = "/account/tournaments";
            })
            .catch((error) => {
                setNotification("Invalid tournament creation: "+error.response.data);
            });
    }


    return (
        <div>
            <h1>Create Tournament</h1>
            <div className="formtab">
                <input className="form" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                <select className="form" onChange={(e) => setDiscipline(e.target.value)}>
                    <option value="">Select Discipline</option>
                    {disciplines.map(discipline =>
                    <option key={discipline.id} value={discipline.id}>{discipline.name}</option>
                    )}
                </select>
                <input className="form" type="number" placeholder="Team Count" onChange={(e) => setTeamCount(parseInt(e.target.value))} />
                <input className="form" type="number" placeholder="Player Count" onChange={(e) => setPlayerCount(parseInt(e.target.value))} />
            </div>
            <div className="formtab">
                <input className="form" type="text" placeholder="Meeting Platform" onChange={(e) => setMeetingPlatform(e.target.value)} />
                <input className="form" type="text" placeholder="Streaming Platform" onChange={(e) => setStreamingPlatform(e.target.value)} />
            </div>
            <div className="formtab">
                <label className="form">Subscription Start:</label>
                <input className="form" type="datetime-local" onChange={(e) => setSubStart(new Date(e.target.value))} />
                <label className="form">Subscription Stop:</label>
                <input className="form" type="datetime-local" onChange={(e) => setSubStop(new Date(e.target.value))} />
                <label className="form">Games Start:</label>
                <input className="form" type="datetime-local" onChange={(e) => setGamesStart(new Date(e.target.value))} />
                <label className="form">Games Stop:</label>
                <input className="form" type="datetime-local" onChange={(e) => setGamesStop(new Date(e.target.value))} />
            </div>
            <button className="button" onClick={handlePost}>Create</button>
            <HomeLink/>
        </div>
    );
}