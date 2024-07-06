"use client"

import { useEffect } from "react";
import Link from "next/link";
import { useGlobalContext } from "./Context/store";
import { GameTimeline, SearchBar, TwitchIframe } from "./commons";

export default function Home () {
	const { authenticated } = useGlobalContext();

	useEffect(() => {
		console.log(authenticated)
	}, [authenticated])

	return (
		<main>
			<GameTimeline count={5} />
			<h1>DAIMON ESPORTS</h1>
			<TwitchIframe url={"https://www.youtube.com/watch?v=-NLXFfRhVDk"} />
			{!authenticated&&<Link className="button" href="/account/login">Login</Link>}
			{authenticated&&<Link className="button" href="/account">Account</Link>}
			<SearchBar />
		</main>
	);
}