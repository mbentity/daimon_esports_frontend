"use client"

import { HomeLink, formatDate } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TournamentSettings ({ params }: { params: { tournament: string } }) {
    const { setNotification, setPopup, user, authenticated } = useGlobalContext();
    const [tournament, setTournament] = useState<any>(null);
    const [ disciplines, setDisciplines ] = useState<any[]>([]);

    const [name, setName] = useState<string>("");
    const [discipline, setDiscipline] = useState<string>();
    const [streamingPlatform, setStreamingPlatform] = useState<string>("");
    const [meetingPlatform, setMeetingPlatform] = useState<string>("");
    const [subTime, setSubTime] = useState<string>("");
    const [subEnd, setSubEnd] = useState<string>("");
    const [gameTime, setGameTime] = useState<string>("");
    const [gameEnd, setGameEnd] = useState<string>("");

    const [nameChange, toggleNameChange] = useState<boolean>(false);
    const [disciplineChange, toggleDisciplineChange] = useState<boolean>(false);
    const [streamingPlatformChange, toggleStreamingPlatformChange] = useState<boolean>(false);
    const [meetingPlatformChange, toggleMeetingPlatformChange] = useState<boolean>(false);
    const [timesChange, toggleTimesChange] = useState<boolean>(false);

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
                if(user&&user!==response.data.user.id) {
                    location.href = "/tournament/"+params.tournament;
                }
                setTournament(response.data);
                setName(response.data.name);
                setDiscipline(response.data.discipline.id);
                setStreamingPlatform(response.data.streaming_platform);
                setMeetingPlatform(response.data.meeting_platform);
                setSubTime(response.data.sub_start);
                setSubEnd(response.data.sub_stop);
                setGameTime(response.data.games_start);
                setGameEnd(response.data.games_stop);
            });
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/disciplines/",
            withCredentials: true
        })
            .then((res) => {
                setDisciplines(res.data);
            }
        );
    }, [user, nameChange, disciplineChange, streamingPlatformChange, meetingPlatformChange, timesChange, params.tournament]);

    const handleChangeName = () => {
        axios({
            method: "put",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/modify/name/",
            data: {name: name},
            withCredentials: true
        })
            .then(() => {
                setNotification("Name updated!");
                toggleNameChange(false);
            })
            .catch((err) => {
                setNotification("Error updating name: "+err.response.data);
            });
    }

    const handleChangeDiscipline = () => {
        if(!discipline) {
            return;
        }
        axios({
            method: "put",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/modify/discipline/",
            data: {discipline: discipline},
            withCredentials: true
        })
            .then(() => {
                setNotification("Discipline updated!");
                toggleDisciplineChange(false);
            })
            .catch((err) => {
                setNotification("Error updating discipline: "+err.response.data);
            });
    }

    const handleChangeStreamingPlatform = () => {
        axios({
            method: "put",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/modify/streaming_platform/",
            data: {streaming_platform: streamingPlatform},
            withCredentials: true
        })
            .then(() => {
                setNotification("Streaming platform updated!");
                toggleStreamingPlatformChange(false);
            })
            .catch((err) => {
                setNotification("Error updating streaming platform: "+err.response.data);
            });
    }

    const handleChangeMeetingPlatform = () => {
        axios({
            method: "put",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/modify/meeting_platform/",
            data: {meeting_platform: meetingPlatform},
            withCredentials: true
        })
            .then(() => {
                setNotification("Meeting platform updated!");
                toggleMeetingPlatformChange(false);
            })
            .catch((err) => {
                setNotification("Error updating meeting platform: "+err.response.data);
            });
    }

    const handleChangeTimes = () => {
        axios({
            method: "put",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/modify/dates/",
            data: {
                sub_start: subTime,
                sub_stop: subEnd,
                games_start: gameTime,
                games_stop: gameEnd
            },
            withCredentials: true
        })
            .then(() => {
                setNotification("Dates updated!");
                toggleTimesChange(false);
            })
            .catch((err) => {
                setNotification("Error updating dates: "+err.response.data);
            });
    }

    const handleDelete = () => {
        setPopup({
            text: "Are you sure you want to cancel this tournament?",
            buttons: [{text: "Yes", action: () => {
                axios({
                    method: "delete",
                    url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/delete/",
                    withCredentials: true
                })
                    .then(() => {
                        setPopup({text: "Tournament cancelled", buttons: [{text: "OK", action: () => {
                        location.href = "/tournaments";
                    }
                    }], default: null});
                    })
                    .catch((err) => {
                        setNotification("Error cancelling tournament: "+err.response.data);
                    });
                }}],
            default: "No"
        });
    }

    return (
        <div>
            <h1>Tournament Settings</h1>
            <div className="card">
                <p>Name</p>
                {!nameChange&&<>
                    <p className="text">{tournament?.name}</p>
                    <button onClick={() => toggleNameChange(true)}>Edit</button>
                </>}
                {nameChange&&<>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}/>
                    <button onClick={handleChangeName}>Save</button>
                    <button onClick={() => toggleNameChange(false)}>Cancel</button>
                </>}
                <p>Discipline</p>
                {!disciplineChange&&<>
                    <p className="text">{tournament?.discipline?.name}</p>
                    <button onClick={() => toggleDisciplineChange(true)}>Edit</button>
                </>}
                {disciplineChange&&<>
                    <select className="form" onChange={(e) => setDiscipline(e.target.value)} value={discipline}>
                    <option value="">Select Discipline</option>
                    {disciplines.map(discipline =>
                    <option key={discipline.id} value={discipline.id}>{discipline.name}</option>
                    )}
                </select>
                    <button onClick={handleChangeDiscipline}>Save</button>
                    <button onClick={() => toggleDisciplineChange(false)}>Cancel</button>
                </>}
                <p>Streaming Platform</p>
                {!streamingPlatformChange&&<>
                    <p className="text">{tournament?.streaming_platform}</p>
                    <button onClick={() => toggleStreamingPlatformChange(true)}>Edit</button>
                </>}
                {streamingPlatformChange&&<>
                    <input type="text" value={streamingPlatform} onChange={e => setStreamingPlatform(e.target.value)}/>
                    <button onClick={handleChangeStreamingPlatform}>Save</button>
                    <button onClick={() => toggleStreamingPlatformChange(false)}>Cancel</button>
                </>}
                <p>Meeting Platform</p>
                {!meetingPlatformChange&&<>
                    <p className="text">{tournament?.meeting_platform}</p>
                    <button onClick={() => toggleMeetingPlatformChange(true)}>Edit</button>
                </>}
                {meetingPlatformChange&&<>
                    <input type="text" value={meetingPlatform} onChange={e => setMeetingPlatform(e.target.value)}/>
                    <button onClick={handleChangeMeetingPlatform}>Save</button>
                    <button onClick={() => toggleMeetingPlatformChange(false)}>Cancel</button>
                </>}
                <p>Dates</p>
                {!timesChange&&<>
                    <p className="text">Subscriptions Start: {formatDate(tournament?.sub_start)}</p>
                    <p className="text">Subscriptions End: {formatDate(tournament?.sub_stop)}</p>
                    <p className="text">Games Start: {formatDate(tournament?.games_start)}</p>
                    <p className="text">Games End: {formatDate(tournament?.games_stop)}</p>
                    <button onClick={() => toggleTimesChange(true)}>Edit</button>
                </>}
                {timesChange&&<>
                    <input className="form" type="datetime-local" value={subTime.slice(0, 16)} onChange={e => setSubTime(e.target.value)}/>
                    <input className="form" type="datetime-local" value={subEnd.slice(0, 16)} onChange={e => setSubEnd(e.target.value)}/>
                    <input className="form" type="datetime-local" value={gameTime.slice(0, 16)} onChange={e => setGameTime(e.target.value)}/>
                    <input className="form" type="datetime-local" value={gameEnd.slice(0, 16)} onChange={e => setGameEnd(e.target.value)}/>
                    <button onClick={handleChangeTimes}>Save</button>
                    <button onClick={() => toggleTimesChange(false)}>Cancel</button>
                </>}
            </div>
            <div className="card verticalscroll">
                <p>Games</p>
                <Link href={"/game/create/"+params.tournament}><button>Create Game</button></Link>
                <ul>
                    {tournament?.games.map((game: any) => <Link key={game.id} href={"/game/"+game.id}><div className="cardobject">
                        <p>{game.team1.tag} vs {game.team2.tag}</p>
                        <p>{game.score1} - {game.score2}</p>
                        <p>{formatDate(game.timestamp)}</p>
                        <div className="buttonrow">
                        <Link href={"/game/"+game.id+"/settings"}><button>Edit</button></Link>
                        <Link href={"/game/"+game.id+"/delete"}><button>Delete</button></Link>
                        </div>
                    </div></Link>)}
                </ul>
            </div>
            <div className="card verticalscroll">
                <p>Teams</p>
                {tournament?.teams.length===0&&<p className="text">No teams</p>}
                <ul>
                    {tournament?.teams.map((team: any) => <Link key={team.id} href={"/team/"+team.id}><div className="cardobject">
                        <p>{team.name} ({team.tag})</p>
                        <ul>
                            {team.players.map((player: any) => <li key={player.id}>{player.user.name}</li>)}
                        </ul>
                        <Link href={"/team/"+team.id+"/delete"}><button>Disband</button></Link>
                    </div></Link>)}
                </ul>
            </div>
            <button className="button" onClick={handleDelete}>Cancel Tournament</button>
            <HomeLink/>
        </div>
    );
}