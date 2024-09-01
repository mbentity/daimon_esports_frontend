"use client"

import { GameTimeline, HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TeamPage ({ params }: { params: { team: string } }) {
	const { setNotification, setPopup, user } = useGlobalContext();
    const [canJoin, setCanJoin] = useState<boolean>(false);
    const [team, setTeam] = useState<any>(null);
    const [games, setGames] = useState<any>(null);
    const [isMember, setIsMember] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+params.team+"/",
            withCredentials: true
        })
            .then(response => {
                setTeam(response.data);
                if(user&&response.data.user.id===user) {
                    setIsOwner(true);
                }
                combineGames(response.data.team1,response.data.team2);
                axios({
                    method: "get",
                    url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+response.data.tournament.id+"/cansubscribe/",
                    withCredentials: true
                })
                    .then(response => {
                        setCanJoin(response.data);
                    })
                    .catch(error => {
                        setCanJoin(false);
                    })
            })
    }, [user, params.team]);

    useEffect(() => {
        if(user && team) {
            team.players.map((player: any) => {
                if(player.user.id===user) {
                    setIsMember(true);
                }
            })
        }
    }, [user, team]);

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
            setNotification("Request sent.");
            setCanJoin(false);
        })
        .catch(error => {
            setNotification("Error sending request: "+error.response.data);
        })
    }

    const handleLeave = () => {
        const playerId = team.players.filter((player: any) => player.user.id===user)[0].id;
        setPopup({
            text: "Are you sure you want to leave this team?",
            buttons: [
                {text: "Yes", action: () => {
                    axios({
                        method: 'delete',
                        url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/players/"+playerId+"/delete/",
                        withCredentials: true
                    }).then(response => {
                        setNotification("Left team.");
                        setIsMember(false);
                    })
                    .catch(error => {
                        setNotification("Error leaving team: "+error.response.data);
                    })
                }}
            ],
            default: "No"
        });
    }

    return (
        <div>
            <h1>{team?.name}</h1>
            {games&&<GameTimeline games={games} highlighted=""/>}
            <img className="logo" src={team?.logo} alt={team?.name}/>
            <div className="card">
                <p>Owner: {team?.user?.name}</p>
                <p>Tournament: <Link href={"/tournament/"+team?.tournament?.id}>{team?.tournament?.name}</Link></p>
                {canJoin && <button onClick={handleJoin}>Request to join</button>}
                {isMember && !isOwner && <button onClick={handleLeave}>Leave team</button>}
                {user&&user===team?.user.id&&<Link href={"/team/"+team?.id+"/settings"}><button>Team Settings</button></Link>}
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