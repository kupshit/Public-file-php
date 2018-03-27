define([
    "jquery",
    "define"
], function(
    jquery,
    define
) {
    return {
        containerFull:                    jquery(define.containerFullSelector),
        container:                        jquery(define.containerSelector),
        header:                           jquery(define.headerSelector),
        headerAction:                     jquery(define.headerActionSelector),
        contextmenu:                      jquery(define.contextmenuSelector),
        contextmenuList:                  jquery(define.contextmenuListSelector),
        loading:                          jquery(define.loadingSelector),
        loadingNotice:                    jquery(define.loadingNoticeSelector),
        alert:                            jquery(define.alertSelector),
        alertList:                        jquery(define.alertListSelector),
        login:                            jquery(define.loginSelector),

        sidebar:                          jquery(define.sidebarSelector),
        sidebarFile:                      jquery(define.sidebarFileSelector),
        sidebarFileList:                  jquery(define.sidebarFileListSelector),
        sidebarFileListEntry:             jquery(define.sidebarFileListEntrySelector),
        sidebarFileCursor:                jquery(define.sidebarFileCursorSelector),
        sidebarDatabase:                  jquery(define.sidebarDatabaseSelector),

        content:                          jquery(define.contentSelector),
        contentFileManager:               jquery(define.contentFileManagerSelector),
        contentFileManagerLocation:       jquery(define.contentFileManagerLocationSelector),
        contentFileManagerList:           jquery(define.contentFileManagerListSelector),
        contentFileManagerListRender:     jquery(define.contentFileManagerListRenderSelector)
    };
});