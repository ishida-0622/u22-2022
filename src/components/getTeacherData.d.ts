import { teacherData } from "../firebase/firestoreTypes";

export default function getTeacherData(
    uid: string
): Promise<teacherData | null>;
