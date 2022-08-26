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

    // 1人ならページ遷移
    if (children.length === 1) {
        const child = await getStuData(children[0]);
        location.href = `./?id=${child!.id}`;
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
