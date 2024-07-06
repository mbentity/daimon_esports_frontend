"use client"

import { HomeLink } from "@/app/commons";
import axios from "axios";
import { useState, useEffect } from "react";

export default function GamePage ({ params }: { params: { game: string } }) {
    const [game, setGame] = useState<any>(null);

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/"+params.game)
            .then(response => {
                setGame(response.data);
            })
    }, []);

    return (
        <div>
            <h1>Game</h1>
            <h2>{game?.team1.name} vs {game?.team2.name}</h2>
            <HomeLink/>
        </div>
    );
}