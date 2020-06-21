import React, { useRef, useEffect, useState, useReducer, useCallback } from "react";
import { connect } from 'react-redux';
import styled from "styled-components";
import d3 from "../../../d3.js";

import { SIDES, ORIENTATIONS } from './../../constants.js';

import AbstractScale from './../../scales/AbstractScale.js';
import ContinuousScale from './../../scales/ContinuousScale.js';
import CategoricalScale from './../../scales/CategoricalScale.js';
import { EVENT_TYPES, EVENT_SUBTYPES } from './../../history/base-events.js';


const StyledAxis = styled("div")`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    position: absolute;
    
`;

function Axis(props) {
    const {
        id,
        side,
        x,
        xScale,
        y,
        yScale,
        stack,
        height,
        width,
        top,
        left,
        drawRegister,
        // Options
        tickRotation = 0,
        enableBrushing = true,
        showLabel = true,
        autoRemoveTicks = true,
        type = 'linear', // or 'log' or 'time
        maxCharacters = null,
    } = props;

    const svgRef = useRef();
    const [iteration, iterate] = useReducer(i => i+1, 0);

    // Set side and orientation enum values from side prop.
    console.assert(Object.keys(SIDES).includes(side));
    const orientation = (side === SIDES.top || side === SIDES.bottom ? ORIENTATIONS.horizontal : ORIENTATIONS.vertical);
    
    // Set the scale variable
    const variable = (orientation === ORIENTATIONS.horizontal ? x : y);
    const variableScale = (orientation === ORIENTATIONS.horizontal ? xScale : yScale);

    const computedTranslateX = (orientation === ORIENTATIONS.horizontal ? 0 : width - 1);
    const computedTranslateY = 0;

    useEffect(() => {
        if(variableScale) {
            console.assert(variableScale instanceof AbstractScale);
            // Subscribe to event publishers
            variableScale.onUpdate(id, iterate);
        }

        return () => {
            // Unsubscribe to events
            try {
                variableScale.onUpdate(id, null);
            } catch(e) {

            }
        };
    }, [variableScale, id]);

    const draw = useCallback((svg, _, { brushingOverride }) => {

        if(!variableScale) {
            return;
        }

        if(variableScale.isLoading) {
            return;
        }

        const disableBrushing = (brushingOverride === true) || !enableBrushing;
        
        const varScale = variableScale;

        let varScaleDomain = varScale.domain;
        let varScaleDomainFiltered = varScale.domainFiltered;
        if(varScale instanceof ContinuousScale) {
            if(type === "log") {
                if(varScaleDomain[0] == 0) {
                    varScaleDomain = varScaleDomain.slice();
                    varScaleDomain[0] = 1;
                }
                if(varScaleDomainFiltered[0] == 0) {
                    varScaleDomainFiltered = varScaleDomainFiltered.slice();
                    varScaleDomainFiltered[0] = 1;
                }
            }
        }

        let range;
        if(orientation === ORIENTATIONS.horizontal) {
            range = [0, width];
        } else if(orientation === ORIENTATIONS.vertical) {
            range = [height, 0];
        }

        let axisFunction;
        if(side === SIDES.top) {
            axisFunction = d3.axisTop;
        } else if(side === SIDES.left) {
            axisFunction = d3.axisLeft;
        } else if(side === SIDES.right) {
            axisFunction = d3.axisRight;
        } else if(side === SIDES.bottom) {
            axisFunction = d3.axisBottom;
        }

        let scaleZoomedOut, scaleZoomedIn, tickSizeOuter;
        if(varScale instanceof CategoricalScale) {
            if(orientation === ORIENTATIONS.horizontal) {
                scaleZoomedOut = d3.scaleBand()
                    .domain(varScaleDomain)
                    .range(range);
                scaleZoomedIn = d3.scaleBand()
                    .domain(varScaleDomainFiltered)
                    .range(range);
            } else if(orientation === ORIENTATIONS.vertical) {
                scaleZoomedOut = d3.scaleBand()
                    .domain(varScaleDomain.slice().reverse())
                    .range(range);
                scaleZoomedIn = d3.scaleBand()
                    .domain(varScaleDomainFiltered.slice().reverse())
                    .range(range);
            }
            tickSizeOuter = 0;
        } else if(varScale instanceof ContinuousScale) {
            let continuousScaleFunc = d3.scaleLinear;
            if(type === "log") {
                continuousScaleFunc = d3.scaleLog;
            } else if (type === "time") {
                continuousScaleFunc = d3.scaleTime;
            }
            scaleZoomedOut = continuousScaleFunc()
                .domain(varScaleDomain)
                .range(range);
            scaleZoomedIn = continuousScaleFunc()
                .domain(varScaleDomainFiltered)
                .range(range);
            tickSizeOuter = 6;
            // TODO: options for log, etc...
        }

        /*
         * Create the SVG elements
         */

        const container = d3.select(svg);
        container.selectAll("g").remove();
        
        const containerZoomedIn = container.append("g")
                .attr("class", "axis-zoomed-in")
                .attr("transform", "translate(" + computedTranslateX + "," + computedTranslateY + ")");
        
        /*
            * The zoomed-in axis
            */
        let tickFormatFunction;
        if(varScale instanceof CategoricalScale) {
            tickFormatFunction = ((d) => varScale.toHuman(d));
        }

        let tickFormatFunction2;
        if(maxCharacters) {
            if(tickFormatFunction) {
                tickFormatFunction2 = (d) => {
                    let humanD = varScale.toHuman(d);
                    if(humanD.length > maxCharacters) {
                        return (humanD.substring(0, maxCharacters) + "...");
                    }
                    return humanD;
                }
            } else {
                tickFormatFunction2 = (d) => {
                    if(d.length > maxCharacters) {
                        return (d.substring(0, maxCharacters) + "...");
                    }
                    return d;
                }
            }
        }
        const ticksZoomedIn = containerZoomedIn.call(
            axisFunction(scaleZoomedIn)
                .tickSizeOuter(tickSizeOuter)
                .tickFormat(tickFormatFunction2)
        );


        let textBboxZoomedIn;
        try {
            textBboxZoomedIn = ticksZoomedIn.select("text").node().getBBox();
        } catch(e) {
            // Replace with dummy object on failure
            // TODO: find better solution
            textBboxZoomedIn = { height: 0 };
        }

        const tickTransformFunction = (d, i, v) => {
            let tickBbox;
            try {
                tickBbox = v[i].getBBox();
            } catch(e) {
                tickBbox = { height: 0 };
            }
            let tickRotateX = 0;
            let tickRotateY = 0;
            if(side === SIDES.top) {
                tickRotateY = -tickBbox.height;
            } else if(side === SIDES.bottom) {
                tickRotateY = tickBbox.height;
            } else if(side === SIDES.left) {
                tickRotateX = -tickBbox.height;
            } else if(side === SIDES.right) {
                tickRotateX = tickBbox.height;
            }
            return "rotate(" + tickRotation + "," + tickRotateX + "," + tickRotateY + ")";
        }

        let tickTextAnchor = "middle";
        if(tickRotation !== 0) {
            if(side === SIDES.left || side === SIDES.bottom) {
                tickTextAnchor = "end";
            } else {
                tickTextAnchor = "start";
            }
        } else {
            if(side === SIDES.left) {
                tickTextAnchor = "end";
            } else if(side === SIDES.right) {
                tickTextAnchor = "start";
            }
        }

        ticksZoomedIn.selectAll("text")	
            .attr("text-anchor", tickTextAnchor)
            .attr("transform", tickTransformFunction);

        
        
        
        // Get the width/height of the zoomed-in axis, before removing the text
        let axisBboxZoomedIn;
        try {
            axisBboxZoomedIn = container.select(".axis-zoomed-in").node().getBBox();
        } catch(e) {
            axisBboxZoomedIn = {
                height: 0,
                width: 0,
            };
        }
        
        if(varScale instanceof CategoricalScale) {
            if(orientation === ORIENTATIONS.horizontal) {
                const barWidth = width / varScaleDomainFiltered.length;
                if(autoRemoveTicks && barWidth < textBboxZoomedIn.height) {
                    ticksZoomedIn.selectAll("text")
                        .remove();
                }
            } else if(orientation === ORIENTATIONS.vertical) {
                const barHeight = height / varScaleDomainFiltered.length;
                if(autoRemoveTicks && barHeight < textBboxZoomedIn.height) {
                    ticksZoomedIn.selectAll("text")
                        .remove();
                }
            }
        }


        

        /*
            * The zoomed-out axis
            */

        const betweenAxisMargin = 4;
        let axisBboxZoomedOut;

        let zoomedOutTranslateX = computedTranslateX;
        let zoomedOutTranslateY = computedTranslateY;

        if(side === SIDES.left) {
            zoomedOutTranslateX -= (axisBboxZoomedIn.width + betweenAxisMargin);
        } else if(side === SIDES.bottom) {
            zoomedOutTranslateY += (axisBboxZoomedIn.height + betweenAxisMargin);
        } else if(side === SIDES.top) {
            zoomedOutTranslateY -= (axisBboxZoomedIn.height + betweenAxisMargin);
        } else if(side === SIDES.right) {
            zoomedOutTranslateX += (axisBboxZoomedIn.width + betweenAxisMargin);
        }

        if(!disableBrushing) {
            const containerZoomedOut = container.append("g")
                    .attr("class", "axis-zoomed-out")
                    .attr("transform", "translate(" + zoomedOutTranslateX + "," + zoomedOutTranslateY + ")");
            
            const ticksZoomedOut = containerZoomedOut.call(
                axisFunction(scaleZoomedOut)
                    .tickSizeOuter(tickSizeOuter)
                    .tickFormat(tickFormatFunction2)
            );
            let textBboxZoomedOut;
            try {
                textBboxZoomedOut = ticksZoomedOut.select("text").node().getBBox();
            } catch(e) {
                textBboxZoomedOut = { height: 0 };
            }

            ticksZoomedOut.selectAll("text")	
                    .style("text-anchor", tickTextAnchor)
                    .attr("transform", tickTransformFunction);
            
            // Get the width/height of the zoomed-out axis, before removing the text
            try {
                axisBboxZoomedOut = container.select(".axis-zoomed-out").node().getBBox();
            } catch(e) {
                axisBboxZoomedOut = {
                    height: 0,
                    width: 0,
                };
            }
            
            if(varScale instanceof CategoricalScale) {
                const barWidth = width / varScaleDomain.length;
                if(autoRemoveTicks && barWidth < textBboxZoomedOut.height) {
                    ticksZoomedOut.selectAll("text")
                        .remove();
                }
            }

        

            /*
                * Add brushing to the zoomed-out axis
                */

            

            /*
                * Display current zoom state as overlay on zoomed-out axis
                */
            
            if(orientation === ORIENTATIONS.vertical) {
                let zoomRectTranslateX;
                if(side === SIDES.left) {
                    zoomRectTranslateX = (-axisBboxZoomedOut.width-betweenAxisMargin);
                } else if(side === SIDES.right) {
                    zoomRectTranslateX = 0;
                }
                if(varScale instanceof ContinuousScale) {  
                    let start = varScaleDomainFiltered[0];
                    let end = varScaleDomainFiltered[1];
                    containerZoomedOut.append("rect")
                        .attr("width", axisBboxZoomedOut.width+betweenAxisMargin)
                        .attr("height", scaleZoomedOut(start) - scaleZoomedOut(end))
                        .attr("x", 0)
                        .attr("y", scaleZoomedOut(end))
                        .attr("fill", "silver")
                        .attr("fill-opacity", 0.5)
                        .attr("transform", "translate(" + zoomRectTranslateX + ",0)");
                } else if(varScale instanceof CategoricalScale) {
                    let eachBand = height / varScaleDomain.length;
                    for(let domainFilteredItem of varScaleDomainFiltered) {
                        containerZoomedOut.append("rect")
                            .attr("width", axisBboxZoomedOut.width+betweenAxisMargin)
                            .attr("height", eachBand)
                            .attr("x", 0)
                            .attr("y", scaleZoomedOut(domainFilteredItem))
                            .attr("fill", "silver")
                            .attr("fill-opacity", 0.5)
                            .attr("transform", "translate(" + zoomRectTranslateX + ",0)");
                    }
                }
            } else if(orientation === ORIENTATIONS.horizontal) {
                let zoomRectTranslateY;
                if(side === SIDES.top) {
                    zoomRectTranslateY = (-axisBboxZoomedOut.height-betweenAxisMargin);
                } else if(side === SIDES.bottom) {
                    zoomRectTranslateY = 0;
                }
                if(varScale instanceof CategoricalScale) {  
                    let eachBand = width / varScaleDomain.length;
                    for(let domainFilteredItem of varScaleDomainFiltered) {
                        containerZoomedOut.append("rect")
                            .attr("width", eachBand)
                            .attr("height", axisBboxZoomedOut.height)
                            .attr("x", scaleZoomedOut(domainFilteredItem))
                            .attr("y", 0)
                            .attr("fill", "silver")
                            .attr("fill-opacity", 0.5)
                            .attr("transform", "translate(0," + zoomRectTranslateY + ")");
                    }
                } else if(varScale instanceof ContinuousScale) {
                    let start = varScaleDomainFiltered[0];
                    let end = varScaleDomainFiltered[1];
                    containerZoomedOut.append("rect")
                        .attr("width", scaleZoomedOut(end) - scaleZoomedOut(start))
                        .attr("height", axisBboxZoomedOut.height+betweenAxisMargin)
                        .attr("x", scaleZoomedOut(start))
                        .attr("y", 0)
                        .attr("fill", "silver")
                        .attr("fill-opacity", 0.5)
                        .attr("transform", "translate(0," + zoomRectTranslateY + ")");
                }
            }


            let axisContainerSize;
            let brush, brushed;
            if(orientation === ORIENTATIONS.vertical) {
                axisContainerSize = axisBboxZoomedOut.width;
                if(varScale instanceof ContinuousScale) {
                    brushed = () => {
                        if (!d3.event.sourceEvent) return;
                        let s = d3.event.selection || scaleZoomedOut.range().slice().reverse();
                        let s2 = s.map(scaleZoomedOut.invert, scaleZoomedOut);
                        varScale.zoom(s2[1], s2[0]);
                        if(stack) {
                            stack.push(new HistoryEvent(
                                EVENT_TYPES.SCALE,
                                EVENT_SUBTYPES.SCALE_DOMAIN_FILTER,
                                varScale.id,
                                "zoom",
                                [s2[1], s2[0]]
                            ));
                        }
                    }
                } else if(varScale instanceof CategoricalScale) {
                    brushed = () => {
                        if (!d3.event.sourceEvent) return;
                        let s = d3.event.selection || scaleZoomedOut.range().slice().reverse();
                        let eachBand = height / varScaleDomain.length;
                        let startIndex = Math.floor((s[0] / eachBand));
                        let endIndex = Math.ceil((s[1] / eachBand));
                        varScale.zoom(startIndex, endIndex);
                        if(stack) {
                            stack.push(new HistoryEvent(
                                EVENT_TYPES.SCALE,
                                EVENT_SUBTYPES.SCALE_DOMAIN_FILTER,
                                varScale.id,
                                "zoom",
                                [startIndex, endIndex]
                            ));
                        }
                    }
                }
                let brushExtent;
                if(side === SIDES.left) {
                    brushExtent = [[-axisContainerSize-betweenAxisMargin, 0], [0, height]];
                } else if(side === SIDES.right) {
                    brushExtent = [[0, 0], [axisContainerSize+betweenAxisMargin, height]];
                }
                brush = d3.brushY()
                    .extent(brushExtent)
                    .on("end." + id, brushed);
                
            } else if(orientation === ORIENTATIONS.horizontal) {
                axisContainerSize = axisBboxZoomedOut.height;
                if(varScale instanceof ContinuousScale) {
                    brushed = () => {
                        if (!d3.event.sourceEvent) return;
                        let s = d3.event.selection || scaleZoomedOut.range().slice();
                        let s2 = s.map(scaleZoomedOut.invert, scaleZoomedOut);
                        varScale.zoom(s2[0], s2[1]);
                        if(stack) {
                            stack.push(new HistoryEvent(
                                EVENT_TYPES.SCALE,
                                EVENT_SUBTYPES.SCALE_DOMAIN_FILTER,
                                varScale.id,
                                "zoom",
                                [s2[0], s2[1]]
                            ));
                        }
                    }
                } else if(varScale instanceof CategoricalScale) {
                    brushed = () => {
                        if (!d3.event.sourceEvent) return;
                        let s = d3.event.selection || scaleZoomedOut.range().slice();
                        let eachBand = width / varScaleDomain.length;
                        let startIndex = Math.floor((s[0] / eachBand));
                        let endIndex = Math.ceil((s[1] / eachBand));
                        varScale.zoom(startIndex, endIndex);
                        if(stack) {
                            stack.push(new HistoryEvent(
                                EVENT_TYPES.SCALE,
                                EVENT_SUBTYPES.SCALE_DOMAIN_FILTER,
                                varScale.id,
                                "zoom",
                                [startIndex, endIndex]
                            ));
                        }
                    }
                }
                let brushExtent;
                if(side === SIDES.top) {
                    brushExtent = [[0, -axisContainerSize-betweenAxisMargin], [width, 0]];
                } else if(side === SIDES.bottom) {
                    brushExtent = [[0, 0], [width, axisContainerSize+betweenAxisMargin]];
                }
                brush = d3.brushX()
                    .extent(brushExtent)
                    .on("end." + id, brushed);
            }

            if(varScale instanceof ContinuousScale) {
                let brushMoveDomain;
                if(orientation === ORIENTATIONS.vertical) {
                    brushMoveDomain = scaleZoomedIn.domain().slice().reverse();
                } else if(orientation === ORIENTATIONS.horizontal) {
                    brushMoveDomain = scaleZoomedIn.domain().slice();
                }
                let brushMoveRange = brushMoveDomain.map(scaleZoomedOut);
                containerZoomedOut.append("g")
                    .attr("class", "brush")
                    .call(brush)
                    .call(brush.move, brushMoveRange);
            } else if(varScale instanceof CategoricalScale) {
                // Only allow "moving" of the brush if all domainFiltered elements are consecutive/no gaps between
                let hasGaps = false;
                let domain = varScaleDomain;
                let domainFiltered = varScaleDomainFiltered;
                let currDomainIndex = null;
                for(let domainFilteredElement of domainFiltered) {
                    let elementIndex = domain.indexOf(domainFilteredElement);
                    if(elementIndex === -1) {
                        hasGaps = true; // stop if encounter any elements of filteredDomain that are not found in domain
                        break;
                    }
                    if(currDomainIndex === null) {
                        currDomainIndex = elementIndex;
                    } else if(elementIndex - currDomainIndex > 1) {
                        hasGaps = true;
                        break;
                    }
                    currDomainIndex = elementIndex;
                }

                if(hasGaps) {
                    // Do not allow "moving"
                    containerZoomedOut.append("g")
                        .attr("class", "brush")
                        .call(brush);
                } else {
                    // No gaps, allow "moving"
                    let eachBand;
                    if(orientation === ORIENTATIONS.horizontal) {
                        eachBand = width / varScaleDomain.length;
                    } else if(orientation === ORIENTATIONS.vertical) {
                        eachBand = height / varScaleDomain.length;
                    }
                    
                    let brushMoveRange = [scaleZoomedOut(domainFiltered[0]), scaleZoomedOut(domainFiltered[domainFiltered.length - 1]) + eachBand];
                    containerZoomedOut.append("g")
                        .attr("class", "brush")
                        .call(brush)
                        .call(brush.move, brushMoveRange);
                }
            }
            


        } // end if not disable brushing
        
        /*
            * Axis label text
            */

        const containerLabel = container.append("g")
                .attr("class", "axis-label")
                .attr("transform", "translate(" + zoomedOutTranslateX + "," + zoomedOutTranslateY + ")");
        
        const labelText = containerLabel.append("text")
            .style("text-anchor", "middle")
            .style("font-family", "Avenir")
            .style("font-size", "16px")
            .text(varScale.name);

        let labelTextBbox;
        try {
            labelTextBbox = labelText.node().getBBox();
            if(d3Node) {
                throw new Error("no bbox, use catch block");
            }
        } catch(e) {
            if(orientation === ORIENTATIONS.horizontal) {
                labelTextBbox = {
                    height: height / 2,
                    width: 0
                };
            } else if(orientation === ORIENTATIONS.vertical) {
                labelTextBbox = {
                    height: height / 2,
                    width: 0
                };
            }
        }

        if(disableBrushing) {
            axisBboxZoomedOut = { width: 0, height: 0 };
        }

        let labelX, labelY, labelRotate;
        if(side === SIDES.left) {
            labelY = -((labelTextBbox.height / 3));
            labelX = -(height / 2);
            labelRotate = -90;
        } else if(side === SIDES.bottom) {
            labelX = (width / 2);
            labelY = (axisBboxZoomedOut.height + (labelTextBbox.height / 2) + (betweenAxisMargin * 2));
            labelRotate = 0;
        } else if(side === SIDES.top) {
            labelX = (width / 2);
            labelY = -(axisBboxZoomedOut.height + (labelTextBbox.height / 2));
            labelRotate = 0;
        } else if(side === SIDES.right) {
            labelY = -(axisBboxZoomedOut.width + (labelTextBbox.height / 2));
            labelX = (height / 2);
            labelRotate = 90;
        }

        labelText
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("transform", "rotate(" + labelRotate + ")");
        
        if(!showLabel) {
            labelText.attr("fill-opacity", 0);
        }

    }, [width, height, variableScale, id]);

    useEffect(() => {
        draw(svgRef.current, null, {});
    }, [draw, iteration]);
    
    return (
        <StyledAxis
            width={width}
            height={height}
            top={top}
            left={left}
        >
            <svg
                ref={svgRef}
                width={width}
                height={height}
            />
        </StyledAxis>
    );
}

const mapStateToProps = (state, ownProps) => ({
    xScale: state.scales[ownProps.x],
    yScale: state.scales[ownProps.y],
});

export default connect(mapStateToProps, null)(Axis);



