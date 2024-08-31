"use client"

import { HomeLink } from "@/app/commons";
import { useGlobalContext } from "@/app/Context/store";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TeamCreate ({ params }: { params: { tournament: string } }) {
    const { setNotification, setPopup, user, authenticated } = useGlobalContext();
    const [tournament, setTournament] = useState<any>(null);
    const [name, setName] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const maxTagLength = 4;

    useEffect(() => {
        if(authenticated===false) {
            location.href = "/account/login";
        }
    }, [authenticated]);

    useEffect(() => {
        // if user cannot create, send them back to the tournament page
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/",
            withCredentials: true
        })
            .then((res) => {
                setTournament(res.data);
            });
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/tournaments/"+params.tournament+"/cansubscribe/",
            withCredentials: true
        })
            .then(res => {
                if(res.data.canCreate===false) {
                    location.href = "/tournament/"+params.tournament;
                }
            })
            .catch(err => {
            });
    }, [user, params.tournament]);

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

    const handleCreate = () => {
        if(!checkTagInName() || !checkTagLength()) {
            setNotification("Invalid tag: must be "+maxTagLength+" characters included in the name or less.");
            return;
        }
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/teams/create/",
            data: {
                name: name,
                tag: tag,
                tournament: params.tournament
            },
            withCredentials: true
        })
            .then(() => {
                setNotification("Team created!");
                location.href = "/tournament/"+params.tournament;
            })
            .catch(err => {
                setNotification("Error creating team: "+err.response.data);
            });
    }

    return (
        <div>
            <h1>Create Team</h1>
            <div className="formtab">
                <input className="form"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input className="form"
                    type="text"
                    placeholder="Tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />
                <button className="form" onClick={handleCreate}>Create</button>
            </div>
            {name.length>0&&tag.length>0&&!checkTagInName()&&<h3 className="error">Tag must be in name</h3>}
            {tag.length>0&&!checkTagLength()&&<h3 className="error">Tag must be {maxTagLength} characters or less</h3>}
            <HomeLink/>
        </div>
    );
}