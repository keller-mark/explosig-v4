import range from "lodash/range";
import { solveQP } from "../../quadprog/index.js";
import { normalizeRows, transpose, shape, selectColumns } from '../df.js';
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
    const orderedM = selectColumns(origM, origP.columns);

    // Normalize M and transpose to match the SignatureEstimation package.
    const M = transpose(normalizeRows(orderedM));
    
    // Normalize P and transpose.
    const P = transpose(normalizeRows(origP));

    console.log(P.data);
    
    // K = # of signatures.
    const K = shape(P)[1];
    // N = # of samples.
    const N = shape(M)[1];
    
    // G = matrix appearing in the quad prog objective function.
    // Shape (n, n)
    const G = dot(transpose(P).data, P.data);
    console.log("G length", G.length, G[0].length);
    
    // C = matrix constraints under which we want to minimize the quad prog objective function.
    // Shape (n,m)
    const C = hstack(ones(K, 1), eye(K));
    console.log("C length", C.length, C[0].length);
    
    // b = vector containing the values of b_0.
    // Shape (m,)
    const b = [1, ...range(K).map(i => 0)];
    console.log("b length", b.length);
    
    // d = vector appearing in the quad prog objective function as a^T.
    // Shape (n,)
    const D = dot(transpose(M).data, P.data);
    console.log("d length", D[0].length);


    // Solve each quadratic programming problem.
    let exposures = D.map(d => {
        const { solution } = solveQP(G, d, C, b, 1);
        return solution;
    });
    
    // Some exposure values may be negative due to numerical issues,
    // but very close to zero. Change these negative values to zero and renormalize.
    exposures = exposures.map(row => row.map(val => (val < 0 ? 0 : val)));
    
    let exposuresDf = { data: exposures, index: origM.index, columns: origP.index };
    exposuresDf = normalizeRows(exposuresDf);
    
    return exposuresDf;
}