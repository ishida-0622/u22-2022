import { parentData } from "firebase/firestoreTypes";

export default function getParentsData(uid: string): Promise<parentData | null>;
