import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import fromEntries from 'object.fromentries';
import styled from "styled-components";
import { dataListingPromise } from './utils/constants'; // TODO: temporary
import { configSlice } from './utils/slices.js';
const { setSampleCohorts } = configSlice.actions;

const StyledContainer = styled.div`
    display: grid;
    grid-template: auto 1fr / auto 1fr;
    height: calc(80vh - 40px - 60px);
    width: 100%;
    padding: 0 0.5rem;
    box-sizing: border-box;
`;

const StyledOptions = styled.div`
    grid-column: 1 / 3;
    label {
        font-size: 15px;

    }
    margin: 4px 0;
`;

const StyledTissueTypeList = styled.ul`
    grid-column: 1 / 2;

    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow-y: scroll;
    li {
        background-color: #f1f6fe;
        border-bottom: 1px solid #dee9f1;
        padding: 5px 10px 5px 10px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
            background-color: #deeaf3;
        }
    }
`;

const StyledCohortList = styled.div`
    grid-column: 2 / 3;
    overflow-y: scroll;
    padding-left: 0.5rem;
`;

const StyledCohortsByTissueType = styled.div`
    h4 {
        padding: 0;
        margin: 0;
        display: block;
    }
`;

const StyledCohortItem = styled.div`
    label {
        font-size: 14px;
    }
`;

function PickSamples(props) {
    const {
        sampleCohorts: selectedSampleCohorts,
        setSampleCohorts: setSelectedSampleCohorts,
    } = props;

    const [tissueTypes, setTissueTypes] = useState([]);
    const [sampleCohorts, setSampleCohorts] = useState([]);
    const [sampleCohortSources, setSampleCohortSources] = useState([]);
    const [sourceFilter, setSourceFilter] = useState();

    useEffect(() => {
        dataListingPromise.then((dataListing) => {
            setTissueTypes(dataListing.tissueTypes
                .sort((a, b) => a.oncotreeName.localeCompare(b.oncotreeName))
            );
            setSampleCohorts(dataListing.sampleCohorts);
            setSampleCohortSources(dataListing.sampleCohortSources);
        });
    });

    return (
        <StyledContainer>
            <StyledOptions>
                <label>Filter cohorts by source&nbsp;</label>
                <select>
                    {sampleCohortSources.map(source => (
                        <option key={source} value={source}>{source}</option>
                    ))}
                </select>
            </StyledOptions>
            <StyledTissueTypeList>
                {tissueTypes.map(d => (
                    <li key={d.oncotreeCode} title={d.oncotreeCode}>{d.oncotreeName}</li>
                ))}
            </StyledTissueTypeList>
            <StyledCohortList>
                {tissueTypes.map(tissueType => (
                    <StyledCohortsByTissueType key={tissueType.oncotreeCode}>
                        <h4>{tissueType.oncotreeName}</h4>
                        {sampleCohorts
                            .filter(cohort => cohort.oncotreeTissueCode === tissueType.oncotreeCode)
                            .map(cohort => (
                                <StyledCohortItem key={cohort.id}>
                                    <label title={cohort.id}>
                                        <input type="checkbox" />
                                        {cohort.name}
                                    </label>
                                </StyledCohortItem>
                        ))}
                    </StyledCohortsByTissueType>
                ))}
            </StyledCohortList>
        </StyledContainer>
    );
}

const mapStateToProps = (state) => ({
    sampleCohorts: state.config.sampleCohorts,
});

const mapDispatchToProps = (dispatch) => ({
    setSampleCohorts: sampleCohorts => dispatch(setSampleCohorts(sampleCohorts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickSamples);