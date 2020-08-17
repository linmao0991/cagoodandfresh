import React from "react";

const loginContext = React.createContext({
    isLoggedin: false,
    login: () => {}
})

export default loginContext