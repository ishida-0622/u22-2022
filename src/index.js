import signUp from "./auth/signup";
import $ from "jquery"
import getUserData from "./auth/userData"
import { doc, setDoc, addDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "./firebase/firebaseConfig"
import { signOut } from "firebase/auth"
import Vue from "./vue"

$(function () {
    $("#test").on("click", async () => {
        // signUp("test001@example.com", "pass00");
        console.log(getUserData());
    });
});
