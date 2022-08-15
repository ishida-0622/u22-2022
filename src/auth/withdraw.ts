import { db } from "../firebase/firebaseConfig";
import getUserData from "./getUserData";
import $ from "jquery";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { idConverter, userDataConverter } from "../firebase/firestoreTypes";
import getStuData from "../components/getStuData";
import getTeacherData from "../components/getTeacherData";
import getParentsData from "../components/getParentsData";
import getClassList from "../components/getClassList";
import getClassData from "../components/getClassData";
import deleteCollection from "../components/deleteCollection";

const main = async () => {
    // ログインしているか
    const user = getUserData();
    if (!user) {
        window.location.href = "/login.html";
        return;
    }
};

/**
 * パスワードの照合
 * 成功時にユーザーの削除処理を呼び出す
 */
const passwordCollation = async () => {
    // ログイン中のユーザーの情報の取得 ログインしていなかったら終了
    const user = getUserData();
    if (!user) {
        return;
    }

    // ユーザー情報の取得
    const userData = (
        await getDoc(
            doc(db, `users/${user.uid}`).withConverter(userDataConverter)
        )
    ).data();

    // 存在しなければ終了
    if (!userData) {
        return;
    }

    // パスワードの取得
    const pass = (
        await getDoc(doc(db, `id/${userData.id}`).withConverter(idConverter))
    ).data()?.password;

    // 入力されたパスワードの取得
    const inputPass = $("#inputed-password").val();

    // 一致したらユーザー削除処理を呼び出す
    if (pass && inputPass && pass === inputPass) {
        await userDelete();
        $("#menu_button").hide();
        $("#header_icon").hide();
        $("#menu").hide();
        $("#breadcrumb").hide();
    } else {
        alert("パスワードが一致しません");
    }
};

/**
 * ユーザー削除処理
 */
const userDelete = async () => {
    // ログイン中のユーザーの情報の取得 ログインしていなかったら終了
    const user = getUserData();
    if (!user) {
        return;
    }
    const uid = user.uid;

    // アカウントタイプ
    const userType = (
        await getDoc(doc(db, `users/${uid}`).withConverter(userDataConverter))
    ).data()?.type;

    // 存在しなければ終了
    if (!userType) {
        return;
    }

    // 生徒なら
    if (userType === "student") {
        // 生徒情報取得 存在しなければ終了
        const userData = await getStuData(uid);
        if (!userData) {
            return;
        }

        // 所属クラス一覧取得 存在しなければ終了
        const classList = await getClassList(uid);
        if (!classList) {
            return;
        }

        // 所属クラスから自分を削除
        classList.forEach(async (val) => {
            // クラス情報取得 存在しなければ終了
            const classData = await getClassData(val);
            if (!classData) {
                return;
            }

            // 更新するデータ
            const updateData = {
                // studentsの中で自分のuidと一致しないものを残す
                students: classData.students.filter((val) => val !== uid),
            };

            // 更新
            await updateDoc(doc(db, `class/${val}`), updateData);
        });

        // クラスとテストを削除
        await deleteCollection(db, `users/${uid}/class`);
        await deleteCollection(db, `users/${uid}/tests`);

        // idから自分のidを削除
        await deleteDoc(doc(db, `id/${userData.id}`));

        // 講師なら
    } else if (userType === "teacher") {
        // 講師情報取得 存在しなければ終了
        const userData = await getTeacherData(uid);
        if (!userData) {
            return;
        }

        // 所属クラス一覧取得 存在しなければ終了
        const classList = await getClassList(uid);
        if (!classList) {
            return;
        }

        // 所属クラスから自分を削除
        // TODO:クラスに講師が1人しかいなかった場合のクラス削除処理
        classList.forEach(async (val) => {
            // クラス情報取得 存在しなければ終了
            const classData = await getClassData(val);
            if (!classData) {
                return;
            }

            // 更新するデータ
            const updateData = {
                // teachersの中で自分のuidと一致しないものを残す
                teachers: classData.teachers.filter((val) => val !== uid),
            };

            // 更新
            await updateDoc(doc(db, `class/${val}`), updateData);
        });

        // クラスを削除
        await deleteCollection(db, `users/${uid}/class`);

        // idから自分のidを削除
        await deleteDoc(doc(db, `id/${userData.id}`));

        // 保護者なら
    } else {
        // 保護者情報取得 存在しなければ終了
        const userData = await getParentsData(uid);
        if (!userData) {
            return;
        }

        // idから自分のidを削除
        await deleteDoc(doc(db, `id/${userData.id}`));
    }

    // usersのドキュメントを削除
    await deleteDoc(doc(db, `users/${uid}`));

    // Authのユーザー削除
    await user
        .delete()
        .then(() => {
            // 成功したら画面切り替え
            $("#cfm").hide();
            $("#after").show();
        })
        .catch(() => {
            alert("削除処理に失敗しました");
        });
};

main();

// 確認しましたボタンを押したら画面切り替え
$("#cfm-button").on("click", () => {
    $("#before").hide();
    $("#cfm").show();
});

// パスワードの入力フォームがsubmitされたらpasswordCollationを走らせる
$("#password-form").on("submit", passwordCollation);
