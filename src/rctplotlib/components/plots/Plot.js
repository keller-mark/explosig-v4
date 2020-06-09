import React, { useRef } from "react";

export default function Plot(props) {

    const canvasRef = useRef();
    const hiddenCanvasRef = useRef();

    const canvasStyle = {
        'height': (this.pHeight) + 'px', 
        'width': (this.pWidth) + 'px',
        'top': (this.pMarginTop) + 'px',
        'left': (this.pMarginLeft) + 'px'
    };

    const tooltipStyle = {};
    
    return (
        <div>
            <canvas
                ref={canvasRef}
                class="vdp-plot" 
                style={canvasStyle}
            />
            <canvas
                ref={hiddenCanvasRef}
                class="vdp-plot-hidden" 
                style={canvasStyle}
            />
            {showHighlightX1 && (
                <div
                    style={{
                        'height': (this.pHeight) + 'px', 
                        'width': '1px',
                        'top': (this.pMarginTop) + 'px',
                        'left': (this.pMarginLeft + this.highlightX1 - 0.5) + 'px'
                    }}
                    class="vdp-plot-highlight"
                />
            )}
            {showHighlightX2 && (
                <div
                    style={{
                        'height': (this.pHeight) + 'px', 
                        'width': '1px',
                        'top': (this.pMarginTop) + 'px',
                        'left': (this.pMarginLeft + this.highlightX2 - 0.5) + 'px'
                    }}
                    class="vdp-plot-highlight"
                />
            )}
            {showTooltip && (
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
            )}
        </div>
    );
}