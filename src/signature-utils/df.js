import d3 from "../d3.js";

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

export function filterRows(df, newIndexValues) {
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
    const { data, index, columns } = df;
    const newData = columns.map((col, i) => index.map((row, j) => data[j][i]));
    return { index: columns, columns: index, data: newData };
}

export function normalizeRows(df) {
    const { data, index, columns } = df;
    console.log(data);
    const rowSums = data.map(row => d3.sum(row));
    const newData = data.map((row, i) => row.map(d => d / rowSums[i]));
    return { index, columns, data: newData };
}

export function shape(df) {
    return [df.index.length, df.columns.length];
}