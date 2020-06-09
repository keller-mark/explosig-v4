import React, { useRef, useCallback } from "react";

export default function Subplots(props) {

    // Function for child components to call to "register" their draw functions.
    const drawRegister = useCallback((key, draw, options) => {
        drawRef.current[key] = { draw, options };
    }, [drawRef]);

    return (
        <div>
            <Barplot
                drawRegister={drawRegister}
            />
        </div>
    );
}