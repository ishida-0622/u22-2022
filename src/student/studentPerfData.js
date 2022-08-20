import getStuPerfData from "../components/getStuPerfData";
import getUserData from "../auth/getUserData";

/**
 * 表示用に日付の文字列を整える
 * @param {String} original 元の文字列
 * @param {boolean} mode Trueにすると年を省略
 * @returns 整えた日付の文字列
 */
const dateFormat = (original, mode) => {
	const month = Number(original.slice(4, 6));
	const day = Number(original.slice(6));
	if(mode){
		return month + '/' + day;
	} else {
		const year = Number(original.slice(0, 4));
		return year + '/' + month + '/' + day;
	}
}
/**
 * グラフを描写する
 * @param {number} showRate 表示するレート
 * @param {number} position スクロールバーの位置
 */
const showGraph = (showRate, position) =>{
	// スクロールバーが端についている場合、ずらす量を調整する------------------------
    var shift = graphScroll / scrollLength * barLength / 2;
	if(position <= -1){
		shift = Math.max(0, shift);
	}
	if(position >= maxPosition){
		shift = Math.min(0, shift);
	}
	// 背景を塗る------------------------
	context.fillStyle = "white";
	context.fillRect(-1,-1,CANVAS.width,300);

	// スクロールバーを表示------------------------
    // 背景部分
	context.fillStyle = "rgb(37, 128, 212)";
	context.fillRect(-1,284.5,CANVAS.width,17);
    // スクロールバー本体部分
	context.fillStyle = "rgb(204, 231, 255)";
	context.fillRect((position + 1) * barLength + shift -0.5,
                     284.5,barLength * Math.min((GRAPH_LENGTH + 1),
                     showRate.length),
                     17);

	// 目盛線の表示------------------------
	context.strokeStyle = "rgb(204, 231, 255)";
	context.lineWidth = 1;
	context.beginPath();
    // 縦方向
	for(let i = 0; i < (GRAPH_LENGTH + 1); i++){
		context.moveTo(42 + i * 47 - shift, 5);
		context.lineTo(42 + i * 47 - shift, 255);
	}
    // 横方向
	for(let i = 0; i < 10; i++){
		context.moveTo(63.5, 5 + i * 25);
		context.lineTo(CANVAS.width, 5 + i * 25);
	}
	context.closePath();
	context.stroke();

	// グラフの線を描写する------------------------
	let start = 42;
	if(showRate.length <= (GRAPH_LENGTH + 1)){
		start += 47
	}

	let started = false;
	let drawX;
	let drawY;

	context.strokeStyle = "rgb(50, 156, 255)";
	context.beginPath();
	showRate.forEach((i, ind) => {
		if(!isNaN(i["score"])){
            drawX = start + ind * 47 - shift;
            drawY = 255 - (i["score"] - MIN) / (MAX - MIN) * 251;
			if (!started){
				context.moveTo(drawX, drawY);
				started = true;
			} else {
				context.lineTo(drawX, drawY);
			}
		}
	});
	context.stroke();

	// レートの点を描写する------------------------
	let TextY;
	let TextrectY;

	// テキストを左右中央揃えにする
	context.textAlign = "center";

	showRate.forEach((i, ind) => {
		if(!isNaN(i["score"])){
			// 点などの描写位置を決めておく
			drawX = start + ind * 47 - shift;
			drawY = 255 - (i["score"] - MIN) / (MAX - MIN) * 251;

			// 下の方に日付を表示する
			context.font = "12px 'sans-serif'";
			context.textBaseline = "middle";
			context.fillStyle = "rgb(0, 0, 0)";
			context.fillText(i["date"].slice(0, 4), drawX, 263);
			context.fillText(dateFormat(i["date"], true), drawX, 275);

			// 点の描写
			context.fillStyle = "rgb(50, 156, 255)";
			context.beginPath();
			context.arc(drawX, drawY, 2, 0, 360)
			context.fill()




			// もしもマウスが近くにあったら、値を表示する
			if(Math.abs(mouseX - drawX) < 23.5 && mouseY < 260 && mouseY > 0){
				context.font = "20px 'sans-serif'";
				let textWidth = context.measureText(i["score"])['width']
				if (drawY - 25 > 5){
					// 外枠を超えないなら点の上に表示するように設定する
					context.textBaseline = "bottom";
					TextY = drawY - 5;
					TextrectY = drawY -25;
				} else {
					// 超えるようなら下に表示するように設定する
					context.textBaseline = "top";
					TextY = drawY + 5;
					TextrectY = drawY + 5;
				}
				// 描写する
				context.fillRect(drawX - (textWidth / 2) - 5, TextrectY ,textWidth + 10,20);
				context.fillStyle = "rgb(255, 255, 255)";
				context.fillText(i["score"], drawX, TextY);

			}

		}
	});


	// グラフより左側にある物を白い四角形で隠す------------------------
	context.fillStyle = "white";
	context.fillRect(0,0.5,65,283);

	// グラフの外枠を表示------------------------
	context.strokeRect(65, 5, CANVAS.width, 250)

	// 軸の表示------------------------
	context.font = "12px 'sans-serif'";
	context.textAlign = "right";
	context.textBaseline = "middle";
	context.fillStyle = "black";
	context.beginPath();
	for(let i = 0; i < 11; i++){
		context.fillText(Math.round((MAX - MIN) / 10 * i + MIN), 60, 255 - i * 25);
		context.moveTo(63.5, 255 - i * 25);
		context.lineTo(66.5, 255 - i * 25);
	}
	context.closePath();
	context.stroke();
}

