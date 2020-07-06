import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import styled from "styled-components";
import fromEntries from "object.fromentries";
import { readTsv, selectRows, signatureEstimationQP } from "../signature-utils";
import { Dataset, Subplots, PlotContainer, CategoricalScale, StackedBarPlot, ContinuousScale, Axis } from "../rctplotlib";
import { useColumnSize } from './utils/hooks.js';
import { datasetsSlice, scalesSlice } from './utils/slices.js';
const { setDataset } = datasetsSlice.actions;
const { setScale } = scalesSlice.actions;


const mutationDataPromise = readTsv(fetch("/counts.TCGA-LUAD_LUAD_mc3.v0.2.8.WXS.SBS-96.tsv"));
        
const signatureDataPromise = readTsv(fetch("/COSMIC-signatures.SBS-96.tsv"));

const activeSignatureDataPromise = signatureDataPromise.then(d => {
    return Promise.resolve(selectRows(d, ["1", "2", "4", "5", "6", "13", "17"]));
});

const exposuresPromise = Promise.all([mutationDataPromise, activeSignatureDataPromise]).then(([md, asd]) => {
    return Promise.resolve(signatureEstimationQP(md, asd))
});

const exposuresDataset = new Dataset({
    id: "exposures.SBS-96",
    name: "TCGA-LUAD_LUAD_mc3.v0.2.8 WXS SBS-96 Exposures",
    data: exposuresPromise.then(df => {
        const arr = df.data.map((row, i) => fromEntries([...row.map((el, j) => [df.columns[j], el]), ["sampleId", df.index[i]]]));
        return Promise.resolve(arr);
    }),
});

const sampleIdScale = new CategoricalScale({
    id: "sampleId",
    name: "Sample",
    domain: mutationDataPromise.then(d => d.index)
});

const signatureScale = new CategoricalScale({
    id: "LUAD.SBS-96.signatures",
    name: "SBS-96 Signature",
    domain: ["1", "2", "4", "5", "6", "13", "17"]
});

const exposuresScale = new ContinuousScale({
    id: "SBS-96.exposures",
    name: "SBS-96 Exposures",
    domain: [0, 1],
})

function ExplorerMultiSample(props) {
    const {
        setDataset,
        setScale,
    } = props;

    const [columnWidth, columnHeight, columnRef] = useColumnSize();

    useEffect(() => {
        setDataset({ id: "exposures.SBS-96", dataset: exposuresDataset });
        setScale({ id: "sampleId", scale: sampleIdScale });
        setScale({ id: "LUAD.SBS-96.signatures", scale: signatureScale });
        setScale({ id: "SBS-96.exposures", scale: exposuresScale });
    }, []);

    return (
        <div ref={columnRef}>
           MultiSample

           <button onClick={() => sampleIdScale.setDomainFiltered(sampleIdScale.domain.slice(0, 10))}>Update signature domain</button>


            <PlotContainer
                width={columnWidth}
                height={500}
                marginLeft={100}
                marginBottom={250}
            >
                <Axis
                    id="SBS-96.LUAD.exposures-stacked-bar.axisLeft"
                    slot="axisLeft"
                    y="SBS-96.exposures"
                />
                <Axis
                    id="SBS-96.LUAD.exposures-stacked-bar.axisBottom"
                    slot="axisBottom"
                    x="sampleId"
                    tickRotation={-90}
                    maxCharacters={10}
                />
                <StackedBarPlot
                    id="SBS-96.LUAD.exposures-stacked-bar.plot"
                    slot="plot"
                    data="exposures.SBS-96"
                    x="sampleId"
                    y="SBS-96.exposures"
                    color="LUAD.SBS-96.signatures"
                />
            </PlotContainer>
        </div>
    );
}

const mapStateToProps = (state, ownProps) => ({

});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    setDataset: dataset => dispatch(setDataset(dataset)),
    setScale: scale => dispatch(setScale(scale)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ExplorerMultiSample);