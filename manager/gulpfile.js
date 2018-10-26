var gulp         = require("gulp");
var gutil        = require("gulp-util");
var sass         = require("gulp-sass");
var plumber      = require("gulp-plumber");
var concat       = require("gulp-concat");
var rename       = require("gulp-rename");
var livereload   = require("gulp-livereload");
var minifyCss    = require("gulp-cssnano");
var minifyJs     = require("gulp-uglify");
var cssbeautify  = require("gulp-cssbeautify");
var prettify     = require("gulp-js-prettify");
var wait         = require("gulp-wait");
var color        = require("gulp-color");
var notifier     = require("node-notifier").WindowsBalloon;
var del          = require("del");

var notifier = new notifier({
  withFallback: false, // Use Growl Fallback if <= 10.8
  customPath: void 0 // Relative/Absolute path to binary if you want to use your own fork of terminal-notifier
});

var listSass = {
    basic: [
        "default",
        "pink",
        "purpe",
        "transparent"
    ],

    desktop: [
        "default"
    ]
};

function notify(options) {
    gutil.log(options.message);

    if (!options.time)
        options.time = 3;

    if (!options.type)
        options.type = "info";

    notifier.notify({
        title: options.title,
        message: options.message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''),
        sound: true,
        wait: false,
        time: options.time * 1000,
        type: options.type
    }, function(err, res) {
        if (typeof err !== "undefined") {
            console.log("----- Notifier error -----");
            console.log(err);
            console.log(res);
        }
    });
}

gulp.task("compress-javascript-basic", function() {
    var isSuccess = true;

    return gulp.src("assets/build/javascript/basic/main.js")
               .pipe(rename("app.js"))
               .pipe(gulp.dest("assets/javascript/basic"))
               .pipe(plumber({
                    errorHandler: function(error) {
                        isSuccess = false;

                        notify({
                            title: "Error compress javascript basic",
                            message: error.toString(),
                            type: "error",
                            time: 2
                        });

                        this.emit("end");
                    }
               }))
               .pipe(livereload())
               .pipe(minifyJs())
               .pipe(plumber({
                    errorHandler: function(error) {
                        isSuccess = false;

                        notify({
                            title: "Error compress javascript basic minify",
                            message: error.toString(),
                            type: "error",
                            time: 2
                        });

                        this.emit("end");
                    }
               }))
               .pipe(rename("app.min.js"))
               .pipe(gulp.dest("assets/javascript/basic"))
               .pipe(livereload())
               .on("end", function() {
                    if (isSuccess) {
                        notify({
                            title: "Compress javascript basic",
                            message: "Javascript basic is change"
                        });
                    }
               });
});

gulp.task("compress-javascript-lib-basic", function() {
    var isSuccess = true;

    return gulp.src("assets/build/javascript/basic/lib/**/*.js")
               .pipe(rename({
                    extname: ".js"
               }))
               .pipe(gulp.dest("assets/javascript/basic/lib"))
               .pipe(plumber({
                    errorHandler: function(error) {
                        isSuccess = false;

                        notify({
                            title: "Error compress javascript lib basic",
                            message: error.toString(),
                            type: "error",
                            time: 2
                        });

                        this.emit("end");
                    }
               }))
               .pipe(livereload())
               .pipe(minifyJs())
               .pipe(plumber({
                    errorHandler: function(error) {
                        isSuccess = false;

                        notify({
                            title: "Error compress javascript lib minify basic",
                            message: error.toString(),
                            type: "error",
                            time: 2
                        });

                        this.emit("end");
                    }
               }))
               .pipe(rename({
                    extname: ".min.js"
               }))
               .pipe(gulp.dest("assets/javascript/basic/lib"))
               .pipe(livereload())
               .on("end", function() {
                    if (isSuccess) {
                        notify({
                            title: "Compress javascript lib basic",
                            message: "Javascript lib basic is change"
                        });
                    }
               });
});

