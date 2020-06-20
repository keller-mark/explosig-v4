import React, { useRef, useEffect } from "react";

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
        <div>
            <canvas
                ref={canvasRef}
                className="vdp-plot" 
                style={canvasStyle}
            />
            <canvas
                ref={hiddenCanvasRef}
                className="vdp-plot-hidden" 
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
        </div>
    );
}