#GIK
A gulp workflow for giks.

## What tasks are included?

- `clean.build` Clean up build dirs.
- `clean.docs` Clean up docs dirs.
- `lint.test` Linter on test files.
- `lint.src`  Linter on source files.
- `lint` Lint for both test and source files.
- `docs` Generate documentation (`gik-doc`)
- `build` Run the ES6 transpiler (`Babel`) on the source files and puts them on build.
- `test` Runs tests. (`Mocha` `Chai`)
- `watch` Runs tests and watches for changes.

## Usage

- Install `gulp`, `chai` and `gik` as a dev-dependencies.

	```bash
	$ npm install --save-dev gulp chai fai
	```

- Install `babel-runtime` as dependency (if you want complete support for ES6 feats)

	```bash
	$ npm install --save gulp babel-runtime
	```

- Create a `gulpfile.js` on your project's root and add the following lines:

	```javascript
		'use strict';
		let Gulp = require('gulp');
		let Gik  = require('gik');

		for (let i in GIK) Gulp.task.apply(Gulp, GIK[i]);

		// Your tasks here
		Gulp.task('your task', ()=>)
	```

- Create a `test` and `src` directory.

	```bash
	mkdir test && mkdir src
	```

- Add a `.chai.js` file in the `test` directory to configure your `Chai` experience.
own globals to the mix.

	```bash
	touch test/.chai.js
	```

	```javascript
	'use strict';

	let Chai = require('chai');

	// Chai configurations.
	Chai.config.includeStack = false;
	Chai.config.showDiff     = false;

	// globals you need on your tests.
	GLOBAL.expect = Chai.expect;
	```

- Create in both `test` and `src` dirs a file named `.eslintrc`. It will allow the linter to
use ES6 and you will be able to personalize its rules.

	```javascript
	{
		"parser": "babel-eslint",
		"env":{
			"browser" : false,
			"node"    : true
		},
		"globals":{
			"xit"      : true,
			"it"       : true,
			"describe" : true,
			"expect"   : true
		},
		"rules":{
		/* your rules here */
		}
	}
	```