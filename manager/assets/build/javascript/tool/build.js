({
    baseUrl: "../desktop",
    mainConfigFile: "../desktop/bundle.js",
    out: "../../app.desktop.min.js",
    name: "main",
    preserveLicenseComments: false,
    // optimize: "none",

    paths: {
        requireLib: "../desktop/lib/require"
    },

    include: "requireLib"
})