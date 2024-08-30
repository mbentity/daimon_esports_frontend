"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "./Context/store";

export const HomeLink = () => {
    return (
        <Link className="homelink" title="Return to Home" href="/">
            <img src="/logo_nobg_squared.png" alt="logo" />
        </Link>
    );
}

export const AuthHandler = ({children}:{children: React.ReactNode}) => {
    const { authenticated, setAuthenticated, setUser } = useGlobalContext();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if(token) {
            axios.defaults.headers.common["Authorization"] = "Bearer "+token;
            axios({
                method: 'get',
                url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user",
                withCredentials: true
            })
                .then((res: any) => {
                    setUser(res.data.id);
                    setAuthenticated(true);
                })
                .catch(() => {
                    setUser("");
                    setAuthenticated(false);
                });
        }
        else {
            setAuthenticated(false);
        }
    }, [authenticated]);

    return <>{children}</>;
}

export const GameFetcher = () => {
    const [games, setGames] = useState<any[]>([]);
    useEffect(() => {
        axios({
            method: 'get',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/games/",
            withCredentials: true
        })
            .then(response => {
                setGames(response.data);
            })
    }, []);

    return <GameViewer games={games}/>
}

export const GameViewer = ({games}:{games: any}) => {

    const checkGameInProgress = (game: any) => {
        if(new Date(game.timestamp).getTime()+game.minutes*60000>new Date().getTime()) {
        }
        return new Date(game.timestamp).getTime()+game.minutes*60000>new Date().getTime();
    }

    return <>
    <GameTimeline games={games}/>
    <StreamIframe url={
        games.find((game: any) => checkGameInProgress(game))?.tournament?.streaming_platform
    }/>
    </>
}

export const GameTimeline = ({games}:{games: any}) => {
    return <div className="games">
        {games.map((game: any, index: any) => {
            return <div key={index}>
                <Game game={game}/>
            </div>
        })}
    </div>
}

export const Game = ({game}:{game: any}) => {
    return <Link href={"/game/"+game.id}>
        <div className="game">
            <p>{game.team1.tag} vs {game.team2.tag}</p>
            <p>{game.score1} - {game.score2}</p>
            <p>{formatDate(game.timestamp)}</p>
            <Link href={"/tournament/"+game.tournament.id}><p className="gamelink">{game.tournament.name}</p></Link>
        </div>
    </Link>
}

export const StreamIframe = ({url}:{url: string}) => {
    if(!url) return (<></>);
    const twitch = url.includes("twitch.tv");
    const youtube = url.includes("youtube.com");
    if(twitch) {
        const channel = url.split("twitch.tv/")[1];
        return <iframe
            src={`https://player.twitch.tv/?channel=${channel}&parent=${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}`}
            height="720"
            width="1280"
            allowFullScreen={true}>
        </iframe>
    }
    else if(youtube) {
        const video = url.split("v=")[1];
        return <iframe
            src={`https://www.youtube.com/embed/${video}?autoplay=1&mute=1`}
            height="720"
            width="1280"
            allow="autoplay; encrypted-media"
            allowFullScreen={true}>
        </iframe>
    }
}

export const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString();
}

export const Notification = () => {
    const { message } = useGlobalContext();
    useEffect(() => {
        if(message) {
            notify();
        }
    }, [message]);
    const notify = () => {
        const x = document.getElementById(`notification`)
		if(x)
		{
			x.className = `show`
			setTimeout(() => {
				x.className = x.className.replace(`show`, ``)
			}, 3000)
		}
    }
    return <div id='notification'>
        {message}
    </div>
}

export const Popup = () => {
    const { popup, setPopup } = useGlobalContext();
    useEffect(() => {
        if(popup) {
            console.log("showing popup");
            console.log(popup);
            showPopup();
        }
        else {
            hidePopup();
        }
    }
    , [popup]);
    const showPopup = () => {
        const x = document.getElementById(`popup`)
        if(x)
        {
            x.className = `show`
        }
    }
    const hidePopup = () => {
        const x = document.getElementById(`popup`)
        if(x)
        {
            x.className = x.className.replace(`show`, ``)
        }
    }
    return <div id='popup'>
        <div id='popupcontent'>
            <p>{popup?.text}</p>
            {popup?.buttons.map((button: any, index: number) => {
                return <button key={index} onClick={button.action}>{button.text}</button>
            })}
            {popup?.default&&<button onClick={() => setPopup(null)}>{popup.default}</button>}
        </div>
    </div>
}