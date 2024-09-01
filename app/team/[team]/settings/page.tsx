"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TeamSettings ({ params }: { params: { team: string } }) {
	const { setPopup, setNotification, user, authenticated } = useGlobalContext();
    const [team, setTeam] = useState<any>(null);
    const [name, setName] = useState<string>("");
    const [logo, setLogo] = useState<any>(null);
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
                if(user&&response.data.user.id!=user) {
                    location.href = "/team/"+params.team;
                }
                setTeam(response.data);
                setName(response.data.name);
                setTag(response.data.tag);
            })
    }, [user, params.team]);

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    const checkTagInName = () => {
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

    const checkTagLength = () => {
        if(tag.length>maxTagLength) {
            return false;
        }
        return true;
    }

    const handleDelete = () => {
        setPopup({text: "Are you sure you want to disband this team?", buttons: [{text: "Yes", action: () => {
            axios({
                method: 'delete',
                url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+team.id+"/delete/",
                withCredentials: true
            }).then(response => {
                setPopup({text: "Team disbanded", buttons: [{text: "OK", action: () => {
                    location.href = "/account";
                }
                }], default: null});
            })
        }}], default: "No"});
    }

    const handleChangeData = () => {
        if(!checkTagInName()||!checkTagLength()) {
            setNotification("Invalid tag: must be "+maxTagLength+" characters included in the name or less.");
            return;
        }
        axios({
            method: 'put',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+team.id+"/modify/",
            withCredentials: true,
            data: {
                name: name,
                tag: tag
            }
        }).then(response => {
            setNotification("Name and tag updated!");
            location.reload();
        })
        .catch((error) => {
            setNotification("Invalid name or tag change: "+error.response.data);
        });
    }

    const handleTransferOwnership = (player: string) => {
        setPopup({text: "Are you sure you want to transfer ownership to this player?", buttons: [{text: "Yes", action: () => {
            axios({
                method: 'put',
                url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+team.id+"/modify/transferownership/",
                withCredentials: true,
                data: {
                    newOwner: player
                }
            }).then(response => {
                setNotification("Ownership transferred.");
                location.reload();
            })
            .catch((error) => {
                setNotification("Invalid transfer: "+error.response.data);
            });
        }}], default: "No"});
    }
   
    const handleKick = (player: string) => {
        axios({
            method: 'delete',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/players/"+player+"/delete/",
            withCredentials: true,
        }).then(response => {
            setNotification("Player kicked.");
            location.reload();
        })
        .catch((error) => {
            setNotification("Invalid kick: "+error.response.data);
        });
    }

    const handleLogoSet = (e: any) => {
        if(e.target.files.length==0) {
            return;
        }
        setLogo(e.target.files[0]);
    }

    const handleLogoCancel = () => {
        setLogo(null);
        let fileInput = document.getElementById("file") as HTMLInputElement;
        fileInput.value = "";
    }

    const handleLogoUpload = () => {
        const formData = new FormData();
        formData.append("logo", logo);
        axios({
            method: 'put',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+team.id+"/modify/logo/",
            withCredentials: true,
            data: formData
        }).then(response => {
            setNotification("Logo uploaded.");
            location.reload();
        })
        .catch((error) => {
            setNotification("Invalid logo upload: "+error.response.data);
        });
    }

    const handleLogoDelete = () => {
        axios({
            method: 'delete',
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/"+team.id+"/modify/logo/",
            withCredentials: true
        }).then(response => {
            setNotification("Logo deleted.");
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
            <div className="card">
                <p>Logo</p>
                {!logo&&team?.logo&&<img src={team.logo} alt="Team logo"/>}
                {logo&&<><img src={URL.createObjectURL(logo)} alt="Team logo"/>
                {logo!==null||team?.logo&&<button onClick={handleLogoDelete}>Delete</button>}
                <button onClick={handleLogoCancel}>Cancel</button>
                <button onClick={handleLogoUpload}>Save</button>
                </>}
                <input id="file" className="form" type="file" onChange={handleLogoSet} accept="image/png"/>
            </div>
            <div className="card verticalscroll">
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
                <button onClick={handleDelete}>Disband Team</button>
            </div>
            <HomeLink/>
        </div>
    );
}