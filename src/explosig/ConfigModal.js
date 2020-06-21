import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import Modal from './Modal';

const StyledConfigModalInner = styled.div`

`;


function ConfigModal(props) {
    const {
        open,
        onClose,
    } = props;

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <StyledConfigModalInner>
                <button>Samples</button>
                <button>Signatures</button>
                <button>Genes</button>
                <button>Clinical</button>
            </StyledConfigModalInner>
        </Modal>
    );
}

export default ConfigModal;