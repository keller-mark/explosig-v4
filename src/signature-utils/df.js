import d3 from "../d3.js";
import range from "lodash/range";
import * as mat from "./matrix.js";

export function parseTsv(tsvString) {
    const parsed = d3.tsvParseRows(tsvString);
    const index = parsed.map(d => d[0]);
    index.shift();
    
    const columns = parsed[0];
    
    const data = parsed.map(d => { d.shift(); return d.map(parseFloat); });
    data.shift();
    return { data, index, columns };
}

export function readTsv(promise) {
    return promise
        .then(res => res.text())
        .then((tsvString) => {
            return Promise.resolve(parseTsv(tsvString));
        });
}

export function shape(df) {
    if(Array.isArray(df)) {
        return mat.shape(df);
    }
    return [df.index.length, df.columns.length];
}

export function selectRows(df, newIndexValues) {
    const { data, index, columns } = df;
    const newIndexIndices = newIndexValues.map(name => index.indexOf(name));
    const newIndex = newIndexIndices.map(i => index[i]);
    const newData = newIndexIndices.map(i => data[i]);
    return { data: newData, index: newIndex, columns };
};

export function selectColumns(df, newColumns) {
    const { data, index, columns } = df;
    const newColumnIndices = newColumns.map(name => columns.indexOf(name));
    const newData = data.map(d => newColumnIndices.map(i => d[i]));
    return { data: newData, index, columns: newColumns };
}

export function transpose(df) {
    return (Array.isArray(df)
        ? mat.transpose(df)
        : ({
            index: df.columns,
            columns: df.index,
            data: mat.transpose(df.data),
        })
    );
}

export function normalizeRows(df) {
    return (Array.isArray(df)
        ? mat.normalizeRows(df)
        : ({
            index: df.index,
            columns: df.columns,
            data: mat.normalizeRows(df.data),
        })
    );
}

export function dot(A, B) {
    return ((Array.isArray(A) && Array.isArray(B))
        ? mat.dot(A, B)
        : ({
            index: A.index,
            columns: B.columns,
            data: mat.dot(A.data, B.data)
        })
    );
}

export function clipLower(df, lower) {
    return (Array.isArray(df)
        ? mat.clipLower(df)
        : ({
            index: df.index,
            columns: df.columns,
            data: mat.clipLower(df.data, lower),
        })
    );
}