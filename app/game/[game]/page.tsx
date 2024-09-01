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
    }, [params.game]);

    const checkGameInProgress = (game: any) => {
        if(new Date(game.timestamp).getTime()+game.minutes*60000>new Date().getTime()) {
        }
        return new Date(game.timestamp).getTime()+game.minutes*60000>new Date().getTime();
    }

    const TeamVersus = ({ team1, team2 }: { team1: any, team2: any }) => {
        if(!team1 || !team2) {
            return <></>;
        }
        return (
            <div className="card versus">
                {team1.logo&&<Link href={"/team/"+team1.id}>
                <img className="team" src={team1.logo} alt={team1.name}/>
                </Link>}
                {!team1.logo&&<Link href={"/team/"+team1.id}>
                <p className="team">{team1.tag}</p>
                </Link>}
                <p className="vs">vs</p>
                {team2.logo&&<img className="team" src={team2.logo} alt={team2.name}/>}
                {!team2.logo&&<p className="team">{team2.tag}</p>}
            </div>
        );
    }

    const TeamScore = ({ score1, score2 }: { score1: number, score2: number }) => {
        if(score1===null||score2===null) {
            return <></>;
        }
        return (
            <div className="card versus">
                <p className="score">{score1}</p>
                <p className="vs">-</p>
                <p className="score">{score2}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>{game?.team1.tag} vs {game?.team2.tag}</h1>
            <TeamVersus team1={game?.team1} team2={game?.team2}/>
            <StreamIframe url={game?.tournament?.streaming_platform}/>
            {game && checkGameInProgress(game) && <StreamIframe url={game?.tournament?.streaming_platform}/>}
            <TeamScore score1={game?.score1} score2={game?.score2}/>
            <div className="card">
                {game?.timestamp && <p>Start: {formatDate(game?.timestamp)}</p>}
                {game?.timestamp && game?.minutes && <p>End: {formatDate((new Date(new Date(game?.timestamp).getTime()+game?.minutes*60000)).toString())}</p>}
            </div>
            <Link className="button" href={"/tournament/"+game?.tournament.id}>{game?.tournament.name}</Link>
            <HomeLink/>
        </div>
    );
}