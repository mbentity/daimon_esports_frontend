"use client"

import { formatDate, HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import { useEffect, useState } from "react";

export default function GameSettings ({ params }: { params: { game: string } }) {
    const { setNotification, authenticated } = useGlobalContext();
    const [game, setGame] = useState<any>(null);
    const [tournament, setTournament] = useState<any>(null);
    const [team1, setTeam1] = useState<any>();
    const [team2, setTeam2] = useState<any>();
    const [score1, setScore1] = useState<number>();
    const [score2, setScore2] = useState<number>();
    const [time, setTime] = useState<string>("");
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
                setGame(response.data);
                setTeam1(response.data.team1);
                setTeam2(response.data.team2);
                setScore1(response.data.score1);
                setScore2(response.data.score2);
                setTime(response.data.timestamp);
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
    }, [teamsChange, scoreChange, timeChange, minutesChange, params.game]);

    const handleChangeTeams = () => {
        axios({
            method: "put",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+game.id+"/modify/teams/",
            withCredentials: true,
            data: {
                team1: team1,
                team2: team2
            },
        })
            .then(() => {
                setNotification("Teams updated!");
                toggleTeamsChange(false);
            })
            .catch((err) => {
                setNotification("Error updating teams: "+err.response.data);
            });
    }

    const handleChangeScore = () => {
        axios({
            method: "put",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+game.id+"/modify/score/",
            withCredentials: true,
            data: {
                score1: score1,
                score2: score2
            },
        })
            .then(() => {
                setNotification("Score updated!");
                toggleScoreChange(false);
            })
            .catch((err) => {
                setNotification("Error updating score: "+err.response.data);
            });
    }

    const handleChangeTime = () => {
        axios({
            method: "put",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+game.id+"/modify/time/",
            withCredentials: true,
            data: {
                timestamp: time
            },
        })
            .then(() => {
                setNotification("Time and date updated!");
                toggleTimeChange(false);
            })
            .catch((err) => {
                setNotification("Error updating time: "+err.response.data);
            });
    }

    const handleChangeMinutes = () => {
        axios({
            method: "put",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+game.id+"/modify/minutes/",
            withCredentials: true,
            data: {
                minutes: minutes
            },
        })
            .then(() => {
                setNotification("Estimated duration updated!");
                toggleMinutesChange(false);
            })
            .catch((err) => {
                setNotification("Error updating duration: "+err.response.data);
            });
    }

    const handleDelete = () => {
        axios({
            method: "delete",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+game.id+"/delete/",
            withCredentials: true
        })
            .then(() => {
                setNotification("Game deleted!");
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
                    <input className="form" type="datetime-local" value={time.slice(0, 16)} onChange={(e) => setTime(e.target.value)}/>
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