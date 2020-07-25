import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import fromEntries from 'object.fromentries';
import styled from "styled-components";
import { dataListingPromise } from './utils/constants'; // TODO: temporary
import { configSlice } from './utils/slices.js';
import { Dataset, PlotContainer, CategoricalScale, HeatmapPlot, ContinuousScale, Axis } from "../rctplotlib";


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
    const [sourceFilter, setSourceFilter] = useState(DEFAULT_SOURCE);

    useEffect(() => {
        dataListingPromise.then((dataListing) => {
            setSignatures(dataListing.signatures);
            setSignatureSources(dataListing.signatureSources);
        });
    });

    function handleSourceFilterSelect(event) {
        setSourceFilter(event.target.value);
    }

    const xScale = new CategoricalScale({
        id: "cancerType",
        name: "Cancer Type",
        domain: ["ALL", "AML", "LUSC"]
    });
    const yScale = new CategoricalScale({
        id: "signature",
        name: "Signature",
        domain: ["COSMIC 1", "COSMIC 2", "COSMIC 3"]
    });
    const colorScale = new CategoricalScale({
        id: "active",
        name: "Active",
        domain: ["True", "False"]
    });
    const dataDataset = new Dataset({
        id: "signaturesByCancerType",
        name: "Signatures by Cancer Type",
        data: [{
            "signature": "COSMIC 1",
            "cancerType": "ALL",
            "active": "True",
        }]
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
            <StyledSignatureMatrix>
                <PlotContainer
                    width={500}
                    height={500}
                    marginLeft={160}
                    marginTop={80}
                >
                    <Axis
                        id="cancerType"
                        slot="axisTop"
                        x="cancerType"
                        xScale={xScale}
                        tickRotation={-90}
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
                    />
                </PlotContainer>
            </StyledSignatureMatrix>
        </StyledContainer>
    );
}

export default PickSignatures;