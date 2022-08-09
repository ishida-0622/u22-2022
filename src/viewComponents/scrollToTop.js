import $ from "jquery";

// トップに戻るボタンの実装(body下部読み込み)

let showPageTop = false;
const PAGETOP = $("#pageTop");

$(window).on("scroll", () => {
    if ($(window).scrollTop() > 10) {
        if (!showPageTop) {
            showPageTop = true;
            PAGETOP.stop().animate({ opacity: "0.5" }, 300);
            PAGETOP.css("pointer-events", "fill");
        }
    } else {
        if (showPageTop) {
            showPageTop = false;
            PAGETOP.stop().animate({ opacity: "0" }, 300);
            PAGETOP.css("pointer-events", "none");
        }
    }
});
