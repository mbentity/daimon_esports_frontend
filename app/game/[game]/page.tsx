"use client"

import { HomeLink, formatDate, StreamIframe } from "@/app/commons";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function GamePage ({ params }: { params: { game: string } }) {
    const [game, setGame] = useState<any>(null);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+params.game+"/",
            withCredentials: true
        })
            .then(response => {
                setGame(response.data);
            })
    }, []);

    const checkGameInProgress = (game: any) => {
        if(new Date(game.timestamp).getTime()+game.minutes*60000>new Date().getTime()) {
        }
        return new Date(game.timestamp).getTime()+game.minutes*60000>new Date().getTime();
    }

    const TeamVersus = ({ team1, team2 }: { team1: any, team2: any }) => {
        if(!team1 || !team2) {
            return <></>;
        }
        console.log(team1, team2);
        return (
            <div className="card versus">
                {team1.logo&&<img className="team" src={team1.logo} alt={team1.name}/>}
                {!team1.logo&&<p className="team">{team1.tag}</p>}
                <p className="vs">vs</p>
                {team2.logo&&<img className="team" src={team2.logo} alt={team2.name}/>}
                {!team2.logo&&<p className="team">{team2.tag}</p>}
            </div>
        );
    }

    return (
        <div>
            <TeamVersus team1={game?.team1} team2={game?.team2}/>
            <h1>{game?.team1.tag} vs {game?.team2.tag}</h1>
            {game && checkGameInProgress(game) && <StreamIframe url={game?.tournament?.streaming_platform}/>}
            <div className="card">
                <p>Score: {game?.score1} - {game?.score2}</p>
                <Link href={"/team/"+game?.team1.id}><button>{game?.team1.name}</button></Link>
                <Link href={"/team/"+game?.team2.id}><button>{game?.team2.name}</button></Link>
            </div>
            <div className="card">
                {game?.timestamp && <p>Start: {formatDate(game?.timestamp)}</p>}
                {game?.timestamp && game?.minutes && <p>End: {formatDate((new Date(new Date(game?.timestamp).getTime()+game?.minutes*60000)).toString())}</p>}
            </div>
            <div className="card">
                <Link href={"/tournament/"+game?.tournament.id}><button>{game?.tournament.name}</button></Link>
            </div>
            <HomeLink/>
        </div>
    );
}