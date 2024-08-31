"use client"

import { formatDate, HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import { useEffect, useState } from "react";

export default function GameSettings ({ params }: { params: { game: string } }) {
    const { authenticated } = useGlobalContext();
    const [game, setGame] = useState<any>(null);
    const [tournament, setTournament] = useState<any>(null);
    const [team1, setTeam1] = useState<any>();
    const [team2, setTeam2] = useState<any>();
    const [score1, setScore1] = useState<number>();
    const [score2, setScore2] = useState<number>();
    const [time, setTime] = useState<Date>();
    const [minutes, setMinutes] = useState<number>();

    const [teamsChange, toggleTeamsChange] = useState<boolean>(false);
    const [scoreChange, toggleScoreChange] = useState<boolean>(false);
    const [timeChange, toggleTimeChange] = useState<boolean>(false);
    const [minutesChange, toggleMinutesChange] = useState<boolean>(false);

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+params.game+"/",
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);
                setGame(response.data);
                setTeam1(response.data.team1);
                setTeam2(response.data.team2);
                setTime(new Date(response.data.timestamp));
                setMinutes(response.data.minutes);
                axios({
                    method: "get",
                    url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+response.data.tournament.id+"/",
                    withCredentials: true
                })
                    .then(response => {
                        setTournament(response.data);
                    });
            });
    }, []);

    const handleChangeTeams = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+game.id+"/teams/",
            withCredentials: true,
            data: {
                team1: team1,
                team2: team2
            },
        })
            .then(() => {
                toggleTeamsChange(false);
            });
    }

    const handleChangeScore = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+game.id+"/score/",
            withCredentials: true,
            data: {
                score1: score1,
                score2: score2
            },
        })
            .then(() => {
                toggleScoreChange(false);
            });
    }

    const handleChangeTime = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+game.id+"/time/",
            withCredentials: true,
            data: {
                time: time?.toISOString()
            },
        })
            .then(() => {
                toggleTimeChange(false);
            });
    }

    const handleChangeMinutes = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+game.id+"/minutes/",
            withCredentials: true,
            data: {
                minutes: minutes
            },
        })
            .then(() => {
                toggleMinutesChange(false);
            });
    }

    const handleDelete = () => {
        axios({
            method: "delete",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+game.id+"/",
            withCredentials: true
        })
            .then(() => {
                location.href = "/tournament/"+tournament.id+"/settings";
            });
    }

    return (
        <div>
            <h1>Game Settings</h1>
            <div className="card">
                <p>Teams</p>
                {!teamsChange && <>
                    <p>{game?.team1.name} vs {game?.team2.name}</p>
                    <button onClick={() => toggleTeamsChange(true)}>Edit</button>
                </>}
                {teamsChange && <>
                    <select className="form" onChange={(e) => setTeam1(e.target.value)}>
                        <option>Select Team 1</option>
                        {tournament?.teams?.map((team: any) => {
                            return <option key={team.id} value={team.id}>{team.name}</option>
                        })}
                    </select>
                    <select className="form" onChange={(e) => setTeam2(e.target.value)}>
                        <option>Select Team 2</option>
                        {tournament?.teams?.map((team: any) => {
                            return <option key={team.id} value={team.id}>{team.name}</option>
                        })}
                    </select>
                    <button onClick={handleChangeTeams}>Save</button>
                    <button onClick={() => toggleTeamsChange(false)}>Cancel</button>
                </>}
                <p>Score</p>
                {!scoreChange && <>
                    <p>{game?.score1} - {game?.score2}</p>
                    <button onClick={() => toggleScoreChange(true)}>Edit</button>
                </>}
                {scoreChange && <>
                    <input type="number" value={score1} onChange={(e) => setScore1(parseInt(e.target.value))}/>
                    <input type="number" value={score2} onChange={(e) => setScore2(parseInt(e.target.value))}/>
                    <button onClick={handleChangeScore}>Save</button>
                    <button onClick={() => toggleScoreChange(false)}>Cancel</button>
                </>}
            </div>
            <div className="card">
                <p>Time</p>
                {!timeChange && <>
                    {time&&<p>{formatDate(time.toString())}</p>}
                    <button onClick={() => toggleTimeChange(true)}>Edit</button>
                </>}
                {timeChange && <>
                    <input type="datetime-local" value={time?.toISOString().slice(0, 16)} onChange={(e) => setTime(new Date(e.target.value))}/>
                    <button onClick={handleChangeTime}>Save</button>
                    <button onClick={() => toggleTimeChange(false)}>Cancel</button>
                </>}
                <p>Minutes</p>
                {!minutesChange && <>
                    <p>{game?.minutes}</p>
                    <button onClick={() => toggleMinutesChange(true)}>Edit</button>
                </>}
                {minutesChange && <>
                    <input type="number" value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value))}/>
                    <button onClick={handleChangeMinutes}>Save</button>
                    <button onClick={() => toggleMinutesChange(false)}>Cancel</button>
                </>}
                <button onClick={handleDelete}>Delete Game</button>
            </div>
            <HomeLink/>
        </div>
    );
}