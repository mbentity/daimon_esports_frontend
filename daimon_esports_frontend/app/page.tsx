"use client"

import { useEffect } from "react";
import Link from "next/link";
import { useGlobalContext } from "./Context/store";

export default function Home () {
	const { authenticated } = useGlobalContext();

	useEffect(() => {
		console.log(authenticated)
	}, [authenticated])

	return (
		<main>
			<h1>DAIMON ESPORTS</h1>
			{!authenticated&&<Link className="button" href="/account/login">Login</Link>}
			{authenticated&&<Link className="button" href="/account">Account</Link>}
			<Link className="button" href="/leaderboard">Leaderboard</Link>
		</main>
	);
}