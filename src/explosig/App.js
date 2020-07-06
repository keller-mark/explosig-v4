import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import styled from "styled-components";
import Explorer from './Explorer';
import NavBar from './NavBar';

const StyledApp = styled("div")`

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