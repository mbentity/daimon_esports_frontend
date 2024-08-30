"use client"

import { useEffect } from "react";
import Link from "next/link";
import { useGlobalContext } from "./Context/store";
import { GameTimeline, SearchBar } from "./commons";

export default function Home () {
	const { setMessage, authenticated, setPopup } = useGlobalContext();

	useEffect(() => {
		setMessage("Welcome to Daimon Esports!");
		// {text: "Are you sure?", buttons: [{text: "Yes", action: () => console.log("yes")}, {text: "No", action: () => console.log("no")}], default: "Cancel"}
		setPopup({text: "Are you sure?", buttons: [{text: "Yes", action: () => console.log("yes")}, {text: "No", action: () => console.log("no")}], default: "Cancel"});
	}
	, []);

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