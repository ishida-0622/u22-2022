import { stuData } from "firebase/firestoreTypes";
export default function getStuInClass(
    className: string
): Promise<stuData[] | null>;
