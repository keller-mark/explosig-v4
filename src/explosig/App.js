import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { MUT_TYPES, CAT_TYPES } from './utils/constants';
import Explorer from './Explorer';
import NavBar from './NavBar';

const StyledApp = styled("div")`
    font-size: 28px;
`;

export default function App() {



    return (
        <StyledApp>
            <NavBar />
            <Explorer
               
            />
        </StyledApp>
    );
}