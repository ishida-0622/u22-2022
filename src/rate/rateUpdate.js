import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import getTestData from "../components/getTestData";
import {
    stuClassDataConverter,
    stuTestDataConverter,
} from "../firebase/firestoreTypes";
import rateCalc from "./rateCalc";
import getTestList from "../components/getTestList";

const rateUpdate = async (uid, testName, score) => {
    const testData = await getTestData(testName);
    // テスト名からクラス名を取ってきてclassNameに代入
    const className = testData.class_name;

    // uidとクラス名をもとに生徒の対象クラスのレートを取得してrateに代入
    const rate = (
        await getDoc(
            doc(db, `users/${uid}/class/${className}`).withConverter(
                stuClassDataConverter
            )
        )
    ).data().rate;

    // テスト一覧を日付の昇順にソートしたもの
    const testList = (await getTestList(className)).sort((a, b) =>
        a.date < b.date ? -1 : 1
    );

    // 各テストの正解率
    const scores = (
        await Promise.all(
            testList.map(async (val) => {
                const score = (
                    await getDoc(
                        doc(
                            db,
                            `users/${uid}/tests/${val.test_name}`
                        ).withConverter(stuTestDataConverter)
                    )
                ).data()?.score;
                return score
                    ? [
                          Math.round(
                              ((score - val.min_score) /
                                  (val.max_score - val.min_score)) *
                                  100
                          ),
                      ]
                    : [];
            })
        )
    ).flat();

    // rateCalcにscoreを渡して新しいレートを算出してnewScoreに代入
    const newScore = Math.round(rateCalc(scores) * 10) / 10;

    // nweScoreと今日の日付を{date: 日付, score: newScore}の形式でnewRateに代入
    const date = testData.date;
    const newRate = {
        date: date,
        score: newScore,
        test_name: testName,
    };

    // rateの末尾にnewRateを追加
    rate.push(newRate);

    const updateData = {
        rate: rate,
    };

    // rateをupdateDocを使って更新
    await updateDoc(doc(db, `users/${uid}/class/${className}`), updateData);
};

export default rateUpdate;
