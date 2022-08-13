import { classData } from "firebase/firestoreTypes";

export default function getClassData(
    className: string
): Promise<classData | null>;
