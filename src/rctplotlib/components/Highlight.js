import React from 'react';
import styled from "styled-components";

const StyledHighlightX = styled.span`
    position: absolute;
    top: 0;
    left: ${props => `${props.$x - 0.5}px`};
    width: 1px;
    height: 100%;
    background-color: black;
`;

const StyledHighlightY = styled.span`
    position: absolute;
    top: ${props => `${props.$y - 0.5}px`};
    left: 0;
    width: 100%;
    height: 1px;
    background-color: black;
`;

export default function Highlight(props) {
    const {
        highlightScaleX = null,
        highlightScaleY = null,
        highlightX = null,
        highlightY = null,
        highlightHeight = null,
        highlightWidth = null,
    } = props;

    const x = highlightScaleX ? highlightScaleX(highlightX) : null;
    const y = highlightScaleY ? highlightScaleY(highlightY) : null;

    console.log(props);
    
    return (
        <>
            {x !== null ? (
                <StyledHighlightX $x={x} />
            ) : null}
            {x !== null && highlightHeight !== null ? (
                <StyledHighlightX $x={x + highlightHeight} />
            ) : null}
            {y !== null ? (
                <StyledHighlightY $y={y} />
            ) : null}
            {y !== null && highlightWidth !== null ? (
                <StyledHighlightY $y={y + highlightWidth} />
            ) : null}
        </>
    );
}