<?php

    namespace Librarys\App;

    use Librarys\App\AppDirectory;
    use Librarys\File\FileInfo;
    use Librarys\Http\Request;
    use Librarys\App\Config\AppConfig;
    use Librarys\App\Config\AppAboutConfig;
    use Librarys\App\Config\AppAssetsConfig;
    use Librarys\Exception\RuntimeException;

    final class AppAssets
    {

        private static $uid;
        private static $rand;
        private static $device;

        const DEVICE_BASIC   = 'basic';
        const DEVICE_DESKTOP = 'desktop';

        public static function getDeviceType()
        {
            if (self::$device == null) {
                if (Request::isDesktop(false))
                    self::$device = self::DEVICE_DESKTOP;
                else
                    self::$device = self::DEVICE_BASIC;
            }

            return self::$device;
        }

        public static function getUID()
        {
            if (self::$uid == null)
                self::$uid = md5(AppAboutConfig::getInstance()->getSystem(AppAboutConfig::ARRAY_KEY_BUILD_AT));

            return self::$uid;
        }

        public static function getRand()
        {
            if (self::$rand == null)
                self::$rand = intval($_SERVER['REQUEST_TIME']);

                return self::$rand;
        }

        public static function makeURLResourceTheme($themeDirectory, $filename, $deviceType = null)
        {
            if ($deviceType == null)
                $deviceType = self::getDeviceType();

            $rootPath  = env('app.path.root');
            $themePath = env('app.path.theme');
            $themePath = FileInfo::filterPaths($themePath . SP . $deviceType);

            if (FileInfo::isTypeDirectory($themePath) == false)
                return null;

            $themeFilename = $themeDirectory . SP . $filename;
            $themeFilepath = FileInfo::filterPaths($themePath . SP . $themeFilename);

            if (FileInfo::isTypeFile($themeFilepath) == false)
                return null;

            $buffer  = env('app.http.host');
            $buffer .= substr($themeFilepath, strlen($rootPath));

            if (env('app.dev.enable') || Request::isLocal()) {
                $buffer .= '?' . ASSET_PARAMETER_RAND_URL . '=' . self::getRand();
                $buffer .= '&' . ASSET_PARAMETER_UID_URL  . '=' . self::getUID();
            } else {
                $buffer .= '?' . ASSET_PARAMETER_UID_URL  . '=' . self::getUID();
            }

            return separator($buffer, '/');
        }

        public static function makeURLResourceJavascript($filename, $scriptDirectory = null, $deviceType = null)
        {
            $filename = str_ireplace('.js', null, basename($filename));
            $root     = env('app.path.root');
            $jsPath   = env('app.path.javascript');

            if ($deviceType == null)
                $deviceType = self::getDeviceType();

            $jsPath .= SP . $deviceType;

            if ($scriptDirectory != null)
                $jsPath .= SP . $scriptDirectory;

            if (FileInfo::isTypeDirectory($jsPath) == false)
                die(lng('default.resource.directory_not_found'));

            $jsFilename = $filename . '.js';
            $jsFilePath = FileInfo::filterPaths($jsPath . SP . $jsFilename);

            if (FileInfo::isTypeFile($jsFilePath) == false)
                return null;

            $buffer  = env('app.http.host');
            $buffer .= substr($jsFilePath, strlen($root));

            if (env('app.dev.enable') || Request::isLocal()) {
                $buffer .= '?' . ASSET_PARAMETER_RAND_URL . '=' . self::getRand();
                $buffer .= '&' . ASSET_PARAMETER_UID_URL  . '=' . self::getUID();
            } else {
                $buffer .= '?' . ASSET_PARAMETER_UID_URL  . '=' . self::getUID();
            }

            return separator($buffer, '/');
        }

        public static function makeURLResourceIcon($themeDirectory, $filename, $deviceType = null)
        {
            $res = env('app.http.theme');

            if ($deviceType == null)
                $deviceType = '/' . self::getDeviceType();

            $res .= $deviceType;
            $res .= '/' . $themeDirectory;
            $res .= '/icon/' . $filename;

            return $res;
        }

    }

?>