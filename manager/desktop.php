<?php

    if (defined('LOADED') == false)
        exit;

    use Librarys\App\AppAssets;
    use Librarys\App\AppDirectory;
    use Librarys\App\Config\AppConfig;
    use Librarys\Http\Request;

    requireDefine('asset');

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Manager </title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex, nofollow, noodp, nodir"/>
        <meta name="Cache-Control" content="private, max-age=0, no-cache, no-store, must-revalidate"/>
        <meta name="Pragma" content="no-cache"/>
        <meta name="Expires" content="Thu, 01 Jan 1970 00:00:00 GMT">

        <link
            rel="icon"
            type="image/png"
            href="<?php echo AppAssets::makeURLResourceIcon(AppConfig::getInstance()->get('theme.directory'), env('resource.filename.icon.favicon_png')); ?>"/>

        <link
            rel="icon"
            type="image/x-icon"
            href="<?php echo AppAssets::makeURLResourceIcon(AppConfig::getInstance()->get('theme.directory'), env('resource.filename.icon.favicon_ico')); ?>"/>

        <link
            rel="shortcut icon"
            type="image/x-icon"
            href="<?php echo AppAssets::makeURLResourceIcon(AppConfig::getInstance()->get('theme.directory'), env('resource.filename.icon.favicon_ico')); ?>"/>

        <link
            rel="stylesheet"
            type="text/css"
            media="all"
            href="<?php echo AppAssets::makeURLResourceTheme(AppConfig::getInstance()->get('theme.directory'), env('resource.filename.theme.app_desktop')); ?>"/>

        <?php if (Request::isLocal()) { ?>
            <script
                async
                type="text/javascript"
                src="<?php echo AppAssets::makeURLResourceJavascript(env('resource.filename.javascript.desktop.file.require'), env('resource.filename.javascript.desktop.directory.lib')); ?>"
                data-main="<?php echo AppAssets::makeURLResourceJavascript(env('resource.filename.javascript.desktop.file.bundle')); ?>"></script>
        <?php } else { ?>
            <script
                async
                type="text/javascript"
                src="<?php echo AppAssets::makeURLResourceJavascript(env('resource.filename.javascript.desktop.file.app_min')); ?>"></script>
        <?php } ?>

        <script type="text/javascript">
            window.addEventListener("load", function() {
                if (typeof require !== "undefined")
                    require([ "main" ]);
            })
        </script>
    </head>
    <body token-name="<?php echo cfsrTokenName(); ?>" token-value="<?php echo cfsrTokenValue(); ?>">
        <div id="container-full">
            <div id="header">
                <ul class="action left">
                    <li><span class="icomoon icon-home"></span></li>
                </ul>
                <ul class="action right">
                    <li><span class="icomoon icon-database"></span></li>
                    <li><span class="icomoon icon-setting"></span></li>
                    <li><span class="icomoon icon-about"></span></li>
                    <li><span class="icomoon icon-exit"></span></li>
                </ul>
            </div>
            <div id="container">
                <div id="sidebar">
                    <div class="sidebar-file scroll-wrapper">
                        <div class="scroll-content">
                            <ul class="list-file"></ul>
                        </div>
                    </div>
                    <div class="sidebar-database scroll-wrapper">
                        <div class="scroll-content">

                        </div>
                    </div>
                </div>
                <div id="content">
                    <ul>
                        <li class="file-manager">
                            <ul class="file-location"></ul>
                            <div class="list-file scroll-wrapper">
                                <div class="scroll-content">
                                    <ul class="list thumb"></ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div id="login">
                    <form action="#" method="post" onsubmit="return false" autocomplete="off">
                        <ul>
                            <li class="input">
                                <input type="text" name="username" value="" lng="user.login.form.input_username_placeholder" autocomplete="off"/>
                                <span class="icomoon icon-user"></span>
                            </li>
                            <li class="input">
                                <input type="password" name="password" value="" lng="user.login.form.input_password_placeholder" autocomplete="off"/>
                                <span class="icomoon icon-key"></span>
                            </li>
                            <li class="button">
                                <button type="submit" name="login">
                                    <span lng="user.login.form.button_login"></span>
                                </button>
                                <a href="#">
                                    <span lng="user.login.form.forgot_password"></span>
                                </a>
                            </li>
                        </ul>
                    </form>
                </div>
<!--                 <div id="contextmenu">
                    <ul>
                        <li><p><span>Open</span></p></li>
                        <li><p><span>Open with...</span></p></li>
                        <li><p><span>Copy</span></p></li>
                        <li><p><span>Move</span></p></li>
                        <li><p><span>Delete</span></p></li>
                        <li><p><span>Chmod</span></p></li>
                    </ul>
                </div> -->
                <div id="alert">
                    <ul></ul>
                </div>
                <div id="loading">
                    <div id="box">
                        <span class="spinner-animation"></span>
                        <span class="notice"><?php echo lng('default.loading'); ?></span>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>