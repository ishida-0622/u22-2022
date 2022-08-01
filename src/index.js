// import signUp from "./auth/signup";
import $ from "jquery";
// import getUserData from "./auth/userData";
// import { auth, db } from "./firebase/firebaseConfig";
// import { signOut } from "firebase/auth";
// import login from "./auth/login";
// import getClassData from "./components/getClassData";
import getStuData from "./components/getStuData";
// import getTeacherData from "./components/getTeacherData";
// import getStuPerfData from "./components/getStuPerfData";
import getTestData from "./components/getTestData";
// import getTestList from "./components/getTestList";
import getStuInClass from "./components/getStuInClass";
// import { classData } from "./firebase/firestoreTypes";
import Vue from "vue"
import getUid from "./components/getUid";

// new Vue({
//     el: "#app",
//     data(): {
//         id: string
//         name: string
//     } {
//         return {
//             id: "",
//             name: "",
//         }
//     },
//     methods: {
//         search: async function () {
//             const uid = await getUid(this.id);
//             if (uid === null) {
//                 alert("idが見つからない")
//                 return;
//             }
//             const user = await getStuData(uid);
//             if (user === null) {
//                 alert("userが見つからない")
//                 return
//             }
//             this.name = user.last_name + user.first_name;
//         },
//         add: function() {
//             ;
//         }
//     }
// })

const selectBox = document.getElementById("id")

const main = async () => {
    const testClass = await getTestData(selectBox.value);

    if (testClass === null) {
        return;
    }

    const stuDatas = await getStuInClass(testClass.class_name);

    if (stuDatas === null) {
        return;
    }
};

// window.onload = main;

// $(function () {
//     $(".enomoooooo").on("click", main);

//     $("#test").on("click", async () => {
//         // signUp("test001@example.com", "pass00");
//         // console.log(getUserData());
//         // window.location.href = '/test.html';
//         // await signOut(auth);
//         // await login("satomichi@example.com", "pass00");
//         // await signUp("ken.babuo@gmail.com", "pass00");
//         const userID = auth.currentUser.uid;
//         console.log(userID);
//         // テスト
//         const classDoc = await getClassData(
//             "東京情報クリエイター工学院専門学校ネットワークコース"
//         );
//         if (classDoc === null) {
//             return null;
//         }
//         const stu = classDoc.students;
//         const stuDocs = stu.map(async (val) => await getStuData(val));

//         const labels = [
//             "第一回ABC模試",
//             "第一回XX模試",
//             "第一回塾内テスト",
//             "第二回ABC模試",
//             "第二回XX模試",
//             "第二回じゅくないてすと",
//         ];
//         const data2 = {
//             labels: labels,
//             datasets: [
//                 {
//                     label: "My First dataset",
//                     backgroundColor: "rgb(255, 99, 132)",
//                     borderColor: "rgb(255, 99, 132)",
//                     data: [50, 40, 49, 66, 61, 79, 70],
//                 },
//             ],
//         };
//         const config = {
//             type: "line",
//             data: data2,
//             options: {
//                 scales: {
//                     y: {
//                         suggestedMin: 0,
//                         suggestedMax: 100,
//                     },
//                 },
//             },
//         };
//         // const myChart = new Chart(document.getElementById("myChart"), config);
//         // myChart.canvas.parentNode.style.height = "30%";
//         // myChart.canvas.parentNode.style.width = "50%";
//     });
// });
