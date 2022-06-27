import signUp from './auth/signup';
import $ from 'jquery';
import getUserData from './auth/userData';
import {
    doc,
    setDoc,
    addDoc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore';
import { auth, db } from './firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import Vue from './vue';
import Chart from 'chart.js/auto';

const vm = new Vue({
    el: '#main',
    data: {
        test: '',
        array: [],
    },
    methods: {
        changeFunc: () => {
            const a = {
                name: '石田健太郎',
            };
            const b = {
                name: '加藤木優斗',
            };
            const c = {
                name: '石川',
            };
            const d = {
                name: '加藤',
            };
            const arr = [a, b, c, d];
            const e = vm.test;
            const reg = new RegExp('^' + e);
            vm.array = arr
                .filter((obj) => obj.name.match(reg))
                .map((val) => val.name);
        },
    },
});

$(function () {
    $('#test').on('click', async () => {
        // signUp("test001@example.com", "pass00");
        // console.log(getUserData());
        // window.location.href = '/test.html';
        const data = {
            userID: 'ken',
            アカウントタイプ: '生徒',
            ナマエ: 'ケンタロウ',
            ミョウジ: 'イシダ',
            名前: '健太郎',
            名字: '石田',
            年齢: 19,
            性別: '男',
            生年月日: '20020622',
        };
        // const data = {
        //     userID: "katogi",
        //     アカウントタイプ: "講師",
        //     ナマエ: "マサト",
        //     ミョウジ: "カトウギ",
        //     名前: "優斗",
        //     名字: "加藤木",
        //     年齢: 100,
        //     性別: "男",
        //     生年月日: "19220101",
        // }
        const sansuu = {
            a: '',
        };
        const kokugo = {
            レート: 1100,
            レートログ: {
                20210401: 1000,
                20210601: 1050,
                20210801: 1100,
            },
        };
        const sansu = {
            レート: 1100,
            レートログ: {
                20210401: 1000,
                20210801: 1100,
            },
        };
        const oo = {
            実施日時: '20210801',
            最低点数: 0,
            最高点数: 100,
            点数: 80,
        };
        const xx = {
            実施日時: '20210601',
            最低点数: 0,
            最高点数: 100,
            点数: 90,
        };
        const path = '講師1(firebase authで生成されたID)';
        // const path = "講師" + getUserData().uid;
        const path2 = 'XYZ塾5年生国語クラス(一意のクラス名)';
        const path3 = 'XYZ塾5年生算数クラス(一意のクラス名)';
        // await setDoc(doc(db, "users", path), data);
        // await setDoc(doc(db, `users/${path}/class`, path2), kokugo);
        // await setDoc(doc(db, `users/${path}/class`, path3), sansuu);
        // await setDoc(doc(db, `users/${path}/class/${path2}/tests`, "ABC模試"), oo);
        // await setDoc(doc(db, `users/${path}/class/${path2}/tests`, "xx模試"), xx);
        // await setDoc(doc(db, `users/${path}/class/${path3}/tests`, "xx模試"), xx);
        // const res = await getDocs(collection(db, "users"));
        // res.forEach(doc => {
        //     console.log(doc.id);
        // })
        // await signOut(auth);
        // await signUp("ken.babuo@gmail.com", "pass00");
        const a = {
            name: '石田健太郎',
        };
        const b = {
            name: '加藤木優斗',
        };
        const c = {
            name: '石川',
        };
        const d = {
            name: '加藤',
        };
        const arr = [a, b, c, d];
        // const e = "加藤";
        const e = vm.test;
        // const reg = new RegExp("^" + e);
        // const arr2 = arr.filter(obj => obj.name.match(reg));
        // console.log(arr2);
        const userID = auth.currentUser.uid;
        console.log(userID);
        // await setDoc(doc(db, `users/${userID}`), data);
        const classID = 'XYZ塾5年生国語クラス(一意のクラス名)';
        const testID = 'ABC模試';
        // クラスIDからテスト一覧を取得
        const q = query(
            collection(db, `tests`),
            where('クラス名(一意)', '==', classID)
        );
        const res = await getDocs(q);
        res.forEach((doc) => {
            console.log(doc.data());
        });
        // テスト
        const res2 = await getDoc(doc(db, `users/${userID}/class/${classID}`));
        const res3 = await getDoc(doc(db, `tests/${testID}`));
        console.log(res2.data());
        console.log(res3.data());
        const labels = [
            '第一回ABC模試',
            '第一回XX模試',
            '第一回塾内テスト',
            '第二回ABC模試',
            '第二回XX模試',
            '第二回じゅくないてすと',
        ];
        const data2 = {
            labels: labels,
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [50, 40, 49, 66, 61, 79, 70],
                },
            ],
        };
        const config = {
            type: 'line',
            data: data2,
            options: {},
        };
        const myChart = new Chart(document.getElementById('myChart'), config);
    });
});
