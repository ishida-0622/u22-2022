import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { stuData } from "../firebase/firestoreTypes";
// import getUserData from "../auth/userData";
import getClassList from "../components/getClassList";
import getStuInClass from "../components/getStuInClass.js";

const arrayMerge = (arr: stuData[][]) => {
    let res: stuData[] = [];
    arr.forEach((val) => {
        res = res.concat(val);
    });
    return Array.from(new Set(res));
};

// const user = getUserData();
// const uid = user ? user.uid : ""
const uid = "EjQWBubQ3oPR7KDOTplWxCLhe9b2";

const App = () => {
    const [inputValue, setInputValue] = useState("");
    const [allStudentList, setAllStudentList] = useState<stuData[]>([]);
    const [studentList, setStudentList] = useState<stuData[]>(allStudentList);
    useEffect(() => {
        const arrSet = async () => {
            const classList = await getClassList(uid);
            const tmp = await Promise.all(
                classList!.map(async (val) => await getStuInClass(val))
            );
            const allStudentList = arrayMerge(
                tmp.flatMap((val) => (val === null ? [] : [val]))
            ).sort((a, b) =>
                a.last_name_kana + a.first_name_kana >
                b.last_name_kana + b.first_name_kana
                    ? 1
                    : -1
            )
            setAllStudentList(allStudentList);
            setStudentList(allStudentList);
        };
        arrSet();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        search(event.target.value);
    };

    const search = (val: string) => {
        if (val === "") {
            setStudentList(allStudentList);
            return;
        }
        const re = new RegExp("^" + val);
        setStudentList(
            allStudentList.filter((val) =>
                (val.last_name + val.first_name).match(re)
            )
        );
    };

    return (
        <div id="main">
            <input
                type="text"
                name="result"
                id="textBox"
                value={inputValue}
                onChange={handleChange}
            />
            <div>
                {studentList.map((val) => {
                    return (
                        <>
                        <a href="/">{val.last_name + " " + val.first_name}</a><br />
                        </>
                    );
                })}
            </div>
        </div>
    );
};

render(<App />, document.querySelector("#app"));
