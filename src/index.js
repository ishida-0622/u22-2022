import signUp from "./auth/signup";
import $ from "jquery";
import getUserData from "./auth/userData";
import { auth, db } from "./firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import Vue from "./vue";
import login from "./auth/login";
import getClassData from "./components/getClassData";
import getStuData from "./components/getStuData";
import getTeacherData from "./components/getTeacherData";
import getStuPerfData from "./components/getStuPerfData";
import { classData } from "./firebase/firestoreTypes";

const getStuInData = async (className) => {
    // classNameを引数にgetClassDataを呼び出し、クラスの情報をclassDocumentに代入
    const classDocument = await getClassData(className);

    // 存在していなかったらnullを返す
    if (classDocument === null) {
        return null;
    }

    // class/studentsのuidを全てstudentIdに代入
    const studentId = classDocument.students;

    // studentIdを引数に渡してgetStuDataを呼び出し、生徒の情報を配列studentDocumentに格納
    const studentDocument = await Promise.all(studentId.map(async (val) => await getStuData(val)));

    studentDocument.map(val => val)
    const res = []
    studentId.forEach(async val => {
        const d = await getStuData(val)
        res.push(d);
    })

    // 配列に格納したデータを返す
    return studentDocument;
    // return res;
};

const main = async () => {
    const stu = await getStuInData()
    const selectFoodName = document.getElementById("enomoo");
    const arr = ["test1", "test2", "test3"];
    arr.forEach((val) => {
        const option1 = document.createElement("option");
        option1.value = val;
        option1.textContent = val;
        selectFoodName.appendChild(option1);
    });
    console.log(document.getElementById("enomoo").value);
};

// window.onload = main;

$(function () {
    $(".enomoooooo").on("click", main);

    $("#test").on("click", async () => {
        // signUp("test001@example.com", "pass00");
        // console.log(getUserData());
        // window.location.href = '/test.html';
        // await signOut(auth);
        // await login("satomichi@example.com", "pass00");
        // await signUp("ken.babuo@gmail.com", "pass00");
        const userID = auth.currentUser.uid;
        console.log(userID);
        // テスト
        const classDoc = await getClassData(
            "東京情報クリエイター工学院専門学校ネットワークコース"
        );
        if (classDoc === null) {
            return null;
        }
        const stu = classDoc.students;
        const stuDocs = stu.map(async (val) => await getStuData(val));

        const labels = [
            "第一回ABC模試",
            "第一回XX模試",
            "第一回塾内テスト",
            "第二回ABC模試",
            "第二回XX模試",
            "第二回じゅくないてすと",
        ];
        const data2 = {
            labels: labels,
            datasets: [
                {
                    label: "My First dataset",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: [50, 40, 49, 66, 61, 79, 70],
                },
            ],
        };
        const config = {
            type: "line",
            data: data2,
            options: {
                scales: {
                    y: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                    },
                },
            },
        };
        // const myChart = new Chart(document.getElementById("myChart"), config);
        // myChart.canvas.parentNode.style.height = "30%";
        // myChart.canvas.parentNode.style.width = "50%";
    });
});
