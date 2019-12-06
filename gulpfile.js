var gulp = require('gulp'),
    concat = require('gulp-concat'),
    toc = require('gulp-markdown-toc'),
    pdf = require('gulp-markdown-pdf'),
    replace = require('gulp-replace'),
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