<?php

    if (defined('LOADED') == false)
        exit;

    return [
        'auto_redirect' => [
            'file_chmod' => true,
            'file_rename' => true,
            'create_directory' => true,
            'create_file' => true,
            'create_database' => true,
            'rename_database' => true,
        ],

        'enable_disable' => [
            'button_save_on_javascript' => true,
            'auto_focus_input_last' => true,
            'count_checkbox_file_javascript' => true,
            'count_checkbox_mysql_javascript' => true,
            'list_file_double' => true,
            'list_database_double' => true,
            'check_password_default' => false,
            'development' => true,
            'autoload' => true,
        ],

        'login' => [
            'enable_forgot_password' => true,
            'enable_lock_count_failed' => true,
            'max_lock_count' => 5,
            'time_lock' => 180,
            'time_login' => 64800,
            'enable_captcha_secure' => 0,
        ],

        'paging' => [
            'file_edit_text' => 50,
            'file_edit_text_line' => 20,
            'file_home_list' => 50,
            'file_view_zip' => 0,
            'mysql_list_data' => 5,
        ],

        'cache' => [
            'lifetime' => 64800,
        ],

        'tmp' => [
            'lifetime' => 86400,
            'limit' => 100,
        ],

        'theme' => [
            'directory' => 'default',
        ],

        'check_update' => [
            'enable' => false,
            'time' => true,
        ],

        'language' => 'vi',
        'http_host' => 'http://my-duc.193b.starter-ca-central-1.openshiftapps.com/manage',
    ];

?>