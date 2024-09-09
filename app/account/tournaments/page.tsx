"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AccountTournaments () {
    const [ tournaments, setTournaments ] = useState<any[]>([]);
    const { authenticated } = useGlobalContext();

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/tournaments/",
            withCredentials: true
        })
            .then((res) => {
                setTournaments(res.data);
            })
            .catch((err) => {
            });
    }, [authenticated]);

    return (
        <div>
            <h1>Your Tournaments</h1>
            <ul>
                {tournaments.map((tournament) => (
                    <div className="card" key={tournament.id}>
                        <Link href={`/tournament/${tournament.id}`}>
                            <button>{tournament.name}</button>
                        </Link>
                    </div>
                ))}
            </ul>
            <Link href="/tournament/create">
                <button className="button">Create Tournament</button>
            </Link>
            <HomeLink/>
        </div>
    );
}