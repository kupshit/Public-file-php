<?php

    use Librarys\File\FileInfo;
    use Librarys\Zip\PclZip;

    define('LOADED', 1);
    set_time_limit(0);
    require_once('incfiles' . DIRECTORY_SEPARATOR . 'global.php');

    function pathIgone($path) {
        $array = [
            '.git',
            '.gitattributes',
            '.gitignore',
            'gulpfile.js',
            'package.json',
            'asset.php',
            'build.php',
            'transalate.php',

            'assets/backup',
            'assets/config/manager.php',
            'assets/config/user.php',
            'assets/cache',
            'assets/javascript/desktop',
            'assets/javascript/dev',
            'assets/javascript/lib/history.js',
            'assets/javascript/app.js',
            'assets/theme/include',
            'assets/theme/default/sass',
            'assets/theme/transparent/sass',
            'assets/theme/default/theme.css',
            'assets/theme/transparent/theme.css',
            'assets/theme/default/theme_desktop.css',
            'assets/theme/transparent/theme_desktop.css',
            'assets/theme/default/theme_desktop.min.css',
            'assets/theme/transparent/theme_desktop.min.css',
            'assets/tmp',
            'assets/token',
            'assets/user',
            'node_modules'
        ];

        foreach ($array AS $filename) {
            $filepath = FileInfo::filterPaths(env('app.path.root') . SP . $filename);

            if (strpos($path, $filepath) === 0)
                return true;
        }

        return false;
    }

    function scanBuild($pathSrc, $pathDest) {
        $handle = FileInfo::scanDirectory($pathSrc);

        if ($handle === false || is_array($handle) == false)
            return false;

        if (FileInfo::isTypeDirectory($pathDest) == false)
            FileInfo::mkdir($pathDest, true);

        foreach ($handle AS $filename) {
            if ($filename != '.' && $filename != '..') {
                $filepath     = FileInfo::filterPaths($pathSrc  . SP . $filename);
                $filepathDest = FileInfo::filterPaths($pathDest . SP . $filename);

                if (pathIgone($filepath) == false) {
                    if (FileInfo::isTypeDirectory($filepath)) {
                        if (scanBuild($filepath, $filepathDest) == false)
                            return false;
                    } else if (FileInfo::copySystem($filepath, $filepathDest) == false) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    function zipBuild($filepath, $pathDest) {
        if (FileInfo::fileExists($filepath))
            FileInfo::unlink($filepath);

        $zip    = new PclZip($filepath);
        $handle = FileInfo::scanDirectory($pathDest);

        foreach ($handle AS $filename) {
            if ($filename != '.' && $filename != '..' && $filename != 'bin.zip') {
                $entryPath = FileInfo::filterPaths($pathDest . SP . $filename);

                if ($zip->add($entryPath, PCLZIP_OPT_REMOVE_PATH, $pathDest) == false)
                    return false;
            }
        }

        return true;
    }

    $pathSrc  = env('app.path.root');
    $pathDest = dirname(env('app.path.root')) . SP . 'Distro-Manager' . SP . 'manager';

    if (FileInfo::fileExists($pathDest))
        FileInfo::rrmdirSystem($pathDest);

    FileInfo::mkdir($pathDest, true);

    if (scanBuild(
        $pathSrc,
        $pathDest
    ))
        echo 'Build success';
    else
        echo 'Build failed';

    echo '<br/>';

    if (zipBuild(FileInfo::filterPaths($pathDest . SP . 'bin.zip'), $pathDest))
        echo 'Zip bin success';
    else
        echo 'Zip bin failed';

    echo '<br/>';

    if (zipBuild(FileInfo::filterPaths($pathDest . SP . 'additional.zip'), $pathDest))
        echo 'Zip additional success';
    else
        echo 'Zip additional failed';
