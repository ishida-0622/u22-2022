import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import getTestData from "../components/getTestData";
import { stuClassDataConverter } from "../firebase/firestoreTypes";
import rateCalc from "./rateCalc";

const getNowYMD = () => {
    const dt = new Date();
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth() + 1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);
    const result = y + m + d;
    return result;
};

const rateUpdate = async (uid, testName, score) => {
    // テスト名からクラス名を取ってきてclassNameに代入
    const className = (await getTestData(testName)).class_name;

    // uidとクラス名をもとに生徒の対象クラスのレートを取得してrateに代入
    const rate = (
        await getDoc(
            doc(db, `users/${uid}/class/${className}`).withConverter(
                stuClassDataConverter
            )
        )
    ).data().rate;

    // mapを使ってrateからscoreを抜き出してscoreに代入
    const scoreList = rate.map((val) => val.score);

    // rateCalcにscoreを渡して新しいレートを算出してnewScoreに代入
    const newScore = rateCalc(scoreList);

    // nweScoreと今日の日付を{date: 日付, score: newScore}の形式でnewRateに代入
    const date = getNowYMD();
    const newRate = {
        date: date,
        score: newScore,
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
