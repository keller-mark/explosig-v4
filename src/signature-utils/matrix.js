import range from "lodash/range";
import d3 from "../d3.js";

export function shape(mat) {
    if(mat.length > 0) {
        return [mat.length, mat[0].length];
    } else {
        return [mat.length, 0];
    }
}

const dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
const dottranspose = a => a[0].map((x, i) => a.map(y => y[i]));
const dotmmultiply = (a, b) => a.map(x => dottranspose(b).map(y => dotproduct(x, y)));

export function dot(A, B) {
    return dotmmultiply(A, B);
}

export function eye(k) {
    return range(k).map(i => range(k).map(j => (i === j ? 1 : 0)));
}

export function ones(m, n) {
    return range(m).map(i => range(n).map(j => 1));
}

export function hstack(A, B) {
    return A.map((d, i) => [...d, ...B[i]]);
}

export function transpose(mat) {
    const [m, n] = shape(mat);
    const newMat = range(n).map(i => range(m).map(j => mat[j][i]));
    return newMat;
}

export function normalizeRows(mat) {
    const rowSums = mat.map(row => d3.sum(row));
    const newMat = mat.map((row, i) => row.map(d => d / rowSums[i]));
    return newMat;
}

export function clipLower(mat, lower) {
    return mat.map(row => row.map(val => (val < lower ? lower : val)));
}