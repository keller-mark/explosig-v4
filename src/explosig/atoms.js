import fromEntries from "object.fromentries";

import { MUT_TYPES, CAT_TYPES } from './constants';
import { createCategoricalScale, createContinuousScale } from './scales';

export const mutTypeScaleAtoms = createCategoricalScale({
    id: "mutType",
    name: "Mutation Type",
    domain: MUT_TYPES,
});

export const catTypeScaleAtoms = createCategoricalScale({
  id: "catType",
  name: "Category Type",
  domain: CAT_TYPES,
});

export const projectsScaleAtoms = createCategoricalScale({
  id: "projId",
  name: "Study",
  domain: [],
});

export const samplesScaleAtoms = createCategoricalScale({
  id: "sampleId",
  name: "Sample",
  domain: [],
});

export const samplesMetaVariableScaleAtoms = createCategoricalScale({
  id: "samplesMetaVariable",
  name: "",
  domain: ["Study"],
});

export const mutCountScaleAtoms = createContinuousScale({
  id: "mutCount",
  name: "Mutation Count",
  domain: [0, Infinity],
});


export const mutCountSumScaleAtoms = createContinuousScale({
  id: "mutCountSum",
  name: "Mutation Count",
  domain: [0, Infinity],
});