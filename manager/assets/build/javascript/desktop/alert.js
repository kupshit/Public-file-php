define([
    "jquery",
    "define"
], function(
    jquery,
    define
) {
    return {
        maxShow:  5,
        timeShow: 3000,

        type: {
            danger:  "danger",
            success: "success",
            info:    "info",
            warning: "warning"
        },

        arrays: [],

        init: function() {
            this.listenShow();
        },

        add: function(message, type) {
            if (!type)
                type = this.type.danger;

            this.arrays.push({
                message: message,
                type:    type
            });

            this.notifyChange();
        },

        notifyChange: function() {

        },

        listenShow: function() {
            var self = this;

            setInterval(function() {
                if (typeof self.arrays === "undefined")
                    return;

                var elementAlert     = define.element.alert;
                var elementAlertList = define.element.alertList;
                var lengthArray      = self.arrays.length;
                var lengthElement    = elementAlertList.get(0).childElementCount;

                if (lengthArray > 0) {
                    var entryArray  = self.arrays[0];
                    var buffer      = "<li class=\"" + entryArray.type + "\">";
                        buffer     += "<span>" + entryArray.message + "</span>";
                        buffer     += "</li>";

                    if (lengthElement >= self.maxShow || elementAlertList.get(0).scrollHeight > elementAlert.outerHeight()) {
                        var elementFist = elementAlertList.find("li:first-child");

                        elementFist.css({
                            display: "block",
                            width: elementFist.width(),
                            height: elementFist.height()
                        }).animate({
                            opacity: 0,
                            marginLeft: elementAlert.width() + "px",
                            marginTop:  "-" + elementFist.height() + "px",
                        }, 100, function() {
                            elementFist.remove();
                        });
                    }

                    elementAlertList.append(buffer);
                    elementAlert.css({ display: "block" });
                    self.arrays.splice(0, 1);

                    var elementNew = elementAlertList.find("li:last-child");

                    if (elementNew.length && elementNew.length > 0)
                        elementNew.attr("time", Date.now());
                } else if (lengthElement > 0) {
                    var timeNow  = Date.now();
                    var timeNext = 0;

                    elementAlertList.find("li").each(function(entry, a) {
                        var element = $(this);
                        var time    = parseInt(element.attr("time")) + timeNext;

                        if (time + self.timeShow <= timeNow) {
                            element.css({
                                display: "block",
                                width: element.width(),
                                height: element.height()
                            }).animate({
                                opacity: 0,
                                marginLeft: elementAlert.width() + "px",
                                marginTop:  "-" + element.height() + "px",
                            }, 100, function() {
                                element.remove();
                            });
                        }

                        timeNext += self.timeShow;
                    });
                }
            }, 100);
        }
    };
});