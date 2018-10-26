define([
    "ajax",
    "jquery",
    "scroll",
    "define",
    "contextmenu"
], function(
    ajax,
    jquery,
    scroll,
    define,
    contextmenu
) {
    var fileFunction = {
        parseSize: function(size) {
            if (size < 1024)
                return size + 'B';
            else if (size < 1048576)
                return Math.round(size / 1024, 2) + 'KB';
            else if (size < 1073741824)
                return Math.round(size / 1048576, 2) + 'MB';
            else
                return Math.round(size / 1073741824, 2) + 'GB';

            return size + 'B';
        }
    };

    return {
        file: {
            lang:  null,
            login: null,

            init: function(lang, login) {
                this.lang  = lang;
                this.login = login;

                this.fixSize();
            },

            fixSize: function() {
                var height         = define.element.contentFileManager.height();
                var locationHeight = define.element.contentFileManagerLocation.height();
                var listHeight     = height - locationHeight;

                define.element.contentFileManagerList.css({
                    height: listHeight + "px"
                });

                scroll.emulator(define.selector.contentFileManagerListSelector);
            },

            renderLocationPath: function(dataPath) {
                var pathSplits     = [];
                var pathSplitsTmp  = [];
                var pathSeparator  = "/";
                var pathBuffer     = "";
                var buffer         = "";

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

                    if ((i === 0 && pathSeparator === "\\") || i > 0)
                        pathBuffer += pathSeparator;

                    buffer += "<li path=\"" + encodeURIComponent(pathBuffer) + "\">";
                    buffer += "<span class=\"label\">" + pathOffset + "</span>";

                    if (i + 1 < pathSplits.length)
                        buffer += "<span class=\"separator\"></span>";

                    buffer += "</li>";
                }

               define.element.contentFileManagerLocation.html(buffer);
            },

            renderDataList: function(dataPath, dataList) {
                this.renderLocationPath(dataPath);

                define.element.contentFileManagerList.stop().css({
                    display: "inline-block",
                    opacity: 0
                });

                define.element.contentFileManagerListRender.find("div:only-child").each(function() {
                    $(this).unbind("click contextmenu");
                });

                var buffer = "";
                var entry  = null;

                for (var i = 0; i < dataList.length; ++i) {
                    entry = dataList[i];

                    if (entry.is_directory)
                        buffer += "<li name=\"" + entry.name + "\" is_directory=\"true\" path=\"" + encodeURIComponent(entry.path) + "\">";
                    else
                        buffer += "<li name=\"" + entry.name + "\" is_directory=\"false\" path=\"" + encodeURIComponent(entry.path) + "\">";

                    buffer += "<div>";
                    buffer += "<p class=\"label\">";

                    if (entry.is_directory)
                        buffer += "<span class=\"icomoon icon-folder\"></span>";
                    else
                        buffer += "<span class=\"icomoon " + entry.icon + "\"></span>";

                    buffer += "<span class=\"filename\">" + entry.name + "</span>";
                    buffer += "</p>";
                    buffer += "<p class=\"info\">";

                    if (entry.is_directory == false)
                        buffer += "<span class=\"size\">" + fileFunction.parseSize(entry.size) + "</span><span>,</span>";

                    buffer += "<span class=\"perms\">" + entry.perms + "</span>";
                    buffer += "</p>";
                    buffer += "</li>";
                }

                define.element.contentFileManagerListRender.html(buffer).find("div:only-child").each(function() {
                    var element = $(this);

                    element.unbind("click contextmenu").bind("click", function() {
                        var element = $(this);

                        console.log("Click");
                        console.log(element);
                    }).bind("contextmenu", function(e) {
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

                define.element.contentFileManagerList.animate({
                    opacity: 1
                }, define.time.animate_show);
            }
        }
    };
});