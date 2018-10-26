define(function(require) {
    return {
        rawEncode: function(url) {
            return encodeURIComponent(url);
        },

        rawDecode: function(url) {
            return decodeURIComponent(url);
        }
    };
});