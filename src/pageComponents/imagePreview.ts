const imagePreview = (
    element: HTMLInputElement,
    imageElement: HTMLImageElement,
    maxSize: number = 1024 ** 2
) => {
    const files = element.files;
    if (!files) {
        return;
    }
    if (files.length === 0) {
        return;
    }
    const file = files[0];
    if (file.size > maxSize) {
        alert("サイズが大きすぎます");
        element.value = "";
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === "string") {
            imageElement.src = reader.result;
        }
    };
};

export default imagePreview;
