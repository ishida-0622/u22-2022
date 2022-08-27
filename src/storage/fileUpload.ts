import { storage } from "../firebase/firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";

const fileUpload = async (path: string, element: HTMLInputElement) => {
    const files = element.files;
    if (!files || files.length === 0) {
        return;
    }
    const file = files[0];
    const fileRef = ref(storage, path);
    if (file.size > 1024 ** 2) {
        alert("サイズが大きすぎます");
        element.value = "";
        return;
    }

    await uploadBytes(fileRef, file).catch((e) => {
        console.error(e);
    });
};

export default fileUpload;
