define([
    "ajax",
    "header",
    "alert",
    "login"
], function(
    ajax,
    header,
    alert,
    login
) {
    return {
        main:   null,
        datas:  [],
        caches: [],

        init: function(main) {
            var self      = this;
                this.main = main;

            ajax.open({
                url: ajax.script.asset + "?lang",

                error: function(xhr, status) {
                    console.log(status);
                },

                success: function(data, status) {
                    self.datas = data;

                    self.render();
                    header.show();
                    alert.init();
                    login.init(self);
                }
            });
        },

        render: function() {
            var self = this;

            $("*[lng*=\".\"]").each(function() {
                var element  = $(this);
                var lngValue = element.attr("lng");
                var tagName  = element.get(0).tagName.toLowerCase();

                if (tagName === "input") {
                    var type = element.attr("type");

                    if (type == "submit" || type == "radio" || type == "checkbox")
                        element.attr("value", self.get(lngValue));
                    else if (typeof element.attr("set") !== "undefined")
                        element.attr("value", self.get(lngValue));
                    else
                        element.attr("placeholder", self.get(lngValue));
                }  else {
                    element.html(self.get(lngValue));
                }
            });
        },

        get: function(name) {
            if (name == null || name.length <= 0 || name.indexOf(".") === -1) {
                console.log("Name \"" + name + "\" is null or not validate");

                return null;
            }

            if (name.match(/^[a-zA-Z0-9_]+\s*\..+?$/i)) {
                if (typeof this.caches[name] !== "undefined")
                    return this.caches[name];

                var keyCurrent = name;
                var prefixKey  = null;

                if (prefixKey != null)
                    keyCurrent = keyCurrent.substr(prefixKey.length);

                if (keyCurrent.indexOf(".") === 0)
                    keyCurrent = keyCurrent.substr(1);

                var arrayKey = keyCurrent.split(".");
                var array    = this.datas;

                for (var i = 0; i < arrayKey.length; ++i) {
                    var entry = arrayKey[i].trim();

                    if (typeof array !== "object" || typeof array[entry] === "undefined") {
                        console.log("Key " + name + " not found");
                        return null;
                    }

                    array = array[entry];
                }

                if (typeof array === "object")
                    return (this.caches[name] = array);

                var args = arguments;

                array = this.matchesString(array, args);

                if (typeof args === "object" && args.length > 1) {
                    var argsLength = args.length;

                    if ((argsLength - 1) % 2 == 0) {
                        for (var i = 1; i < argsLength; i += 2) {
                            var key   = args[i];
                            var value = 0;

                            if (i + 1 < argsLength)
                                value = args[i + 1];

                            if (array.replace)
                               array = array.replace("{$" + key + "}", value);
                        }
                    }

                    return array;
                }

                return (this.caches[name] = array);
            }

            console.log("Key " + name + " not found");
            return null;
        },

        matchesString: function(str, args) {
            var self = this;

            if (typeof str !== "string" || str.match(/\{(.+?)\}/i) == false)
                return str;

            str = str.replace(/#\{(.+?)\}/, function(match, name) {
                return self.get(name.trim(), args);
            });

            str = str.replace(/lng\{(.+?)\}/i, function(match, name) {
                return self.get(name.trim(), args);
            });

            return str;
        }
    };
});