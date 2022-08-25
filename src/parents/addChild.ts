import getUserData from "../auth/getUserData";
import zip from "../components/zip";
import getStuData from "../components/getStuData";
import getUid from "../components/getUid";
import getParentsData from "../components/getParentsData";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const main = async () => {
    const user = await getUserData();
    if (!user) {
        return;
    }

    const id = (
        document.getElementById("children-id") as HTMLInputElement
    ).value.split(",");
    const name = (
        document.getElementById("children-name") as HTMLInputElement
    ).value.split(",");

    if (id.length !== name.length) {
        alert("入力されたIDと名前の数が一致しません");
        return;
    }
    if (!(await check(id, name))) {
        alert("生徒が見つかりませんでした");
        return;
    }

    const parentData = await getParentsData(user.uid);
    const children = parentData!.children_id.concat(
        await Promise.all(id.map(async (v) => (await getUid(v))!))
    );
    await updateDoc(doc(db, `users/${user.uid}`), {
        children_id: children,
    })
        .then(() => {
            alert("追加しました");
            location.href = "./select-student.html";
        })
        .catch((e) => {
            alert("追加できませんでした");
            console.error(e.code);
        });
    return false;
};

const check = async (id: string[], name: string[]) => {
    if (id.length !== name.length) {
        return false;
    }
    for (const val of zip(id, name)) {
        const uid = await getUid(val[0]);
        if (!uid) {
            return false;
        }
        const stuData = await getStuData(uid);
        if (!stuData) {
            return false;
        }
        if (val[1] !== stuData.last_name + stuData.first_name) {
            return false;
        }
    }
    return true;
};

document.querySelector("form")!.onsubmit = async (e) => {
    e.preventDefault();
    await main();
};
