import React, { useRef, useEffect, useState, useReducer, useCallback } from "react";
import { connect } from 'react-redux';
import debounce from "lodash/debounce";
import Plot from "./Plot.js";
import Two from "../../two.js";
import d3 from "../../../d3.js";

import { BAR_WIDTH_MIN, BAR_MARGIN_DEFAULT } from './../../constants.js';

import AbstractScale from './../../scales/AbstractScale.js';
import Dataset from './../../datasets/Dataset.js';



function StackedBarPlot(props) {
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
        shouldFilterX = false,
        shouldFilterY = false,
        barMarginX = BAR_MARGIN_DEFAULT
    } = props;

    const [iteration, iterate] = useReducer(i => i+1, 0);
    const [highlight, setHighlight] = useState(null);

    const [highlightScale, setHighlightScale] = useState(null);
    const [barWidth, setBarWidth] = useState(null);

    console.log(dataDataset);
    console.log(xScale, yScale, colorScale); 

    useEffect(() => {
        if(xScale && yScale && colorScale && dataDataset) {
            console.assert(dataDataset instanceof Dataset);
            console.assert(xScale instanceof AbstractScale);
            console.assert(yScale instanceof AbstractScale);
            console.assert(colorScale instanceof AbstractScale);

            // Subscribe to event publishers here
            xScale.onUpdate(id, iterate);
            yScale.onUpdate(id, iterate);
            colorScale.onUpdate(id, iterate);

            // Subscribe to data mutations here
            dataDataset.onUpdate(id, iterate);

            // Subscribe to highlights here
            xScale.onHighlight(id, setHighlight);
            xScale.onHighlightDestroy(id, () => setHighlight(null));
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
        };
    }, [xScale, yScale, colorScale, dataDataset, id]);

    const draw = useCallback((canvas, hiddenCanvas) => {
        const two = new Two({
            width,
            height,
            domElement: canvas,
        });

        if(!(xScale && yScale && colorScale && dataDataset)) {
            return;
        }

        if(dataDataset.isLoading || xScale.isLoading || yScale.isLoading || colorScale.isLoading) {
            return;
        }

        console.log(dataDataset)
        
        
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

        dataCopy = dataCopy.filter((el) => xScaleDomain.includes(el[x]));

        console.log(dataCopy);

        const xD3 = d3.scaleBand()
            .domain(xScaleDomain)
            .range([0, width]);

        setHighlightScale(xD3);

        const yD3 = d3.scaleLinear()
            .domain(yScaleDomain)
            .range([height, 0]);

        const barWidth = width / xScaleDomain.length;
        setBarWidth(barWidth);
          
        const stack = d3.stack()
            .keys(colorScale.domainFiltered.slice().reverse())
            .value((d, key) => { return d[key] || 0; })
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        const series = stack(dataCopy);

        console.log(series);

        /*
         * Draw the bars
         */
        let barMarginXValue = barMarginX;
        if(barWidth - barMarginX <= BAR_WIDTH_MIN) {
            barMarginXValue = 0;
        }

        series.forEach((layer) => {
            const col = colorScale.color(layer["key"]);
            layer.forEach((d) => {
                /*const hiddenCol = genColor();
                colToNode[hiddenCol] = { "x": d.data[vm.x], "y": d.data[layer["key"]], "c": layer["key"] };
                contextHidden.fillStyle = hiddenCol;*/
                let rectHeight = yD3(d[0]) - yD3(d[1]);
                if(rectHeight + yD3(d[1]) > height) {
                    rectHeight = height - yD3(d[1]);
                }

                const rect = two.makeRect(xD3(d.data[x]) + (barMarginXValue/2), yD3(d[1]), barWidth - barMarginXValue, rectHeight);
                rect.fill = col;
                rect.stroke = null;
            });
        });

        two.update();
    }, [width, height, xScale, yScale, colorScale, dataDataset, id]);


    console.log("StackedBarPlot.render", iteration)
    
    return (
        <Plot
            height={height}
            width={width}
            top={top}
            left={left}
            draw={draw}
            iteration={iteration}
        />
    );
}

const mapStateToProps = (state, ownProps) => ({
    dataDataset: state.datasets[ownProps.data],
    xScale: state.scales[ownProps.x],
    yScale: state.scales[ownProps.y],
    colorScale: state.scales[ownProps.color]
});
  

export default connect(mapStateToProps, null)(StackedBarPlot);



