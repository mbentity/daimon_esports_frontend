"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AccountInbox () {
    const { setNotification, authenticated } = useGlobalContext();
    const [requests, setRequests] = useState<any>(null);
    const [outgoingRequests, setOutgoingRequests] = useState<any>(null);
    const [teamFilter, setTeamFilter] = useState<any>(null);

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const team = urlParams.get("team");
        if(team) {
            setTeamFilter(team);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/requests/in/",
            withCredentials: true
        })
            .then((res) => {
                setRequests(res.data);
            })
            .catch((err) => {
            });
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/requests/out/",
            withCredentials: true
        })
            .then((res) => {
                setOutgoingRequests(res.data);
            })
            .catch((err) => {
            });
    }, [authenticated]);
           

    const handleAccept = (request: any) => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/requests/"+request.id+"/accept/",
            withCredentials: true
        })
            .then(() => {
                setNotification("Request accepted!");
                location.reload();
            });
    }

    const handleDelete = (request: any) => {
        axios({
            method: "delete",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/requests/"+request.id+"/",
            withCredentials: true
        })
            .then(() => {
                setNotification("Request deleted.");
                location.reload();
            });
    }

    const filterRequests = (requests: any) => {
        if(teamFilter) {
            return requests.filter((request: any) => request.team.id===teamFilter);
        }
        return requests;
    }

    return (
        <div>
            <h1>Inbox</h1>
            <HomeLink/>
            <div className="card">
                <h2>Incoming Requests Filter</h2>
                <select className="form" onChange={e => setTeamFilter(e.target.value)} value={teamFilter}>
                    <option value="">All</option>
                    {requests && requests.map((request: any) => {
                        return (
                            <option key={request.team.id} value={request.team.id}>{request.team.name}</option>
                        );
                    })}
                </select>
                <button onClick={() => setTeamFilter("")}>Clear</button>
            </div>
            {requests && filterRequests(requests).map((request: any) => {
                return (
                    <div key={request.id} className="card">
                        <h2>{request.sender.name}</h2>
                        <p>{request.sender.name} has requested to join your team: {request.team.name}.</p>
                        <button onClick={() => handleAccept(request)}>Accept</button>
                        <button onClick={() => handleDelete(request)}>Decline</button>
                    </div>
                );
            })}
            {!teamFilter && outgoingRequests && outgoingRequests.map((request: any) => {
                return (
                    <div key={request.id} className="card">
                        <h2>{request.receiver.name}</h2>
                        <p>You have requested to join the team of {request.receiver.name}: {request.team.name}.</p>
                        <button onClick={() => handleDelete(request)}>Cancel</button>
                    </div>
                );
            })}
            {requests && requests.length===0 && outgoingRequests && outgoingRequests.length===0 && <h2>Your inbox is empty.</h2>}
        </div>
    );
}