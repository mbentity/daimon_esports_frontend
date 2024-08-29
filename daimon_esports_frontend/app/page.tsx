"use client"

import { useEffect } from "react";
import Link from "next/link";
import { useGlobalContext } from "./Context/store";
import { GameTimeline, SearchBar } from "./commons";

export default function Home () {
	const { authenticated } = useGlobalContext();

	useEffect(() => {
	}, [authenticated])

	return (
		<main>
			<div className="header">
				{!authenticated&&<Link className="accountbutton" href="/account/login">Login</Link>}
				{authenticated&&<Link className="accountbutton" href="/account">Account</Link>}
				<p>DAIMON ESPORTS</p>
				<SearchBar/>
			</div>
			<GameTimeline count={10} />
		</main>
	);
}