"use client"

import { formatDate, HomeLink, TournamentGameTimeline, TwitchIframe } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TournamentPage ({ params }: { params: { tournament: string } }) {
	const { authenticated } = useGlobalContext();
    const [canCreate, setCanCreate] = useState<boolean>(false);

	useEffect(() => {
	}, [authenticated])
    const [tournament, setTournament] = useState<any>(null);

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament)
            .then(response => {
                setTournament(response.data);
            });
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/cancreateteam")
            .then(response => {
                setCanCreate(response.data);
            })
            .catch((error: any) => {
            })
    }, []);

    const calculateStandings = (matches: any, teams: any) => {
        let standings: any = [];
        // populate standings with {team: team id, wins: 0, losses: 0}
        teams.forEach((team: any) => {
            standings.push({team: team.id, wins: 0, losses: 0});
        });
        // update standings with match results
        matches.forEach((match: any) => {
            // if match is still in progress, skip
            if(new Date(match.timestamp).getTime()+match.minutes*60000>new Date().getTime()) {
                return;
            }
            if(match.score1>match.score2) {
                standings.find((standing: any) => standing.team===match.team1.id).wins++;
                standings.find((standing: any) => standing.team===match.team2.id).losses++;
            } else if(match.score1<match.score2) {
                standings.find((standing: any) => standing.team===match.team2.id).wins++;
                standings.find((standing: any) => standing.team===match.team1.id).losses++;
            }
        });
        // sort standings by wins
        standings.sort((a: any, b: any) => b.wins-a.wins);
        return standings;
    }

    const checkGameInProgress = (game: any) => {
        if(new Date(game.timestamp).getTime()+game.minutes*60000>new Date().getTime()) {
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
                <p>Start: {formatDate(tournament?.games_start)}</p>
                <p>End: {formatDate(tournament?.games_stop)}</p>
                <p>Subscriptions open: {formatDate(tournament?.sub_start)}</p>
                <p>Subscriptions close: {formatDate(tournament?.sub_stop)}</p>
                <p>Format: {tournament?.team_count} teams of {tournament?.player_count} players each</p>
            </div>
            <div className="card">
                <h1>Standings</h1>
                <ul>
                    {tournament && calculateStandings(tournament?.games, tournament?.teams).map((standing: any) => {
                        return (
                            <li key={standing.team}>
                                <Link href={"/team/"+tournament?.teams.find((team: any) => team.id===standing.team).id}><button>{tournament?.teams.find((team: any) => team.id===standing.team).name}</button></Link>
                                <p>Wins: {standing.wins}</p>
                                <p>Losses: {standing.losses}</p>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <HomeLink/>
        </div>
    );
}