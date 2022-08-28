import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

const fileDownload = async (path: string): Promise<string | null> => {
    return new Promise((resolve) => {
        const pathRef = ref(storage, path);
        getDownloadURL(pathRef)
            .then((url) => {
                resolve(url);
            })
            .catch(() => {
                resolve(null);
            });
    });
};

export default fileDownload;
