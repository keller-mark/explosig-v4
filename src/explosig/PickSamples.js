import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import fromEntries from 'object.fromentries';
import styled from "styled-components";
import { dataListingPromise } from './utils/constants'; // TODO: temporary
import { configSlice } from './utils/slices.js';
const { setSampleCohorts } = configSlice.actions;

const StyledInnerModal = styled.div`
    padding: 0 0.5rem;
`;

const StyledTissueTypeList = styled.div`

    ul {
        list-style-type: none;
        padding-left: 0;
        li {
            background-color: #f1f6fe;
            border-bottom: 1px solid #dee9f1;

            &:hover {
                background-color: #deeaf3;
            }
        }
    }
`;

function PickSamples(props) {
    const {
        sampleCohorts,
        setSampleCohorts,
    } = props;

    const [tissueTypes, setTissueTypes] = useState([]);

    useEffect(() => {
        dataListingPromise.then((dataListing) => {
            setTissueTypes(dataListing.tissueTypes);
        });
    });

    return (
        <StyledInnerModal>
            <StyledTissueTypeList>
                <ul>
                {tissueTypes.map(d => (
                    <li key={d.oncotreeCode}>{d.oncotreeName}</li>
                ))}
                </ul>
            </StyledTissueTypeList>
        </StyledInnerModal>
    );
}

const mapStateToProps = (state) => ({
    sampleCohorts: state.config.sampleCohorts,
});

const mapDispatchToProps = (dispatch) => ({
    setSampleCohorts: sampleCohorts => dispatch(setSampleCohorts(sampleCohorts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickSamples);