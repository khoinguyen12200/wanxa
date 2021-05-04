import React from "react";

const Context = React.createContext(null);
export default Context;

export function SettingContextProvider({ children }) {
    const [RealTimeSetting,setRealTimeSetting] = React.useState(null);

    const value = React.useMemo(()=>{
        return{
            RealTime:[RealTimeSetting,setRealTimeSetting]
        }
    },[])
	return <Context.Provider value={value}>{children}</Context.Provider>;
}
