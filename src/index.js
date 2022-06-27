import signUp from "./auth/signup";
import $ from "jquery"
import getUserData from "./auth/userData"
import { doc, setDoc, addDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "./firebase/firebaseConfig"
import { signOut } from "firebase/auth"
import Vue from "./vue"

const vm = new Vue({
    el: "#main",
    data: {
        test: "",
        array: [],
    },
    methods: {
        changeFunc: () => {
            const a = {
                name: "石田健太郎"
            }
            const b = {
                name: "加藤木優斗"
            }
            const c = {
                name: "石川"
            }
            const d = {
                name: "加藤"
            }
            const arr = [a,b,c,d];
            const e = vm.test;
            const reg = new RegExp("^" + e);
            vm.array = arr.filter(obj => obj.name.match(reg)).map(val => val.name);
        }
    },
})

$(function () {
    $("#test").on("click", async () => {
        // signUp("test001@example.com", "pass00");
        console.log(getUserData());
    });
});
