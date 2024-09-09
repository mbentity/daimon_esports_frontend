"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AccountTeams () {
    const [ teams, setTeams ] = useState<any[]>([]);
    const { authenticated } = useGlobalContext();

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/teams/",
            withCredentials: true
        })
            .then((res) => {
                setTeams(res.data);
            }
        );
    }, [authenticated]);

    return (
        <div>
            <h1>Your Teams</h1>
            <ul>
                {teams.length===0 && <h2>You are not a member of any team.</h2>}
                {teams.map((team) => (
                    <div className="card" key={team.id}>
                        <Link href={`/team/${team.id}`}>
                            <button>{team.name}</button>
                        </Link>
                    </div>
                ))}
                <Link className="button" href="/tournament/search/">Browse tournaments</Link>
            </ul>
            <HomeLink/>
        </div>
    );
}