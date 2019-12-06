var gulp = require('gulp'),
    concat = require('gulp-concat'),
    toc = require('gulp-markdown-toc'),
    pdf = require('gulp-markdown-pdf'),
    inject = require('gulp-inject-string'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    del = require('del');


/*
    Build the templates into full HTML pages.
*/

gulp.task('combine', function() {
    return gulp.src([
        'sections/header.md',
        'sections/toc.md',
        'sections/getting-started.md',
        'sections/definitions.md',
        'sections/wog-api-requirements.md',
        'sections/naming-conventions.md',
        'sections/api-versioning.md',
        'sections/api-request.md',
        'sections/query-parameters.md',
        'sections/api-response.md',
        'sections/error-handling.md',
        'sections/api-security.md',
        'sections/hypermedia.md',
        'sections/pagination.md',
        'sections/networking.md',
        'sections/webhooks.md',
        'sections/testing.md',
        'sections/footer.md',
    ],{allowEmpty: true})
    .pipe(concat('combined.md'))
    .pipe(toc())
    .pipe(gulp.dest('target'));
});

gulp.task('pdf', function() {
    var pdfOptions = { 
        remarkable: { 
            html:true 
        }
    }

    return gulp.src('target/combined.md')
        .pipe(replace('<!-- toc -->', ''))
        .pipe(replace('<!-- tocstop -->', ''))
        .pipe(pdf(pdfOptions))
        .pipe(gulp.dest('target'));
});


gulp.task('header.md', function() {
    return gulp.src('sections/header.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "Overview"\nnav_order: 1\n---\n'))
    .pipe(rename('index.md'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('getting-started.md', function() {
    return gulp.src('sections/getting-started.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "Getting Started"\nnav_order: 2\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('definitions.md', function() {
    return gulp.src('sections/definitions.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "Definitions"\nnav_order: 3\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('wog-api-requirements.md', function() {
    return gulp.src('sections/wog-api-requirements.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "WoG API Requirements"\nnav_order: 4\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('naming-conventions.md', function() {
    return gulp.src('sections/naming-conventions.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "Naming Conventions"\nnav_order: 5\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('api-versioning.md', function() {
    return gulp.src('sections/api-versioning.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "API Versioning"\nnav_order: 6\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('api-request.md', function() {
    return gulp.src('sections/api-request.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "API Request"\nnav_order: 7\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('query-parameters.md', function() {
    return gulp.src('sections/query-parameters.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "Query Parameters"\nnav_order: 8\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('api-response.md', function() {
    return gulp.src('sections/api-response.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "API Response"\nnav_order: 9\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('error-handling.md', function() {
    return gulp.src('sections/error-handling.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "Error Handling"\nnav_order: 10\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('api-security.md', function() {
    return gulp.src('sections/api-security.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "API Security"\nnav_order: 11\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('hypermedia.md', function() {
    return gulp.src('sections/hypermedia.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "Hypermedia"\nnav_order: 12\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('pagination.md', function() {
    return gulp.src('sections/pagination.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "Pagination"\nnav_order: 13\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('networking.md', function() {
    return gulp.src('sections/networking.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "Networking"\nnav_order: 14\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('webhooks.md', function() {
    return gulp.src('sections/webhooks.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "Webhooks"\nnav_order: 15\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('testing.md', function() {
    return gulp.src('sections/testing.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "Testing"\nnav_order: 16\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});
gulp.task('footer.md', function() {
    return gulp.src('sections/footer.md')
    .pipe(inject.prepend('---\ncollection: national_api_standards\ntitle: "References"\nnav_order: 17\n---\n'))
    .pipe(gulp.dest('docs/_national_api_standards/'));
});

gulp.task('open-api-templates', function() {
    return gulp.src('open-api-templates/**/*')
    .pipe(gulp.dest('docs/_national_api_standards/open-api-templates'));
});






gulp.task('copy', gulp.series(
    'header.md',
    'getting-started.md',
    'definitions.md',
    'wog-api-requirements.md',
    'naming-conventions.md',
    'api-versioning.md',
    'api-request.md',
    'query-parameters.md',
    'api-response.md',
    'error-handling.md',
    'api-security.md',
    'hypermedia.md',
    'pagination.md',
    'networking.md',
    'webhooks.md',
    'testing.md',
    'footer.md',
    'open-api-templates'
));
        
/*
    Clean the build directories
*/

gulp.task('clean', function() {
    return del([
        'target/*'
    ])
});


gulp.task('default', gulp.series(
    'clean',
    'combine',
    'pdf'
));

gulp.task('deploy', gulp.series(
    'copy'
));
