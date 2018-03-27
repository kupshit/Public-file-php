define([
    "jquery"
], function(jquery) {
    var selector = {
        containerFullSelector: "div#container-full",
        containerSelector:     "div#container",
        headerSelector:        "div#header",
        loadingSelector:       "div#loading",
        loadingNoticeSelector: "div#loading span.notice",
        alertSelector:         "div#alert",
        alertListSelector:     "div#alert > ul",
        loginSelector:         "div#login",
        sidebarSelector:       "div#sidebar",
        contentSelector:       "div#content",

        sidebarFileSelector:          "div#sidebar div.sidebar-file",
        sidebarFileListSelector:      "div#sidebar div.sidebar-file ul",
        sidebarFileListEntrySelector: "div#sidebar div.sidebar-file ul li",
        sidebarFileCursorSelector:    "div#sidebar div.sidebar-file div.cursor-hover",
        sidebarDatabaseSelector:      "div#sidebar div.sidebar-database",

        contentFileManagerSelector:               "div#content > ul > li.file-manager",
        contentFileManagerLocationSelector:       "div#content > ul > li.file-manager ul.file-location",
        contentFileManagerListSelector:           "div#content > ul > li.file-manager div.list-file",
        contentFileManagerListRenderSelector:     "div#content > ul > li.file-manager div.list-file ul.list"
    };

    var element = {
        containerFull:   jquery(selector.containerFullSelector),
        container:       jquery(selector.containerSelector),
        header:          jquery(selector.headerSelector),
        headerAction:    jquery(selector.headerActionSelector),
        contextmenu:     jquery(selector.contextmenuSelector),
        contextmenuList: jquery(selector.contextmenuListSelector),
        loading:         jquery(selector.loadingSelector),
        loadingNotice:   jquery(selector.loadingNoticeSelector),
        alert:           jquery(selector.alertSelector),
        alertList:       jquery(selector.alertListSelector),
        login:           jquery(selector.loginSelector),

        sidebar:         jquery(selector.sidebarSelector),
        content:         jquery(selector.contentSelector),

        sidebarFile:          jquery(selector.sidebarFileSelector),
        sidebarFileList:      jquery(selector.sidebarFileListSelector),
        sidebarFileListEntry: jquery(selector.sidebarFileListEntrySelector),
        sidebarFileCursor:    jquery(selector.sidebarFileCursorSelector),
        sidebarDatabase:      jquery(selector.sidebarDatabaseSelector),

        contentFileManager:               jquery(define.contentFileManagerSelector),
        contentFileManagerLocation:       jquery(define.contentFileManagerLocationSelector),
        contentFileManagerList:           jquery(define.contentFileManagerListSelector),
        contentFileManagerListRender:     jquery(define.contentFileManagerListRenderSelector)
    };

    return {
        code: {
            is_login:         1,
            is_not_login:     2,
            is_login_already: 4,
            is_login_error:   8
        },

        time: {
            animate_show:   200,
            animate_hidden: 200
        },

        selector: selector,
        element: element
    };
});