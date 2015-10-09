'use strict';

//--------------------------------------------------------------------------- NODE MODULES

const Path         = require('path');
const FS           = require('fs');
const ChildProcess = require('child_process');

//---------------------------------------------------------------------------- NPM MODULES

const Del    = require('del');
const Chalk  = require('chalk');

const Gulp   = require('gulp');
const Lint   = require('gulp-eslint');
const Source = require('gulp-sourcemaps');
const SrcSup = require('gulp-sourcemaps-support');
const Babel  = require('gulp-babel');
const Mocha  = require('gulp-spawn-mocha');

//------------------------------------------------------------------------- CONF.pathS & ROUTES

// Does a little simulation of the Path library.
if (!FS.existsSync(Path.join(process.env.PWD, 'package.json'))){
	console.info(Chalk.red('Run gulp from project root'));
	process.exit(1);
}

const GIK  = [];
module.exports = GIK;

const CONF = {};

CONF.path = new String(process.env.PWD);
for (let dir of ['src', 'test', 'docs', 'build', 'coverage'])
	Object.defineProperty(CONF.path, dir, {
		value        : Path.join(String(CONF.path), dir),
		writable     : false,
		enumerable   : true,
		configurable : false
	});

CONF.route = {
	index : Path.resolve(CONF.path.build, 'index.js'),
	chai  : Path.join(CONF.path.test, '.chai.js'),
	test  : [Path.join(CONF.path.test, '**/*.js')],
	src   : [Path.join(CONF.path.src, '**/*.js')],
	json  : [Path.join(CONF.path.src, '**/*.json')]
};

CONF.lint = {
	src: {
		useEslintrc : true
	},
	test: {
		rulesPath   : [CONF.path.test],
		useEslintrc : true
	}
};

CONF.babel = {
	optional      : ['runtime'],
	sourceMap     : ['both'],
	blacklist     : ['strict'], // removes use strict
	stage         : 1,
	sourceMapName : '.map',
	sourceRoot    : CONF.path.src,
	comments      : false
};

CONF.mocha = {
	ui        : 'bdd',
	bail      : true,
	require   : CONF.route.chai,
	reporter  : 'mocha-unfunk-reporter',
	compilers : 'js:babel/register',
	istanbul  : {
		dir: Path.join(CONF.path.toString(), 'coverage')
	}
};

//---------------------------------------------------------------------------------- TASKS


GIK.push(['clean.build', function(done){
	Del([CONF.path.build, CONF.path.coverage]).then(()=>done());
}]);

GIK.push(['clean', ['clean.build']]);

GIK.push(['lint.test', ()=>
	Gulp.src(CONF.route.test)
		.pipe(Lint(CONF.lint.test))
		.pipe(Lint.format())
		.pipe(Lint.failOnError())
]);

GIK.push(['lint.src', ()=>
	Gulp.src(CONF.route.src)
		.pipe(Lint(CONF.lint.src))
		.pipe(Lint.format())
		.pipe(Lint.failOnError())
]);

GIK.push(['lint', ['lint.test', 'lint.src']]);

GIK.push(['build', ['clean', 'lint'], ()=>
	Gulp.src(CONF.route.src)
		.pipe(SrcSup())
		.pipe(Source.init())
		.pipe(Babel(CONF.babel))
		.pipe(Source.write('.')) // inline sourcemaps
		.pipe(Gulp.dest(CONF.path.build))
]);

GIK.push(['test', ['lint', 'build'], ()=>
	Gulp.src(CONF.route.test)
		.pipe(Mocha(CONF.mocha))
]);

GIK.push(['watch', function(){
	let cmd;
	// keep every argument after the gulp command.
	let arg = process.argv.slice(process.argv.indexOf('watch') + 1);
	// but use this command instead.
	arg.unshift('test');
	// this will be run when changes are found
	function onChange(){
		// if there's a current process, kill it, so it can be restarted.
		if (cmd) cmd.kill();
		// spawn the new process, but keep its stdio in this process instead.
		cmd = ChildProcess.spawn('gulp', arg, { stdio:'inherit' });
		// if there's the need of run a command after the process dies, do it here.
		cmd.on('close', function(){
			console.info('\n', Chalk.yellow('Waiting for changes …'));
		});
	}
	// Watch the source files, plus the test files;
	let src = CONF.route.src.concat(CONF.route.test).concat(CONF.route.json);
	Gulp.watch(src, onChange);
	onChange();
}]);