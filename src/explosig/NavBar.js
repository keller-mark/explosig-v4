import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import ConfigModal from './ConfigModal';


const StyledNavBar = styled("div")`
    height: 49px;
    width: 100%;
    background-color: #648381;
    padding: 0;
    position: relative;
`;

const StyledNavButton = styled("button")`
    background-color: #e4fde1;
    color: #2c3e50;
    border: 0;
    padding: .3rem;
    border-radius: .2rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    margin: 0 .5rem;
    font-size: 16px;
`;

const StyledLink = styled("a")`
    text-decoration: none;
    color: #fff;
    font-size: 1.5rem;
    margin: 0 1rem;
    position: relative;
    top: 7px;
`;

const StyledRightButtonGroup = styled("div")`
    position: absolute;
    right: 0;
    top: 0;
    margin: 9px .5rem;
`;

export default function NavBar() {

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    return (
        <StyledNavBar>
            <StyledLink href="/">ExploSig</StyledLink>
            <StyledRightButtonGroup>
                <StyledNavButton onClick={() => setIsConfigOpen(true)}>
                    Configure
                </StyledNavButton>
            </StyledRightButtonGroup>
            <ConfigModal open={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
        </StyledNavBar>
    );
}