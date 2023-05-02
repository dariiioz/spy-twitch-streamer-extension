import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import dayjs from "dayjs";

// l18j76hbws4sdfk2ont4zdtlkljsaj
// 4q83kznppblx379ay949bvmooti5dl

const Settings = ({ setIsConfigured }) => {
    const [clientId, setClientId] = useState(
        localStorage.getItem("client_id") || ""
    );
    const [secretCode, setSecretCode] = useState(
        localStorage.getItem("secret_code") || ""
    );
    const [twitchUser, setTwitchUser] = useState(
        localStorage.getItem("twitch_user") || ""
    );

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const getAccessToken = async () => {
        const response = await fetch(
            `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${secretCode}&grant_type=client_credentials`,
            {
                method: "POST",
            }
        );
        const data = await response.json();
        if(data.status === 400 || data.status === 401){
            setError("Please check your Client-Id and Secret code.");
            setLoading(false);
            return false;
        }
        return data;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Form submitted");
        console.log("Client-Id : " + clientId);
        console.log("Secret code : " + secretCode);
        console.log("Twitch User : " + twitchUser);
        if (clientId != "" && secretCode != "" && twitchUser != "") {
            setError("");
            const data = getAccessToken();
            data.then((res) => {
                if (res === false) {
                    setError("Please check your Client-Id and Secret code.");
                    setLoading(false);
                    return;
                } else {
                    console.log(res);
                    console.log("Saving settings...");
                    // console.log("Client-Id : " + clientId);
                    localStorage.setItem("client_id", clientId);
                    // console.log("Secret code : " + secretCode);
                    localStorage.setItem("secret_code", secretCode);
                    // console.log("Twitch User : " + twitchUser);
                    localStorage.setItem("twitch_user", twitchUser);
                    console.log("Access Token:", res.access_token);
                    localStorage.setItem("access_token", res.access_token);
                    console.log("Expires in:", res.expires_in);
                    localStorage.setItem("expires_in", res.expires_in);
                    console.log("Token Type:", res.token_type);
                    localStorage.setItem("token_type", res.token_type);
                    const date = dayjs().add(res.expires_in, "second");
                    localStorage.setItem("expiration_date", date);
                    console.log("Expiration date:", date.format("YYYY-MM-DD HH:mm:ss"));
                }

                setLoading(false);
                setIsConfigured(true);
                console.log("Settings saved successfully.");
            });
        } else {
            setError("Connexion error. Please check your settings.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if(localStorage.getItem("expiration_date") !== null){
            const expirationDate = dayjs(localStorage.getItem("expiration_date"));
            const now = dayjs();
            if(expirationDate.isAfter(now)){
                console.log("Token still valid.");
                setIsConfigured(true);
            }else{
                console.log("Token expired.");
                localStorage.removeItem("access_token");
                localStorage.removeItem("expires_in");
                localStorage.removeItem("token_type");
                localStorage.removeItem("expiration_date");
                setIsConfigured(false);
                setError("Token expired. Please check your settings.");
            }
        }
    }, []);

    

    return (
        <div className="mr-5 ml-5 mt-2">
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <div>
                        <label
                            htmlFor="small-input"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Client-Id : (find here)
                        </label>
                        <input
                            onChange={(e) => setClientId(e.target.value)}
                            value={clientId}
                            placeholder="4z4z4z4z4z4z4zz4z4z"
                            type="text"
                            id="small-input"
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div className="pt-1">
                        <label
                            htmlFor="small-input"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Secret code : (find here)
                        </label>
                        <input
                            onChange={(e) => setSecretCode(e.target.value)}
                            value={secretCode}
                            placeholder="3a3a3a3a3a3a3a3a3a"
                            type="text"
                            id="small-input"
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div className="pt-1">
                        <label
                            htmlFor="small-input"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Twitch User :
                        </label>
                        <input
                            onChange={(e) => setTwitchUser(e.target.value)}
                            value={twitchUser}
                            placeholder="twitchuser"
                            type="text"
                            id="small-input"
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 mt-5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                            Save
                        </button>
                    </div>
                </div>
            </form>
            {error && (
                <h2 className="text-red-600 text-center mt-2">
                    {error}
                </h2>
            )}
            {loading && (
                <h2 className="text-blue-600 text-center mt-2">Loading...</h2>
            )}
            <Toaster />
        </div>
    );
};

export default Settings;
