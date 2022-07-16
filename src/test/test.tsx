import React, { useState } from "react"
import { render } from "react-dom"
import { stuData } from "../firebase/firestoreTypes"
import getUserData from "../auth/userData"
import getTeacherData from "../components/getTeacherData"
import getStuInClass from "../components/getStuInClass.js"

const user = getUserData()
const uid = user ? user.uid : ""
const teacher = await getTeacherData(uid);
// const classList = await
const allStudentList = await getStuInClass("");

const App = () => {
    const [inputValue, setInputValue] = useState("");
    const [studentList, setStudentList] = useState<stuData[]>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(() => event.target.value)
    }

    const search = (val: string) => {
        ;
    }
    return (
        <div id="main">
            <input type="text" name="result" id="textBox" onChange={(event) => handleChange(event)} />
        </div>
    )
}

render(<App/>, document.querySelector("#app"))
