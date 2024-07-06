"use client"

import { HomeLink, SearchBar, TournamentCard } from "@/app/commons";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TournamentSearch () {
    const [search, setSearch] = useState<string>("");
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [sort, setSort] = useState<sortType>({id: "", display: ""});
    const [filter, setFilter] = useState<boolean>(false);
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
                    console.log(response.data);
                    setTournaments(response.data);
                })
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleSearch = () => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/search/?search="+search+"&ordering="+(ascendant?"":"-")+sort.id+(filter?"":"&completed=false"))
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
                <select 
                    value={sort.id}
                    onChange={e => setSort({id: e.target.value, display: e.target.selectedOptions[0].text})}
                >
                    <option value="">sort by</option>
                    <option value="games_start">Tournament Start</option>
                    <option value="games_stop">Tournament End</option>
                    <option value="sub_start">Subscriptions Start</option>
                    <option value="sub_stop">Subscriptions End</option>
                </select>
                <label>Ascendant</label>
                <input 
                    type="checkbox" 
                    checked={ascendant}
                    onChange={e => setAscendant(e.target.checked)}
                />
                <label>Include Completed Tournaments</label>
                <input 
                    type="checkbox" 
                    checked={filter} 
                    onChange={e => setFilter(e.target.checked)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {tournaments.length?<div>
                {tournaments.map(tournament => {
                    return (
                        <TournamentCard key={tournament.id} tournament={tournament}/>
                    );
                })}
            </div>:<p>No Tournaments Found</p>}
            <HomeLink/>
        </div>
    );
}