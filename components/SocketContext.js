import React from "react";
import socketIOClient from "socket.io-client";


const getHostname = function () {
    const hostname =
        typeof window !== "undefined" && window.location.hostname
            ? window.location.hostname
            : "";
    return hostname + ":3000";
};
export const socket = socketIOClient.connect(getHostname());
const SocketContext = React.createContext();

export default SocketContext