define([
    "token",
    "lang"
], function(
    token,
    lang
) {
    return {
        init: function() {
            token.init();
            lang.init(this);

            return this;
        }
    }.init();
});