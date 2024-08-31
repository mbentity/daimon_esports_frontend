"use client"

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

export interface Context {
	authenticated: boolean  | null;
	setAuthenticated: Dispatch<SetStateAction<boolean | null>>;
	user: string;
	setUser: Dispatch<SetStateAction<string>>;
	notification: string;
	setNotification: Dispatch<SetStateAction<string>>;
	popup: {text: string, buttons: {text: string, action: any}[], default: string | null} | null;
	setPopup: Dispatch<SetStateAction<{text: string, buttons: {text: string, action: any}[], default: string | null} | null>>;
}

const GlobalContext = createContext<Context>({
	authenticated: null,
	setAuthenticated: () => {},
	user: "",
	setUser: () => {},
	notification: "",
	setNotification: () => {},
	popup: null,
	setPopup: () => {}
});

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [authenticated, setAuthenticated]: [boolean | null, Dispatch<SetStateAction<boolean | null>>] = useState(null as boolean | null);
	const [user, setUser]: [string, Dispatch<SetStateAction<string>>] = useState("");
	const [notification, setNotification]: [string, Dispatch<SetStateAction<string>>] = useState("");
	const [popup, setPopup] = useState<{text: string, buttons: {text: string, action: any}[], default: string | null} | null>(null);

	return (
		<GlobalContext.Provider value={{
			authenticated,
			setAuthenticated,
			user,
			setUser,
			notification,
			setNotification,
			popup,
			setPopup
		}}>
			{children}
		</GlobalContext.Provider>
	);
}

export const useGlobalContext = () => useContext(GlobalContext);