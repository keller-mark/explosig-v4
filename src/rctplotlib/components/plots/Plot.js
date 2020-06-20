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
    }
    canvas:nth-child(2) {
        display: none;
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
    } = props;

    const canvasRef = useRef();
    const hiddenCanvasRef = useRef();

    useEffect(() => {
        draw(canvasRef.current, hiddenCanvasRef.current);
    }, [draw, iteration]);

    const canvasStyle = {
        'height': (height) + 'px', 
        'width': (width) + 'px',
        'top': (top) + 'px',
        'left': (left) + 'px'
    };

    const tooltipStyle = {};
    
    return (
        <StyledPlot
            width={width}
            height={height}
            top={top}
            left={left}
        >
            <canvas
                ref={canvasRef}
                style={canvasStyle}
            />
            <canvas
                ref={hiddenCanvasRef}
                style={canvasStyle}
            />
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
            {/*showTooltip && (
                <div class="vdp-tooltip" style={tooltipStyle}>
                    <table>
                        <tr>
                            <th>{ this._xScale.name }</th>
                            <td>{ this.tooltipInfo.x }</td>
                        </tr>
                        <tr>
                            <th>{ this._yScale.name }</th>
                            <td>{ this.tooltipInfo.y }</td>
                        </tr>
                    </table>
                </div>
            )*/}
        </StyledPlot>
    );
}