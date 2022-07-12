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
import { stuClassData } from "./firebase/firestoreTypes"

$(function () {
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
        const classData = await getStuPerfData(userID);
        console.log(classData);
        classData.forEach(val => {
            val.rate.forEach(r => {
                console.log(r.date, r.score);
            })
        })

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
