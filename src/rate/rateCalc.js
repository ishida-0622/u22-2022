// numericのインポート
const numeric = require("numeric");

/**
 * 現在のレートを計算して返却する
 * @param {number[]} scores
 * @returns {number} 現在のレート
 */
const rateCalc = (scores) => {
	// レートの算出関数呼び出し
	const rate = calcRate(scores);

	// 範囲チェックとリターン
	if(rate < 0) {
		return 0;
	} else if (rate > 100) {
		return 100;
	}
    return rate;
};

/**
 * レートの算出を行う
 * @param {number[]} scores 得点一覧
 * @returns {number} 現在のレート
 */
const calcRate = (scores) => {
	const len = scores.length;

    if(len < 3) {
        // スコアそのままを返す
        return scores[len-1];
    } else if (len < 5) {
        // 一次式で近似して、現在のレートを返却
        const elements = calcApproximatedCurve(scores, 1);	//ax+b -> [a, b]
		return (elements[0]*len + elements[1] -50) * 0.92 + 50;
    } else if (len < 10) {
        // 一次式と二次式で近似して、重みづけした上で現在のレートを返却
		const elements = calcApproximatedCurve(scores, 1);			// ax+b -> [a, b]
		const secondElements = calcApproximatedCurve(scores, 2);	// ax^2+bx+c -> [a, b, c]
		return (0.3*(elements[0]*len + elements[1]) + 0.7*(secondElements[0]*Math.pow(len, 2) + secondElements[1]*len + secondElements[2]) - 50) * 0.92 + 50;
    }
	// 一次式と三次式で近似し、微分式も加味して重みづけした上で現在のレートを返却
	const elements = calcApproximatedCurve(scores, 1);								// ax+b -> [a, b]
	const thirdElements = calcApproximatedCurve(scores, 3);							// x^3+bx^2+cx+d -> [a, b, c, d]
	const differentiatedElements =
		[thirdElements[0]*3, thirdElements[1]*2, (scores[len-2]-thirdElements[0]*3*Math.pow(len-1, 2)-thirdElements[1]*2*(len-1))];		// [3a, 2b, (一つ前のスコアに合わせた切片)]
	return (0.2*(elements[0]*len + elements[1]) + 0.2*(differentiatedElements[0]*Math.pow(len, 2) + differentiatedElements[1]*len + differentiatedElements[2])
		+ 0.6*(thirdElements[0]*Math.pow(len, 3) + thirdElements[1]*Math.pow(len, 2) + thirdElements[2]*len + thirdElements[3]) - 50) * 0.92 + 50;
};

/**
 * 最小二乗法によってn次の近似式を求める
 * @param {number[]} scores 得点一覧
 * @param {number} dim 次元->近似式の次数(n次の"n")
 * @returns {number[]} 近似式(n次)の係数({ax^2+bx+c}の[a, b, c]等)
 */
function calcApproximatedCurve(scores, dim) {
	// dimの調整
	dim += 1;

	// n次式の近似に必要な数のデータがない場合は0の配列を返却
	if(scores.length<dim) {
		return numeric.rep([dim], 0);
	}

	// scoresのフォーマット
	let formatedScores = []
	scores.forEach((score, index) => {
		formatedScores.push([index+1, score]);
	});

	/**
	 * 最小二乗法A(初期値[[0*dim]*dim])
	 * @type {number[][]}
	 */
	let A=numeric.rep([dim, dim], 0);

	/**
	 * 最小二乗法b(初期値[0*dim])
	 * @type {number[]}
	 */
	let b=numeric.rep([dim], 0);

	// 最小二乗法の実行
	formatedScores.forEach(formatedScore => {
		for(let j=0; j<dim; j++) {
			for(let k=0; k<dim; k++) {
				A[j][k] += Math.pow(formatedScore[0], 2*(dim-1)-j-k);
			}
		}
		for(let j=0; j<dim; ++j) {
			b[j] += formatedScore[1]*Math.pow(formatedScore[0], dim-1-j);
		}
	});

	// 線形計画法による係数の導出
	return numeric.solve(A, b);
}

export default rateCalc;