gulp.task("compress-javascript-desktop", function() {
    var isSuccess = true;

    return gulp.src("assets/build/javascript/desktop/**/*.js")
               .pipe(rename({
                    extname: ".js"
               }))
               .pipe(gulp.dest("assets/javascript/desktop"))
               .pipe(plumber({
                    errorHandler: function(error) {
                        isSuccess = false;

                        notify({
                            title: "Error compress javascript desktop",
                            message: error.toString(),
                            type: "error",
                            time: 2
                        });

                        this.emit("end");
                    }
               }))
               .pipe(livereload())
               .on("end", function() {
                    if (isSuccess) {
                        notify({
                            title: "Compress javascript desktop",
                            message: "Javascript desktop is change"
                        });
                    }
               });
});

// Sass theme
(function(lists) {
    gutil.log(color("+ Create task sass theme basic", "cyan"));

    for (var i = 0; i < lists.length; ++i) {
        var key = lists[i];

        gutil.log("- Create task sass theme " + color(key, "green") + " basic");
        gulp.task("sass-theme-" + key, function() {
            var name      = this.seq[0];
            var lastIndex = name.lastIndexOf("-");
            var lastName  = name.substring(lastIndex + 1);
            var isSuccess = true;

            return gulp.src("assets/build/sass/basic/" + lastName + "/sass/theme.scss")
                       .pipe(wait(500))
                       .pipe(plumber({
                            errorHandler: function(error) {
                                isSuccess = false;

                                notify({
                                    title: "Error sass theme " + lastName + " basic",
                                    message: error.toString(),
                                    type: "error",
                                    time: 2
                                });

                                this.emit("end");
                            }
                       }))
                       .pipe(sass())
                       .pipe(plumber({
                            errorHandler: function(error) {
                                isSuccess = false;

                                notify({
                                    title: "Error sass theme " + lastName + " basic",
                                    message: error.toString(),
                                    type: "error",
                                    time: 2
                                });

                                this.emit("end");
                            }
                       }))
                       .pipe(cssbeautify())
                       .pipe(rename("theme.css"))
                       .pipe(gulp.dest("assets/theme/basic/" + lastName))
                       .pipe(livereload())
                       .pipe(minifyCss())
                       .pipe(rename("theme.min.css"))
                       .pipe(gulp.dest("assets/theme/basic/" + lastName))
                       .pipe(livereload())
                       .on("end", function() {
                            if (isSuccess) {
                                notify({
                                    title: "Sass theme " + lastName + " basic",
                                    message: "Theme " + color(lastName, "green") + " basic is change"
                                });
                            }
                       });
        });
    }
})(listSass.basic);

(function(lists) {
    gutil.log(color("+ Create task sass theme desktop", "cyan"));

    for (var i = 0; i < lists.length; ++i) {
        var key = lists[i];

        gutil.log("- Create task sass theme " + color(key, "green") + " desktop");
        gulp.task("sass-theme-desktop-" + key, function() {
            var name      = this.seq[0];
            var lastIndex = name.lastIndexOf("-");
            var lastName  = name.substring(lastIndex + 1);
            var isSuccess = true;

            return gulp.src("assets/build/sass/desktop/" + lastName + "/sass/theme.scss")
                       .pipe(wait(500))
                       .pipe(plumber({
                            errorHandler: function(error) {
                                isSuccess = false;

                                notify({
                                    title: "Error sass theme " + lastName + " desktop",
                                    message: error.toString(),
                                    type: "error",
                                    time: 2
                                });

                                this.emit("end");
                            }
                       }))
                       .pipe(sass())
                       .pipe(plumber({
                            errorHandler: function(error) {
                                isSuccess = false;

                                notify({
                                    title: "Error sass theme " + lastName + " desktop",
                                    message: error.toString(),
                                    type: "error",
                                    time: 2
                                });

                                this.emit("end");
                            }
                       }))
                       .pipe(cssbeautify())
                       .pipe(rename("theme.css"))
                       .pipe(gulp.dest("assets/theme/desktop/" + lastName))
                       .pipe(livereload())
                       .pipe(minifyCss())
                       .pipe(rename("theme.min.css"))
                       .pipe(gulp.dest("assets/theme/desktop/" + lastName))
                       .pipe(livereload())
                       .on("end", function() {
                            if (isSuccess) {
                                notify({
                                    title: "Sass theme " + lastName + " desktop",
                                    message: "Theme " + lastName + " desktop is change"
                                });
                            }
                       });
        });
    }
})(listSass.desktop);

