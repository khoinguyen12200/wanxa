import React from "react";
import socketIOClient from "socket.io-client";


const getHostname = function () {
    const hostname =
        typeof window !== "undefined" && window.location.hostname
            ? window.location.hostname
            : "";
       
    var p = process.env.PORT || "3000";

    console.log(hostname + ":" + p)
    return hostname +":"+ p;
  
};
export const socket = socketIOClient.connect(getHostname());
const SocketContext = React.createContext();

export default SocketContext