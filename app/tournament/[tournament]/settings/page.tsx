"use client"

import { HomeLink, TimeFormat } from "@/app/commons";
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
    const [games, setGames] = useState<any>(null);
    const [teams, setTeams] = useState<any>(null);
    const [players, setPlayers] = useState<any>(null);

    const [nameChange, toggleNameChange] = useState<boolean>(false);
    const [disciplineChange, toggleDisciplineChange] = useState<boolean>(false);
    const [streamingPlatformChange, toggleStreamingPlatformChange] = useState<boolean>(false);
    const [meetingPlatformChange, toggleMeetingPlatformChange] = useState<boolean>(false);

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament)
            .then(response => {
                console.log(response.data);
                setTournament(response.data);
                if(user&&user!==response.data.user.id) {
                    location.href = "/tournament/"+params.tournament;
                }
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

    function handleChangeName () {
        axios.post(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/name", {name: name})
            .then(() => {
                toggleNameChange(false);
            });
    }

    function handleChangeDiscipline () {
        axios.post(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/discipline", {discipline: discipline})
            .then(() => {
                toggleDisciplineChange(false);
            });
    }

    function handleChangeStreamingPlatform () {
        axios.post(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/streamingplatform", {streamingPlatform: streamingPlatform})
            .then(() => {
                toggleStreamingPlatformChange(false);
            });
    }

    function handleChangeMeetingPlatform () {
        axios.post(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/meetingplatform", {meetingPlatform: meetingPlatform})
            .then(() => {
                toggleMeetingPlatformChange(false);
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
                    <input type="text" value={tournament?.name} onChange={e => setName(e.target.value)}/>
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
                    <input type="text" value={tournament?.streaming_platform} onChange={e => setStreamingPlatform(e.target.value)}/>
                    <button onClick={handleChangeStreamingPlatform}>Save</button>
                    <button onClick={() => toggleStreamingPlatformChange(false)}>Cancel</button>
                </>}
                <p>Meeting Platform</p>
                {!meetingPlatformChange&&<>
                    <p className="text">{tournament?.meeting_platform}</p>
                    <button onClick={() => toggleMeetingPlatformChange(true)}>Edit</button>
                </>}
                {meetingPlatformChange&&<>
                    <input type="text" value={tournament?.meeting_platform} onChange={e => setMeetingPlatform(e.target.value)}/>
                    <button onClick={handleChangeMeetingPlatform}>Save</button>
                    <button onClick={() => toggleMeetingPlatformChange(false)}>Cancel</button>
                </>}
            </div>
            <div className="card overflow">
                <p>Games</p>
                <Link href={"/game/create/"+params.tournament}><button>Create Game</button></Link>
                <ul>
                    {tournament?.games.map((game: any) =>
                        <Link href={"/game/"+game.id}><div key={game.id} className="cardobject">
                            <p>{game.team1.tag} vs {game.team2.tag}</p>
                            <p>{game.score1} - {game.score2}</p>
                            <p><TimeFormat timestamp={game.timestamp}/></p>
                            <div className="buttonrow">
                            <Link href={"/game/"+game.id+"/edit"}><button>Edit</button></Link>
                            <Link href={"/game/"+game.id+"/delete"}><button>Delete</button></Link>
                            </div>
                        </div></Link>)}
                </ul>
            </div>
            <div className="card overflow">
                <p>Teams</p>
                <ul>
                    {tournament?.teams.map((team: any) =>
                        <Link href={"/team/"+team.id}><div key={team.id} className="cardobject">
                            <p>{team.name} ({team.tag})</p>
                            <ul>
                                {team.players.map((player: any) => <li key={player.id}>{player.user.name}</li>)}
                            </ul>
                            <Link href={"/team/"+team.id+"/delete"}><button>Delete</button></Link>
                        </div></Link>)}
                </ul>
            </div>
            <HomeLink/>
        </div>
    );
}