define([
    "jquery",
    "define",
    "scroll",
    "contextmenu",
    "content"
], function(
    jquery,
    define,
    scroll,
    contextmenu,
    content
) {
    return {
        // isInitFixSizeChild: false,

        // fixSizeChild: function() {
        //     var self         = this;

        //     // Get window size
        //     var windowWidth  = jquery(window).width();
        //     var windowHeight = jquery(window).height();

        //     // Get header, sidebar size
        //     var headerHeight = define.element.header.height();
        //     var sidebarWidth = define.element.sidebar.width();

        //     // Css fix
        //     var cssFix = {
        //         display: self.isInitFixSizeChild == false ? "none" : "block",
        //         height: (windowHeight - headerHeight) + "px",
        //     };

        //     // Fix height
        //     define.element.container.css(cssFix);
        //     define.element.sidebar.css(cssFix);

        //     if (self.isInitFixSizeChild == false)
        //         define.element.loading.css(cssFix).css({ display: "block" });

        //     define.element.headerAction.find("li").each(function() {
        //         var element = $(this);
        //         var login   = element.attr("login");

        //         if (typeof login === "string" && login === "true") {
        //             element.css({
        //                 display: "none"
        //             });
        //         }
        //     });

        //     define.element.content.css(cssFix);
        //     define.element.content.css({ width: (windowWidth - sidebarWidth) + "px", left: sidebarWidth + "px" });
        //     define.element.header.css({ display: "block" });
        //     define.element.container.css({ display: "block", top: headerHeight + "px" });

        //     scroll.emulator(define.selector.sidebarFileSelector);
        //     content.file.fixSize();
        //     scroll.emulator(define.selector.contentFileManagerListSelector);

        //     if (self.isInitFixSizeChild)
        //         self.stopLoading();

        //     self.isInitFixSizeChild = true;
        // },

        // registerWindowOnResize: function() {
        //     var self = this;

        //     jquery(window).unbind("resize").bind("resize", function(handler) {
        //         self.fixSizeChild();
        //     });
        // },

        // registerDocumentOnMouseMove: function() {
        //     var self = this;

        //     jquery(document).unbind("mousemove").bind("mousemove", function(e) {
        //         contextmenu.onMouseMove(self, e);
        //     });
        // },

        startLoading: function(notice) {
            if (define.element.loading.css("display") === "block") {
                if (typeof notice === "string")
                    define.element.loadingNotice.html(notice);

                return;
            }

            if (typeof notice === "string")
                define.element.loadingNotice.html(notice);

            define.element.loading.css({ display: "block", opacity: 0 }).animate({ opacity: 1 }, define.time.animate_show);
        },

        stopLoading: function() {
            if (define.element.loading.css("display") === "none") {
                define.element.loadingNotice.html("");
                return;
            }

            define.element.loading.animate({ opacity: 0 }, define.time.animate_hidden, function() {
                define.element.loadingNotice.html("");

                define.element.loading.css({
                    display: "none"
                });
            });
        },

        show: function() {
            var css  = { display: "block", opacity: 0 };
            var anim = { opacity: 1 };

            define.element.sidebar        .stop().css(css).animate(anim, define.time.time_show);
            define.element.content.stop() .css(css).animate(anim, define.time.time_show);

            // define.element.sidebarFile    .stop().css(css).animate(anim, define.time.time_show);
            // define.element.sidebarDatabase.stop().css(css).animate(anim, define.time.time_show);

            // define.element.headerAction.find("li").each(function() {
            //     var element = $(this);
            //     var login   = element.attr("login");

            //     if (typeof login === "string" && login === "true")
            //         element.stop().css({
            //             display: "inline-block"
            //         }).animate(anim, define.selector.time_show);
            // });

            // scroll.emulator(define.selector.sidebarFileSelector);
            // scroll.emulator(define.selector.contentFileManagerListSelector);
        },

        hidden: function() {
            var css  = { display: "none" };
            var anim = { opacity: 0 };

            define.element.sidebar.stop().animate(anim, define.time.time_show, function() {
                $(this).css(css);
            });

            define.element.content.stop().animate(anim, define.time.time_show, function() {
                $(this).css(css);
            });
        }
    };
});