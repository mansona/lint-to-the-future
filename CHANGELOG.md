# Changelog

## Release (2024-09-30)

lint-to-the-future 2.1.0 (minor)

#### :rocket: Enhancement
* `lint-to-the-future`
  * [#36](https://github.com/mansona/lint-to-the-future/pull/36) Add remove command to lint-to-the-future ([@Mikek2252](https://github.com/Mikek2252))
  * [#44](https://github.com/mansona/lint-to-the-future/pull/44) add lttf alias ([@mansona](https://github.com/mansona))
  * [#37](https://github.com/mansona/lint-to-the-future/pull/37) Prevent fractions from showing up in the y axis ([@mansona](https://github.com/mansona))

#### :house: Internal
* `lint-to-the-future`
  * [#43](https://github.com/mansona/lint-to-the-future/pull/43) Add prettier setup ([@mansona](https://github.com/mansona))
  * [#41](https://github.com/mansona/lint-to-the-future/pull/41) move output command test to its own file ([@mansona](https://github.com/mansona))
  * [#40](https://github.com/mansona/lint-to-the-future/pull/40) setup release-plan ([@mansona](https://github.com/mansona))
  * [#39](https://github.com/mansona/lint-to-the-future/pull/39) switch to pnpm ([@mansona](https://github.com/mansona))

#### Committers: 2
- Chris Manson ([@mansona](https://github.com/mansona))
- Michael Kerr ([@Mikek2252](https://github.com/Mikek2252))

v2.0.0 / 2023-01-13
==================
* Squash old file lists to save size #32 from @wagenet
* add a basic tests for rootUrl on output command #30 from @mansona

v1.3.1 / 2022-10-17
==================
* Fix rootUrl option #29 from @wandroll

v1.3.0 / 2022-10-14
==================
* Move from minimist to commander #28 from @Mikek2252
* Update README.md #26 from @Mikek2252

v1.2.0 / 2022-07-25
==================
* Add support for --previousResults to point at a local file instead of a link #25 from @Mikek2252

v1.1.0 / 2022-05-17
==================
* try importing an esm module before reverting to `importCwd` #24 from @mansona
* add documentation for plugin developers #23 from @mansona

v1.0.0 / 2022-02-02
==================

Lint to the Future v1.0 is here 🎉 There are no breaking changes with this release it's just time to declare this project as stable!

* Add tests & fix bug with view files route #19 from @mansona
* Update README.md #18 from @locks

v0.8.0 / 2021-11-09
==================
* Adds monthly view to the overview, with a 30 day grouping #14 from @MinThaMie
* [docs] add lint-to-the-future-stylelint to readme #12 from @mansona

v0.7.0 / 2021-10-19
==================
* add attribution links #11 from @mansona
* Make sure graphs can actually go to zero #10 from @mansona
* Adds dark mode #9 from @MinThaMie
* [DOC] Add plugins to the README #8 from @jenweber

v0.6.1 / 2021-09-15
==================
* remove incorrect peer-dependency on eslint #7 from @mansona

v0.6.0 / 2021-07-06
==================
* Add weekly charts #6 from @mansona

v0.5.1 / 2021-06-04
==================
* don't error if package.json is missing devDependencies or dependencies #5 from @mansona

v0.5.0 / 2021-04-12
==================
* Add some initial styling to the Dashboard UI #2 from @MinThaMie
* move to github actions for CI #3 from @mansona
