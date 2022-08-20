import getUserData from "../auth/getUserData";
import getUid from "../components/getUid";
import $ from "jquery";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import getClassData from "../components/getClassData";
import getTeacherData from "../components/getTeacherData";

/**
 * クラス概要変更画面のjs
 */

// idの配列をSet
let idSet = new Set();

const main = async () => {
    // 現在ログイン出来ているかどうかを確認　出来ていなければログイン画面に飛ばす
    const userData = await getUserData();
    if (userData === null) {
        window.location.href = "../login.html";
        return;
    }

    // urlからクラス名を取得
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const className = params.get("class_name");

    // クラス名からクラスに登録されている講師を取得
    const classData = await getClassData(className);
    const teachersUid = classData.teachers;

    // HTMLから入力されたクラス名を取得
    document.getElementById("class_name").value = className;

    // 講師名とそれに対応した削除ボタンを表示
    teachersUid.forEach(async (val) => {
        const teacherData = await getTeacherData(val);
        const firstName = teacherData.first_name;
        const lastName = teacherData.last_name;
        const id = teacherData.id;

        // 要素を作成
        const element = document.createElement("p");

        // class
        element.className = "teacher_name";

        // id
        element.id = id;

        // 存在確認のためのSetにidを追加
        idSet.add(id);

        // テキスト内容
        element.innerHTML = lastName + " " + firstName + "(" + id + ")";

        // 親要素を取得
        const teachers = document.getElementById("teachers");

        // 削除ボタンを表示
        const button = document.createElement("button");
        button.textContent = "削除";
        button.addEventListener("click", () => removeTeacher(id));
        element.appendChild(button);

        // 要素を追加
        teachers.appendChild(element);
    });
};

// 削除ボタンの機能
const removeTeacher = (id) => {
    const element = document.getElementById(id);
    element.remove();

    // Setからidを削除
    idSet.delete(id);
};

// 登録ボタンの機能
document.getElementById("registration").onclick = async () => {
    // HTMLからクラス名と講師名を取得
    const className = document.getElementById("class_name").value;
    const element = Array.from(document.getElementById("teachers").children);

    // idを元にuidを取得し、講師名のリストを作成
    const teacherList = await Promise.all(
        element.map(async (val) => {
            const uid = await getUid(val.id);
            const teacherData = await getTeacherData(uid);
            return teacherData.last_name + " " + teacherData.first_name;
        })
    );

    // uidのリストを作成
    const uidList = await Promise.all(
        element.map(async (val) => await getUid(val.id))
    );

    // 更新するクラス名
    const upDateClassName = {
        class_name: className,
    };

    // 更新するクラス名
    const upDateClass = {
        class_name: className,
        teachers: uidList,
    };

    // confirmを表示
    if (
        window.confirm(
            "以下の内容で登録します。よろしいですか？\n\nクラス名：" +
                className +
                "\n講師：" +
                teacherList
        )
    ) {
        // OKの場合情報を更新
        uidList.forEach(async (val) => {
            await updateDoc(
                doc(db, `users/${val}/class/${className}`),
                upDateClassName
            );
        });

        await updateDoc(doc(db, `class/${className}`), upDateClass);

        window.location.href = "./";
    } else {
        // 警告ダイアログを表示
        window.alert("キャンセルされました");
        return;
    }
};

// 追加ボタンの機能
const teacherAdd = async () => {
    // HTMLからidを取得
    const id = document.getElementById("teacher_id").value;

    // 未入力の場合はreturn
    if (id === "") {
        window.alert("IDを入力してください");
        return;
    }

    // uidを取得し、それを元にteacherのドキュメントを取得
    const uid = await getUid(id);
    const teacherData = await getTeacherData(uid);

    // idに一致するuidが存在しない場合return
    if (uid === null) {
        window.alert("IDが一致するユーザは存在しませんでした");
        return;
    }

    // 追加されたidが既に追加済みの場合return
    if (idSet.has(id)) {
        window.alert("そのユーザは既に追加済みです");
        return;
    }

    // Setにidを追加
    idSet.add(id);

    // 講師名とidを代入
    const firstName = teacherData.first_name;
    const lastName = teacherData.last_name;
    const teacherId = teacherData.id;

    // confirmを表示
    if (
        window.confirm(
            "以下の講師を追加します。よろしいですか？\n\n講師名：" +
                lastName +
                " " +
                firstName +
                "\nID：" +
                teacherId
        )
    ) {
        // 要素を作成
        const element = document.createElement("p");

        // class
        element.className = "teacher_name";

        // id
        element.id = teacherId;

        // テキスト内容
        element.innerHTML = lastName + " " + firstName + "(" + teacherId + ")";

        // 親要素を取得
        const teachers = document.getElementById("teachers");

        // 削除ボタンを表示
        const button = document.createElement("button");
        button.textContent = "削除";
        button.addEventListener("click", () => removeTeacher(teacherId));
        element.appendChild(button);

        // 要素を追加
        teachers.appendChild(element);
    } else {
        // 警告ダイアログを表示
        window.alert("キャンセルされました");
    }
};

// 追加ボタンがクリックされた場合の処理
$(function () {
    $("#add").on("click", async () => {
        await teacherAdd();
    });
});

// mainを実行
main();
