import Vue from "vue";
import getUserData from "../auth/getUserData.js";
import { stuData } from "firebase/firestoreTypes";
import getClassList from "../components/getClassList";
import getStuInClass from "../components/getStuInClass";

new Vue({
    el: "#app",
    data(): {
        inputValue: string;
        uid: string;
        allStudentList: stuData[];
        studentList: stuData[];
    } {
        return {
            inputValue: "",
            uid: "",
            allStudentList: [],
            studentList: [],
        };
    },
    methods: {
        init: async function () {
            // デバッグするなら下のコメントアウト削除
            // await (await import("../auth/login")).default("god.yamada@example.com", "godyamada")

            const user = getUserData();

            // ログインしているユーザーがいない場合ログイン画面に飛ばす
            if (user === null) {
                window.location.href = "/login.html";
                return;
            }
            this.uid = user.uid;
            const classList = await getClassList(this.uid);
            if (classList === null) {
                return;
            }
            const tmp = await Promise.all(
                classList.map(async (val) => await getStuInClass(val))
            );
            this.allStudentList = Array.from(
                new Set(tmp.flatMap((val) => (val === null ? [] : val)))
            ).sort((a, b) => {
                return a.last_name_kana + a.first_name_kana >
                    b.last_name_kana + b.first_name_kana
                    ? 1
                    : -1;
            });
            this.studentList = this.allStudentList;
        },
        search: function () {
            this.studentList = this.allStudentList.filter((val) =>
                (val.last_name + val.first_name).match(
                    new RegExp("^" + this.inputValue.replace(/\s+/g, ""))
                )
            );
        },
        pageTransition: function (id: string) {
            import("../components/getUid").then(async (module) => {
                const uid = await module.default(id);
                window.location.href = `./stu-data-teacher.html?id=${uid}`;
            });
        },
    },
    created() {
        this.init();
    },
});
