define([
    "jquery",
    "cookies"
], function(
    jquery,
    cookies
) {
    var tokenName  = "";
    var tokenValue = "";

    return {
        init: function() {
            var body = jquery("body");

            if (body.length && body.length > 0) {
                tokenName  = body.attr("token-name");
                tokenValue = body.attr("token-value");

                if (tokenName == null || typeof tokenName === "undefined")
                    errorToken();

                if (tokenValue == null || typeof tokenValue === "undefined")
                    errorToken();

                var cookieToken = cookies.get(tokenName);

                if (cookieToken == null || typeof cookieToken === "undefined" || cookieToken != tokenValue)
                    errorToken();
            } else {
                throw new Error("Error not body");
            }

            return this;
        },

        getName: function() {
            return tokenName;
        },

        getValue: function() {
            return tokenValue;
        },

        reloadBrowser: function() {
            window.location.reload();
        }
    };
});