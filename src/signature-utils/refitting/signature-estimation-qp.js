import range from "lodash/range";
import { solveQP } from "../../quadprog/index.js";
import * as df from '../df.js';
import * as mat from '../matrix.js';

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
    const orderedM = df.selectColumns(origM, origP.columns);

    // Normalize M and transpose to match the SignatureEstimation package.
    const M = df.transpose(df.normalizeRows(orderedM));
    
    // Normalize P and transpose.
    const P = df.transpose(df.normalizeRows(origP));
    
    // K = # of signatures.
    const K = df.shape(P)[1];
    // N = # of samples.
    const N = df.shape(M)[1];
    
    // G = matrix appearing in the quad prog objective function.
    // Shape (n, n)
    const G = df.dot(df.transpose(P), P).data;
    
    // C = matrix constraints under which we want to minimize the quad prog objective function.
    // Shape (n,m)
    const C = mat.hstack(mat.ones(K, 1), mat.eye(K));
    
    // b = vector containing the values of b_0.
    // Shape (m,)
    const b = [1, ...range(K).map(i => 0)];
    
    // d = vector appearing in the quad prog objective function as a^T.
    // Shape (n,)
    const D = df.dot(df.transpose(M), P).data;

    // Solve each quadratic programming problem.
    const exposuresData = D.map(d => {
        const { solution } = solveQP(G, d, C, b, 1);
        return solution;
    });

    // Some exposure values may be negative due to numerical issues,
    // but very close to zero. Change these negative values to zero and renormalize.
    const exposures = df.normalizeRows(df.clipLower({
        data: exposuresData,
        index: origM.index,
        columns: origP.index,
    }));
    
    return exposures;
}