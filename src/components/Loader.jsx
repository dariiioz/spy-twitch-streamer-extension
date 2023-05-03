import React from "react";
import { MutatingDots } from "react-loader-spinner";
const Loader = () => {
    return (
        <div className="flex justify-center items-center">
            
            <MutatingDots
                height="75"
                width="75"
                color="#4406CB"
                secondaryColor="#E300B8"
                radius="12.5"
                ariaLabel="mutating-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
};

export default Loader;
