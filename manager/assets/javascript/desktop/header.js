define([
    "jquery",
    "define"
], function(
    jquery,
    define
) {
    return {
        show: function() {
            define.element.header.stop().css({
                display: "block",
                opacity: "0"
            }).animate({
                opacity: "1"
            }, define.time.animate_show);
        },

        getHeight: function() {
            return define.element.header.find("ul.action:first-child").height();
        }
    };
});