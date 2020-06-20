import React, { Children, cloneElement, useRef, useCallback } from "react";
import styled from "styled-components";

const StyledSubplots = styled("div")`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    position: relative;
`;

export default function Subplots(props) {
    const {
        nrows=1,
        ncols=1,
        width = 0,
        height = 0,
        children,
    } = props;

    const drawRef = useRef({});

    // Function for child components to call to "register" their draw functions.
    const drawRegister = useCallback((key, draw, options) => {
        drawRef.current[key] = { draw, options };
    }, [drawRef]);

    const colWidth = width / nrows;
    const rowHeight = height / ncols;

    return (
        <StyledSubplots
            width={width}
            height={height}
        >
            {Children.map(children, (child, i) => cloneElement(
                child,
                {
                    width: colWidth,
                    height: rowHeight,
                    top: Math.floor(i / ncols) * rowHeight,
                    left: (i % ncols) * colWidth,
                }
            ))}
        </StyledSubplots>
    );
}