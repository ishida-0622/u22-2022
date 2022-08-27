import getStuData from "../components/getStuData";
import getUid from "../components/getUid";
import Chart from "chart.js/auto";
import getClassList from "../components/getClassList";
import getRate from "../components/getRate";
import { rateType } from "../firebase/firestoreTypes";
import fileDownload from "../storage/fileDownload";

/**クラス名とそのクラスのレートの配列*/
let rateList: {
    className: string;
    rate: rateType[];
}[] = [];

/**Chartオブジェクト*/
let chart: Chart;

const main = async () => {
    // GETで与えられたidを取得
    const id = new URL(location.href).searchParams.get("id");
    if (!id) {
        return;
    }

    // idをもとにuidを取得
    const uid = await getUid(id);
    if (!uid) {
        return;
    }

    // 生徒情報を取得
    const studentData = await getStuData(uid);
    if (!studentData) {
        return;
    }

    // 生徒情報をセット
    document.getElementById(
        "name"
    )!.textContent = `${studentData.last_name} ${studentData.first_name}`;
    document.getElementById(
        "name-kana"
    )!.textContent = `${studentData.last_name_kana} ${studentData.first_name_kana}`;
    document.getElementById("id")!.textContent = `ID：${studentData.id}`;
    document.getElementById("sex")!.textContent = `性別：${
        studentData.sex === "1"
            ? "男"
            : studentData.sex === "2"
            ? "女"
            : "その他"
    }`;

    const image = await fileDownload(uid);
    if (image) {
        (document.getElementById("stu-icon") as HTMLImageElement).src = image;
    }

    // クラス一覧を取得
    const classList = await getClassList(uid);
    if (!classList) {
        return;
    }

    // セレクトボックスを取得
    const classSelectBox = document.querySelector("select");
    if (!classSelectBox) {
        return;
    }

    classList.forEach(async (className) => {
        // クラスのレートを取得 存在しなければ終了
        const rate = await getRate(uid, className);
        if (!rate) {
            return;
        }

        // rateListにクラス名とレートをセット
        rateList.push({
            className: className,
            rate: rate,
        });

        // セレクトボックスにクラス名をセット
        const option = document.createElement("option");
        option.value = className;
        option.text = className;
        classSelectBox.add(option);
    });
};

// セレクトボックスが変更されたら
document.querySelector("select")!.onchange = () => {
    // 選択されたクラス名
    const selectedClass = document.querySelector("select")!.value;

    // 選択されたクラスのレート
    const selectedClassRate = rateList.filter(
        (val) => val.className === selectedClass
    )[0];

    // 描画するとこ
    const ctx = document.querySelector("canvas");

    // すでに描画されていたら削除
    if (chart) {
        chart.destroy();
    }

    // グラフの描画
    chart = new Chart(ctx!, {
        type: "line",
        data: {
            // テスト名 存在しなかったら日付
            labels: selectedClassRate.rate.map((val) =>
                val.test_name ? val.test_name : val.date.replace(/-/g, "/")
            ),
            datasets: [
                {
                    label: selectedClass,
                    data: selectedClassRate.rate.map((val) => val.score),
                },
            ],
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: 100,
                },
            },
            layout: {
                padding: 10,
            },
        },
    });
};

main();
