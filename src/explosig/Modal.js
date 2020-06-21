import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";


const StyledModalBackground = styled("div")`
    z-index: 199;
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: black;
    opacity: 0.4;
`;

const StyledModal = styled("div")`
    z-index: 200;
    top: 10vh;
    left: 10%;
    height: 80vh;
    width: 80%;
    position: fixed;
    background-color: white;
`;

const StyledModalInner = styled("div")`
    box-sizing: border-box;
    height: 100%;
    overflow-y: scroll;
    .modal-close {
        position: absolute;
        right: 1.5rem;
        top: 1rem;
        cursor: pointer;
        user-select: none;
    }
    h3 {
        margin-left: 1.5rem;
    }
`;

export default function Modal(props) {
    const {
        open = false,
        onClose,
        title = null,
        children,
    } = props;

    useEffect(() => {
        function handleKeydown(e) {
            console.log(e);
            if(e.key === 'Escape') {
                onClose();
            }
        }
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [onClose]);

    return (
        open ? (
            <>
                <StyledModalBackground onClick={onClose} />
                <StyledModal>
                    <StyledModalInner>
                        <span className="modal-close" onClick={onClose}>Close</span>
                        {title ? (<h3>{title}</h3>) : null}
                        <div>
                            {children}
                        </div>
                    </StyledModalInner>
                </StyledModal>
            </>
        ) : null
    );
}