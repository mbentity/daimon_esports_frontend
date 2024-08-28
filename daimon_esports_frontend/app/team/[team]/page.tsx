"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TeamPage ({ params }: { params: { team: string } }) {
	const { authenticated } = useGlobalContext();

	useEffect(() => {
	}, [authenticated])
    const [team, setTeam] = useState<any>(null);

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+params.team)
            .then(response => {
                setTeam(response.data);
            })
    }, []);

    const handleJoin = () => {
        axios.post(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+params.team+"/join")
            .then(response => {
                setTeam(response.data);
            })
    }

    return (
        <div>
            <h1>{team?.name}</h1>
            <div className="card">
                <p>Owner: {team?.user?.name}</p>
                <p>Tournament:</p>
                <Link href={"/tournament/"+team?.tournament?.id}><button>{team?.tournament?.name}</button></Link>
            </div>
            <div className="card">
                <p>Players:</p>
                <ul>
                    {team?.players.map((player: any) => <li key={player.id}>{player.user.name}</li>)}
                </ul>
                {authenticated && <button onClick={handleJoin}>Request to join</button>}
            </div>
            <HomeLink/>
        </div>
    );
}