/**
 * 表示位置を移動・表示するレートを再設定する
 * @param {number} 移動量
 */
const changePosition = (distance) => {
	position = Math.min(Math.max(-1, position + distance), maxPosition)
	// 表示するレートを再設定する
	showRate = rate.slice(
						  Math.max(0, position),
						  Math.min(rate.length, position + (GRAPH_LENGTH + 2))
						 );
	// グラフを再描写
	showGraph(showRate, position);
}

/**
 * ウィンドウ内でマウス・指を動かした際の処理
 * @param {Event} evt
 * @param {Number} mode 0 = マウス用のモード、1 = スマホ用のモード
 */
 const windowMouseMove = (evt, mode) => {
	if (CLASS_MENU.value !== "-1"){
		const rect = CANVAS.getBoundingClientRect();
		const width = rect.width / CANVAS.width;
		const height = rect.height / CANVAS.height;

		// マウス、指の位置を取得する
		if(mode === 1){
			const touchObject = evt.changedTouches;
			if(touchObject){
				mouseX = (touchObject[0].clientX - rect.left) / width;
				mouseY = (touchObject[0].clientY - rect.top) / height;
			}
		} else {
			mouseX = (evt.clientX - rect.left) / width;
			mouseY = (evt.clientY - rect.top) / height;
		}

		// クリック状態なら移動距離に応じてグラフをスクロール
		if(click !== 0){
            evt.preventDefault();
			graphScroll += (mouseX - clickedX) * click;
			clickedX = mouseX;
			if (graphScroll >= scrollLength && position < maxPosition){
				changePosition(1);
				graphScroll -= scrollLength;
			}
			if (graphScroll <= -scrollLength && position > -1){
				changePosition(-1);
				graphScroll += scrollLength;
			}
		}

		// グラフの再描写
		showGraph(showRate, position);
	}

}
window.addEventListener('mousemove', (evt) => {
	windowMouseMove(evt, 0);
}, false);
window.addEventListener('touchmove', (evt) => {
	windowMouseMove(evt, 1);
}, { passive: false });


// キャンバスの設定------------------------
const CANVAS = document.getElementById("graph");

/**
 * グラフ内でマウスのボタンを押した・タップされた際に押された場所をメモし、クリック状態にする
 * @param {Event} evt
 * @param {Number} mode 0 = マウス用のモード、1 = スマホ用のモード
 */
const mouseDown = (evt, mode) =>  {
	// スマホ操作なら指の位置を取得する
	if(mode === 1){
		const rect = CANVAS.getBoundingClientRect();
		const touchObject = evt.changedTouches;
		const width = rect.width / CANVAS.width;
		const height = rect.height / CANVAS.height;
		if(touchObject){
			mouseX = (touchObject[0].clientX - rect.left) / width;
			mouseY = (touchObject[0].clientY - rect.top) / height;
		}
	}

	// クリック位置のメモ
	clickedX = mouseX;

	// スクロールバーより上をクリックしたか下をクリックしたかでクリック状態に違いをつけておく
	if(mouseY >= 285){
        // スクロールバーより下ならスクロースバーをマウスと同じ方向に動くようにする
		click = 1;
        scrollLength = barLength;
	} else {
        // 上ならグラフ自体がマウスと同じ方向に動くようにする
		click = -1;
        scrollLength = 47;
	}

	graphScroll = 0;
}
CANVAS.addEventListener('mousedown', (evt) => {
	mouseDown(evt, 0);
}, false);
CANVAS.addEventListener('touchstart', (evt) => {
	mouseDown(evt, 1);
}, false);


