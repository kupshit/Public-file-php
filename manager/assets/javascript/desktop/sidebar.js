define([
    "ajax",
    "jquery",
    "define",
    "scroll",
    "contextmenu",
    "content",
    "header"
], function(
    ajax,
    jquery,
    define,
    scroll,
    contextmenu,
    content,
    header
) {
    return {
        file: {
            lang:  null,
            login: null,
            path:  null,

            init: function(lang, login) {
                this.lang  = lang;
                this.login = login;

                this.initFolderRoot();
                this.loadPath();
            },

            initFolderRoot: function() {
                var buffer  = "<li>";
                    buffer += "<p class=\"root\">";
                    buffer += "<span class=\"icomoon icon-folder\"></span>";
                    buffer += "<span>" + this.lang.get("default.loading") + "</span>";
                    buffer += "</p>";
                    buffer += "</li>";

                define.element.sidebarFileList.css({ top: header.getHeight() + "px" });
                define.element.sidebarFileList.html(buffer);
                this.repaintListEntry();
            },

            setPath: function(path) {
                this.path = path;
            },

            getPath: function() {
                return this.path;
            },

            loadPath: function(path, elementEntry) {
                var url  = ajax.script.index;
                var self = this;

                if (typeof path === "string")
                    url += "?directory=" + path;

                if (typeof elementEntry === "undefined" || elementEntry.get(0).tagName.toLowerCase() !== "p")
                    elementEntry = define.element.sidebarFileList.find("> li > p.root");

                var elementIcon   = elementEntry.find("span.icomoon");
                var elementParent = elementEntry.parent();

                if (elementIcon.hasClass("icon-folder-open")) {
                    elementIcon.removeClass("icon-folder-open").addClass("icon-folder");

                    elementParent.find("> p + ul").css({
                        display: "none"
                    }).html("");

                    return;
                }

                var request = ajax.open({
                    url: url,

                    begin: function() {
                        self.startSpinner(elementParent);
                    },

                    end: function() {
                        self.stopSpinner(elementParent);
                        self.repaintListEntry();
                        self.bindClickListEntry();
                    },

                    success: function(data) {
                        if (self.login.check(data)) {
                            var elementSubList = elementParent.find("> p + ul");

                            if (elementSubList.length <= 0) {
                                elementParent.append("<ul></ul>");
                                elementSubList = elementParent.find("> p + ul");
                            }

                            self.setPath(data.data.path);
                            self.renderDataList(elementSubList, data.data.path, data.data.list);
                            content.file.renderDataList(data.data.path, data.data.list);
                        }
                    }
                });
            },

            bindClickListEntry: function() {
                var self = this;

                define.element.sidebarFileList.find("p").each(function() {
                    var element = $(this);
                    var parent  = element.parent();

                    element.unbind("click").bind("click", function() {
                        self.loadPath(decodeURIComponent(parent.attr("path")), element);
                        console.log("Click: " + element);
                        console.log(parent);
                    }).unbind("contextmenu").bind("contextmenu", function(e) {
                        contextmenu.show(element, {
                            open:   "Mở",
                            copy:   "Sao chép",
                            move:   "Di chuyển",
                            delete: "Xóa",
                            chmod:  "Phân quyền",
                            info:   "Thông tin"
                        }, function(index, object) {
                            console.log(index);
                            console.log(object);
                        });

                        e.preventDefault();
                    });
                });
            },

            startSpinner: function(elementEntryLi) {
                var elementIcon = elementEntryLi.find("> p > span.icomoon");
                    elementIcon.removeClass("icon-folder")
                               .addClass("spinner-animation");
            },

            stopSpinner: function(elementEntryLi) {
                var elementIcon = elementEntryLi.find("> p > span.icomoon");
                    elementIcon.removeClass("spinner-animation")
                               .addClass("icon-folder");
            },

            is: false,

            renderDataList: function(elementSubList, dataPath, dataList) {
                elementSubList.stop().css({
                    display: "block",
                    opacity: 1
                });

                var self           = this;
                var pathSplits     = [];
                var pathSplitsTmp  = [];
                var pathSeparator  = "/";
                var pathBuffer     = "";
                var elementCurrent = define.element.sidebarFileList.find("> li");

                if (dataPath.indexOf("/") === 0) {
                    pathSplits.push("/");
                    dataPath = dataPath.substr(1);
                } else {
                    pathSeparator = "\\";
                }

                pathSplitsTmp = dataPath.split(pathSeparator);

                for (var i = 0; i < pathSplitsTmp.length; ++i)
                    pathSplits.push(pathSplitsTmp[i]);

                for (var i = 0; i < pathSplits.length; ++i) {
                    var pathOffset  = pathSplits[i];
                        pathBuffer += pathOffset;

                    if (i === 0) {
                        elementCurrent.find("> p > span:last-child")
                                      .html(pathOffset);

                        elementCurrent.find("> p > span.icomoon:first-child")
                                      .removeClass("icon-folder")
                                      .addClass("icon-folder-open");

                        if (pathSeparator === "\\")
                            pathBuffer += pathSeparator;
                    } else {
                        var elementSub  = elementCurrent.find("> ul > li[name=\"" + pathOffset + "\"]");

                        if (i + 1 < pathSplits.length)
                            pathBuffer += pathSeparator;

                        if (typeof elementSub === "undefined" || elementSub.length <= 0) {
                            var elementSubBuffer  = "<ul>";
                                elementSubBuffer += "<li name=\"" + pathOffset + "\" is_directory=\"true\">";
                                elementSubBuffer += "<p>";
                                elementSubBuffer += "<span class=\"icomoon icon-folder-open\"></span>";
                                elementSubBuffer += "<span>" + pathOffset + "</span>";
                                elementSubBuffer += "</p>";
                                elementSubBuffer += "</li>";
                                elementSubBuffer += "</ul>";

                            elementCurrent.append(elementSubBuffer);
                            elementSub = elementCurrent.find("> ul > li[name=\"" + pathOffset + "\"]");
                        }

                        elementCurrent = elementSub;
                        elementCurrent.find("> p:first-child > span:last-child").html(pathOffset);
                        elementCurrent.find("> p:first-child > span.icomoon:first-child").removeClass("icon-folder").addClass("icon-folder-open");
                        elementCurrent.attr("path", encodeURIComponent(pathBuffer));
                    }
                }

                var elementUl = elementCurrent;
                var buffer    = "";
                var entry     = null;

                if (elementUl.find("> p + ul").length <= 0)
                    elementUl.append("<ul></ul>");

                elementUl = elementUl.find("> p + ul").html("");

                for (var i = 0; i < dataList.length; ++i) {
                    entry = dataList[i];

                    if (entry.is_directory)
                        buffer += "<li name=\"" + entry.name + "\" is_directory=\"true\" path=\"" + encodeURIComponent(entry.path) + "\">";
                    else
                        buffer += "<li name=\"" + entry.name + "\" is_directory=\"false\" path=\"" + encodeURIComponent(entry.path) + "\">";

                    buffer += "<p>";

                    if (entry.is_directory)
                        buffer += "<span class=\"icomoon icon-folder\"></span>";
                    else
                        buffer += "<span class=\"icomoon " + entry.icon + "\"></span>";

                    buffer += "<span>" + entry.name + "</span>";
                    buffer += "</p>";
                    buffer += "</li>";
                }

                elementUl.append(buffer);
            },

            repaintListEntry: function() {
                define.element.sidebarFileList.find("li > p").each(function() {
                    var element     = $(this);
                    var parent      = element.parent().parent().parent();
                    var paddingLeft = 0;

                    if (typeof element.attr("class") === "undefined" || element.attr("class").indexOf("root") === -1)
                        paddingLeft += 15;
                    else
                        paddingLeft += 10;

                    if (typeof parent !== "undefined" && parent.get(0).tagName.toLowerCase() === "li") {
                        var elementLabel      = parent.find("p:first-child");
                        var parentPaddingLeft = elementLabel.css("paddingLeft");

                        if (typeof parentPaddingLeft === "undefined")
                            parentPaddingLeft = 5;
                        else if (parentPaddingLeft.indexOf("px") !== -1)
                            parentPaddingLeft = parseInt(parentPaddingLeft.substr(0, parentPaddingLeft.length - 2));
                        else
                            parentPaddingLeft = 10;

                        paddingLeft += parentPaddingLeft;
                    }

                    element.css({
                        paddingLeft: paddingLeft + "px"
                    });
                });
            }
        },

        database: {
            initDatabase: function() {

            }
        }
    };
});