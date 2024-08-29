"use client"

import { Games, HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TeamPage ({ params }: { params: { team: string } }) {
	const { authenticated } = useGlobalContext();
    const [canJoin, setCanJoin] = useState<boolean>(false);
    const [team, setTeam] = useState<any>(null);
    const [games, setGames] = useState<any>(null);

	useEffect(() => {
	}, [authenticated])

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+params.team)
            .then(response => {
                setTeam(response.data);
                combineGames(response.data.team1,response.data.team2);
                axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+response.data.tournament.id+"/cancreateteam")
                    .then(response => {
                        setCanJoin(response.data);
                    })
            })
    }, []);

    function combineGames(team1: any, team2: any) {
        // merge arrays and sort by timestamp
        let combinedGames = team1.concat(team2);
        combinedGames.sort((a: any, b: any) => new Date(a.timestamp).getTime()-new Date(b.timestamp).getTime());
        setGames(combinedGames);
    }

    const handleJoin = () => {
        axios.post(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+params.team+"/join")
            .then(response => {
                setTeam(response.data);
            })
    }

    return (
        <div>
            <h1>{team?.name}</h1>
            {games&&<Games games={games}/>}
            <div className="card">
                <p>Owner: {team?.user?.name}</p>
                <p>Tournament:</p>
                <Link href={"/tournament/"+team?.tournament?.id}><button>{team?.tournament?.name}</button></Link>
                {canJoin && <button onClick={handleJoin}>Request to join</button>}
            </div>
            <div className="card">
                <p>Players:</p>
                <ul>
                    {team?.players.map((player: any) => <li key={player.id}>{player.user.name}</li>)}
                </ul>
            </div>
            <HomeLink/>
        </div>
    );
}