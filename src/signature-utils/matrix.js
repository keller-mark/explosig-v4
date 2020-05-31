import range from "lodash/range";

const dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
const transpose = a => a[0].map((x, i) => a.map(y => y[i]));
const mmultiply = (a, b) => a.map(x => transpose(b).map(y => dotproduct(x, y)));

export function dot(A, B) {
    console.log(A, B);
    return mmultiply(A, B);
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