/**
 * 2個以上の配列のiとjを入れ替えたものを返却
 * @param  {...T[]} arrays 配列
 * @returns ([1, 2, 3], [A, B, C]) => [[1, A], [2, B], [3, C]]
 */
const zip = (...arrays) => {
    const len = Math.min(...arrays.map((arr) => arr.length));
    return new Array(len)
        .fill(undefined)
        .map((_, i) => arrays.map((arr) => arr[i]));
};

export default zip;
