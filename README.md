#GIK
A gulp workflow for giks.

## Usage

Install `gulp`, `chai` and `gik` as a dev-dependencies.
```bash
$ npm install --save-dev gulp chai fai
```

Create a `gulpfile.js` on your project's root and add the following lines:
```javascript
	'use strict';
	let Gulp = require('gulp');
	let Gik  = require('gik');

	for (let i in GIK) Gulp.task.apply(Gulp, GIK[i]);

	// Your tasks here
	Gulp.task('your task', ()=>)
```

Create a `test` directory on your project's root directory, and add a `.chai.js` where you
can optionally configure your chai experience.

```bash
mkdir test && cd test && touch .chai.js
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

Optionally create `.eslintrc` files on your `test` and `src` directories
to configure how the `ES6 Linter` behaves.

## What tasks are included?

- `clean` Clean up build dirs.
- `lint.test` Linter on test files.
- `lint.src`  Linter on source files.
- `lint` Lint for both test and source files.
- `build` Run the ES6 transpiler (`Babel`) on the source files and puts them on build.
- `test` Runs tests. (`Mocha` `Chai`)
- `watch` Runs tests and watches for changes.
