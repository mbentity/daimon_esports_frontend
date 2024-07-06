"use client"

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

export interface Context {
	authenticated: boolean  | null;
	setAuthenticated: Dispatch<SetStateAction<boolean | null>>;
	user: string;
	setUser: Dispatch<SetStateAction<string>>;
}

const GlobalContext = createContext<Context>({
	authenticated: null,
	setAuthenticated: () => {},
	user: "",
	setUser: () => {},
});

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [authenticated, setAuthenticated]: [boolean | null, Dispatch<SetStateAction<boolean | null>>] = useState(null as boolean | null);
	const [user, setUser]: [string, Dispatch<SetStateAction<string>>] = useState("");

	return (
		<GlobalContext.Provider value={{
			authenticated,
			setAuthenticated,
			user,
			setUser,
		}}>
			{children}
		</GlobalContext.Provider>
	);
}

export const useGlobalContext = () => useContext(GlobalContext);