// Clone icomoon font theme basic
(function(lists) {
    gutil.log(color("+ Create task clone icomoon font theme basic", "cyan"));

    gulp.task("clone-icomoon-font-theme-basic", function() {
        return gulp.src("assets/build/sass/basic/include/icomoon/fonts/*.*")
                   .pipe(gulp.dest("assets/theme/fonts/icomoon/basic"))
                   .pipe(livereload())
                   .on("end", function() {
                        notify({
                            title: "Clone icomoon theme basic",
                            message: "Font icomoon theme basic is change"
                        });
                    });
    });
})(listSass.basic);

// Clone icomoon font theme desktop
(function(lists) {
    gutil.log(color("+ Create task clone icomoon font theme desktop", "cyan"));

    gulp.task("clone-icomoon-font-theme-desktop", function() {
        return gulp.src("assets/build/sass/desktop/include/icomoon/fonts/*.*")
                   .pipe(gulp.dest("assets/theme/fonts/icomoon/desktop"))
                   .pipe(livereload())
                   .on("end", function() {
                        notify({
                            title: "Clone icomoon theme desktop",
                            message: "Font icomoon theme desktop is change"
                        });
                    });
    });
})(listSass.desktop);

// Clone icon theme basic
(function(lists) {
    gutil.log(color("+ Create task clone icon theme basic", "cyan"));

    for (var i = 0; i < lists.length; ++i) {
        var key = lists[i];

        gutil.log("- Create task icon theme " + color(key, "green") + " basic");
        gulp.task("clone-icon-theme-basic-" + key, function() {
            var name      = this.seq[0];
            var lastIndex = name.lastIndexOf("-");
            var lastName  = name.substring(lastIndex + 1);

            return gulp.src("assets/build/sass/basic/" + lastName + "/icon/*.*")
                       .pipe(gulp.dest("assets/theme/basic/" + lastName + "/icon"))
                       .pipe(livereload())
                       .on("end", function() {
                            notify({
                                title: "Clone icon theme basic",
                                message: "Icon theme basic is change"
                            });
                        });
        });
    }
})(listSass.basic);

// Clone icon theme desktop
(function(lists) {
    gutil.log(color("+ Create task clone icon theme desktop", "cyan"));

    for (var i = 0; i < lists.length; ++i) {
        var key = lists[i];

        gutil.log("- Create task icon theme " + color(key, "green") + " desktop");
        gulp.task("clone-icon-theme-desktop-" + key, function() {
            var name      = this.seq[0];
            var lastIndex = name.lastIndexOf("-");
            var lastName  = name.substring(lastIndex + 1);

            return gulp.src("assets/build/sass/desktop/" + lastName + "/icon/*.*")
                       .pipe(gulp.dest("assets/theme/desktop/" + lastName + "/icon"))
                       .pipe(livereload())
                       .on("end", function() {
                            notify({
                                title: "Clone icon theme desktop",
                                message: "Icon theme desktop is change"
                            });
                        });
        });
    }
})(listSass.desktop);

// Clone ini theme basic
(function(lists) {
    gutil.log(color("+ Create task clone ini theme basic", "cyan"));

    for (var i = 0; i < lists.length; ++i) {
        var key = lists[i];

        gutil.log("- Create task ini theme " + color(key, "green") + " basic");
        gulp.task("clone-ini-theme-basic-" + key, function() {
            var name      = this.seq[0];
            var lastIndex = name.lastIndexOf("-");
            var lastName  = name.substring(lastIndex + 1);

            return gulp.src("assets/build/sass/basic/" + lastName + "/theme.ini")
                       .pipe(gulp.dest("assets/theme/basic/" + lastName))
                       .pipe(livereload())
                       .on("end", function() {
                            notify({
                                title: "Clone ini theme basic",
                                message: "Ini theme basic is change"
                            });
                        });
        });
    }
})(listSass.basic);

// Clone ini theme desktop
(function(lists) {
    gutil.log(color("+ Create task clone ini theme desktop", "cyan"));

    for (var i = 0; i < lists.length; ++i) {
        var key = lists[i];

        gutil.log("- Create task ini theme " + color(key, "green") + " desktop");
        gulp.task("clone-ini-theme-desktop-" + key, function() {
            var name      = this.seq[0];
            var lastIndex = name.lastIndexOf("-");
            var lastName  = name.substring(lastIndex + 1);

            return gulp.src("assets/build/sass/desktop/" + lastName + "/theme.ini")
                       .pipe(gulp.dest("assets/theme/desktop/" + lastName))
                       .pipe(livereload())
                       .on("end", function() {
                            notify({
                                title: "Clone ini theme desktop",
                                message: "Ini theme desktop is change"
                            });
                        });
        });
    }
})(listSass.basic);

