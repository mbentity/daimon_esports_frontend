"use client"

import { HomeLink, SearchBar, TournamentCard } from "@/app/commons";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TournamentSearch () {
    const [search, setSearch] = useState<string>("");
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [sort, setSort] = useState<sortType>({id: "games_start", display: "Tournament Start"}); // Default sort by "games_start
    const [completed, setCompleted] = useState<string>("");
    const [closed, setClosed] = useState<string>("");
    const [ascendant, setAscendant] = useState<boolean>(true);

    type sortType = {
        id: string,
        display: string
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const search = urlParams.get("query");
        if(search) {
            setSearch(search);
            axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/search/?search="+search)
                .then(response => {
                    setTournaments(response.data);
                })
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    useEffect(() => {
        handleSearch();
    }
    , [completed, closed]);

    const handleSearch = () => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/search/?search="+search+completed+closed)
            .then(response => {
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
                <select 
                    value={sort.id}
                    onChange={e => setSort({id: e.target.value, display: e.target.selectedOptions[0].text})}
                >
                    <option value="games_start">Tournament Start</option>
                    <option value="games_stop">Tournament End</option>
                    <option value="sub_start">Subscriptions Start</option>
                    <option value="sub_stop">Subscriptions End</option>
                </select>
                <select
                    value={ascendant.toString()}
                    onChange={e => setAscendant(e.target.value==="true")}
                >
                    <option value="true">Ascendant</option>
                    <option value="false">Descendant</option>
                </select>
                <select
                    value={completed}
                    onChange={e => setCompleted(e.target.value)}
                >
                    <option value="">Completed?</option>
                    <option value="&completed=true">Completed</option>
                    <option value="&completed=false">Not Completed</option>
                </select>
                <select
                    value={closed}
                    onChange={e => setClosed(e.target.value)}
                >
                    <option value="">Closed?</option>
                    <option value="&closed=true">Closed</option>
                    <option value="&closed=false">Not Closed</option>
                </select>
                <button onClick={handleSearch}>Search</button>
            </div>
            {tournaments.length?<div>
                {tournaments.sort((a, b) => {
                    if(sort.id) {
                        if(ascendant) {
                            return new Date(a[sort.id]).getTime() - new Date(b[sort.id]).getTime();
                        }
                        else {
                            return new Date(b[sort.id]).getTime() - new Date(a[sort.id]).getTime();
                        }
                    }
                    return 0;
                })
                .map(tournament => {
                    return (
                        <TournamentCard key={tournament.id} tournament={tournament}/>
                    );
                })}
            </div>:<p>No Tournaments Found</p>}
            <HomeLink/>
        </div>
    );
}