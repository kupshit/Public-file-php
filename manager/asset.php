<?php

    use Librarys\Language;
    use Librarys\App\AppAssets;
    use Librarys\App\AppDirectory;
    use Librarys\File\FileInfo;
    use Librarys\Http\Request;
    use Librarys\Http\Secure\CFSRToken;

    define('LOADED',               1);
    define('INDEX',                1);
    define('DISABLE_CHECK_LOGIN',  1);
    define('ENABLE_CUSTOM_HEADER', 1);

    require_once('incfiles' . DIRECTORY_SEPARATOR . 'global.php');
    requireDefine('asset');

    if (CFSRToken::getInstance()->validateGet() !== true)
        die(lng('default.global.cfsr_token_not_validate'));

    if (isset($_GET[ASSET_PARAMETER_LOAD_LANG]) && Request::isDesktop()) {
        $json = Language::toJson(null);

        if (is_string($json) == false)
            die(lng('default.resource.file_not_found'));

        echo $json;
    } else {
        die(lng('default.resource.file_not_found'));
    }

?>