"use client"

import { HomeLink, SearchBar, TournamentCard } from "@/app/commons";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TournamentSearch () {
    const [search, setSearch] = useState<string>("");
    const [tournaments, setTournaments] = useState<any[]>([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const search = urlParams.get("query");
        if(search) {
            setSearch(search);
            axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/search/?search="+search)
                .then(response => {
                    console.log(response.data);
                    setTournaments(response.data);
                })
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleSearch = () => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/search/?search="+search)
            .then(response => {
                console.log(response.data);
                setTournaments(response.data);
            })
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div>
            <h1>Search</h1>
            <div>
                <input 
                    type="text" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleKeyPress} // Add key press handler
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div>
                {tournaments.map(tournament => {
                    return (
                        <TournamentCard key={tournament.id} tournament={tournament}/>
                    );
                })}
            </div>
            <HomeLink/>
        </div>
    );
}