import React from "react";
import Settings from "./Settings";
import { useState } from "react";
import dayjs from "dayjs";
import { useEffect } from "react";
import Card from "./Card";
import ButtonResetConfig from "./ButtonResetConfig";

const App = () => {
    const [isConfigured, setIsConfigured] = useState(false);
    const [expiration_date, setExpiration_date] = useState(
        dayjs(localStorage.getItem("expiration_date")) || ""
    );

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
        if (isConfigured) {
            const data = getStraemData();
            data.then((res) => {
                console.log("Stream data : ", res);
                if (res.data.length > 0) {
                    setStreamData(res.data[0]);
                    setError("");
                } else {
                    setError("No stream data found.");
                }
            });

            const profileData = getProfileData();
            profileData.then((res) => {
                console.log("Profile data : ", res);
                if (res.data.length > 0) {
                    setProfileData(res.data[0]);
                } else {
                    setError("No profile data found.");
                }
            });
        }
    }, [isConfigured]);


    return (
        <div>
            <h1 className="text-white text-center pt-2">
                Twitch Live Extension
            </h1>

            {isConfigured && (
                <ButtonResetConfig setIsConfigured={setIsConfigured} />
            )}

            {isConfigured === false && (
                <Settings setIsConfigured={setIsConfigured} />
            )}

            {loading && (
                <div className="text-center">
                    <p className="text-blue">Loading...</p>
                </div>
            )}

            {error && (
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {streamData && isConfigured === true && <Card streamData={streamData} profileData={profileData} />}

            
        </div>
    );
};

export default App;
