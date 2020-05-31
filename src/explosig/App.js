import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { readTsv, filterRows, signatureEstimationQP } from "../signature-utils/index.js";

const StyledApp = styled("div")`
    font-size: 48px;
`;

export default function App() {
    const [mutationData, setMutationData] = useState();
    const [signatureData, setSignatureData] = useState();
    const [activeSignatureData, setActiveSignatureData] = useState();

    useEffect(() => {
        let isMounted = true;

        readTsv(fetch("/counts.TCGA-LUAD_LUAD_mc3.v0.2.8.WXS.SBS-96.tsv"))
            .then(d => {
                if(isMounted) {
                    setMutationData(d);
                }
            });
        
        readTsv(fetch("/COSMIC-signatures.SBS-96.tsv"))
            .then(d => {
                if(isMounted) {
                    setSignatureData(d);
                    setActiveSignatureData(filterRows(d, ["1", "2", "4", "5", "6", "13", "17"]));
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if(mutationData && signatureData && activeSignatureData) {
            console.log(mutationData);
            console.log(signatureData);
            console.log(activeSignatureData);
            const exposuresData = signatureEstimationQP(mutationData, activeSignatureData);
            console.log(exposuresData);
        }
    }, [mutationData, activeSignatureData]);

    return (
        <StyledApp>
            Hi
        </StyledApp>
    );
}