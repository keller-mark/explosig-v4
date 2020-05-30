import range from "lodash/range";

export function dot(A, B) {
    const result = new Array(A.length).fill(0).map(row => new Array(B[0].length).fill(0));
  
    return result.map((row, i) => {
      return row.map((val, j) => {
        return A[i].reduce((sum, elm, k) => sum + (elm*B[k][j]) ,0)
      })
    });
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