"use client"

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
                url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/",
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
    }, [authenticated, setAuthenticated, setUser]);

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
            .catch(error => {
            });
    }, []);

    return <GameViewer games={games}/>
}

export const GameViewer = ({games}:{games: any}) => {
    const [highlightedGame, setHighlightedGame] = useState<any>(null);

    useEffect(() => {
        const lastGame = games.filter((game: any) => {
            const endTimestamp = new Date(game.timestamp).getTime()+game.minutes*60000;
            const currentTimestamp = new Date().getTime();
            return currentTimestamp>endTimestamp;
        }).sort((a: any, b: any) => {
            return new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime();
        })[0];
        const gameInProgress = games.find((game: any) => checkGameInProgress(game));
        const nextGame = games.find((game: any) => {
            const startTimestamp = new Date(game.timestamp).getTime();
            const currentTimestamp = new Date().getTime();
            return currentTimestamp<startTimestamp;
        });

        if(gameInProgress) setHighlightedGame(gameInProgress);
        else if(nextGame) setHighlightedGame(nextGame);
        else if(lastGame) setHighlightedGame(lastGame);
        else setHighlightedGame(games[0]);
    }, [games, highlightedGame]);

    const checkGameInProgress = (game: any) => {
        const startTimestamp = new Date(game.timestamp).getTime();
        const endTimestamp = startTimestamp+game.minutes*60000;
        const currentTimestamp = new Date().getTime();
        return currentTimestamp>startTimestamp&&currentTimestamp<endTimestamp;
    }

    return <>
    <GameTimeline games={games} highlighted={highlightedGame?.id}/>
    <StreamIframe url={
        highlightedGame?.tournament?.streaming_platform
    }/>
    </>
}

export const GameTimeline = ({games, highlighted}:{games: any, highlighted: string}) => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const hlGameElement = useRef<HTMLDivElement>(null);

    if(timelineRef.current&&hlGameElement.current) {
        const timeline = timelineRef.current;
        const hlGame = hlGameElement.current;

        const timelineRect = timeline.getBoundingClientRect();
        const hlGameRect = hlGame.getBoundingClientRect();

        const offset = hlGameRect.left-timelineRect.left;
        timeline.scrollTo({ left: offset, behavior: "smooth" });
    }

    return <div className="games" ref={timelineRef}>
        {games.map((game: any, index: any) => {
            const isHighlighted = game.id===highlighted;
            return <div key={index} ref={isHighlighted?hlGameElement:null}>
                <Game game={game}/>
            </div>
        })}
    </div>
}

export const Game = ({game}:{game: any}) => {
    const checkGamePassed = (game: any) => {
        const endTimestamp = new Date(game.timestamp).getTime()+game.minutes*60000;
        const currentTimestamp = new Date().getTime();
        return currentTimestamp>endTimestamp;
    }
    const checkGameInProgress = (game: any) => {
        const startTimestamp = new Date(game.timestamp).getTime();
        const endTimestamp = startTimestamp+game.minutes*60000;
        const currentTimestamp = new Date().getTime();
        return currentTimestamp>startTimestamp&&currentTimestamp<endTimestamp;
    }
    return <Link href={"/game/"+game.id}>
        <div className={"game"+(checkGameInProgress(game)?" ongoing":"")+(checkGamePassed(game)?" passed":"")}>
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
            allowFullScreen={true}>
        </iframe>
    }
    else if(youtube) {
        const video = url.split("v=")[1];
        return <iframe
            src={`https://www.youtube.com/embed/${video}?autoplay=1&mute=1`}
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
    const { notification, setNotification } = useGlobalContext();

    useEffect(() => {
        if(notification) {
            const x = document.getElementById(`notification`)
            if(x)
            {
                x.className = `show`
                setTimeout(() => {
                    x.className = x.className.replace(`show`, ``)
                    setNotification("");
                }, 3000)
            }
        }
    }, [notification, setNotification]);
    return <div id='notification'>
        {notification}
    </div>
}

export const Popup = () => {
    const { popup, setPopup } = useGlobalContext();
    useEffect(() => {
        if(popup) {
            show();
        }
        else {
            hide();
        }
    }
    , [popup]);
    const show = () => {
        const x = document.getElementById(`popup`)
        if(x)
        {
            x.className = `show`
        }
    }
    const hide = () => {
        const x = document.getElementById(`popup`)
        if(x)
        {
            x.className = x.className.replace(`show`, ``)
        }
    }
    const handleAction = (action: any) => {
        action();
        setPopup(null);
    }
    return <div id='popup'>
        <div id='popupcontent'>
            <p>{popup?.text}</p>
            {popup?.buttons.map((button: any, index: number) => {
                return <button key={index} onClick={() => handleAction(button.action)}>{button.text}</button>
            })}
            {popup?.default&&<button onClick={() => setPopup(null)}>{popup.default}</button>}
        </div>
    </div>
}