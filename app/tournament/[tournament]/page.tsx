"use client"

import { formatDate, HomeLink, GameViewer } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TournamentPage ({ params }: { params: { tournament: string } }) {
	const { user, authenticated } = useGlobalContext();
    const [canCreate, setCanCreate] = useState<boolean>(false);
    const [isOrganizer, setIsOrganizer] = useState<boolean>(false);

	useEffect(() => {
	}, [authenticated])
    const [tournament, setTournament] = useState<any>(null);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/",
            withCredentials: true
        })
            .then(response => {
                setTournament(response.data);
                if(user && user===response.data.user.id) {
                    setIsOrganizer(true);
                }
            });
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/cansubscribe/",
            withCredentials: true
        })
            .then(response => {
                setCanCreate(response.data);
            })
            .catch(error => {
                console.log(error);
                setCanCreate(false);
            })
    }, [user, params.tournament]);

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
        // sort standings by wins and losses
        standings.sort((a: any, b: any) => {
            if(a.wins>b.wins) {
                return -1;
            } else if(a.wins<b.wins) {
                return 1;
            }
            if(a.losses<b.losses) {
                return -1;
            } else if(a.losses>b.losses) {
                return 1;
            }
            return 0;
        });
        return standings;
    }

    return (
        <div>
            <h1>{tournament?.name}</h1>
            {tournament?.games && <GameViewer games={tournament?.games}/>}
            <div className="card">
                <h1>Standings</h1>
                <ul>
                    {tournament && calculateStandings(tournament?.games, tournament?.teams).map((standing: any) => {
                        return (
                            <div className="cardobject" key={standing.team}>
                                <Link href={"/team/"+tournament?.teams.find((team: any) => team.id===standing.team).id}>
                                    {tournament?.teams.find((team: any) => team.id===standing.team).logo&&<img className="team" src={tournament?.teams.find((team: any) => team.id===standing.team).logo} alt={tournament?.teams.find((team: any) => team.id===standing.team).name}/>}
                                    <p className="gamelink">{tournament?.teams.find((team: any) => team.id===standing.team).name}</p>
                                </Link>
                                <p>&emsp;{standing.wins} - {standing.losses}</p>
                            </div>
                        );
                    })}
                </ul>
            </div>
            <div className="card">
                <p>Organizer: {tournament?.user?.name}</p>
                <p>Discipline: {tournament?.discipline?.name}</p>
                <p>Start: {formatDate(tournament?.games_start)}</p>
                <p>End: {formatDate(tournament?.games_stop)}</p>
                <p>Subscriptions open: {formatDate(tournament?.sub_start)}</p>
                <p>Subscriptions close: {formatDate(tournament?.sub_stop)}</p>
                <p>Format: {tournament?.team_count} teams of {tournament?.player_count} players each</p>
                {tournament&&<Link href={tournament?.streaming_platform}><p>Streaming</p></Link>}
                {tournament && !canCreate && <Link href={tournament?.meeting_platform}><p>Meeting</p></Link>}
                {canCreate && <Link href={"/team/create/"+params.tournament}><button>Create team</button></Link>}
                {isOrganizer && <Link href={"/tournament/"+params.tournament+"/settings"}><button>Tournament Settings</button></Link>}
            </div>
            <HomeLink/>
        </div>
    );
}