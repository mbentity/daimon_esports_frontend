"use client"

import { formatDate, HomeLink, TournamentGameTimeline, TwitchIframe } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TournamentPage ({ params }: { params: { tournament: string } }) {
	const { authenticated } = useGlobalContext();

	useEffect(() => {
	}, [authenticated])
    const [tournament, setTournament] = useState<any>(null);

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament)
            .then(response => {
                console.log(response.data);
                setTournament(response.data);
            })
    }, []);

    const checkGameInProgress = (game: any) => {
        if(new Date(game.timestamp).getTime()+game.minutes*60000>new Date().getTime()) {
            console.log("a game is in progress");
        }
        return new Date(game.timestamp).getTime()+game.minutes*60000>new Date().getTime();
    }

    return (
        <div>
            <h1>{tournament?.name}</h1>
            {tournament?.games && <TournamentGameTimeline games={tournament?.games}/>}
            <div className="card">
                <p>Organizer: {tournament?.user?.name}</p>
                <p>Discipline: {tournament?.discipline?.name}</p>
            </div>
            <div className="card">
                <p>Start: {formatDate(tournament?.games_start)}</p>
                <p>End: {formatDate(tournament?.games_stop)}</p>
                <p>Subscriptions open: {formatDate(tournament?.sub_start)}</p>
                <p>Subscriptions close: {formatDate(tournament?.sub_stop)}</p>
            </div>
            <div className="card">
                <p>Format: {tournament?.team_count} teams of {tournament?.player_count} players each</p>
                <p>Teams:</p>
                <ul>
                    {tournament?.teams.map((team: any) => <li key={team.id}><Link href={"/team/"+team.id}><button>{team.name}</button></Link></li>)}
                </ul>
                {authenticated && <Link href={"/team/create/"+tournament?.id}><button>Create a team</button></Link>}
            </div>
            
            <HomeLink/>
        </div>
    );
}