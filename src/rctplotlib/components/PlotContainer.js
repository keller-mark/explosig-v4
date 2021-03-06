import React, { Children, cloneElement, useRef, useCallback } from "react";
import styled from "styled-components";

const StyledPlotContainer = styled("div")`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    position: relative;
`;


export default function PlotContainer(props) {
    const {
        top = 0,
        left = 0,
        marginTop = 0,
        marginLeft = 0,
        marginRight = 0,
        marginBottom = 0,
        width = 0,
        height = 0,
        children,
    } = props;

    const plotHeight = height - marginTop - marginBottom;
    const plotWidth = width - marginLeft - marginRight;

    const slotToWidth = {
        plot: plotWidth,
        axisTop: plotWidth,
        axisLeft: marginLeft,
        axisRight: marginRight,
        axisBottom: plotWidth,
    };
    const slotToHeight = {
        plot: plotHeight,
        axisTop: marginTop,
        axisLeft: plotHeight,
        axisRight: plotHeight,
        axisBottom: marginBottom,
    };
    const slotToTop = {
        plot: top + marginTop,
        axisTop: top + 0,
        axisLeft: top + marginTop,
        axisRight: top + marginTop,
        axisBottom: top + marginTop + plotHeight,
    };
    const slotToLeft = {
        plot: left + marginLeft,
        axisTop: left + marginLeft,
        axisLeft: left + 0,
        axisRight: left + marginLeft + plotWidth,
        axisBottom: left + marginLeft,
    };
    const slotToSide = {
        plot: undefined,
        axisTop: "top",
        axisLeft: "left",
        axisRight: "right",
        axisBottom: "bottom",
    };

    return (
        <StyledPlotContainer
            width={width}
            height={height}
            top={top}
            left={left}
        >
            {Children.map(children, (child, i) => cloneElement(
                child,
                {
                    width: slotToWidth[child.props.slot],
                    height: slotToHeight[child.props.slot],
                    top: slotToTop[child.props.slot],
                    left: slotToLeft[child.props.slot],
                    side: slotToSide[child.props.slot],
                }
            ))}
        </StyledPlotContainer>
    );
}