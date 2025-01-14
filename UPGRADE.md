# Upgrade Notes

## 3.0.1
- Skip meta data update when elementId is missing [@NiklasBr](https://github.com/dachcom-digital/pimcore-seo/pull/58)

## Migrating from Version 2.x to Version 3.0.0
- Execute: `bin/console doctrine:migrations:migrate --prefix 'SeoBundle\Migrations'`

### Global Changes
- Recommended folder structure by symfony adopted
- SEO changes are not getting persisted at auto-save events anymore

### New Features
- Xliff Import/Export Support, see [#31](https://github.com/dachcom-digital/pimcore-seo/issues/31)
    - Introduced `XliffAwareIntegratorInterface` to specify xliff translation states for given integrator
    - Properties for `OpenGraph` and `TwitterCard` integrator can be extended by an 3. argument to include/exclude them for xliff translations (Default `false`)
- Seo Document Editor Support, see [#54](https://github.com/dachcom-digital/pimcore-seo/issues/54)

***

SeoBundle 2.x Upgrade Notes: https://github.com/dachcom-digital/pimcore-seo/blob/2.x/UPGRADE.md
