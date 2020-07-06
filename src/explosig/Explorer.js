import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import Split from 'react-split';
import { MUT_TYPES, CAT_TYPES } from './utils/categories';
import ExplorerMultiSample from './ExplorerMultiSample';

const StyledExplorer = styled("div")`
    
`;

const StyledSplit = styled(Split)`
    width: 100%;

    .gutter {
        float: left;
        height: calc(100vh - 49px - 24px);
        background-color: white;
        background-repeat: no-repeat;
        background-position: 50%;

        transition: background-color 0.5s ease;
        &:hover {
            background-color: #eee;
        }

        &.gutter-horizontal {
            cursor: col-resize;
    
            .gutter-inner {
                height: calc(100vh - 49px - 24px);
                width: 1px;
                background-color: silver;
                position: relative;
                left: 5px;
            }
        }
    }
`;

const StyledPane = styled("div")`
    float: left;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    height: calc(100vh - 49px - 24px);
`;

export default function Explorer(props) {
    const {
      
    } = props;
    
    return (
        <StyledExplorer>
            <StyledSplit
                sizes={[45, 45, 10]}
                minSize={100}
                gutterSize={10}
                snapOffset={0}
                direction="horizontal"
                gutter={(index, direction) => {
                    const gutter = document.createElement('div');
                    gutter.className = `gutter gutter-${direction}`;
                    const gutterInner = document.createElement('div');
                    gutterInner.className = `gutter-inner`;
                    gutter.appendChild(gutterInner);
                    return gutter;
                }}
                onDragEnd={() => {
                    window.dispatchEvent(new Event('resize'));
                }}
            >
                <StyledPane>
                    Overview
                </StyledPane>
                <StyledPane>
                    <ExplorerMultiSample />
                </StyledPane>
                <StyledPane>
                    Legends
                </StyledPane>
            </StyledSplit>
        </StyledExplorer>
    );
}