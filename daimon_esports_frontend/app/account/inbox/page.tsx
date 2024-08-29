"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AccountInbox () {
    const { authenticated } = useGlobalContext();
    const [requests, setRequests] = useState<any>(null);
    const [outgoingRequests, setOutgoingRequests] = useState<any>(null);

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/requests/",
            withCredentials: true
        })
            .then((res) => {
                setRequests(res.data);
            }
        );
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/outgoingrequests/",
            withCredentials: true
        })
            .then((res) => {
                setOutgoingRequests(res.data);
            }
        );
    }, []);

    function handleAccept (request: any) {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/requests/accept/",
            data: {
                id: request.id
            },
            withCredentials: true
        })
            .then(() => {
                location.reload();
            });
    }

    function handleDecline (request: any) {
        axios({
            method: "delete",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/requests/"+request.id+"/",
            withCredentials: true
        })
            .then(() => {
                location.reload();
            });
    }

    function handleCancel (request: any) {
        axios({
            method: "delete",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/requests/"+request.id+"/",
            withCredentials: true
        })
            .then(() => {
                location.reload();
            });
    }

    return (
        <div>
            <h1>Inbox</h1>
            <HomeLink/>
            {requests && requests.map((request: any) => {
                return (
                    <div key={request.id} className="card">
                        <h2>{request.sender.name}</h2>
                        <p>{request.sender.name} has requested to join your team: {request.team.name}.</p>
                        <button onClick={() => handleAccept(request)}>Accept</button>
                        <button onClick={() => handleDecline(request)}>Decline</button>
                    </div>
                );
            })}
            {outgoingRequests && outgoingRequests.map((request: any) => {
                return (
                    <div key={request.id} className="card">
                        <h2>{request.receiver.name}</h2>
                        <p>You have requested to join {request.receiver.name}'s team: {request.team.name}.</p>
                        <button onClick={() => handleCancel(request)}>Cancel</button>
                    </div>
                );
            })}
        </div>
    );
}