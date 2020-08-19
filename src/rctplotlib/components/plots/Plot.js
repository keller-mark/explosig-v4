import React, { useRef, useEffect } from "react";
import styled from "styled-components";

const StyledPlot = styled("div")`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    position: absolute;

    canvas:nth-child(1) {
        width: ${props => props.width}px;
        height: ${props => props.height}px;
        top: 0px;
        left: 0px;
        position: absolute;
    }
    canvas:nth-child(2) {
        display: none;
    }
`;

const StyledTooltip = styled.div.attrs(props => ({
    style: {
        top: `${props.top}px`,
        left: `${props.left}px`
    }
}))`
    position: fixed;
    border: 1px solid rgb(205, 205, 205);
    background-color: rgba(255, 255, 255, 0.95);
    z-index: 100;
    padding: 0.25rem;
    border-radius: 3px;
    transform: translate(10%, -50%);
    font-size: 14px;

    table > tr > th {
        text-align: right;
        padding-right: 5px;
    }
`;

const StyledHighlightX = styled.div.attrs(props => ({
    style: {
        left: `${props.$x - 0.5}px`,
    }
}))`
    position: absolute;
    top: 0;
    width: 1px;
    height: 100%;
    background-color: black;
    pointer-events: none;
`;

const StyledHighlightY = styled.div.attrs(props => ({
    style: {
        top: `${props.$y - 0.5}px`,
    }
}))`
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: black;
    pointer-events: none;
`;

export default function Plot(props) {
    const {
        draw,
        iteration,
        height,
        width,
        top,
        left,
        tooltip,
        highlightScaleX = null,
        highlightScaleY = null,
        highlightX = null,
        highlightY = null,
        highlightHeight = null,
        highlightWidth = null,
    } = props;

    const canvasRef = useRef();
    const hiddenCanvasRef = useRef();

    useEffect(() => {
        draw(canvasRef.current, hiddenCanvasRef.current);
    }, [draw, iteration]);

    const x = highlightScaleX && highlightX ? highlightScaleX(highlightX) : null;
    const y = highlightScaleY && highlightY ? highlightScaleY(highlightY) : null;
    
    return (
        <StyledPlot
            width={width}
            height={height}
            top={top}
            left={left}
        >
            {/* plot */}
            <canvas ref={canvasRef} />
            <canvas ref={hiddenCanvasRef} />
            {/* highlight */}
            {x !== null ? (
                <StyledHighlightX $x={x} />
            ) : null}
            {x !== null && highlightWidth !== null ? (
                <StyledHighlightX $x={x + highlightWidth} />
            ) : null}
            {y !== null ? (
                <StyledHighlightY $y={y} />
            ) : null}
            {y !== null && highlightHeight !== null ? (
                <StyledHighlightY $y={y + highlightHeight} />
            ) : null}
            {/* tooltip */}
            {tooltip && (
                <StyledTooltip
                    top={tooltip.top}
                    left={tooltip.left}
                >
                    <table>
                        <tbody>
                        {Object.entries(tooltip)
                            .filter(([k, v]) => !["top", "left"].includes(k))
                            .map(([k, v]) => (
                                <tr key={k}>
                                    <th>{k}</th>
                                    <td>{v}</td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </table>
                </StyledTooltip>
            )}
        </StyledPlot>
    );
}