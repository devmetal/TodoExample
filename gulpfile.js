var elixir = require('laravel-elixir');

elixir.config.sourcemaps = true;
elixir.config.js.browserify.options['debug'] = true;

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.browserify('app.js','public/js/app.js','resources/assets/react/');
    mix.less('main.less');
});
