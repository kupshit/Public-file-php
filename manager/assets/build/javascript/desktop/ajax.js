define([
    "jquery",
    "define",
    "alert",
    "token"
], function(
    jquery,
    define,
    alert,
    token
) {
    return {
        script: {
            index: "index.php",
            asset: "asset.php",
            login: "user/login.php"
        },

        status: {
            timeout:     "timeout",
            abort:       "abort",
            error:       "error",
            parsererror: "parsererror",
            success:     "success"
        },

        open: function(options) {
            if (!options.async)
                options.async = true;

            if (!options.method)
                options.method = "POST";

            if (!options.cache)
                options.cache = false;

            if (!options.dataType)
                options.dataType = "json";

            if (!options.data || options.data.length <= 0) {
                options.data = {
                    submit: 1
                };
            }

            var tokenName  = token.getName();
            var tokenValue = token.getValue();

            if (typeof options.data[tokenName] === "undefined")
                options.data[tokenName] = tokenValue;

            var self           = this;
            var handlerError   = null;
            var handlerSuccess = null;
            var handlerBegin   = null;
            var handlerEnd     = null;

            if (!options.error)
                handlerError = function(xhr, status, throws) {};
            else
                handlerError = options.error;

            if (!options.success)
                handlerSuccess = function(data, status, xhr) {};
            else
                handlerSuccess = options.success;

            if (!options.begin)
                handlerBegin = function(xhr) {};
            else
                handlerBegin = options.begin;

            if (!options.end)
                handlerEnd = function(xhr) {};
            else
                handlerEnd = options.end;

            options.beforeSend = function(xhr, settings) {
                handlerBegin(xhr);
            };

            options.error = function(xhr, status, throws) {
                if (status === self.status.parsererror) {
                    alert.add(xhr.responseText);
                    console.log(xhr);
                    console.log(xhr.responseText);
                }

                var flagEnd = handlerError(xhr, status, throws);

                if (typeof flagEnd === "undefined" || flagEnd == true)
                    handlerEnd(xhr);
            };

            options.success = function(data, status, xhr) {
                var dataAlert    = data.alert;
                var dataContents = data.datas;
                var dataCode     = data.code;
                var dataCodeSys  = data.code_sys;

                if (dataAlert && dataAlert.length > 0) {
                    for (var i = 0; i < dataAlert.length; ++i)
                        alert.add(dataAlert[i].message, dataAlert[i].type);
                }

                var flagEnd = handlerSuccess(data, status, xhr);

                if (typeof flagEnd === "undefined" || flagEnd == true)
                    handlerEnd(xhr);
            };

            return jquery.ajax(options);
        }
    };
});