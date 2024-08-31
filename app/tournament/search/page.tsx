"use client"

import { HomeLink } from "@/app/commons";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function TournamentSearch () {
    const [search, setSearch] = useState<string>("");
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [sort, setSort] = useState<sortType>({id: "games_start", name: "Tournament Start"});
    const [completed, setCompleted] = useState<string>("");
    const [closed, setClosed] = useState<string>("");
    const [ascendant, setAscendant] = useState<boolean>(true);
    const [disciplines, setDisciplines] = useState<any[]>([]);
    const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
    const [filteredTournaments, setFilteredTournaments] = useState<any[]>([]);

    type sortType = {
        id: string,
        name: string
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const search = urlParams.get("query");
        if(search!==null) {
            setSearch(search);
            axios({
                method: 'get',
                url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/search/?search="+search,
                withCredentials: true
            })
                .then(response => {
                    setTournaments(response.data);
                })
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        axios({
            method: 'get',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/disciplines/",
            withCredentials: true
        })
            .then(response => {
                setDisciplines(response.data);
            })
    }, []);

    useEffect(() => {
        const filtered = tournaments
        .filter(tournament => {
            if(search) {
                return tournament.name.toLowerCase().includes(search.toLowerCase());
            }
            return true;
        })
        .filter(tournament => {
            if(selectedDiscipline) {
                return tournament.discipline.id === selectedDiscipline.split("=")[1];
            }
            return true;
        })
        .filter(tournament => {
            if(completed) {
                const now = new Date();
                return new Date(tournament.games_stop).getTime() < now.getTime();
            }
            return true;
        })
        .filter(tournament => {
            if(closed) {
                const now = new Date();
                return new Date(tournament.sub_stop).getTime() < now.getTime();
            }
            return true;
        })
        setFilteredTournaments(filtered);
    }, [tournaments, search, selectedDiscipline, completed, closed]);

    const handleSearch = () => {
        axios({
            method: 'get',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/search/?search="+search+completed+closed+selectedDiscipline,
            withCredentials: true
        })
            .then(response => {
                setTournaments(response.data);
            })
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const TournamentCard = ({tournament}:{tournament: any}) => {
        return <div className="card">
            <Link href={"/tournament/"+tournament.id}>
                <h1>{tournament.name}</h1>
            </Link>
            <h2>{tournament.discipline.name}</h2>
        </div>
    }

    return (
        <div>
            <h1>Search</h1>
            <div className="searchbar">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <select
                    value={sort.id}
                    onChange={e => setSort({id: e.target.value, name: e.target.selectedOptions[0].text})}
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
                    value={selectedDiscipline}
                    onChange={e => setSelectedDiscipline(e.target.value)}
                >
                    <option value="">Discipline?</option>
                    {disciplines.map(discipline => {
                        return <option key={discipline.id} value={"&discipline="+discipline.id}>{discipline.name}</option>
                    })}
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
            {filteredTournaments.length?<div>
                {filteredTournaments.sort((a, b) => {
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
            </div>:<p className="card">No Tournaments Found</p>}
            <HomeLink/>
        </div>
    );
}