gulp.task("watch", function() {
    notify({
        title: "Gulp",
        message: "Watch start"
    });
    livereload.listen();

    (function(lists) {
        for (var i = 0; i < lists.length; ++i) {
            gutil.log("* Watch sass theme basic " + color(lists[i], "green"));
            gulp.watch([
                "assets/build/sass/basic/" + lists[i] + "/sass/*.scss",
                "assets/build/sass/basic/include/*.scss",
                "assets/build/sass/basic/include/sass/icomoon/*.scss"
            ], [
                "sass-theme-" + lists[i]
            ]);

            gutil.log("* Watch icon theme basic " + color(lists[i], "green"));
            gulp.watch([
                "assets/build/sass/basic/" + lists[i] + "/icon/*.*",
            ], [
                "clone-icon-theme-basic-" + lists[i]
            ]);

            gutil.log("* Watch ini theme basic " + color(lists[i], "green"));
            gulp.watch([
                "assets/build/sass/basic/" + lists[i] + "/theme.ini",
            ], [
                "clone-ini-theme-basic-" + lists[i]
            ]);
        }
    })(listSass.basic);

    (function(lists) {
        for (var i = 0; i < lists.length; ++i) {
            gutil.log("* Watch sass theme desktop " + color(lists[i], "green"));
            gulp.watch([
                "assets/build/sass/desktop/" + lists[i] + "/sass/*.scss",
                "assets/build/sass/desktop/include/*.scss",
                "assets/build/sass/desktop/include/icomoon/*.scss"
            ], [
                "sass-theme-desktop-" + lists[i]
            ]);

            gutil.log("* Watch icon theme desktop " + color(lists[i], "green"));
            gulp.watch([
                "assets/build/sass/desktop/" + lists[i] + "/icon/*.*",
            ], [
                "clone-icon-theme-desktop-" + lists[i]
            ]);

            gutil.log("* Watch ini theme desktop " + color(lists[i], "green"));
            gulp.watch([
                "assets/build/sass/desktop/" + lists[i] + "/theme.ini",
            ], [
                "clone-ini-theme-desktop-" + lists[i]
            ]);
        }
    })(listSass.desktop);

    (function() {
        gutil.log("* Watch clone icomoon font theme " + color("basic", "green"));
        gutil.log("* Watch clone icomoon font theme " + color("desktop", "green"));

        gulp.watch([ "assets/build/sass/basic/include/icomoon/fonts/*.*"    ], [ "clone-icomoon-font-theme-basic" ]);
        gulp.watch([ "assets/build/sass/desktop/include/icomoon/fonts/*.*" ], [ "clone-icomoon-font-theme-desktop" ]);
    })();

    (function() {
        gutil.log("* Watch javascript on change");
        gulp.watch([ "assets/build/javascript/basic/main.js"        ], [ "compress-javascript-basic" ]);
        gulp.watch([ "assets/build/javascript/basic/lib/**/*.js" ], [ "compress-javascript-lib-basic" ]);
        gulp.watch([ "assets/build/javascript/desktop/**/*.js"   ], [ "compress-javascript-desktop" ]);
    })();
});

gulp.task("default", (function() {
    var arrayTasks = [
        "clone-icomoon-font-theme-basic",
        "clone-icomoon-font-theme-desktop"
    ];

    var key = null;
    var i   = 0;

    for (i = 0; i < listSass.basic.length; ++i) {
        arrayTasks.push("clone-ini-theme-basic-" + listSass.basic[i]);
        arrayTasks.push("clone-icon-theme-basic-" + listSass.basic[i]);
    }

    for (i = 0; i < listSass.desktop.length; ++i) {
        arrayTasks.push("clone-ini-theme-desktop-" + listSass.desktop[i]);
        arrayTasks.push("clone-icon-theme-desktop-" + listSass.desktop[i]);
    }

    arrayTasks.push("watch");

    return arrayTasks;
})());