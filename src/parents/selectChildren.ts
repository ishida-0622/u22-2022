import getUserData from "../auth/getUserData";
import getParentsData from "../components/getParentsData";
import getStuData from "../components/getStuData";

const main = async () => {
    const userData = await getUserData();
    if (!userData) {
        return;
    }

    // 子供のuidリスト
    const children = (await getParentsData(userData.uid))?.children_id;
    if (!children) {
        return;
    }

    const selectBox = document.querySelector("select");

    // セレクトボックスに追加
    children.forEach(async (val) => {
        const child = await getStuData(val);
        const opt = document.createElement("option");
        opt.value = child!.id;
        opt.text = `${child!.last_name} ${child!.first_name}(${child!.id})`;
        selectBox!.add(opt);
    });
};

main();
