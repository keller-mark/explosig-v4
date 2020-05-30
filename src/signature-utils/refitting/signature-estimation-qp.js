import range from "lodash/range";
import { solveQP } from "quadprog";
import { normalizeRows, transpose, shape } from '../df.js';
import { dot, hstack, ones, eye } from '../matrix.js';

/**
 * Estimate exposures with quadratic programming.
 * Adapted from
 * https://www.ncbi.nlm.nih.gov/CBBresearch/Przytycka/software/signatureestimation/SignatureEstimation.pdf
 * and
 * https://github.com/lrgr/signature-estimation-py/blob/master/signature_estimation.py
 * @param {number[][]} M (N x L) mutation count matrix where N = # of samples, L = # of categories.
 * @param {number[][]} P (K x L) mutation signature matrix where K = # of signatures.
 * @returns {number[][]} E (N x K) exposure matrix.
 */
export default function signatureEstimationQP(origM, origP) {

    // Reorder the columns of the mutations matrix to match the ordering of the signatures columns
    const orderedM = reorderColumns(origM, origP.columns);

    // Normalize M and transpose to match the SignatureEstimation package.
    const M = transpose(normalizeRows(orderedM));
    
    // Normalize P and transpose.
    const P = transpose(normalizeRows(origP));
    
    // K = # of signatures.
    const K = shape(P)[1];
    // N = # of samples.
    const N = shape(M)[1];
    
    // G = matrix appearing in the quad prog objective function.
    const G = dot(transpose(P).data, P.data);
    
    // C = matrix constraints under which we want to minimize the quad prog objective function.
    const C = hstack(ones(K, 1), eye(K));
    
    // b = vector containing the values of b_0.
    const b = [1, ...range(K).map(i => 0)];
    
    // d = vector appearing in the quad prog objective function as a^T.
    const D = dot(transpose(M).data, P.data);
    
    // Solve each quadratic programming problem.
    let exposures = D.map(d => { return solveQP(G, d, C, b, 1).solution; });
    
    return exposures;
    
    // Some exposure values may be negative due to numerical issues,
    // but very close to zero. Change these negative values to zero and renormalize.
    exposures = exposures.map(row => row.map(val => (val < 0 ? 0 : val)));
    
    let exposuresDf = { data: exposures, index: origM.index, columns: origP.index };
    exposuresDf = normalizeRows(exposuresDf);
    
    return exposuresDf;
}