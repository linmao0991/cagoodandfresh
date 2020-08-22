import React from "react";

const directoryContext = React.createContext({
    currentDir: "main",
    previousDir: "none",
    switchDir: () => {}
})

export default directoryContext