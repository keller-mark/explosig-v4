import React, { useRef, useEffect, useState, useReducer, useCallback } from "react";
import { connect } from 'react-redux';
import debounce from "lodash/debounce";
import Plot from "./Plot.js";
import Two from "../../two.js";
import d3 from "../../../d3.js";

import { TOOLTIP_DEBOUNCE, BAR_WIDTH_MIN, BAR_MARGIN_DEFAULT } from './../../constants.js';

import AbstractScale from './../../scales/AbstractScale.js';
import CategoricalScale from './../../scales/CategoricalScale.js';
import Dataset from './../../datasets/Dataset.js';


function HeatmapPlot(props) {
    const {
        drawRegister,
        id,
        data,
        dataDataset,
        x,
        xScale,
        y,
        yScale,
        color,
        colorScale,
        width,
        height,
        top,
        left,
        // Options
        shouldFilterX = true,
        shouldFilterY = true,
        onClick = null,
        onHover = null,
    } = props;

    const [iteration, iterate] = useReducer(i => i+1, 0);
    const [highlightX, setHighlightX] = useState();
    const [highlightY, setHighlightY] = useState();

    const [highlightScaleX, setHighlightScaleX] = useState();
    const [highlightScaleY, setHighlightScaleY] = useState();

    const [tooltip, setTooltip] = useState();

    const destroyTooltip = useCallback(() => {
        setTooltip(null);

        // Destroy all highlights here
        xScale.emitHighlightDestroy();
        yScale.emitHighlightDestroy();
        colorScale.emitHighlightDestroy();
    }, [xScale, yScale, colorScale]);

    const showTooltip = useCallback((mouseX, mouseY, tX, tY, tColor) => {
        // Dispatch highlights
        xScale.emitHighlight(tX);
        yScale.emitHighlight(tY);
        colorScale.emitHighlight(tColor);

        setTooltip({
            left: mouseX,
            top: mouseY,
            [xScale.name]: xScale.toHuman(tX),
            [yScale.name]: yScale.toHuman(tY),
            [colorScale.name]: colorScale.toHuman(tColor),
        });
    }, [xScale, yScale, colorScale]);

    useEffect(() => {
        if(xScale && yScale && colorScale && dataDataset) {
            console.assert(dataDataset instanceof Dataset);
            console.assert(xScale instanceof CategoricalScale);
            console.assert(yScale instanceof CategoricalScale);
            console.assert(colorScale instanceof AbstractScale);

            // Subscribe to event publishers here
            xScale.onUpdate(id, iterate);
            yScale.onUpdate(id, iterate);
            colorScale.onUpdate(id, iterate);

            // Subscribe to data mutations here
            dataDataset.onUpdate(id, iterate);

            // Subscribe to highlights here
            xScale.onHighlight(id, setHighlightX);
            xScale.onHighlightDestroy(id, () => setHighlightX(null));
            yScale.onHighlight(id, setHighlightY);
            yScale.onHighlightDestroy(id, () => setHighlightY(null));
        }

        return () => {
            // Unsubscribe to events
            try {
                xScale.onUpdate(id, null);
            } catch(e) {

            }
            try {
                yScale.onUpdate(id, null);
            } catch(e) {

            }
            try {
                colorScale.onUpdate(id, null);
            } catch(e) {

            }
            
            // Unsubscribe to data mutations here
            try {
                dataDataset.onUpdate(id, null);
            } catch(e) {

            }

            // Unsubscribe to highlights here
            try {
                xScale.onHighlight(id, null);
            } catch(e) {

            }
            try {
                xScale.onHighlightDestroy(id, null);
            } catch(e) {

            }
            try {
                yScale.onHighlight(id, null);
            } catch(e) {

            }
            try {
                yScale.onHighlightDestroy(id, null);
            } catch(e) {

            }
        };
    }, [xScale, yScale, colorScale, dataDataset, id]);

    const draw = useCallback((canvas, hiddenCanvas) => {
        const two = new Two({
            width,
            height,
            domElement: canvas,
            hiddenDomElement: hiddenCanvas,
        });

        const hiddenContext = two.hiddenContext;

        if(!(xScale && yScale && colorScale && dataDataset)) {
            return;
        }

        if(dataDataset.isLoading || xScale.isLoading || yScale.isLoading || colorScale.isLoading) {
            return;
        }        
        
        let dataCopy = dataDataset.dataCopy;

        let xScaleDomain;
        if(shouldFilterX) {
            xScaleDomain = xScale.domainFiltered;
        } else {
            xScaleDomain = xScale.domain;
        }

        let yScaleDomain;
        if(shouldFilterY) {
            yScaleDomain = yScale.domainFiltered;
        } else {
            yScaleDomain = yScale.domain;
        }

        dataCopy = dataCopy
            .filter((el) => xScaleDomain.includes(el[x]))
            .filter((el) => yScaleDomain.includes(el[y]));

        const xD3 = d3.scaleBand()
            .domain(xScaleDomain)
            .range([0, width]);
        setHighlightScaleX(xD3);

        const yD3 = d3.scaleBand()
            .domain(yScaleDomain)
            .range([0, height]);
        setHighlightScaleY(yD3);

        const barWidth = width / xScaleDomain.length;
        const barHeight = height / yScaleDomain.length;

        // Draw bars.
        dataCopy.forEach((d) => {
            const col = colorScale.color(d[color]);
            const rect = two.makeRect(xD3(d[x]), yD3(d[y]), barWidth, barHeight);
            rect.fill = col;
            rect.stroke = null;
        });

        two.update();

        if(!hiddenContext) {
            /* Ignore interactivity if SVG was passed in (for download). */
            return;
        }

        /*
         * Listen for mouse events
         */
        const canvasSelection = d3.select(canvas);

        const destroyTooltipDebounced = debounce(destroyTooltip, TOOLTIP_DEBOUNCE);
        canvasSelection.on("mousemove", () => {
            const mouse = d3.mouse(canvas);
            const mouseX = mouse[0];
            const mouseY = mouse[1];

            // TODO
            let xVal, yVal, colorVal;
            let found = false;

            const mouseViewportX = d3.event.clientX;
            const mouseViewportY = d3.event.clientY;

            if(found) {
                showTooltip(mouseViewportX, mouseViewportY, xVal, yVal, colorVal); 
            } else {
                destroyTooltipDebounced();
            }
        })
        .on("mouseleave", destroyTooltip);
        
        if(onClick) {
            canvasSelection.on("click", () => {
                const mouse = d3.mouse(canvas);
                const mouseX = mouse[0];
                const mouseY = mouse[1];

                // TODO
                let xVal, yVal, colorVal;
                let found = false;

                if(found) {
                    onClick(xVal, yVal, colorVal); 
                }
            })
        }

    }, [width, height, xScale, yScale, colorScale, dataDataset, id]);


    console.log("HeatmapPlot.render", iteration);
    
    return (
        <Plot
            height={height}
            width={width}
            top={top}
            left={left}
            draw={draw}
            iteration={iteration}
            tooltip={tooltip}
        />
    );
}

const mapStateToProps = (state, ownProps) => ({
    dataDataset: ownProps.dataDataset || state.datasets[ownProps.data],
    xScale: ownProps.xScale || state.scales[ownProps.x],
    yScale: ownProps.yScale || state.scales[ownProps.y],
    colorScale: ownProps.colorScale || state.scales[ownProps.color]
});

export default connect(mapStateToProps, null)(HeatmapPlot);
