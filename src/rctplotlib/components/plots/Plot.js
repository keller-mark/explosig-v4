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

export default function Plot(props) {
    const {
        draw,
        iteration,
        height,
        width,
        top,
        left,
        highlightX1,
        highlightX2,
        highlightY1,
        highlightY2,
        tooltip,
    } = props;

    const canvasRef = useRef();
    const hiddenCanvasRef = useRef();

    useEffect(() => {
        draw(canvasRef.current, hiddenCanvasRef.current);
    }, [draw, iteration]);
    
    return (
        <StyledPlot
            width={width}
            height={height}
            top={top}
            left={left}
        >
            <canvas ref={canvasRef} />
            <canvas ref={hiddenCanvasRef} />
            {highlightX1 && (
                <div
                    style={{
                        'height': (height) + 'px', 
                        'width': '1px',
                        'top': (top) + 'px',
                        'left': (left + highlightX1 - 0.5) + 'px'
                    }}
                    className="vdp-plot-highlight"
                />
            )}
            {highlightX2 && (
                <div
                    style={{
                        'height': (height) + 'px', 
                        'width': '1px',
                        'top': (top) + 'px',
                        'left': (left + highlightX2 - 0.5) + 'px'
                    }}
                    className="vdp-plot-highlight"
                />
            )}
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