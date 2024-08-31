"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGlobalContext } from "./Context/store";
import { GameFetcher } from "./commons";

export default function Home () {
	const { setNotification, authenticated, setPopup } = useGlobalContext();

	useEffect(() => {
		//setNotification("Welcome to Daimon Esports!");
		//setPopup({text: "Are you sure?", buttons: [{text: "Yes", action: () => console.log("yes")}, {text: "No", action: () => console.log("no")}], default: "Cancel"});
	}
	, []);

	const SearchBar = () => {
		const [search, setSearch] = useState<string>("");

		const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				if (search.trim() !== '') {
					location.href = `/tournament/search/?query=${encodeURIComponent(search)}`;
				}
			}
		};

		// disable autocomplete and autocorrect

		useEffect(() => {
			if (typeof document === 'undefined') return
			const input = document.getElementById("search");
			if(input) {
				input.setAttribute("autocomplete", "off");
				input.setAttribute("autocorrect", "off");
				input.setAttribute("autocapitalize", "off");
				input.setAttribute("spellcheck", "false");
			}
		}, []);

		return (
			<div className="inputbox">
				<input
					id="search"
					className="input"
					type="text"
					value={search}
					onChange={e => setSearch(e.target.value)}
					onKeyDown={handleKeyPress}
				/>
				<Link className="inputbutton" href={`/tournament/search/?query=${encodeURIComponent(search)}`}>
					Search
				</Link>
			</div>
		);
	};

	return (
		<main>
			<div className="header">
				{!authenticated&&<Link className="accountbutton" href="/account/login">Login</Link>}
				{authenticated&&<Link className="accountbutton" href="/account">Account</Link>}
				<p>DAIMON ESPORTS</p>
				<SearchBar/>
			</div>
			<GameFetcher/>
		</main>
	);
}