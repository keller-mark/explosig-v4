import React, { useEffect } from 'react';
import { useRecoilState } from "recoil";
import fromEntries from "object.fromentries";
import { MUT_TYPES } from './constants';
import { createCategoricalScale, createContinuousScale } from './scales';

function SigNames(props) {
    const { catType, sigScaleAtoms } = props;
    const [sigScaleDomain, setSigScaleDomain] = useRecoilState(sigScaleAtoms.domain);
    return (
        <ul>
            {sigScaleDomain.map(d => (
                <li key={d}>{catType} {d}</li>
            ))}
        </ul>
    );
}


export default function Explorer(props) {
    const {
        projectsScaleAtoms,
        mutTypeScaleAtoms,
        catTypeScaleAtoms,
        catTypeToSigScaleAtoms
    } = props;

    const [projectsScaleDomain, setProjectsScaleDomain] = useRecoilState(projectsScaleAtoms.domain);
    const [mutTypeScaleDomain, setMutTypeScaleDomain] = useRecoilState(mutTypeScaleAtoms.domain);
    const [catTypeScaleDomain, setCatTypeScaleDomain] = useRecoilState(catTypeScaleAtoms.domain);

    return (
        <div>
            <ul>
                {projectsScaleDomain.map((d) => (
                    <li key={d}>{d}</li>
                ))}
            </ul>
            <ul>
                {mutTypeScaleDomain.map((d) => (
                    <li key={d}>{d}</li>
                ))}
            </ul>
            {Object.entries(catTypeToSigScaleAtoms).map(([catType, sigScaleAtoms]) => (
                <SigNames key={catType} catType={catType} sigScaleAtoms={sigScaleAtoms} />
            ))}
        </div>
    )

}