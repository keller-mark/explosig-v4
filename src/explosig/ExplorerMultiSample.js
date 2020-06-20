import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux'
import styled from "styled-components";
import { readTsv, selectRows, signatureEstimationQP } from "../signature-utils";
import { DatasetContainer, CategoricalScale } from "../rctplotlib";
import { MUT_TYPES, CAT_TYPES } from './utils/constants';
import { datasetsSlice, scalesSlice } from './utils/slices';
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

const exposuresDataset = new DatasetContainer({
    id: "TCGA-LUAD_LUAD_mc3.v0.2.8.WXS.SBS-96.exposures",
    name: "TCGA-LUAD_LUAD_mc3.v0.2.8 WXS SBS-96 Exposures",
    data: exposuresPromise,
});

const sampleIdScale = new CategoricalScale({
    id: "TCGA-LUAD_LUAD_mc3.v0.2.8.WXS.SBS-96.sampleId",
    name: "Sample",
    domain: mutationDataPromise.then(d => d.index)
});

const signatureScale = new CategoricalScale({
    id: "LUAD.SBS-96.signatures",
    name: "SBS-96 Signature",
    domain: ["1", "2", "4", "5", "6", "13", "17"]
});

function ExplorerMultiSample(props) {
    const {
        setDataset,
        setScale,
        scales,
        datasets,
    } = props;

    useEffect(() => {
        setDataset({ id: "TCGA-LUAD_LUAD_mc3.v0.2.8.WXS.SBS-96.exposures", dataset: exposuresDataset });
        setScale({ id: "TCGA-LUAD_LUAD_mc3.v0.2.8.WXS.SBS-96.sampleId", scale: sampleIdScale });
        setScale({ id: "LUAD.SBS-96.signatures", scale: signatureScale });
    }, []);

    useEffect(() => {
        console.log(datasets);
        console.log(scales);
    }, [datasets, scales]);

    return (
        <div>
           MultiSample
        </div>
    );
}

const mapStateToProps = (state, ownProps) => ({
    datasets: state.datasets,
    scales: state.scales,
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    setDataset: dataset => dispatch(setDataset(dataset)),
    setScale: scale => dispatch(setScale(scale)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ExplorerMultiSample);