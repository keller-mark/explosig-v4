import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import styled from "styled-components";
import Modal from './Modal';
import { configSlice } from './utils/slices.js';
import PickMutTypes from './PickMutTypes';
import PickSamples from './PickSamples';
const { setCatTypes, setProjects, setSignaturesByCatType, setGenesByGeneMetric, setClinicalVariables } = configSlice.actions;


const StyledConfigModal = styled.div`
    display: grid;
    grid-template-rows: 1fr auto;
`;

const StyledConfigModalTop = styled.div`
    margin-left: 0.5rem;
    margin-top: 0.3rem;
    display: inline;
    h3 {
        font-size: 18px;
        display: inline;
        padding: 0;
        margin: 0;
    }
`;

const StyledButtonRow = styled.div`
    display: inline;
`;

const StyledButton = styled.button`
    background-color: #e4fde1;
    color: #2c3e50;
    border: 1px solid #2c3e50;
    padding: .2rem;
    border-radius: .2rem;
    cursor: pointer;
    margin: .5rem .5rem;
    font-size: 14px;
    opacity: ${(props) => (props.active ? 1 : 0.4)};
`;

const StyledConfigModalInner = styled.div`
    
`;

const PANEL = Object.freeze({
    mutTypes: 1,
    samples: 2,
    signatures: 3,
    genes: 4,
    clinical: 5
});


function ConfigModal(props) {
    const {
        open,
        onClose,
    } = props;

    const [panel, setPanel] = useState(PANEL.samples);

    return (
        <Modal
            open={true}
            onClose={onClose}
        >
            <StyledConfigModal>
                <StyledConfigModalTop>
                    <h3>Configure</h3>
                    <StyledButtonRow>
                        <StyledButton active={panel === PANEL.mutTypes} onClick={() => setPanel(PANEL.mutTypes)}>Mutation Types</StyledButton>
                        <StyledButton active={panel === PANEL.samples} onClick={() => setPanel(PANEL.samples)}>Sample Cohorts</StyledButton>
                        <StyledButton active={panel === PANEL.signatures} onClick={() => setPanel(PANEL.signatures)}>Signatures</StyledButton>
                        <StyledButton active={panel === PANEL.genes} onClick={() => setPanel(PANEL.genes)}>Genes</StyledButton>
                        <StyledButton active={panel === PANEL.clinical} onClick={() => setPanel(PANEL.clinical)}>Clinical</StyledButton>
                    </StyledButtonRow>
                </StyledConfigModalTop>
                <StyledConfigModalInner>
                    {panel === PANEL.mutTypes && (<PickMutTypes />)}
                    {panel === PANEL.samples && (<PickSamples />)}
                </StyledConfigModalInner>
            </StyledConfigModal>
        </Modal>
    );
}

const mapStateToProps = (state) => ({
    catTypes: state.config.catTypes,
    projects: state.config.projects,
    catTypeToSignatures: state.config.catTypeToSignatures,
    geneMetricToGenes: state.config.geneMetricToGenes,
    clinicalVariables: state.config.clinicalVariables,
});

const mapDispatchToProps = (dispatch) => ({
    setCatTypes: catTypes => dispatch(setCatTypes(catTypes)),
    setProjects: projects => dispatch(setProjects(projects)),
    setSignaturesByCatType: sigsByCatType => dispatch(setSignaturesByCatType(sigsByCatType)),
    setGenesByGeneMetric: genesByMetric => dispatch(setGenesByGeneMetric(genesByMetric)),
    setClinicalVariables: clinicalVariables => dispatch(setClinicalVariables(clinicalVariables)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfigModal);