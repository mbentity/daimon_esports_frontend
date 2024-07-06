"use client"

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "./Context/store";

export const HomeLink = () => {
    return (
        <Link className="homelink" title="Return to Home" href="/">
            <img src="/logo_nobg_squared.png" alt="logo" />
        </Link>
    );
}

interface Character {
    gender: boolean;
    eyeColor: string;
    hairColor: string;
    skinColor: string;
    hairStyle: string;
    facialHair: string;
};

export const idToUrl = (id: string, index: string) => {
    return process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/cosmetics/"+id+"/"+index;
}

export const levelToScore = (level:number) => {
    return Math.pow(level, 2)*125;
}

export const scoreToLevel = (score:number) => {
    return Math.floor(Math.sqrt(score/125))
}

export const Character = ({id}:{id: string}) => {
    const [hairType, setHairType] = useState<number|null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [character, setCharacter] = useState<Character|null>(null)

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/player/"+id+"/character")
            .then(response => {
                setCharacter({
                    gender: response.data.gender,
                    eyeColor: response.data.eye_color,
                    hairColor: response.data.hair_color,
                    skinColor: response.data.skin_color,
                    hairStyle: response.data.hair_style?.id,
                    facialHair: response.data.facial_hair?.id
                })
                setHairType(response.data.hair_style.type);
            })
    }
    , []);

    useEffect(() => {
        if(!character) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if(canvas&&ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const images = [];
            if(hairType === 1) {
                images.push([idToUrl(character.hairStyle, "0"), "hair"]);
                images.push([idToUrl(character.hairStyle, "1"), "line"]);
            }
            images.push([idToUrl("face", "0"), "skin"]);
            images.push([idToUrl("face", "1"), "line"]);
            character.gender?images.push([idToUrl("male", "0"), "eye"]):images.push([idToUrl("female", "0"), "eye"]);
            character.gender?images.push([idToUrl("male", "1"), "line"]):images.push([idToUrl("female", "1"), "line"]);
            if(character.facialHair) {
                images.push([idToUrl(character.facialHair, "0"), "line"]);
            }
            if(hairType === 0) {
                images.push([idToUrl(character.hairStyle, "0"), "hair"]);
                images.push([idToUrl(character.hairStyle, "1"), "line"]);
            }
            else if(hairType === 1) {
                images.push([idToUrl(character.hairStyle, "2"), "hair"]);
                images.push([idToUrl(character.hairStyle, "3"), "line"]);
            }
            const imagePromises = images.map(image => new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject();
                img.crossOrigin = "anonymous";
                img.src = image[0];
                if(image[1] === "hair"||image[1] === "skin"||image[1] === "eye") {
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const context = canvas.getContext("2d");
                        context?.drawImage(img, 0, 0, img.width, img.height);
                        const imageData = context?.getImageData(0, 0, img.width, img.height);
                        if(image[1] === "hair") {
                            for(let i = 0; i < imageData!.data.length; i += 4) {
                                if(imageData!.data[i] === 127&&imageData!.data[i+1] === 127&&imageData!.data[i+2] === 127) {
                                    imageData!.data[i] = parseInt(character.hairColor.substring(1, 3), 16);
                                    imageData!.data[i+1] = parseInt(character.hairColor.substring(3, 5), 16);
                                    imageData!.data[i+2] = parseInt(character.hairColor.substring(5, 7), 16);
                                }
                            }
                        }
                        else if(image[1] === "skin") {
                            for(let i = 0; i < imageData!.data.length; i += 4) {
                                if(imageData!.data[i] === 127&&imageData!.data[i+1] === 127&&imageData!.data[i+2] === 127) {
                                    imageData!.data[i] = parseInt(character.skinColor.substring(1, 3), 16);
                                    imageData!.data[i+1] = parseInt(character.skinColor.substring(3, 5), 16);
                                    imageData!.data[i+2] = parseInt(character.skinColor.substring(5, 7), 16);
                                }
                            }
                        }
                        else if(image[1] === "eye") {
                            for(let i = 0; i < imageData!.data.length; i += 4) {
                                if(imageData!.data[i] === 127&&imageData!.data[i+1] === 127&&imageData!.data[i+2] === 127) {
                                    imageData!.data[i] = parseInt(character.eyeColor.substring(1, 3), 16);
                                    imageData!.data[i+1] = parseInt(character.eyeColor.substring(3, 5), 16);
                                    imageData!.data[i+2] = parseInt(character.eyeColor.substring(5, 7), 16);
                                }
                            }
                        }
                        context?.putImageData(imageData!, 0, 0);
                        resolve(canvas);
                    }
                }
            }));
            Promise.all(imagePromises)
                .then((images: any) => {
                    images.forEach((image: any) => ctx.drawImage(image, 0, 0, canvas.width, canvas.height));
                })
        }
    }, [character, hairType]);

    return (<div>
        <canvas ref={canvasRef} width="512" height="512"/>
    </div>);
}

export const AuthHandler = ({children}:{children: React.ReactNode}) => {
    const { authenticated, setAuthenticated } = useGlobalContext();
    const { setUser } = useGlobalContext();

    useEffect(() => {
        if(authenticated === null) {
            axios.get(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user", {withCredentials: true})
                .then((res: any) => {
                    console.log(res.data);
                    setUser(res.data);
                    setAuthenticated(true);
                })
                .catch(() => {
                    setUser("");
                    setAuthenticated(false);
                });
        }
    }, [authenticated]);

    return <>{children}</>;
}