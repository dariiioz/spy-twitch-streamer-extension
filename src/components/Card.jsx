import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const Card = ({ streamData, profileData }) => {
    console.log(streamData);
    console.log(profileData);
    return (
        <div className="container">
            <div className="p-4 flex flex-col text-center items-center">
                <div className="w-16 h-16 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
                    <img
                        src={profileData.profile_image_url}
                        alt="profile"
                        className="rounded-full"
                    />
                </div>
                <div className="flex-grow">
                    <h1 className="text-white text-2xl title-font font-medium mb-3">
                        {profileData.display_name}{" "}
                        {streamData.title ? "is live" : "is offline"}
                    </h1>
                    {streamData.title && (
                        <h2 className="text-white text-lg title-font font-medium mb-3">
                            Play at {streamData.game_name}
                        </h2>
                    )}
                    <a className="inline-flex text-white">
                        <button className="btn bg-red-600 hover:bg-red-700 btn-sm items-center inline-flex">
                            {streamData.viewer_count
                                ? streamData.viewer_count
                                : 0}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-4 h-4">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </button>
                    </a>
                    <p className="leading-relaxed text-white text-sm mt-1">
                        {streamData.title}
                    </p>

                    <button href="https://www.twitch.tv/${}" className="mt-3 btn btn-primary items-center inline-flex">
                        Watch on Twitch
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
