({
	baseUrl: "../js",
	paths:{
		classes: 'classes',
		'jquery': 'libs/jquery',
		'lodash' : 'libs/lodash',
        'handlebars' : 'libs/handlebars',
	},
    shim: {
        'lodash': {
            exports: '_'
        }
    },
	name: "app",
	out: "out/app.min.js"
})