/**
 * ウィンドウ内でマウスのボタン・指が離された際にクリック状態を終了する
 */
const mouseUp = () =>  {
	if (click !== 0){
		click = 0;
		graphScroll = 0;
		if (CLASS_MENU.value !== "-1"){
			showGraph(showRate, position);
		}
	}
}

window.addEventListener('mouseup', mouseUp, false);
window.addEventListener('touchend', mouseUp, false);

// 左方向のボタンを押した際の処理
document.getElementById("prev").onclick = () =>{
	if(position > -1){
		changePosition(-1);
	}
}

// 右方向のボタンを押した際の処理
document.getElementById("next").onclick = () =>{
	if(position < maxPosition){
		changePosition(1);
	}
}


/**
 * 最初の処理
 */
const Start = async () => {
	// ユーザデータを取得
	const USER_DATA = await getUserData()
	const UID = await USER_DATA["uid"];
	// 成績データを取得
	const stuPerfData = await getStuPerfData(UID);


	// 新たなレートのデータを入れておく変数
	let newrates;

	// 取得したデータを元にクラスのデータ・レートのデータを作成しておく
	stuPerfData.forEach((i) => {
		classes.push(i["class_name"]);
		newrates = i["rate"];
		newrates.push({"score" : NaN});
		rates.push(newrates);
	});


	// もしも所属しているクラスがなかったら
	if (classes.length === 0){
		document.getElementById("ifNotSelected").innerHTML = "<h2>クラスに所属していません</h2>"
	} else {
		// プルダウンメニューの中に選択肢を追加する
		classes.forEach((i, ind) => {
			CLASS_MENU.innerHTML += "<option value='" + ind +"'>" + i + "</option>"
		});
	}
	document.getElementById("pleaseWait").style.display = 'none';
	document.getElementById("mainContent").style.display = 'block';

}


// 二次元グラフィックスのコンテキストを取得------------------------
const context = CANVAS.getContext("2d");
// その他変数の設定------------------------
const GRAPH_LENGTH = 11;
const MAX = 100;
const MIN = 0;
const CLASS_MENU = document.getElementById("classList")
const RATE_TABLE = document.getElementById("rateTable");
let rate;
let maxPosition;
let position;
let showRate;
let barLength;
let scrollLength;
let mouseX = 0;
let mouseY = 0;
let clickedX = -1;
let click = 0;
let graphScroll = 0;
let rates = [];
let classes = [];

// グラフのサイズを指定------------------------
CANVAS.width = 66 + 47 * GRAPH_LENGTH;
CANVAS.height = 300;
// スクロール用のボタンのサイズをグラフのサイズに合わせる
document.getElementById("scrollMenu").style.width = CANVAS.width + "px"
// プルダウンメニューの処理------------------------
// プルダウンメニューから選択した場合
CLASS_MENU.onchange = () => {
	if (CLASS_MENU.value !== "-1"){
		// クラスを何かしら選択した場合の処理------------------------
		// 要素の表示・非表示を切り返す
		document.getElementById("scoreView").style.display = 'block';
		document.getElementById("ifNotSelected").style.display = 'none';

		// 選択したクラスのレートのデータを取得する
		rate = rates[Number(CLASS_MENU.value)];

		// レートのリストを更新
		RATE_TABLE.innerHTML = "";
		rate.slice(0, -1).forEach((i) => {
			RATE_TABLE.innerHTML += "<tr><td class = 'tdNumber'>" + dateFormat(i["date"], false) + "</td><td class = 'tdNumber'>" + i["score"] + "</td></tr>";
		});


		// スクロールできる最大値を背呈する
		maxPosition = Math.max(rate.length - (GRAPH_LENGTH + 2), -1);

		// 表示する場所を最大値に設定する
		position = maxPosition;

		// 表示する部分のレートの設定のために移動用関数を呼び出す
		changePosition(0)

		// 現在のレートの部分に末尾のレートを表示
		document.getElementById("currentRate").innerText = rate.slice(-2)[0]["score"];

		// スクロールバーの長さの単位を決める
		barLength = CANVAS.width / rate.length
        scrollLength = barLength

		// グラフの再描写
		showGraph(showRate, position);

	} else {
		// 「選択してください」を選択した場合の処理------------------------
		// 要素の表示・非表示を切り返す
		document.getElementById("scoreView").style.display = 'none';
		document.getElementById("ifNotSelected").style.display = 'block';
	}
}

// 最初の処理をする
Start()
context.translate(0.5, 0.5);
