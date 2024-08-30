"use client"

import { GameTimeline, HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TeamPage ({ params }: { params: { team: string } }) {
	const { user } = useGlobalContext();
    const [canJoin, setCanJoin] = useState<boolean>(false);
    const [team, setTeam] = useState<any>(null);
    const [games, setGames] = useState<any>(null);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+params.team+"/",
            withCredentials: true
        })
            .then(response => {
                setTeam(response.data);
                combineGames(response.data.team1,response.data.team2);
                axios({
                    method: "get",
                    url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+response.data.tournament.id+"/cansubscribe/",
                    withCredentials: true
                })
                    .then(response => {
                        setCanJoin(response.data);
                    })
            })
    }, []);

    const combineGames = (team1: any, team2: any) => {
        // merge arrays and sort by timestamp
        let combinedGames = team1.concat(team2);
        combinedGames.sort((a: any, b: any) => new Date(a.timestamp).getTime()-new Date(b.timestamp).getTime());
        setGames(combinedGames);
    }

    const handleJoin = () => {
        axios({
            method: 'post',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/requests/create/",
            withCredentials: true,
            data: {
                team: team.id
            }
        }).then(response => {
            setCanJoin(false);
        })
    }

    return (
        <div>
            <h1>{team?.name}</h1>
            {games&&<GameTimeline games={games}/>}
            <div className="card">
                <p>Owner: {team?.user?.name}</p>
                <p>Tournament: <Link href={"/tournament/"+team?.tournament?.id}>{team?.tournament?.name}</Link></p>
                {canJoin && <button onClick={handleJoin}>Request to join</button>}
                {user&&user===team?.user.id&&<Link href={"/team/"+team?.id+"/settings"}><button>Team settings</button></Link>}
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