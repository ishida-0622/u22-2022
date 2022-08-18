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
            const user = await getUserData();
            if (!user) {
                return;
            }
            this.uid = user.uid;
            const classList = await getClassList(this.uid);
            if (!classList) {
                return;
            }
            const tmp = (
                await Promise.all(
                    classList.map(async (val) => await getStuInClass(val))
                )
            )
                .flatMap((val) => (!val ? [] : val))
                .sort((a, b) => {
                    return a.last_name_kana + a.first_name_kana >
                        b.last_name_kana + b.first_name_kana
                        ? 1
                        : -1;
                });
            const idSet = new Set<string>();
            tmp.forEach((val) => {
                if (!idSet.has(val.id)) {
                    this.allStudentList.push(val);
                    idSet.add(val.id);
                }
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
            window.location.href = `./stu-data.html?id=${id}`;
        },
    },
    created() {
        this.init();
    },
});
