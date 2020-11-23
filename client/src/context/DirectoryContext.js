import React from "react";

const directoryContext = React.createContext({
    currentDir: '',
    previousDir: "none",
    switchDir: () => {}
})

export default directoryContext