import getStuData from "../components/getStuData";
import getUid from "../components/getUid";
import Chart from "chart.js/auto";
import getClassList from "../components/getClassList";
import getRate from "../components/getRate";
import { rateType } from "../firebase/firestoreTypes";

/**クラス名とそのクラスのレートの配列*/
let rateList: {
    className: string;
    rate: rateType[];
}[];

/**Chartオブジェクト*/
let rateChart: Chart;

const main = async () => {
    // GETで与えられたidを取得
    const id = new URL(location.href).searchParams.get("id");
    if (!id) {
        alert("生徒が選択されていません");
        location.href = "./select-student.html";
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

    const stuName = document.getElementById("stu-name");
    if (stuName) {
        stuName.textContent =
            studentData.last_name + studentData.first_name + "さんの";
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

    // セレクトボックスにクラス名をセット
    classList.forEach(async (className) => {
        const option = document.createElement("option");
        option.value = className;
        option.text = className;
        classSelectBox.add(option);
    });

    // レートの配列を更新
    rateList = (
        await Promise.all(
            classList.map(async (className) => {
                return {
                    className: className,
                    rate: (await getRate(uid, className))!,
                };
            })
        )
    ).sort((a, b) => (a.rate[0].date < b.rate[0].date ? -1 : 1));

    // 全てのクラスのレートを描画
    allDraw();
    document.getElementById("canvas-area")!.style.visibility = "visible";
};

/**
 * 全てのクラスのレートを描画する
 */
const allDraw = () => {
    // 日付から重複を取り除いてソートした配列
    const setDate = Array.from(
        new Set(rateList.flatMap((val) => val.rate.map((v) => v.date)))
    ).sort();

    // 折れ線グラフの線の色
    const color = [
        "#FF4B00",
        "#005AFF",
        "#03AF7A",
        "#4DC4FF",
        "#F6AA00",
        "#FFF100",
        "#000000",
    ];

    // 渡すデータ
    const data = rateList.map((val, i) => {
        // 愚直に回すと計算量が Ο(N(全クラスのレート更新回数) * M(該当クラスのレート更新回数)) になるので
        // Ο(N) にするためにsetにする (10^4^2とかでもない限りほぼ誤差だけど)
        const st = new Set(val.rate.map((v) => v.date));

        return {
            borderColor: color[i % 7],
            spanGaps: true,
            type: "line" as any,
            label: val.className,
            data: setDate.map((date) => {
                // その日付に更新されているか
                if (st.has(date)) {
                    // 更新されたうち最大のものを返却
                    return Math.max(
                        ...val.rate
                            .filter((v) => v.date === date)
                            .map((v) => v.score)
                    );
                } else {
                    return null;
                }
            }),
        };
    });

    // すでに描画されていたら削除
    if (rateChart) {
        rateChart.destroy();
    }

    const ctx = document.querySelector("#rate") as HTMLCanvasElement;
    // グラフの描画
    rateChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: setDate,
            datasets: data,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                // y軸の最大値と最小値
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

// セレクトボックスが変更されたら
if (document.querySelector("select")) {
    document.querySelector("select")!.onchange = () => {
        // 選択されたクラス名
        const selectedClass = document.querySelector("select")!.value;
        if (selectedClass === "all") {
            allDraw();
            return;
        }

        // 選択されたクラスのレート
        const selectedClassRate = rateList.filter(
            (val) => val.className === selectedClass
        )[0];

        // 描画するとこ
        const ctx = document.querySelector("#rate") as HTMLCanvasElement;

        // すでに描画されていたら削除
        if (rateChart) {
            rateChart.destroy();
        }

        // グラフの描画
        rateChart = new Chart(ctx, {
            type: "line",
            data: {
                // テスト名 存在しなかったら日付
                labels: selectedClassRate.rate.map((val) =>
                    val.test_name ? val.test_name : val.date.replace(/-/g, "/")
                ),
                datasets: [
                    {
                        borderColor: "#005AFF",
                        label: selectedClass,
                        data: selectedClassRate.rate.map((val) => val.score),
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    // y軸の最大値と最小値
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
}

main();
