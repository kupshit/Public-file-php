var Main = (function() {
    var EVENT_LOAD    = "load";
    var EVENT_CLICK   = "click";
    var EVENT_FOCUS   = "focus";
    var EVENT_KEYDOWN = "keydown";
    var EVENT_KEYUP   = "keyup";
    var EVENT_INPUT   = "input";
    var EVENT_SUBMIT  = "submit";
    var EVENT_CHANGE  = "change";
    var EVENT_SCROLL  = "scroll";

    function initHistoryScript(historyScriptLink) {
        if (!window.history.pushState && !History.pushState && historyScriptLink != null) {
            var head = getElementsByTagName("head");

            if (head.length > 0) {
                var history       = document.createElement("script");
                    history.type  = "text/javascript";
                    history.async = true;
                    history.src   = historyScriptLink;

                head[0].appendChild(history);
            }

            addListener(window, EVENT_KEYDOWN, function(e) {
                if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) {
                    var href      = window.location.href;
                    var hastagPos = href.indexOf("#");

                    if (hastagPos !== -1)
                        href = httpHost + "/" + href.substr(hastagPos + 1);

                    window.location.href = href;

                    e.preventDefault();
                } else {
                    return true;
                }

                return false;
            }, true);

            historyScriptLink = null;
        }
    }

    function addListener(object, event, handle, isRemove) {
        if (typeof isRemove !== "undefined" && isRemove)
            removeListener(object, event, handle);

        if (object.addEventListener)
            object.addEventListener(event, handle);
        else if (object.attachEvent)
            object.attachEvent(event, handle);
    }

    function removeListener(object, event, handle) {
        if (object.removeEventListener)
            object.removeEventListener(event, handle);
        else if (object.detachEvent)
            object.detachEvent(event, handle);
    }

    function getElementById(id, element) {
        if (typeof element === "undefined" || element == null)
            element = document;

        return element.getElementById(id);
    }

    function getElementsByTagName(tagName, element) {
        if (element == null || typeof element === "undefined")
            element = document;

        return element.getElementsByTagName(tagName);
    }

    function getAttribute(element, attrName) {
        if (element.getAttribute)
            return element.getAttribute(attrName);
        else if (element.getAttributeNode)
            return element.getAttributeNode(attrName);

        return null;
    }

    function removeAttribute(element, attrName) {
        if (element.removeAttribute)
            element.removeAttribute(attrName);
        else if (element.removeAttributeNode)
            element.removeAttributeNode(attrName);
    }

    function setAttribute(element, name, value, checkExists) {
        if (element.setAttribute)
            element.setAttribute(name, value);
        else if (element.setAttributeNode)
            element.setAttributeNode(name, value);
    }

    function hasAttribute(element, name) {
        var attr = getAttribute(element, node);

        if (attr == null)
            return false;
        else if (typeof attr === "undefined")
            return false;

        return true;
    }

    function replaceAttributeName(childNodes, tag, name, value) {
        if (childNodes == null || typeof childNodes === "undefined")
            return;

        for (var i = 0; i < childNodes.length; ++i) {
            var child = childNodes[i];
            var nodeName = child.nodeName.toLowerCase();

            if (nodeName === tag) {
                setAttribute(child, name, value);
                replaceAttributeName(child.childNodes, tag, name, value);
            }
        }
    }

    function isMobileDevice() {
        return "ontouchstart" in window || "onmsgesturechange" in window;
    }

    // OnLoad
    var onLoad = (function() {
        var onloads      = [];
        var invokes      = [];
        var loopCount    = 0;
        var loopInterval = null;

        function runHandle(arrays) {
            if (loopInterval != null) {
                clearInterval(loopInterval);
                loopInterval = null;
            }

            var removes = [];

            for (var i = 0; i < arrays.length; ++i) {
                var handle = arrays[i];

                if (typeof handle === "function") {
                    // Result is remove element, false = remove
                    var result = handle();

                    if (typeof result !== "undefined" && result == false)
                        removes.push(i);
                }
            }

            if (removes.length <= 0)
                return;

            for (var i = removes.length - 1; i >= 0; --i)
                arrays.splice(removes[i], 1);
        }

        return {
            run: function() {
                loopInterval = setInterval(function() {
                    if (++loopCount >= 200) {
                        clearInterval(loopInterval);
                        throw 'Crash loop';
                    } else {
                        console.log("Success load, not loop");
                    }
                }, 10);

                addListener(window, EVENT_LOAD, onLoad.reOnload, true);
            },

            addOnload: function(handle) {
                onloads.push(handle);
            },

            addInvoke: function(handle) {
                invokes.push(handle);
            },

            reOnload: function() {
                runHandle(onloads);
            },

            reInvoke: function() {
                runHandle(invokes);
            }
        };
    })();

    // ProgressBarBody
    var progressBarBody = (function() {
        var element  = null;
        var interval = null;
        var count    = 0;
        var current  = 0;
        var time     = 0;

        return {
            init: function() {
                if (element == null)
                    element = getElementById("progress-bar-body");
            },

            updateCurrent: function(__current) {
                current = __current;
            },

            getCurrent: function() {
                return current;
            },

            updateTime: function(__time) {
                time = __time;
            },

            getTime: function() {
                return time;
            },

            updateCount: function(__count) {
                count = __count;
            },

            getCount: function() {
                return count;
            },

            reDisplay: function() {
                progressBarBody.init();

                if (interval != null)
                    clearInterval(interval, null);

                if (element.style.display === "none")
                    element.style.width = "0%";

                element.style.display = "block";
                interval = setInterval(frame, time);

                function frame() {
                    if (count >= current || count >= 100) {
                        clearInterval(interval);

                        if (count >= 100)
                            element.style.display = "none";
                    } else {
                        count              += 1;
                        element.style.width = count + "%";
                    }
                }
            }
        };
    })();

    // Ajax
    var ajax = (function() {
        function processOptions(options) {
            if (!options.url)
                return false;

            if (!options.before)
                options.before = function(xhr) { };

            if (!options.end)
                options.end = function(xhr) { };

            if (!options.success)
                options.success = function(data, xhr) { };

            if (!options.error)
                options.error = function(xhr) { };

            if (!options.progress)
                options.progress = function(event, xhr) { };

            if (!options.uploadProgress)
                options.uploadProgress = function(event, xhr) { };

            if (!options.loadstart)
                options.loadstart = function(event, xhr) { };

            if (!options.loadend)
                options.loadend = function(event, xhr) { };

            if (!options.method)
                options.method = "GET";

            return true;
        }

        function processEvent(options, xhr) {
            var ready = false;

            xhr.onreadystatechange = function(e) {
                ready = true;
            };

            xhr.onloadstart = function(e) {
                options.loadstart(e, xhr);
            };

            xhr.onprogress = function(e) {
                options.progress(e, xhr);
            };

            xhr.upload.onprogress = function(e) {
                options.uploadProgress(e, xhr);
            };

            xhr.onloadend = function(e) {
                if (ready) {
                    if (xhr.readyState == 4 && xhr.status == 200)
                        options.success(xhr.responseText, xhr);
                    else
                        options.error(xhr);
                }

                options.loadend(e, xhr);
                options.end(xhr);
            };

            options.before(xhr);

            return xhr;
        }

        function processFormData(options, xhr) {
            if (options.method === "POST") {
                var dataSend = new FormData();

                if (options.datas) {
                    for (var key in options.datas)
                        dataSend.append(key, options.datas[key]);
                } else if (options.dataFormElement) {
                    var arrays    = [];
                    var inputs    = getElementsByTagName("input",    options.dataFormElement);
                    var textareas = getElementsByTagName("textarea", options.dataFormElement);
                    var selects   = getElementsByTagName("select",   options.dataFormElement);

                    if (inputs.length && inputs.length > 0) {
                        for (var i = 0; i < inputs.length; ++i)
                            arrays.push(inputs[i]);
                    }

                    if (textareas.length && textareas.length > 0) {
                        for (var i = 0; i < textareas.length; ++i)
                            arrays.push(textareas[i]);
                    }

                    if (selects.length && selects.length > 0) {
                        for (var i = 0; i < selects.length; ++i)
                            arrays.push(selects[i]);
                    }

                    if (arrays.length && arrays.length > 0) {
                        for (var i = 0; i < arrays.length; ++i) {
                            var input = arrays[i];
                            var name  = null;
                            var value = null;
                            var type  = null;
                            var tag   = null;

                            if (input.name && input.name.length > 0)
                                name = input.name;

                            if (input.type && input.type.length > 0)
                                type = input.type;

                            if (input.value && input.value.length > 0)
                                value = input.value;

                            if (input.tagName)
                                tag = input.tagName.toLowerCase();

                            if (name != null && tag != null) {
                                if (value == null || (value.length && value.length <= 0))
                                    value = "";

                                if (tag === "textarea" || tag === "select") {
                                    dataSend.append(name, value);
                                } else if (type === "checkbox" || type === "radio") {
                                    if (input.checked)
                                        dataSend.append(name, value);
                                } else if (type === "file") {
                                    var files = input.files;

                                    if (files.length && files.length > 0) {
                                        for (var j = 0; j < files.length; ++j)
                                            dataSend.append(input.name, files[j]);
                                    }
                                } else {
                                    dataSend.append(name, value);
                                }
                            }
                        }
                    }
                }

                if (options.submitElement && options.submitElement.type && options.submitElement.type === "submit") {
                    var value = null;

                    if (options.submitElement.name) {
                        if (options.submitElement.value)
                            value = options.submitElement.value;
                        else if (options.submitElement.tagName.toLowerCase && options.submitElement.tagName.toLowerCase() === "button")
                            value = options.submitElement.innerHTML;

                        dataSend.append(options.submitElement.name, value);
                    }
                }

                return dataSend;
            }

            return null;
        }

        return {
            open: function(options) {
                var xhr  = ajax.createXHR();
                var data = null;

                if (processOptions(options)) {
                    xhr  = processEvent(options, xhr);
                    data = processFormData(options, xhr);

                    xhr.open(options.method, options.url, true);
                    xhr.send(data);
                }
            },

            createXHR: function() {
                if (window.XMLHttpRequest)
                    return new XMLHttpRequest();
                else
                    return new ActiveXObject("Microsoft.XMLHTTP");
            }
        };
    })();

    // AutoFocusInputLast
    var autoFocusInputLast = (function() {
/*        var elements = [];

        function autoFocusOnHastagUrl() {
            var hrefLocation = window.location.href;

            if (hrefLocation !== null && hrefLocation.length > 0) {
                var hastagIndexHrefLocation = hrefLocation.lastIndexOf("#");
                var hastagValue             = null;

                if (hastagIndexHrefLocation === -1 && window.location.hash && window.location.hash != null) {
                    hrefLocation           += window.location.hash;
                    hastagIndexHrefLocation = hrefLocation.lastIndexOf("#");
                }

                if (hastagIndexHrefLocation !== -1) {
                    hastagValue = hrefLocation.substring(hastagIndexHrefLocation + 1);

                    cleanAutoFocusElement();
                    putAutoFocusElementName(hastagValue, true);
                } else if (elements.length && elements.length > 0) {
                    cleanAutoFocusElement();
                    putAutoFocusElement(elements[0]);
                }
            }
        }

        function addHastagToForm() {
            var element = this;

            if (element.form && typeof element.form !== "undefined") {
                var actionForm  = getAttribute(element.form, "action");
                var nameElement = element.name;

                if (actionForm !== null && actionForm.length > 0) {
                    var hastagIndexAction = actionForm.lastIndexOf("#");

                    if (hastagIndexAction !== -1)
                        actionForm = actionForm.substring(0, hastagIndexAction);
                }

                if (typeof nameElement !== "undefined" && nameElement !== null)
                    nameElement = element.tagName.toLowerCase() + "_" + nameElement;

                element.form.action  = actionForm + "#" + nameElement;
                window.location.href = actionForm + "#" + nameElement;

                cleanAutoFocusElement();
                putAutoFocusElement(element);
            }
        }

        function cleanAutoFocusElement() {
            if (typeof elements === "undefined" && elements.length <= 0)
                return;

            for (var i = 0; i < elements.length; ++i)
                removeAttribute(elements[i], "autofocus");
        }

        function putAutoFocusElement(element, isFocusOnHastag) {
            setAttribute(element, "autofocus");
            element.focus();

            if (isFocusOnHastag) {
                var scrollTopElement = document.documentElement || document.body;
                var scrollTop        = window.pageYOffset       || scrollTopElement.scrollTop;
                var elementOffsetTop = element.offsetTop + element.form.offsetTop;

                if (scrollTop > elementOffsetTop)
                    scrollTopElement.scrollTop = elementOffsetTop;
            }
        }

        function putAutoFocusElementName(name, isFocusOnHastag) {
            if (typeof elements === "undefined" && elements.length <= 0)
                return;

            for (var i = 0; i < elements.length; ++i) {
                var element     = elements[i];
                var nameElement = element.name;

                if (typeof nameElement !== "undefined" && nameElement !== null)
                    nameElement = element.tagName.toLowerCase() + "_" + nameElement.toLowerCase();
                else
                    nameElement = element.tagName.toLowerCase();

                if (nameElement === name)
                    putAutoFocusElement(element, isFocusOnHastag);
            }
        }

        return {
            onload: function() {
                if (elements.length && elements.length > 0) {
                    for (var i = 0; i < elements.length; ++i)
                        removeListener(elements[i], EVENT_FOCUS, addHastagToForm);

                    elements = [];
                }

                var inputs    = getElementsByTagName("input");
                var textareas = getElementsByTagName("textarea");

                if (typeof inputs !== "undefined" && inputs.length > 0) {
                    for (var i = 0; i < inputs.length; ++i) {
                        var element = inputs[i];

                        if (element.type) {
                            var type = element.type;

                            if (type === "text" || type === "password" || type === "number") {
                                elements.push(element);
                                addListener(element, EVENT_FOCUS, addHastagToForm, true);
                            }
                        }
                    }
                }

                if (typeof textareas !== "undefined" && textareas.length > 0) {
                    for (var i = 0; i < textareas.length; ++i) {
                        elements.push(textareas[i]);
                        addListener(textareas[i], EVENT_FOCUS, true);
                    }
                }

                autoFocusOnHastagUrl(true);
            }
        };*/
    })();

    // ButtonSaveOnJs
    var buttonSaveOnJs = (function() {
        var element   = null;
        var isKeyCtrl = true;
        var isKeyS    = false;

        var WHICH_KEY_CTRL = 17;
        var WHICH_KEY_S    = 83;

        function saveActionEvent() {
            if (element !== null && typeof element !== "undefined" && element.click)
                element.click();
        }

        function eventKeydown(event) {
            if (event.which) {
                if (event.which === WHICH_KEY_S && event.ctrlKey && event.ctrlKey == true) {
                    isKeyS = true;
                    event.preventDefault();

                    return false;
                }
            }

            return true;
        }

        function eventKeyup(event) {
            if (event.which && event.which == WHICH_KEY_CTRL) {
                isKeyCtrl = false;

                if (isKeyS == true) {
                    isKeyS = false;
                    saveActionEvent();
                    event.preventDefault();

                    return true;
                }
            }

            event.preventDefault();
            return false;
        }

        return {
            onload: function() {
                element = getElementById("button-save-on-javascript");

                if (element === null || typeof element === "undefined" || typeof element.click === "undefined")
                    return;

                addListener(window, EVENT_KEYDOWN, eventKeydown, true);
                addListener(window, EVENT_KEYUP,   eventKeyup,   true);
            }
        };
    })();

    // CheckboxCheckAll
    var checkboxCheckAll = (function() {
        var form      = null;
        var checkall  = null;
        var textCount = null;

        var countCheckedItem  = 0;
        var countCheckboxItem = 0;

        function putCountCheckedItem() {
            if (isValidateVariable() == false || typeof textCount === "undefined" || textCount === null)
                return;

            if (countCheckedItem > 0)
                textCount.innerHTML = "(" + countCheckedItem + ")";
            else
                textCount.innerHTML = null;
        }

        function updateCountCheckboxStatus() {
            if (isValidateVariable() == false)
                return;

            countCheckboxItem = 0;
            countCheckedItem  = 0;

            for (var i = 0; i < form.elements.length; ++i) {
                var element = form.elements[i];

                if (element.type && element.type === "checkbox" && element !== checkall) {
                    if (element.checked)
                        countCheckedItem++;

                    countCheckboxItem++;
                }
            }
        }

        function updateCheckboxAllCheckedStatus() {
            if (isValidateVariable() == false)
                return;

            if (countCheckedItem <= 0)
                checkall.checked = false;
            else if (countCheckedItem >= countCheckboxItem)
                checkall.checked = true;
        }

        function isValidateVariable() {
            if (typeof form === "undefined" || typeof checkall === "undefined")
                return false;

            if (form === null || checkall === null)
                return false;

            return true;
        }

        return {
            init: function(
                idForm,
                idCheckboxAll,
                idElementTextCount
            ) {
                form      = getElementById(idForm);
                checkall  = getElementById(idCheckboxAll);
                textCount = getElementById(idElementTextCount);

                if (isValidateVariable() == false)
                    return;

                updateCountCheckboxStatus();
                putCountCheckedItem();
                updateCheckboxAllCheckedStatus();
            },

            onCheckAll: function() {
                if (isValidateVariable() == false)
                    return;

                var checked = checkall.checked == true;

                for (var i = 0; i < form.elements.length; ++i) {
                    var element = form.elements[i];

                    if (element.type && element.type === "checkbox" && element !== checkall)
                        element.checked = checked;
                }

                updateCountCheckboxStatus();
                putCountCheckedItem();
                updateCheckboxAllCheckedStatus();
            },

            onCheckItem: function(idCheckboxItem) {
                var checkitem = getElementById(idCheckboxItem);

                if (typeof checkitem === "undefined" || checkitem === null || isValidateVariable() == false)
                    return;

                if (checkitem.type && checkitem.type === "checkbox")
                    checkitem.cheked = checkitem.checked == true;

                updateCountCheckboxStatus();
                putCountCheckedItem();
                updateCheckboxAllCheckedStatus();
            }
        };
    })();

    // ChmodInput
    var chmodInput = (function() {
        var inputChmod             = null;
        var inputChmodCheckbox     = null;
        var listInputChmodCheckbox = null;

        function calculatorChmodInput() {
            var array = {
                system: 0,
                group:  0,
                user:   0
            };

            if (typeof inputChmod === "undefined")
                return array;

            var value  = inputChmod.value;

            if (value == null || value.length <= 0)
                value = "";

            if (value.length < 1)
                value +="000";
            else if (value.length < 2)
                value += "00";
            else if (value.length < 3)
                value += "0";

            var length = value.length;

            if (length >= 3)
                array.system = parseInt(value.charAt(length - 3));

            if (length >= 2)
                array.group = parseInt(value.charAt(length - 2));

            if (length >= 1)
                array.user = parseInt(value.charAt(length - 1));

            if (array.system < 0 || array.system > 7)
                array.system = 0;

            if (array.group < 0 || array.group > 7)
                array.group = 0;

            if (array.user < 0 || array.user > 7)
                array.user = 0;

            return array;
        }

        function calculatorChmodChecked() {
            if (typeof listInputChmodCheckbox === "undefined")
                return;

            var system = 0;
            var group  = 0;
            var user   = 0;

            for (var i = 0; i < listInputChmodCheckbox.length; ++i) {
                var checkbox = listInputChmodCheckbox[i];

                if (checkbox.checked == true && checkbox.name && checkbox.name.search) {
                    var name = checkbox.name;

                    if (name.search("system") != -1) {
                        if (name.search("read") != -1)
                            system += 4;
                        else if (name.search("write") != -1)
                            system += 2;
                        else if (name.search("execute") != -1)
                            system += 1;
                    } else if (name.search("group") != -1) {
                        if (name.search("read") != -1)
                            group += 4;
                        else if (name.search("write") != -1)
                            group += 2;
                        else if (name.search("execute") != -1)
                            group += 1;
                    } else if (name.search("user") != -1) {
                        if (name.search("read") != -1)
                            user += 4;
                        else if (name.search("write") != -1)
                            user += 2;
                        else if (name.search("execute") != -1)
                            user += 1;
                    }
                }
            }

            if (system.toString)
                system = system.toString();
            else
                system = "0";

            if (group.toString)
                group = group.toString();
            else
                group = "0";

            if (user.toString)
                user = user.toString();
            else
                user = "0";

            return system + group + user;
        }

        function onCheckboxSetChecked(system, group, user) {
            if (typeof listInputChmodCheckbox === "undefined")
                return;

            for (var i = 0; i < listInputChmodCheckbox.length; ++i) {
                var checkbox = listInputChmodCheckbox[i];

                if (checkbox.name && checkbox.name.search) {
                    var name = checkbox.name;

                    if (name.search("system") != -1) {
                        if (name.search("read") != -1)
                            checkbox.checked = (system & 4) != 0;
                        else if (name.search("write") != -1)
                            checkbox.checked = (system & 2) != 0;
                        else if (name.search("execute") != -1)
                            checkbox.checked = (system & 1) != 0;
                        else
                            checkbox.checked = false;
                    } else if (name.search("group") != -1) {
                        if (name.search("read") != -1)
                            checkbox.checked = (group & 4) != 0;
                        else if (name.search("write") != -1)
                            checkbox.checked = (group & 2) != 0;
                        else if (name.search("execute") != -1)
                            checkbox.checked = (group & 1) != 0;
                        else
                            checkbox.checked = false;
                    } else if (name.search("user") != -1) {
                        if (name.search("read") != -1)
                            checkbox.checked = (user & 4) != 0;
                        else if (name.search("write") != -1)
                            checkbox.checked = (user & 2) != 0;
                        else if (name.search("execute") != -1)
                            checkbox.checked = (user & 1) != 0;
                        else
                            checkbox.checked = false;
                    }
                }
            }
        }

        return {
            init: function(
                idInputChmod,
                idInputChmodCheckbox
            ) {
                inputChmod             = getElementById(idInputChmod);
                inputChmodCheckbox     = getElementById(idInputChmodCheckbox);
                listInputChmodCheckbox = [];

                if (inputChmod == null || inputChmodCheckbox == null)
                    return;

                if (typeof inputChmod === "undefined" || typeof inputChmodCheckbox === "undefined")
                    return;

                addListener(inputChmod, EVENT_INPUT, function(env) {
                    var chmod = calculatorChmodInput();

                    if (typeof chmod !== "undefined")
                        onCheckboxSetChecked(chmod.system, chmod.group, chmod.user);
                }, true);

                var inputChmodCheckboxElement = getElementsByTagName("input", inputChmodCheckbox);

                if (inputChmodCheckboxElement.length) {
                    for (var i = 0; i < inputChmodCheckboxElement.length; ++i) {
                        var entry = inputChmodCheckboxElement[i];

                        if (entry.type && entry.type == "checkbox") {
                            addListener(entry, "click", function(env) {
                                var chmod = calculatorChmodChecked();

                                if (typeof chmod !== "undefined")
                                    inputChmod.value = chmod;

                                chmod = calculatorChmodInput();

                                if (typeof chmod !== "undefined")
                                    onCheckboxSetChecked(chmod.system, chmod.group, chmod.user);
                            }, true);

                            listInputChmodCheckbox.push(entry);
                        }
                    }

                    var chmod = calculatorChmodInput();

                    if (typeof chmod !== "undefined")
                        onCheckboxSetChecked(chmod.system, chmod.group, chmod.user);
                }
            }
        };
    })();

    // CustomInputFile
    var customInputFile =  (function() {
        var elements = [];

        function onChangeInputFileEventListener(env) {
            if (typeof env.target.nextElementSibling !== "undefined") {
                var nextElement = env.target.nextElementSibling;
                var spanElement = getElementsByTagName("span", nextElement);
                var innerHTML   = env.target.value;
                var files       = env.target.files;

                if (files && files.length && files.length > 1) {
                    for (var i = 1; i < files.length; ++i)
                        innerHTML += ", " + files[i].name;
                }

                if (spanElement !== "undefined" && spanElement.length >= 1)
                    spanElement[0].innerHTML = innerHTML;
                else
                    nextElement.innerHTML = innerHTML;
            }
        }

        return {
            onload: function() {
                if (elements.length && elements.length > 0) {
                    for (var i = 0; i < elements.length; ++i)
                        removeListener(elements[i], EVENT_CHANGE, onChangeInputFileEventListener);
                }

                elements = getElementsByTagName("input");

                if (typeof elements !== "undefined" && elements.length > 0) {
                    for (var i = 0; i < elements.length; ++i) {
                        var entry = elements[i];

                        if (entry.type && entry.type.toLowerCase() === "file")
                            addListener(entry, EVENT_CHANGE, onChangeInputFileEventListener, true);
                    }
                }
            },

            onAddMore: function(
                idTemplateInputFile,
                namePrefix,
                placeHolderText
            ) {
                var elementTemplate = getElementById(idTemplateInputFile);
                var elementClone    = elementTemplate.cloneNode(true);
                var parentElement   = elementTemplate.parentElement;
                var className       = elementTemplate.className;

                var childNodes       = parentElement.childNodes;
                var childNodesLength = childNodes.length;

                var attributeNameTemplate = getAttribute(elementTemplate, "name");
                var indexCurrentTemplate  = 0;

                if (attributeNameTemplate != null && typeof attributeNameTemplate !== "undefined") {
                    if (attributeNameTemplate.value)
                        attributeNameTemplate = attributeNameTemplate.value;

                    if (attributeNameTemplate != null && attributeNameTemplate.indexOf(namePrefix, 0) === 0) {
                        indexCurrentTemplate = attributeNameTemplate.substring(namePrefix.length);
                        indexCurrentTemplate = parseInt(indexCurrentTemplate);;
                    } else {
                        indexCurrentTemplate = 0;
                    }

                    var inputFileClone  = getElementsByTagName("input", elementClone);
                    var labelFileClone  = getElementsByTagName("label", elementClone);

                    for (var i = 0; i < inputFileClone.length; ++i) {
                        var input    = inputFileClone[i];
                        var inputNew = document.createElement("input");

                        setAttribute(inputNew, "type", getAttribute(input, "type"));
                        setAttribute(inputNew, "name", getAttribute(input, "name"));
                        setAttribute(inputNew, "id",   getAttribute(input, "id"));

                        elementClone.replaceChild(inputNew, input);
                    }

                    for (var i = 0; i < labelFileClone.length; ++i) {
                        var label = labelFileClone[i];
                        var span  = getElementsByTagName("span", label);

                        if (span != null && typeof span !== "undefined" && span.length >= 1) {
                            var attributes = span[0].attributes;
                            var attrLng    = attributes.lng;
                            var attrValue  = attributes.value;
                            var inner      = null;

                            if (attrLng.value && attrLng.value != null)
                                inner = attrLng.value;
                            else if (attrValue.value && attrValue.value != null)
                                inner = attrValue.value;

                            span[0].innerHTML = inner;
                        } else {
                            if (typeof placeHolderText !== "string")
                                placeHolderText = null;

                            label.innerHTML = placeHolderText;
                        }
                    }

                    var valueIndexCurrent = namePrefix + (indexCurrentTemplate + 1);

                    setAttribute(elementClone, "name", valueIndexCurrent);
                    replaceAttributeName(elementClone.childNodes, "input", "id",   valueIndexCurrent);
                    replaceAttributeName(elementClone.childNodes, "label", "for",  valueIndexCurrent);
                }

                removeAttribute(elementTemplate, "id");

                for (var i = childNodesLength - 1; i >= 0; --i) {
                    var child     = childNodes[i];
                    var childName = getAttribute(child, "name");

                    if (childName != null && typeof childName !== "undefined") {
                        if (childName.value)
                            childName = childName.value;

                        if (childName.indexOf(namePrefix, 0) === 0) {
                            parentElement.insertBefore(elementClone, child.nextSibling);
                            customInputFile.onload();

                            break;
                        }
                    }
                }
            }
        };
    })();

    // CustomInputUrl
    var customInputUrl = (function() {
        return {
            onAddMore: function(
                idTemplateInputUrl,
                namePrefix
            ) {
                var elementTemplate = getElementById(idTemplateInputUrl);
                var elementClone    = elementTemplate.cloneNode(true);
                var parentElement   = elementTemplate.parentElement;

                var childNodes       = parentElement.childNodes;
                var childNodesLength = childNodes.length;

                var attributeNameTemplate = getAttribute(elementTemplate, "name");
                var indexCurrentTemplate  = 0;

                if (attributeNameTemplate != null && typeof attributeNameTemplate !== "undefined") {
                    if (attributeNameTemplate.value)
                        attributeNameTemplate = attributeNameTemplate.value;

                    if (attributeNameTemplate != null && attributeNameTemplate.indexOf(namePrefix, 0) === 0) {
                        indexCurrentTemplate = attributeNameTemplate.substring(namePrefix.length);
                        indexCurrentTemplate = parseInt(indexCurrentTemplate);;
                    } else {
                        indexCurrentTemplate = 0;
                    }

                    var inputClone = getElementsByTagName("input", elementClone);

                    for (var i = 0; i < inputClone.length; ++i) {
                        var input    = inputClone[i];
                        var inputNew = document.createElement("input");

                        setAttribute(inputNew, "type",        getAttribute(input, "type"));
                        setAttribute(inputNew, "name",        getAttribute(input, "name"));
                        setAttribute(inputNew, "placeholder", getAttribute(input, "placeholder"));

                        elementClone.replaceChild(inputNew, input);
                    }

                    setAttribute(elementClone, "name", namePrefix + (indexCurrentTemplate + 1));
                }

                removeAttribute(elementTemplate, "id");

                for (var i = childNodesLength - 1; i >= 0; --i) {
                    var child     = childNodes[i];
                    var childName = getAttribute(child, "name");

                    if (childName != null && typeof childName !== "undefined") {
                        if (childName.value)
                            childName = childName.value;

                        if (childName.indexOf(namePrefix, 0) === 0) {
                            parentElement.insertBefore(elementClone, child.nextSibling);

                            break;
                        }
                    }
                }
            }
        };
    })();

    var loadAjax = (function() {
        var httpHost            = null;
        var historyScriptLink   = null;
        var elementButtonSubmit = null;

        var elementsA      = [];
        var elementsForm   = [];
        var elementsButton = [];

        function progressContent(
            url,
            data,
            xhr,
            callbackRemoveEvent
        ) {
            var titleTagBegin = "<title>";
            var titleTagEnd   = "</title>";
            var titlePosBegin = data.indexOf(titleTagBegin);
            var titlePosEnd   = data.indexOf(titleTagEnd);

            progressBarBody.updateCurrent(80);
            progressBarBody.reDisplay();

            var containerTagBegin = "<div id=\"container\">";
            var containerTagEnd   = "</div>";
            var containerPosBegin = data.indexOf(containerTagBegin);
            var containerPosEnd   = data.lastIndexOf(containerTagEnd);

            if (containerPosBegin === -1 || containerPosEnd === -1)
                return;

            if (titlePosBegin !== -1 && titlePosEnd !== -1) {
                var titleStr     = data.substr(titlePosBegin + titleTagBegin.length, titlePosEnd - (titlePosBegin + titleTagBegin.length));
                var titleElement = getElementsByTagName("title");

                if (titleElement.length && titleElement.length > 0)
                    titleElement[0].innerHTML = titleStr;
            }

            progressBarBody.updateCurrent(84);
            progressBarBody.reDisplay();

            if (typeof callbackRemoveEvent !== "undefined")
                callbackRemoveEvent();

            progressBarBody.updateCurrent(86);
            progressBarBody.reDisplay();

            var container        = data.substr(containerPosBegin + containerTagBegin.length, containerPosEnd - (containerPosBegin + containerTagBegin.length));
            var containerElement = getElementById("container");
            var documentElement  = document.documentElement;

            progressBarBody.updateCurrent(90);
            progressBarBody.reDisplay();

            containerElement.innerHTML = container;

            if (documentElement.pageYOffset)
                documentElement.pageYOffset = 0;

            if (documentElement.scrollTop)
                documentElement.scrollTop = 0;

            if (window.scrollTo)
                window.scrollTo(0, 0);

            progressBarBody.updateCurrent(96);
            progressBarBody.reDisplay();

            if (xhr.responseURL && xhr.responseURL != null && xhr.responseURL.length > 0)
                url = xhr.responseURL;

            if (window.history.pushState) {
                window.history.pushState({
                    path: url
                }, '', url);
            } else if (History.pushState) {
                History.pushState(null, null, url);
            }

            progressBarBody.updateCurrent(98);
            progressBarBody.reDisplay();

            onLoad.reOnload();
            onLoad.reInvoke();
        }

        function processUrl(url) {
            if (url.indexOf && url.indexOf(httpHost) === -1) {
                var strHttp  = "http://";
                var strHttps = "https://";
                var posHttp  = url.indexOf(strHttp);
                var posHttps = url.indexOf(strHttps);

                if (posHttp === -1 && posHttps === -1) {
                    url = httpHost + "/" + url;
                } else {
                    var posEndHttp = strHttp.length;

                    if (posHttps === 0)
                        posEndHttp = strHttps.length;

                    var posSeparatorEndDomain = url.indexOf("/", posEndHttp);

                    if (posSeparatorEndDomain !== -1)
                        url = url.substr(posSeparatorEndDomain + 1);

                    url = httpHost + "/" + url;
                }
            }

            return url;
        }

        function beforeHandle(xhr) {
            progressBarBody.updateCount(0);
            progressBarBody.updateCurrent(20);
            progressBarBody.updateTime(20);
        }

        function endHandle(xhr) {
            progressBarBody.updateCurrent(100);
            progressBarBody.reDisplay();
        }

        function errorHandle(xhr) {
            console.log("Error");
            console.log(xhr);
        }

        function loadStartHandle(e, xhr) {
            progressBarBody.reDisplay();
        }

        function progressHandle(e, xhr) {
            if (e.lengthComputable == false) {
                progressBarBody.updateCurrent(80);
                progressBarBody.updateTime(1);
            } else {
                var percent = (e.loaded / e.total * 60) + 20;

                if (percent > progressBarBody.getCurrent())
                    progressBarBody.updateCurrent(percent);

                progressBarBody.updateTime(progressBarBody.getTime() - 3);
            }

            progressBarBody.reDisplay();
        }

        function eventClickElementA(e) {
            if (!this.href)
                return;

            var href    = processUrl(this.href);
            var request = ajax.open({
                url: href,

                before:    beforeHandle,
                error:     errorHandle,
                loadstart: loadStartHandle,
                progress:  progressHandle,

                end: function(xhr) {
                    loadAjax.reInitLoadTagA();
                    endHandle(xhr);
                },

                success: function(data, xhr) {
                    progressContent(href, data, xhr, function() {
                        for (var i = 0; i < elementsA.length; ++i)
                            removeListener(elementsA[i], EVENT_CLICK, eventClickElementA);
                    });
                }
            });

            return false;
        }

        function eventClickElementButton() {
            elementButtonSubmit = this;
        }

        function eventSubmitElementForm() {
            var action = getAttribute(this, "action");

            if (action != null)
                action = processUrl(action);

            var request = ajax.open({
                url: action,
                method: "POST",
                dataFormElement: this,
                submitElement:   elementButtonSubmit,

                before:         beforeHandle,
                error:          errorHandle,
                loadstart:      loadStartHandle,
                progress:       progressHandle,
                uploadProgress: progressHandle,

                end: function(xhr) {
                    loadAjax.reInitLoadTagForm();
                    endHandle(xhr);
                },

                success: function(data, xhr) {
                    progressContent(action, data, xhr, function() {
                        for (var i = 0; i < elementsButton.length; ++i)
                            removeListener(elementsButton[i], EVENT_CLICK, eventClickElementButton);

                        for (var i = 0; i < elementsForm.length; ++i)
                            removeListener(elementsForm[i], EVENT_SUBMIT, eventSubmitElementForm);
                    });
                }
            });

            return false;
        }

        return {
            init: function(__httpHost) {
                httpHost = __httpHost;
            },

            reInitLoadTagA: function() {
                elementsA = getElementsByTagName("a");

                for (var i = 0; i < elementsA.length; ++i) {
                    var element = elementsA[i];

                    if (!element.className || element.className.indexOf("not-autoload") === -1) {
                        setAttribute(element, "onclick", "return false");

                        if (element != null)
                            addListener(element, EVENT_CLICK, eventClickElementA, true);
                    }
                }
            },

            reInitLoadTagForm: function() {
                elementsForm   = getElementsByTagName("form");
                elementsButton = [];

                var inputs  = getElementsByTagName("input");
                var buttons = getElementsByTagName("button");

                if (inputs.length && inputs.length > 0) {
                    for (var i = 0; i < inputs.length; ++i) {
                        var input = inputs[i];

                        if (input.type && input.type.toLowerCase() === "submit") {
                            addListener(input, EVENT_CLICK, eventClickElementButton, true);

                            if (elementsButton.push)
                                elementsButton.push(input);
                        }
                    }
                }

                if (buttons.length && buttons.length > 0) {
                    for (var i = 0; i < buttons.length; ++i) {
                        addListener(buttons[i], EVENT_CLICK, eventClickElementButton, true);

                        if (elementsButton.push)
                            elementsButton.push(buttons[i]);
                    }
                }

                for (var i = 0; i < elementsForm.length; ++i) {
                    var form = elementsForm[i];

                    if (!form.className || form.className.indexOf("not-autoload") === -1) {
                        setAttribute(form, "onsubmit", "return false");

                        if (form != null)
                            addListener(form, EVENT_SUBMIT, eventSubmitElementForm, true);
                    }
                }
            }
        };
    })();

    var chooseTheme = (function() {
        var origin = null;

        return {
            preview: function(url) {
                var head  = getElementsByTagName("head");
                var style = null;

                if (!head.length || head.length <= 0)
                    return;

                head = head[0];
                style = getElementsByTagName("link", head);

                if (!style.length || style.length <= 0)
                    return;

                for (var i = 0; i < style.length; ++i) {
                    var rel = getAttribute(style[i], "rel");

                    if (rel != null && rel.length && rel.indexOf("stylesheet") !== -1) {
                        style = style[i];
                        break;
                    }
                }

                if (style.href) {
                    if (origin === null)
                        origin = style.href;

                    style.href = url;
                }
            }
        };
    })();

    var autoChooseTypeFolderFile = (function() {
        var inputName       = null;
        var radioTypeFolder = null;
        var radioTypeFile   = null;

        function eventInput(e) {
            if (this.value && this.value.length) {
                if (this.value.indexOf(".") !== -1) {
                    radioTypeFolder.checked = false;
                    radioTypeFile.checked   = true;
                } else {
                    radioTypeFolder.checked = true;
                    radioTypeFile.checked   = false;
                }
            }
        }

        return {
            init: function(formSelector) {
                var form = getElementById(formSelector);

                if (inputName != null) {
                    removeListener(inputName, EVENT_INPUT, eventInput);
                    inputName = null;
                }

                if (form != null && form.length && form.length > 0) {
                    inputName       = form.querySelector("input[type=text][name=name]");
                    radioTypeFolder = form.querySelector("input[type=radio][id=type-folder]");
                    radioTypeFile   = form.querySelector("input[type=radio][id=type-file]");

                    addListener(inputName, EVENT_INPUT, eventInput, true);
                }
            }
        };
    })();

    var editorHighlight = (function() {
        var element            = null;
        var styledElement      = null;
        var textarea           = null;
        var lineNumber         = null;
        var wrapper            = null;
        var linesWrapper       = null;
        var scrollLeftWrapper  = 0;
        var scrollTopWrapper   = 0;
        var scrollWidthWrapper = 0;
        var lineHeight         = 0;
        var heightWrapper      = 0;
        var isWrapContent      = false;

        function cleanChild() {
            for (var i = 0; i < element.childNodes.length; ++i) {
                var child = element.childNodes[i];

                if (child != null && child.tagName && child != textarea)
                    child.remove();
            }
        }

        function initElement() {
            styledElement = window.getComputedStyle(element);
            lineNumber    = document.createElement("div");
            wrapper       = document.createElement("ul");

            lineNumber.className    = "line-number";
            wrapper.className       = "wrapper";
            lineNumber.style.height = styledElement.height;
            wrapper.style.height    = styledElement.height;
            heightWrapper           = parseInt(styledElement.height.replace("px", ""));

            element.appendChild(lineNumber);
            element.appendChild(wrapper);
        }

        function phpHighlight(content) {
            console.log("phpHighlight");

            var buffer        = "";
            var indexChar     = "";
            var indexLoop     = 0;
            var lengthContent = content.length;

            var keywordsPHP = [
                "__halt_compiler", "break", "clone", "die", "empty",
                "endswitch", "final", "global", "include_once", "list",
                "private", "return", "try", "xor", "abstract", "callable",
                "const", "do", "enddeclare", "endwhile", "finally",
                "goto", "instanceof", "namespace", "protected", "static", "unset",
                "yield", "and", "case", "continue", "echo", "endfor",
                "eval", "for", "if", "insteadof", "new", "public",
                "switch", "use", "array", "catch", "declare", "else",
                "endforeach", "exit", "foreach", "exit", "implements",
                "interface", "or", "require", "throw", "var",
                "as", "class", "default", "elseif", "endif", "extends",
                "function", "include", "isset", "print", "require_once",
                "trai", "while"
            ];

            var functionsPHP = [
                "define", "intval"
            ];

            var symbolsPHP = [
                "%", "@", "-", "*", "&", "!",
                "~", ":", "|", "/", "=", "+",
                "-", "^"
            ];

            function getChatAt(index) {
                if (index < 0 || (!index || index == null))
                    index = indexLoop;

                if (index + 1 >= lengthContent)
                    return false;

                return content.charAt(index);
            }

            function getStringAt(index, length) {
                var buffer = "";
                var char   = "";

                for (var i = 0; i < length; ++i) {
                    char = getChatAt(index + i);

                    if (char === false)
                        break;

                    buffer += char;
                }

                return buffer;
            }

            function updateBuffer(val, entity) {
                if (!val || val == null)
                    val = indexChar;

                if (val !== false) {
                    if (typeof entity === "undefined" || entity === true) {
                        var buf      = "";
                        var charCode = 0;

                        for (var i = 0; i < val.length; ++i) {
                            charCode = val.charCodeAt(i);

                            if (charCode != 10 && charCode != 13)
                                buf += "&#" + charCode + ";";
                            else
                                buf += val.charAt(i);
                        }

                        val = buf;
                    }

                    buffer += val;
                }
            }

            function updateLoop(add) {
                indexLoop += add;
            }

            var isMatchPHP = false;
            var startTag   = "";
            var endTag     = "";
            var string     = "";
            var tagQuote   = "";

            var comment       = "";
            var tagSlashOpen  = "";
            var tagSlashClose = "";

            while (indexLoop < lengthContent) {
                indexChar = getChatAt();

                // Check start tag php
                if (indexChar === "<") {
                    startTag = indexChar;

                    while ((indexChar = getChatAt(++indexLoop)) !== false) {
                        if (" \r\n\t".indexOf(indexChar) !== -1)
                            break;
                        else
                            startTag += indexChar;
                    }

                    if (startTag === "<?php" || startTag === "<?" || startTag === "<?=") {
                        updateBuffer("<span class=\"php-tag-open\">", false);
                        updateBuffer(startTag);
                        updateBuffer("</span>", false);

                        isMatchPHP = true;
                        startTag   = "";
                    } else {
                        updateBuffer(startTag);
                    }
                // Is php script
                } else if (isMatchPHP) {
                    // Check end tag php
                    if (indexChar === "?") {
                        endTag = indexChar;

                        while ((indexChar = getChatAt(++indexLoop)) !== false) {
                            if (" \r\n\t".indexOf(indexChar) !== -1) {
                                break;
                            } else if (indexChar === ">") {
                                endTag += indexChar;
                                break;
                            } else {
                                endTag += indexChar;
                            }
                        }

                        if (endTag === "?>") {
                            updateBuffer("<span class=\"php-tag-close\">", false);
                            updateBuffer(endTag);
                            updateBuffer("</span>", false);
                            updateLoop(1);

                            isMatchPHP = false;
                            endTag     = "";
                        } else {
                            updateBuffer(endTag);
                        }
                    // Check string
                    } else if (("\"" === indexChar || "'" === indexChar || "\"" === tagQuote || "'" === tagQuote) && (tagSlashOpen == null || tagSlashOpen.length <= 0)) {
                        if (tagQuote === null || tagQuote.length <= 0) {
                            string   = indexChar;
                            tagQuote = indexChar;
                        } else {
                            string = indexChar;
                        }

                        while ((indexChar = getChatAt(++indexLoop)) !== false) {
                            if (" \r\n\t".indexOf(indexChar) !== -1)
                                break;
                            else
                                string += indexChar;

                            if (indexChar === tagQuote)
                                break;
                        }

                        updateBuffer("<span class=\"php-string\">", false);
                        updateBuffer(string);
                        updateBuffer("</span>", false);

                        if (indexChar === tagQuote) {
                            string   = "";
                            tagQuote = "";

                            updateLoop(1);
                        }
                    // Check variable
                    } else if ("$" === indexChar) {
                        var variable = indexChar;
                        var charCode = -1;

                        while ((indexChar = getChatAt(++indexLoop)) !== false) {
                            if (indexChar.toLowerCase)
                                charCode = indexChar.toLowerCase().charCodeAt(0);
                            else
                                charCode = -1;

                            if (variable.length <= 0 && ((charCode >= 97 && charCode <= 122) || charCode === 95))
                                variable += indexChar;
                            else if ((charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || charCode === 95)
                                variable += indexChar;
                            else
                                break;
                        }

                        if (variable.length > 0) {
                            updateBuffer("<span class=\"php-variable-name\">", false);
                            updateBuffer(variable);
                            updateBuffer("</span>", false);
                        } else {
                            updateBuffer("$");
                        }
                    } else {
                        if (indexChar.toLowerCase) {
                            var charCode = indexChar.toLowerCase().charCodeAt(0);

                            if ((charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || charCode === 95) {
                                var name = indexChar;

                                while ((indexChar = getChatAt(++indexLoop)) !== false) {
                                    if (indexChar.toLowerCase)
                                        charCode = indexChar.toLowerCase().charCodeAt(0);
                                    else
                                        charCode = -1;

                                    if (" \r\n\t".indexOf(indexChar) !== -1)
                                        break;
                                    else if ((charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || charCode === 95)
                                        name += indexChar;
                                    else
                                        break;
                                }

                                // Check keyword
                                if (keywordsPHP.indexOf(name.toLowerCase()) !== -1) {
                                    updateBuffer("<span class=\"php-keyword\">", false);
                                    updateBuffer(name);
                                    updateBuffer("</span>", false);
                                } else if (functionsPHP.indexOf(name.toLowerCase()) !== -1) {
                                    updateBuffer("<span class=\"php-function\">", false);
                                    updateBuffer(name);
                                    updateBuffer("</span>", false);
                                // Check number
                                } else if (isNaN(name) == false) {
                                    updateBuffer("<span class=\"php-number\">", false);
                                    updateBuffer(name);
                                    updateBuffer("</span>", false);
                                } else {
                                    var tagSelfStatic = getStringAt(indexLoop, 2);

                                    if (tagSelfStatic === "::") {
                                        updateBuffer("<span class=\"php-class-name\">", false);
                                        updateBuffer(name);
                                        updateBuffer("</span>", false);

                                        updateBuffer("<span class=\"php-class-tag-self\">", false);
                                        updateBuffer(tagSelfStatic);
                                        updateBuffer("</span>", false);

                                        updateLoop(2);
                                    } else {
                                        updateBuffer(name);
                                    }
                                }
                            } else if (symbolsPHP.indexOf(indexChar) !== -1) {
                                if ((indexChar === "-" || indexChar === "=") && getChatAt(indexLoop + 1) === ">") {
                                    updateBuffer(indexChar);
                                } else {
                                    updateBuffer("<span class=\"php-symbol\">", false);
                                    updateBuffer(indexChar);
                                    updateBuffer("</span>", false);
                                }

                                updateLoop(1);
                            } else {
                                updateBuffer();
                                updateLoop(1);
                            }
                        } else {
                            updateBuffer();
                            updateLoop(1);
                        }
                    }
                } else {
                    updateBuffer();
                    updateLoop(1);
                }
            }

            return buffer;
        }

        function initContent() {
            var content = textarea.value;
            var lines   = [];

            if (content != null && content.length && content.length > 0) {
                content = phpHighlight(content);
                lines   = content.split(/(?:\r\n|\r|\n)/g);
            } else {
                lines = [ "" ];
            }

            var childWrapper        = document.createElement("li");
            var spanChildWrapper    = document.createElement("span");
            var preChildWrapper     = document.createElement("pre");
            var preSpanChildWrapper = document.createElement("span");
            var childWrapperClone   = null;
            var widthNumberEnd      = 0;

            spanChildWrapper.textContent = lines.length;
            setAttribute(spanChildWrapper, "unselectable", "on");
            setAttribute(spanChildWrapper, "contenteditable", "false");

            childWrapper.appendChild(spanChildWrapper);
            childWrapper.appendChild(preChildWrapper);
            preChildWrapper.append(preSpanChildWrapper);
            wrapper.appendChild(childWrapper);

            var spanStyled        = window.getComputedStyle(spanChildWrapper);
            var spanWidth         = parseFloat(spanStyled.width.replace("px", ""));
            var spanPaddingLeft   = parseFloat(spanStyled.paddingLeft.replace("px", ""));
            var spanPadddingRight = parseFloat(spanStyled.paddingRight.replace("px", ""));

            widthNumberEnd                   = spanWidth + spanPaddingLeft + spanPadddingRight;
            preChildWrapper.style.marginLeft = widthNumberEnd + "px";
            spanChildWrapper.style.width     = spanWidth + "px";
            lineHeight                       = parseInt(spanStyled.lineHeight.replace("px", ""));

            wrapper.childNodes[0].remove();

            if (linesWrapper == null)
                linesWrapper = [];

            for (var i = 0; i < lines.length; ++i) {
                childWrapperClone = childWrapper.cloneNode(true);
                childWrapperClone.childNodes[0].textContent = i + 1;

                if (!lines[i].length || lines[i].length <= 0)
                    childWrapperClone.childNodes[1].childNodes[0].innerHTML = "\n";
                else
                    childWrapperClone.childNodes[1].childNodes[0].innerHTML = lines[i];

                wrapper.appendChild(childWrapperClone);
                linesWrapper.push(childWrapperClone);
            }
        }

        function initEventScroll() {
            scrollLeftWrapper  = 0;
            scrollTopWrapper   = 0;
            scrollWidthWrapper = 0;

            if (isMobileDevice())
                return;

            addListener(wrapper, EVENT_SCROLL, eventScrollWrapper, true);
        }

        function eventScrollWrapper(e) {
            if (isWrapContent)
                return true;

            var scrollLeft  = this.scrollLeft;
            var scrollTop   = this.scrollTop;
            var scrollWidth = this.scrollWidth;

            if (linesWrapper == null)
                linesWrapper = getElementsByTagName("li", this);

            if (scrollLeftWrapper !== scrollLeft || scrollTopWrapper !== scrollTop || scrollWidthWrapper !== scrollWidth) {
                if (linesWrapper.length && linesWrapper.length > 0) {
                    var beginLoop = Math.floor(scrollTop / lineHeight);
                    var endLoop   = Math.ceil((heightWrapper / lineHeight) + beginLoop) + 1;

                    if (endLoop > linesWrapper.length)
                        endLoop = linesWrapper.length;

                    for (var i = beginLoop; i < endLoop; ++i)
                        linesWrapper[i].childNodes[0].style.left  = scrollLeft + "px";
                }

                scrollLeftWrapper  = scrollLeft;
                scrollTopWrapper   = scrollTop;
                scrollWidthWrapper = scrollWidth;
            }

            return true;
        }

        return {
            init: function(idEditorHightlight) {
                editorHighlight.clean();

                element  = getElementById(idEditorHightlight);
                textarea = getElementsByTagName("textarea", element);

                if (typeof element === "undefined" || typeof textarea === "undefined" || element == null || textarea == null)
                    return;

                if (!textarea.length || textarea.length <= 0)
                    return;

                textarea = textarea[0];

                cleanChild();
                initElement();
                initContent();
                initEventScroll();
            },

            clean: function() {
                if (textarea != null)
                    removeListener(textarea, EVENT_SCROLL, eventScrollWrapper);

                element            = null;
                styledElement      = null;
                textarea           = null;
                lineNumber         = null;
                wrapper            = null;
                linesWrapper       = null;
                scrollLeftWrapper  = 0;
                scrollTopWrapper   = 0;
                scrollWidthWrapper = 0;
                lineHeight         = 0;
                heightWrapper      = 0;
                isWrapContent      = false;
            }
        };
    })();

    var translateLanguage = (function() {
        return {
            translate: function(str, langFrom, langTo) {
                ajax.open({
                    url: "translate.php?submit&from_lang=" + encodeURI(langFrom) + "&to_lang=" + encodeURI(langTo) + "&text=" + str,

                    success: function(data) {
                        console.log(data);
                    }
                });
            }
        };
    })();

    return {
        initHistoryScript:        initHistoryScript,

        Ajax:                     ajax,
        OnLoad:                   onLoad,
        ProgressBarBody:          progressBarBody,
        AutoFocusInputLast:       autoFocusInputLast,
        ButtonSaveOnJs:           buttonSaveOnJs,
        CheckboxCheckAll:         checkboxCheckAll,
        ChmodInput:               chmodInput,
        CustomInputFile:          customInputFile,
        CustomInputUrl:           customInputUrl,
        LoadAjax:                 loadAjax,
        ChooseTheme:              chooseTheme,
        AutoChooseTypeFolderFile: autoChooseTypeFolderFile,
        EditorHighlight:          editorHighlight,
        TranslateLanguage:        translateLanguage
    };
})();

if (Main.OnLoad)
    Main.OnLoad.run();