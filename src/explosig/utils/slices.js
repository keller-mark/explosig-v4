import { createSlice } from '@reduxjs/toolkit';

export const configSlice = createSlice({
    name: 'config',
    initialState: {
        catTypes: [],
        sampleCohorts: [],
        catTypeToSignatures: {},
        geneMetricToGenes: {},
        clinicalVariables: [],
    },
    reducers: {
        setCatTypes: (state, action) => ({
            ...state,
            catTypes: action.payload,
        }),
        setSampleCohorts: (state, action) => ({
            ...state,
            sampleCohorts: action.payload,
        }),
        setSignaturesByCatType: (state, action) => ({
            ...state,
            catTypeToSignatures: {
                ...state.catTypeToSignatures,
                [action.payload.catType]: action.payload.signatures,
            }
        }),
        setGenesByGeneMetric: (state, action) => ({
            ...state,
            geneMetricToGenes: {
                ...state.geneMetricToGenes,
                [action.payload.geneMetric]: action.payload.genes,
            }
        }),
        setClinicalVariables: (state, action) => ({
            ...state,
            clinicalVariables: action.payload,
        })
    }
});

export const datasetsSlice = createSlice({
    name: 'datasets',
    initialState: {},
    reducers: {
        setDataset: (state, action) => ({
            ...state,
            [action.payload.id]: action.payload.dataset,
        }),
    }
});

export const scalesSlice = createSlice({
    name: 'scales',
    initialState: {},
    reducers: {
        setScale: (state, action) => ({
            ...state,
            [action.payload.id]: action.payload.scale,
        }),
    }
});

//export const { addScale, addDataset } = dataSlice.actions;
//export default dataSlice.reducer;