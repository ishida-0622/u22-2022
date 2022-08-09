/*
    パスワードの表示と非表示を切り替える関数
    最大3つまでのパスワードフォームに対応可能
    それぞれの関数に対応するhtmlは各関数に記載
*/

/**
 * 目のアイコンをクリックすることで、通常パスワードの表示と非表示を切り替える関数
 * <div class="password-input-area">
        <input type="password" placeholder="password" class="text-password" id="inputed-password" required>
        <span class="fa fa-eye" id="password-eye"></span>
    </div>
 */
const showHidePassword = () => {
    const txtPass = document.getElementById("inputed-password");
    const btnEye = document.getElementById("password-eye");

    if (txtPass.type === "text") {
        txtPass.type = "password";
        btnEye.className = "fa fa-eye";
    } else {
        txtPass.type = "text";
        btnEye.className = "fa fa-eye-slash";
    }
}

/**
 * 目のアイコンをクリックすることで、新規パスワードの表示と非表示を切り替える関数
 * <div class="password-input-area">
        <input type="password" placeholder="password" class="text-password" id="new-inputed-password" required>
        <span class="fa fa-eye" id="new-password-eye"></span>
    </div>
 */
const showHideNewPassword = () => {
    const txtPass = document.getElementById("new-inputed-password");
    const btnEye = document.getElementById("new-password-eye");

    if (txtPass.type === "text") {
        txtPass.type = "password";
        btnEye.className = "fa fa-eye";
    } else {
        txtPass.type = "text";
        btnEye.className = "fa fa-eye-slash";
    }
}

/**
 * 目のアイコンをクリックすることで、再入力パスワードの表示と非表示を切り替える関数
 * <div class="password-input-area">
        <input type="password" placeholder="password" class="text-password" id="re-inputed-password" required>
        <span class="fa fa-eye" id="re-password-eye"></span>
    </div>
 */
const showHideRePassword = () => {
    const txtPass = document.getElementById("re-inputed-password");
    const btnEye = document.getElementById("re-password-eye");

    if (txtPass.type === "text") {
        txtPass.type = "password";
        btnEye.className = "fa fa-eye";
    } else {
        txtPass.type = "text";
        btnEye.className = "fa fa-eye-slash";
    }
}

// 各idでonclickを設定
document.getElementById("password-eye").onclick = showHidePassword;
document.getElementById("new-password-eye").onclick = showHideNewPassword;
document.getElementById("re-password-eye").onclick = showHideRePassword;
