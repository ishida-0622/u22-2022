import $ from "jquery";

// サイドバーを開閉する際の動きの実装

const openMenu = () => {
    $(".side_menu").css("animation-name", "openMenu");
};

const closeMenu = () => {
    $(".side_menu").css("animation-name", "closeMenu");
};

$("#open").on("click", openMenu);
$("#close").on("click", closeMenu);
