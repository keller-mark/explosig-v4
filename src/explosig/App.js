import React, { useState, useEffect, useRef } from 'react';
import { useRecoilState } from "recoil";
import fromEntries from "object.fromentries";
import styled from "styled-components";
import { readTsv, selectRows, signatureEstimationQP } from "../signature-utils/index.js";
import { projectsScaleAtoms, mutTypeScaleAtoms, catTypeScaleAtoms } from "./atoms";
import { MUT_TYPES, CAT_TYPES } from './constants';
import { createCategoricalScale, createContinuousScale } from './scales';
import Explorer from './Explorer';


const StyledApp = styled("div")`
    font-size: 48px;
`;

export default function App() {
    const [mutationData, setMutationData] = useState();
    const [signatureData, setSignatureData] = useState();
    const [activeSignatureData, setActiveSignatureData] = useState();

    const [projectsScaleDomain, setProjectsScaleDomain] = useRecoilState(projectsScaleAtoms.domain);
    const [mutTypeScaleDomain, setMutTypeScaleDomain] = useRecoilState(mutTypeScaleAtoms.domain);
    const [catTypeScaleDomain, setCatTypeScaleDomain] = useRecoilState(catTypeScaleAtoms.domain);

    const catTypeToSigScaleAtomsRef = useRef({});
    const catTypeToCatScaleAtomsRef = useRef({});
    const catTypeToSigProbScaleAtomsRef = useRef({});
    const catTypeToSigExposureScaleAtomsRef = useRef({});
    const catTypeToSigExposureSumScaleAtomsRef = useRef({});
    const catTypeToSigExposureNormalizedScaleAtomsRef = useRef({});
    const catTypeToSigExposureCosineSimilarityScaleAtomsRef = useRef({});

    useEffect(() => {
        catTypeToSigScaleAtomsRef.current = fromEntries(
            catTypeScaleDomain.map(catType => ([
              catType,
              createCategoricalScale({
                  id: `${catType}.sigs`,
                  name: `${catType} Signature`,
                  domain: [1, 2],
              })
            ]))
        );
        
        catTypeToCatScaleAtomsRef.current = fromEntries(
            catTypeScaleDomain.map(catType => ([
              catType,
              createCategoricalScale({
                id: `${catType}.cats`,
                name: `${catType} Mutation Category`,
                domain: []
              })
            ]))
        );
        
        catTypeToSigProbScaleAtomsRef.current = fromEntries(
            catTypeScaleDomain.map(catType => ([
              catType,
              createContinuousScale({
                id: `${catType}.sigProb`,
                name: "Probability",
                domain: [0, 0.2]
              })
            ]))
        );
          
        catTypeToSigExposureScaleAtomsRef.current = fromEntries(
            catTypeScaleDomain.map(catType => ([
              catType,
              createContinuousScale({
                id: `${catType}.sigExposure`,
                name: `${catType} Exposure`,
                domain: [0, Infinity]
              })
            ]))
        );
          
        catTypeToSigExposureSumScaleAtomsRef.current = fromEntries(
            catTypeScaleDomain.map(catType => ([
              catType,
              createContinuousScale({
                id: `${catType}.sigExposureSum`,
                name: `${catType} Exposure`,
                domain: [0, Infinity]
              })
            ]))
        );
          
        catTypeToSigExposureNormalizedScaleAtomsRef.current = fromEntries(
            catTypeScaleDomain.map(catType => ([
              catType,
              createContinuousScale({
                id: `${catType}.sigExposureNormalized`,
                name: `${catType} Normalized Exposure`,
                domain: [0.0, 1.0]
              })
            ]))
        );
          
        catTypeToSigExposureCosineSimilarityScaleAtomsRef.current = fromEntries(
            catTypeScaleDomain.map(catType => ([
              catType,
              createContinuousScale({
                id: `${catType}.sigExposureCosineSimilarity`,
                name: `${catType} Cos. Sim.`,
                domain: [0.0, 1.0]
              })
            ]))
        );
          
    }, [catTypeScaleDomain])


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

            setProjectsScaleDomain(["TCGA-LUAD_LUAD_mc3.v0.2.8"]);
        }
    }, [mutationData, activeSignatureData]);

    return (
        <StyledApp>
            <Explorer
                projectsScaleAtoms={projectsScaleAtoms}
                mutTypeScaleAtoms={mutTypeScaleAtoms}
                catTypeScaleAtoms={catTypeScaleAtoms}
                catTypeToSigScaleAtoms={catTypeToSigScaleAtomsRef.current}
            />
        </StyledApp>
    );
}