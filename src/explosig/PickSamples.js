import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import fromEntries from 'object.fromentries';
import styled from "styled-components";
import { dataListingPromise } from './utils/constants'; // TODO: temporary
import { configSlice } from './utils/slices.js';

const DEFAULT_SOURCE = 'TCGA';

const StyledContainer = styled.div`
    display: grid;
    grid-template: auto 1fr / auto 1fr;
    height: calc(80vh - 40px - 60px);
    width: 100%;
    box-sizing: border-box;
`;

const StyledOptions = styled.div`
    grid-column: 1 / 3;
    margin: 6px 0;
    padding: 0 0.5rem;
    label {
        font-size: 15px;

    }
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
        padding: 0.5rem;
        font-size: 14px;
        cursor: pointer;
        position: relative;
        &:hover {
            background-color: #deeaf3;
        }

        span {
            padding: 0 10px;
            background-color: #dee9f1;
            right: 10px;
            position: absolute;
        }
    }
`;

const StyledCohortList = styled.div`
    grid-column: 2 / 3;
    overflow-y: scroll;
    padding-left: 0.5rem;
`;

const StyledCohortsByTissueType = styled.div`
    margin-bottom: 1rem;
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

function filterCohorts(cohorts, tissueType, sourceFilter) {
    return cohorts
        .filter(cohort => cohort.oncotreeTissueCode === tissueType.oncotreeCode)
        .filter(cohort => (sourceFilter === '*' ? true : cohort.source === sourceFilter));
}

function PickSamples(props) {
    const {
        sampleCohorts: selectedSampleCohorts,
        setSampleCohorts: setSelectedSampleCohorts,
    } = props;

    const [tissueTypes, setTissueTypes] = useState([]);
    const [sampleCohorts, setSampleCohorts] = useState([]);
    const [sampleCohortSources, setSampleCohortSources] = useState([]);
    const [sourceFilter, setSourceFilter] = useState(DEFAULT_SOURCE);

    useEffect(() => {
        dataListingPromise.then((dataListing) => {
            setTissueTypes(dataListing.tissueTypes
                .sort((a, b) => a.oncotreeName.localeCompare(b.oncotreeName))
            );
            setSampleCohorts(dataListing.sampleCohorts);
            setSampleCohortSources(dataListing.sampleCohortSources);
        });
    });

    function handleSourceFilterSelect(event) {
        setSourceFilter(event.target.value);
    }

    function handleCheckCohort(event) {
        const { checked, value } = event.target;
        if(checked) {
            setSelectedSampleCohorts(prev => ([...prev, value]));
        } else {
            setSelectedSampleCohorts(prev => prev.filter(d => d !== value));
        }
    }

    return (
        <StyledContainer>
            <StyledOptions>
                <label>Filter cohorts by source&nbsp;
                    <select value={sourceFilter} onChange={handleSourceFilterSelect}>
                        <option value="*">*</option>
                        {sampleCohortSources.map(source => (
                            <option key={source} value={source}>{source}</option>
                        ))}
                    </select>
                </label>
            </StyledOptions>
            <StyledTissueTypeList>
                {tissueTypes.map(tissueType => {
                    const matchingCohorts = filterCohorts(sampleCohorts, tissueType, sourceFilter);
                    return (matchingCohorts.length > 0
                        ? (<li key={tissueType.oncotreeCode} title={tissueType.oncotreeCode}>
                            {tissueType.oncotreeName}
                            <span>{matchingCohorts.length}</span>
                        </li>)
                        : null
                    );
                })}
            </StyledTissueTypeList>
            <StyledCohortList>
                {tissueTypes.map(tissueType => {
                    const matchingCohorts = filterCohorts(sampleCohorts, tissueType, sourceFilter);
                    return (matchingCohorts.length > 0 ?
                        (<StyledCohortsByTissueType key={tissueType.oncotreeCode}>
                            <h4>{tissueType.oncotreeName}</h4>
                            {matchingCohorts
                                .map(cohort => (
                                    <StyledCohortItem key={cohort.id}>
                                        <label title={cohort.id}>
                                            <input
                                                type="checkbox"
                                                onChange={handleCheckCohort}
                                                value={cohort.id}
                                                checked={selectedSampleCohorts.includes(cohort.id)}
                                            />
                                            {cohort.name}
                                        </label>
                                    </StyledCohortItem>
                            ))}
                        </StyledCohortsByTissueType>)
                        : null
                    );
                })}
            </StyledCohortList>
        </StyledContainer>
    );
}

export default PickSamples;