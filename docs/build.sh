#!/bin/sh


rm _national_api_standards/*.md

cd ..

ls sections | xargs -I % ~/.npm-global/bin/gulp %

cd docs

rm -rf _site

bundle exec jekyll build -d _site/standards $1
