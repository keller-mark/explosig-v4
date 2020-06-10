import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";


const StyledNavBar = styled("div")`
    font-size: 28px;
    height: 49px;
`;

const StyledNavButton = styled("button")`

`;

export default function NavBar() {
    return (
        <StyledNavBar>
            <StyledNavButton>Samples</StyledNavButton>
            <StyledNavButton>Signatures</StyledNavButton>
            <StyledNavButton>Genes</StyledNavButton>
            <StyledNavButton>Clinical</StyledNavButton>
        </StyledNavBar>
    );
}