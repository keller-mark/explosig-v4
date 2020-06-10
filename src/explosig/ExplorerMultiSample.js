import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { readTsv, selectRows, signatureEstimationQP } from "../signature-utils";
import { MUT_TYPES, CAT_TYPES } from './utils/constants';



export default function ExplorerMultiSample(props) {
    const {
      
    } = props;
    
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
                    setActiveSignatureData(selectRows(d, ["1", "2", "4", "5", "6", "13", "17"]));
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if(mutationData && activeSignatureData) {
            console.log(mutationData);
            console.log(activeSignatureData);
            const exposuresData = signatureEstimationQP(mutationData, activeSignatureData);
            console.log(exposuresData);

        }
    }, [mutationData, activeSignatureData]);

    return (
        <div>
           MultiSample
        </div>
    );
}