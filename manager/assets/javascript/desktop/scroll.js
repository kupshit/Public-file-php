define([
    "jquery"
], function(
    jquery
) {
    return {
        scrollMargin: 10,
        scrollMin:    30,

        emulator: function(selector) {
            if (typeof selector === "undefined") {
                console.log("Selector scroll is null");
                return false;
            }

            var element = selector;

            if (typeof element === "string")
                element = jquery(element);

            if (element.hasClass("scroll-wrapper") == false)
                element = element.find("scroll-wrapper");
            else if (element.parent().hasClass("scroll-wrapper"))
                element = element.parent();

            this.addScrollThumb(element);
            this.bindScrollThumb(element);
        },

        addScrollThumb: function(selector) {
            var element = selector;

            if (typeof element === "string")
                element = jquery(element);

            var scrollVertical   = element.find("div.scroll-vertical");
            var scrollHorizontal = element.find("div.scroll-horizontal");
            var scrollContent    = element.find("div.scroll-content");

            if (!scrollContent)
                return false;

            if (!scrollVertical.length || scrollVertical.length <= 0)
                element.append("<div class=\"scroll-vertical\"></div>");

            if (!scrollHorizontal.length || scrollHorizontal.length <= 0)
                element.append("<div class=\"scroll-horizontal\"></div>");

            var scrollVertical   = element.find("div.scroll-vertical");
            var scrollHorizontal = element.find("div.scroll-horizontal");

            var elementScrollWidth  = scrollContent.get(0);
            var elementScrollHeight = scrollContent.get(0);

            if (elementScrollWidth.scrollWidth)
                elementScrollWidth = elementScrollWidth.scrollWidth;
            else
                elementScrollWidth = this.scrollMin;

            if (elementScrollHeight.scrollHeight)
                elementScrollHeight = elementScrollHeight.scrollHeight;
            else
                elementScrollHeight = this.scrollMin;

            var elementWidth  = element.width()  || scrollContent.width();
            var elementHeight = element.height() || scrollContent.outerHeight();

            var scrollHorizontalRatio = elementScrollWidth  / (elementWidth  - (this.scrollMargin << 1));
            var scrollVerticalRatio   = elementScrollHeight / (elementHeight - (this.scrollMargin << 1));

            var scrollHorizontalThumb = Math.ceil(elementWidth  / scrollHorizontalRatio);
            var scrollVerticalThumb   = Math.ceil(elementHeight / scrollVerticalRatio);

            scrollHorizontal.css({
                left:  this.scrollMargin,
                width: scrollHorizontalThumb + "px"
            });

            scrollVertical.css({
                top:    this.scrollMargin,
                height: scrollVerticalThumb + "px"
            });
        },

        bindScrollThumb: function(selector) {
            var element = selector;

            if (typeof element === "string")
                element = jquery(element);

            var self                   = this;
            var elementWidth           = element.width();
            var elementHeight          = element.height();
            var scrollVertical         = element.find("div.scroll-vertical");
            var scrollHorizontal       = element.find("div.scroll-horizontal");
            var scrollContent          = element.find("div.scroll-content");
            var scrollContentEndLeft   = scrollContent.get(0);
            var scrollContentEndTop    = scrollContent.get(0);
            var windowElement          = jquery(window);
            var documentElement        = jquery(document);
            var windowPageXCurrent     = 0;
            var windowPageXPrev        = 0;
            var windowPageYCurrent     = 0;
            var windowPageYPrev        = 0;
            var scrollHorizontalOffset = 0;
            var scrollHorizontalBegin  = 0;
            var scrollHorizontalEnd    = 0;
            var scrollVerticalOffset   = 0;
            var scrollVerticalBegin    = 0;
            var scrollVerticalEnd      = 0;
            var scrollHorizontalDown   = false;
            var scrollVerticalDown     = false;

            if (!scrollVertical || !scrollHorizontal)
                this.addScrollThumb(element);

            scrollContentEndLeft = scrollContentEndLeft.scrollWidth - scrollContent.outerWidth();
            scrollContentEndTop  = scrollContentEndTop.scrollHeight - scrollContent.outerHeight();

            // element.unbind("resize").bind("resize", function(handler) {
            //     elementWidth           = element.width();
            //     elementHeight          = element.height();
            //     scrollContentEndLeft   = scrollContent.get(0).scrollWidth  - elementWidth;
            //     scrollContentEndTop    = scrollContent.get(0).scrollHeight - elementHeight;

            //     scrollContent.scrollTop(0);
            //     scrollContent.scrollLeft(0);
            //     self.checkScroll(selector);
            // });

            scrollContent.unbind("DOMSubtreeModified DOMNodeInserted DOMNodeRemoved").bind("DOMSubtreeModified DOMNodeInserted DOMNodeRemoved", function(e) {

                elementWidth           = element.width();
                elementHeight          = element.height();
                scrollContentEndLeft   = scrollContent.get(0).scrollWidth  - elementWidth;
                scrollContentEndTop    = scrollContent.get(0).scrollHeight - elementHeight;

                self.addScrollThumb(element);
                self.checkScroll(selector);

                if (scrollHorizontalDown == false) {
                    var scrollHorizontalOffset = scrollContent.scrollLeft() / scrollContentEndLeft;
                    var scrollHorizontalEnd    = elementWidth - scrollHorizontal.width() - (self.scrollMargin << 1);

                    scrollHorizontal.css({ left: Math.floor(scrollHorizontalOffset * scrollHorizontalEnd + self.scrollMargin) + "px" });
                }

                if (scrollVerticalDown == false) {
                    var scrollVerticalOffset = scrollContent.scrollTop() / scrollContentEndTop;
                    var scrollVerticalEnd    = elementHeight - scrollVertical.height() - (self.scrollMargin << 1);

                    scrollVertical.css({ top: Math.floor(scrollVerticalOffset * scrollVerticalEnd + self.scrollMargin) + "px" });
                }
            });

            this.checkScroll(selector);

            scrollHorizontal.unbind("mousedown").bind("mousedown", function(e) {
                e.preventDefault();

                documentElement.unbind("mouseup").bind("mouseup", function(e) {
                    e.preventDefault();
                    windowElement.unbind("mousemove");
                    documentElement.unbind("mouseup");

                    windowPageXCurrent   = 0;
                    windowPageXPrev      = 0;
                    scrollHorizontalDown = false;
                });

                scrollHorizontalDown = true;

                windowElement.unbind("mousemove").bind("mousemove", function(e) {
                    windowPageXCurrent     = e.pageX;
                    scrollHorizontalOffset = scrollHorizontal.css("left");
                    scrollHorizontalBegin  = self.scrollMargin;
                    scrollHorizontalEnd    = elementWidth - scrollHorizontal.width() - self.scrollMargin;

                    if (scrollHorizontalOffset.indexOf("px") !== -1)
                        scrollHorizontalOffset = scrollHorizontalOffset.substr(0, scrollHorizontalOffset.length - 2);

                    if (windowPageXPrev === 0)
                        windowPageXPrev = windowPageXCurrent;

                    scrollHorizontalOffset = parseInt(scrollHorizontalOffset);

                    if (windowPageXCurrent < windowPageXPrev)
                        scrollHorizontalOffset -= windowPageXPrev - windowPageXCurrent;
                    else if (windowPageXCurrent > windowPageXPrev)
                        scrollHorizontalOffset += windowPageXCurrent - windowPageXPrev;

                    if (scrollHorizontalOffset <= scrollHorizontalBegin)
                        scrollHorizontalOffset = scrollHorizontalBegin;

                    if (scrollHorizontalOffset >= scrollHorizontalEnd)
                        scrollHorizontalOffset = scrollHorizontalEnd;

                    scrollHorizontal.css({ left: (scrollHorizontalOffset) + "px" });
                    scrollContent.scrollLeft(((scrollHorizontalOffset - self.scrollMargin) / (scrollHorizontalEnd - self.scrollMargin)) * scrollContentEndLeft);

                    windowPageXPrev = windowPageXCurrent;
                });
            });

            scrollVertical.unbind("mousedown").bind("mousedown", function(e) {
                e.preventDefault();

                documentElement.unbind("mouseup").bind("mouseup", function(e) {
                    e.preventDefault();
                    windowElement.unbind("mousemove");
                    documentElement.unbind("mouseup");

                    windowPageYCurrent = 0;
                    windowPageYPrev    = 0;
                    scrollVerticalDown = false;
                });

                scrollVerticalDown = true;

                windowElement.unbind("mousemove").bind("mousemove", function(e) {
                    windowPageYCurrent   = e.pageY;
                    scrollVerticalOffset = scrollVertical.css("top");
                    scrollVerticalBegin  = self.scrollMargin;
                    scrollVerticalEnd    = elementHeight - scrollVertical.height() - self.scrollMargin;

                    if (scrollVerticalOffset.indexOf("px") !== -1)
                        scrollVerticalOffset = scrollVerticalOffset.substr(0, scrollVerticalOffset.length - 2);

                    if (windowPageYPrev === 0)
                        windowPageYPrev = windowPageYCurrent;

                    scrollVerticalOffset = parseInt(scrollVerticalOffset);

                    if (windowPageYCurrent < windowPageYPrev)
                        scrollVerticalOffset -= windowPageYPrev - windowPageYCurrent;
                    else if (windowPageYCurrent > windowPageYPrev)
                        scrollVerticalOffset += windowPageYCurrent - windowPageYPrev;

                    if (scrollVerticalOffset < scrollVerticalBegin)
                        scrollVerticalOffset = scrollVerticalBegin;

                    if (scrollVerticalOffset > scrollVerticalEnd)
                        scrollVerticalOffset = scrollVerticalEnd;

                    scrollVertical.css({ top: scrollVerticalOffset + "px" });
                    scrollContent.scrollTop(((scrollVerticalOffset - self.scrollMargin) / (scrollVerticalEnd - self.scrollMargin)) * scrollContentEndTop);

                    windowPageYPrev = windowPageYCurrent;
                });
            });

            scrollContent.unbind("scroll").bind("scroll", function() {
                if (scrollHorizontalDown == false) {
                    var scrollHorizontalOffset = scrollContent.scrollLeft() / scrollContentEndLeft;
                    var scrollHorizontalEnd    = elementWidth - scrollHorizontal.width() - (self.scrollMargin << 1);

                    scrollHorizontal.css({ left: Math.floor(scrollHorizontalOffset * scrollHorizontalEnd + self.scrollMargin) + "px" });
                }

                if (scrollVerticalDown == false) {
                    var scrollVerticalOffset = scrollContent.scrollTop() / scrollContentEndTop;
                    var scrollVerticalEnd    = elementHeight - scrollVertical.height() - (self.scrollMargin << 1);

                    scrollVertical.css({ top: Math.floor(scrollVerticalOffset * scrollVerticalEnd + self.scrollMargin) + "px" });
                }
            });
        },

        checkScroll: function(selector) {
            var element = selector;

            if (typeof element === "string")
                element = jquery(element);

            var self             = this;
            var scrollVertical   = element.find("div.scroll-vertical");
            var scrollHorizontal = element.find("div.scroll-horizontal");
            var scrollContent    = element.find("div.scroll-content");

            if (scrollContent.get(0).scrollWidth <= scrollContent.outerWidth())
                scrollHorizontal.css({ opacity: 0 });
            else
                scrollHorizontal.css({ opacity: 1 });

            if (scrollContent.get(0).scrollHeight <= scrollContent.outerHeight())
                scrollVertical.css({ opacity: 0 });
            else
                scrollVertical.css({ opacity: 1 });
        }
    };
});