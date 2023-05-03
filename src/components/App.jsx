import React from "react";
import Settings from "./Settings";
import { useState } from "react";

import { useEffect } from "react";
import Card from "./Card";
import ButtonResetConfig from "./ButtonResetConfig";
import Loader from "./Loader";

const App = () => {
    const [isConfigured, setIsConfigured] = useState(false);

    const [streamData, setStreamData] = useState({});
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getStraemData = async () => {
        setLoading(true);
        let url = new URL(
            `https://api.twitch.tv/helix/streams?user_login=${localStorage.getItem(
                "twitch_user"
            )}`
        );
        // console.log(url);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Client-Id": localStorage.getItem("client_id"),
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        const data = await response.json();

        if (data.status === 400 || data.status === 401) {
            setError("Please check your Client-Id and Secret code.");
            setLoading(false);
            return false;
        }
        setLoading(false);
        return data;
    };

    const getProfileData = async () => {
        setLoading(true);
        let url = new URL(
            `https://api.twitch.tv/helix/users?login=${localStorage.getItem(
                "twitch_user"
            )}`
        );

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Client-Id": localStorage.getItem("client_id"),
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        const data = await response.json();
        if (data.status === 400 || data.status === 401) {
            setError("Please check your Client-Id and Secret code.");
            setLoading(false);
            return false;
        }
        setLoading(false);
        return data;
    };

    useEffect(() => {
        let interval;
        if (isConfigured) {
            const fetchData = async () => {
                const streamData = await getStraemData();
                console.log("Stream data : ", streamData);
                if (streamData.data.length > 0) {
                    setStreamData(streamData.data[0]);
                    setError("");
                } else {
                    setError("No stream data found.");
                }

                const profileData = await getProfileData();
                console.log("Profile data : ", profileData);
                if (profileData.data.length > 0) {
                    setProfileData(profileData.data[0]);
                } else {
                    setError("No profile data found.");
                }
            };

            fetchData();
            interval = setInterval(fetchData, 30000); 
        }

        return () => clearInterval(interval); 
    }, [isConfigured]);

    return (
        <div>
            <h1 className="text-white text-center pt-2">
                Streamer Spy - Twitch
            </h1>

            {isConfigured && (
                <ButtonResetConfig setIsConfigured={setIsConfigured} />
            )}

            {isConfigured === false && (
                <Settings setIsConfigured={setIsConfigured} />
            )}

            {loading && (
                <Loader />
            )}

            {error && (
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {streamData && isConfigured === true && !loading && (
                <Card streamData={streamData} profileData={profileData} />
            )}
        </div>
    );
};

export default App;
