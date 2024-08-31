"use client"

import { HomeLink, formatDate } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TournamentSettings ({ params }: { params: { tournament: string } }) {
    const { user, authenticated } = useGlobalContext();
    const [tournament, setTournament] = useState<any>(null);
    const [ disciplines, setDisciplines ] = useState<any[]>([]);

    const [name, setName] = useState<string>("");
    const [discipline, setDiscipline] = useState<any>();
    const [streamingPlatform, setStreamingPlatform] = useState<string>("");
    const [meetingPlatform, setMeetingPlatform] = useState<string>("");
    const [subTime, setSubTime] = useState<number>(0);
    const [subEnd, setSubEnd] = useState<number>(0);
    const [gameTime, setGameTime] = useState<number>(0);
    const [gameEnd, setGameEnd] = useState<number>(0);

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
    }, [user]);

    const handleChangeName = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/name/",
            data: {name: name},
            withCredentials: true
        })
            .then(() => {
                toggleNameChange(false);
            });
    }

    const handleChangeDiscipline = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/discipline/",
            data: {discipline: discipline},
            withCredentials: true
        })
            .then(() => {
                toggleDisciplineChange(false);
            });
    }

    const handleChangeStreamingPlatform = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/stream/",
            data: {streamingPlatform: streamingPlatform},
            withCredentials: true
        })
            .then(() => {
                toggleStreamingPlatformChange(false);
            });
    }

    const handleChangeMeetingPlatform = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/meet/",
            data: {meetingPlatform: meetingPlatform},
            withCredentials: true
        })
            .then(() => {
                toggleMeetingPlatformChange(false);
            });
    }

    const handleChangeTimes = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/dates/",
            data: {
                subTime: subTime,
                subEnd: subEnd,
                gameTime: gameTime,
                gameEnd: gameEnd
            },
            withCredentials: true
        })
            .then(() => {
                toggleTimesChange(false);
            });
    }

    const handleDelete = () => {
        axios({
            method: "delete",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/",
            withCredentials: true
        })
            .then(() => {
                location.href = "/tournaments";
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
                    <select onChange={e => setDiscipline(e.target.value)}>
                        {disciplines.map((discipline: any) => <option key={discipline.id} value={discipline.id}>{discipline.name}</option>)}
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
                    <input type="datetime-local" value={new Date(subTime).toISOString().slice(0, 16)} onChange={e => setSubTime(new Date(e.target.value).getTime())}/>
                    <input type="datetime-local" value={new Date(subEnd).toISOString().slice(0, 16)} onChange={e => setSubEnd(new Date(e.target.value).getTime())}/>
                    <input type="datetime-local" value={new Date(gameTime).toISOString().slice(0, 16)} onChange={e => setGameTime(new Date(e.target.value).getTime())}/>
                    <input type="datetime-local" value={new Date(gameEnd).toISOString().slice(0, 16)} onChange={e => setGameEnd(new Date(e.target.value).getTime())}/>
                    <button onClick={handleChangeTimes}>Save</button>
                    <button onClick={() => toggleTimesChange(false)}>Cancel</button>
                </>}
            </div>
            <div className="card verticalscroll">
                <p>Games</p>
                <Link href={"/game/create/"+params.tournament}><button>Create Game</button></Link>
                <ul>
                    {tournament?.games.map((game: any) => <Link href={"/game/"+game.id}><div key={game.id} className="cardobject">
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
                <ul>
                    {tournament?.teams.map((team: any) => <Link href={"/team/"+team.id}><div key={team.id} className="cardobject">
                        <p>{team.name} ({team.tag})</p>
                        <ul>
                            {team.players.map((player: any) => <li key={player.id}>{player.user.name}</li>)}
                        </ul>
                        <Link href={"/team/"+team.id+"/delete"}><button>Disband</button></Link>
                    </div></Link>)}
                </ul>
            </div>
            <button onClick={handleDelete}>Cancel Tournament</button>
            <HomeLink/>
        </div>
    );
}