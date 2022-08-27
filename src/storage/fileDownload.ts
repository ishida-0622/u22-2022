import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

const fileDownload = async (path: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        const pathRef = ref(storage, path);
        getDownloadURL(pathRef)
            .then((url) => {
                resolve(url);
            })
            .catch(() => {
                reject(null);
            });
    });
};

export default fileDownload;
