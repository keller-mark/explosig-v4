import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import fromEntries from 'object.fromentries';
import styled from "styled-components";
import { dataListingPromise } from './utils/constants'; // TODO: temporary
import { useElementSize } from './utils/hooks.js';
import { configSlice } from './utils/slices.js';
import { Dataset, PlotContainer, CategoricalScale, HeatmapPlot, ContinuousScale, Axis } from "../rctplotlib";

const DEFAULT_CAT_TYPE = '*';
const DEFAULT_SOURCE = 'COSMIC';

const StyledContainer = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    height: calc(80vh - 40px - 60px);
    width: 100%;
    box-sizing: border-box;
`;

const StyledOptions = styled.div`
    margin: 6px 0;
    padding: 0 0.5rem;
    label {
        font-size: 15px;

    }
`;

const StyledSignatureMatrix = styled.div`
    overflow: scroll;
`;

function filterSignatures(signatures, sourceFilter) {
    return signatures
        .filter(sig => (sourceFilter === '*' ? true : sig.source === sourceFilter));
}

function PickSignatures(props) {
    const {
        catTypes: selectedCatTypes,
        sampleCohorts: selectedSampleCohorts,
        catTypeToSignatures: selectedCatTypeToSignatures,
        setCatTypeToSignatures: setSelectedCatTypeToSignatures,
    } = props;

    const [catTypeToSignatures, setCatTypeToSignatures] = useState({});
    const [signatureSources, setSignatureSources] = useState([]);
    const [signatures, setSignatures] = useState([]);
    const [catTypeFilter, setCatTypeFilter] = useState(DEFAULT_CAT_TYPE);
    const [sourceFilter, setSourceFilter] = useState(DEFAULT_SOURCE);
    const [cancerTypeMap, setCancerTypeMap] = useState([]);

    const [width, height, elRef] = useElementSize();

    useEffect(() => {
        dataListingPromise.then((dataListing) => {
            setSignatures(dataListing.signatures);
            setSignatureSources(dataListing.signatureSources);
            setCancerTypeMap(dataListing.cancerTypeMap);
        });
    });

    function handleSourceFilterSelect(event) {
        setSourceFilter(event.target.value);
    }


    const filteredSignatureNames = signatures
        .filter(s => (sourceFilter === '*' ? true : s.source === sourceFilter))
        .map(s => s.id);
    
    const filteredCancerTypeNames = Array.from(new Set(cancerTypeMap
        .filter(ct => (sourceFilter === '*' ? true : ct.source === sourceFilter))
        .map(ct => ct.cancerType)));
    
    const filteredData = cancerTypeMap
        .filter(ct => (sourceFilter === '*' ? true : ct.source === sourceFilter))
        .map(ct => ({ signature: ct.signature, cancerType: ct.cancerType, active: 1 }));

    const xScale = new CategoricalScale({
        id: "cancerType",
        name: "Cancer Type",
        domain: filteredCancerTypeNames
    });
    const yScale = new CategoricalScale({
        id: "signature",
        name: "Signature",
        domain: filteredSignatureNames
    });
    const colorScale = new CategoricalScale({
        id: "active",
        name: "Active",
        domain: [1, 0]
    });
    const dataDataset = new Dataset({
        id: "signaturesByCancerType",
        name: "Signatures by Cancer Type",
        data: filteredData
    })

    return (
        <StyledContainer>
            <StyledOptions>
                <label>Filter signatures by source&nbsp;
                    <select value={sourceFilter} onChange={handleSourceFilterSelect}>
                        <option value="*">*</option>
                        {signatureSources.map(source => (
                            <option key={source} value={source}>{source}</option>
                        ))}
                    </select>

                </label>
            </StyledOptions>
            <StyledSignatureMatrix ref={elRef}>
                <PlotContainer
                    width={width - 50}
                    height={filteredSignatureNames.length * 16}
                    marginLeft={160}
                    marginTop={150}
                >
                    <Axis
                        id="cancerType"
                        slot="axisTop"
                        x="cancerType"
                        xScale={xScale}
                        tickRotation={45}
                        maxCharacters={20}
                        enableBrushing={false}
                    />
                    <Axis
                        id="signature"
                        slot="axisLeft"
                        y="signature"
                        yScale={yScale}
                        enableBrushing={false}
                    />
                    <HeatmapPlot
                        id="signaturesByCancerType"
                        slot="plot"
                        data="signaturesByCancerType"
                        dataDataset={dataDataset}
                        x="cancerType"
                        xScale={xScale}
                        y="signature"
                        yScale={yScale}
                        color="active"
                        colorScale={colorScale}
                        rectMarginX={2}
                        rectMarginY={2}
                    />
                </PlotContainer>
            </StyledSignatureMatrix>
        </StyledContainer>
    );
}

export default PickSignatures;