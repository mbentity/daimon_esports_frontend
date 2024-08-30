"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TeamSettings ({ params }: { params: { team: string } }) {
	const { user, authenticated } = useGlobalContext();
    const [team, setTeam] = useState<any>(null);
    const [name, setName] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [nameChange, toggleNameChange] = useState<boolean>(false);
    const [tagChange, toggleTagChange] = useState<boolean>(false);
    const maxTagLength = 4;

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+params.team+"/",
            withCredentials: true
        })
            .then(response => {
                setTeam(response.data);
                if(user&&response.data.user.id!=user) {
                    location.href = "/team/"+params.team;
                }
            })
    }, [user]);

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    function checkTagInName () {
        let nameLower = name.toLowerCase();
        let tagLower = tag.toLowerCase();
        let tagIndex = 0;
        for(let i=0; i<nameLower.length; i++) {
            if(nameLower[i]==tagLower[tagIndex]) {
                tagIndex++;
                if(tagIndex==tag.length) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkTagLength () {
        if(tag.length>maxTagLength) {
            return false;
        }
        return true;
    }

    function handleDelete() {
        axios({
            method: 'delete',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+team.id+"/",
            withCredentials: true
        }).then(response => {
            location.href = "/account";
        })
    }

    function handleChangeData() {
        if(!checkTagInName()||!checkTagLength()) {
            return;
        }
        axios({
            method: 'put',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+team.id+"/",
            withCredentials: true,
            data: {
                name: name,
                tag: tag
            }
        }).then(response => {
            location.reload();
        })
    }

    function handleTransferOwnership(player: string) {
        axios({
            method: 'put',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+team.id+"/transferownership/",
            withCredentials: true,
            data: {
                newOwner: player
            }
        }).then(response => {
            location.reload();
        })
    }
    
    function handleKick(player: string) {
        axios({
            method: 'delete',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/players/"+player+"/",
            withCredentials: true,
        }).then(response => {
            location.reload();
        })
    }


    return (
        <div>
            <h1>Team Settings</h1>
            <div className="card">
                <p>Name</p>
                {!nameChange&&<>
                    <p className="text">{team?.name}</p>
                    <button onClick={() => toggleNameChange(true)}>Edit</button>
                </>}
                {nameChange&&<>
                    <input type="text" value={team?.name} onChange={(e) => setName(e.target.value)}/>
                    <button onClick={handleChangeData}>Save</button>
                    <button onClick={() => toggleNameChange(false)}>Cancel</button>
                </>}
                <p>Tag</p>
                {!tagChange&&<>
                    <p className="text">{team?.tag}</p>
                    <button onClick={() => toggleTagChange(true)}>Edit</button>
                </>}
                {tagChange&&<>
                    <input type="text" value={team?.tag} onChange={(e) => setTag(e.target.value)}/>
                    <button onClick={handleChangeData}>Save</button>
                    <button onClick={() => toggleTagChange(false)}>Cancel</button>
                </>}
            </div>
            <div className="card overflow">
                <p>Members</p>
                <ul>
                    {team?.players.map((member: any) => {
                        return <div key={member.id} className="cardobject">
                            <p>{member.user.name}</p>
                            {user&&user!==member.user.id&&<button onClick={() => handleTransferOwnership(member.user.id)}>Transfer ownership</button>}
                            {user&&user!==member.user.id&&<button onClick={() => handleKick(member.id)}>Kick</button>}
                        </div>
                    })}
                </ul>
            </div>
            <div className="card">
                <Link href={"/account/inbox/?team="+team?.id}><button>Your Inbox</button></Link>
                <button onClick={handleDelete}>Delete Team</button>
            </div>
            <HomeLink/>
        </div>
    );
}