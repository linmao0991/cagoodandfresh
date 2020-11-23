import React from "react";

const loginContext = React.createContext({
    isLoggedin: false,
    permissionLevel: 0,
    login: () => {}
})

export default loginContext