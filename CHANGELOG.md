## 1.0.3 (2024-09-10)


### Bug Fixes

* **linting:** fix linting report ([7ca1c93](https://github.com/fr1t2/zond-faucet/commit/7ca1c93cd15e2f6e29747cc894bf61110ef7cca4))
* **start script:** add new script location ([7254bb1](https://github.com/fr1t2/zond-faucet/commit/7254bb1a210cd374572e5bda4201bdb981443d3e))
* **start script:** add new script location ([db57e93](https://github.com/fr1t2/zond-faucet/commit/db57e934357025cdf5a1df1b8f947b986262048b))


### Code Refactoring

* **module-alias:** add module-alias to simplify path traversal ([9920862](https://github.com/fr1t2/zond-faucet/commit/992086289efd056e571f44feea79a9d19f349f6d)), closes [#13](https://github.com/fr1t2/zond-faucet/issues/13)


### Features

* **api:** add additional api funcitons ([a95c8e4](https://github.com/fr1t2/zond-faucet/commit/a95c8e42f9f40f001a7fb8981d72783e5c21c061))
* **api:** add additional api funcitons ([aab5256](https://github.com/fr1t2/zond-faucet/commit/aab525649fe3df2479fb51a5f75c514d5f9160f8))
* **api:** add functions ([dd2f9c1](https://github.com/fr1t2/zond-faucet/commit/dd2f9c1d60fb89938b99258da219ea595925a51a))
* **api:** add functions ([209e949](https://github.com/fr1t2/zond-faucet/commit/209e9493fee4ef2be321b7b0c60d2921497c02e8))
* **api:** add new api function to segragate bot actions ([88ee028](https://github.com/fr1t2/zond-faucet/commit/88ee028e1fd6c261b669b5eb24abe5e01f5d1396))
* **api:** add new api function to segragate bot actions ([934d626](https://github.com/fr1t2/zond-faucet/commit/934d6266a42247d0d1149b75810ffd43739510a8))
* **api:** impliment api into block and balance lookups ([e55a220](https://github.com/fr1t2/zond-faucet/commit/e55a220b79d8e5e94acbd57aea9958239ff7ea27))
* **api:** move to api internal calls ([268e6dc](https://github.com/fr1t2/zond-faucet/commit/268e6dc78bbc2afb00c97265c383cf82301145a8))
* **channel limiter:** limit access to bot commands based on list in config ([69f987c](https://github.com/fr1t2/zond-faucet/commit/69f987ccedb149c02f494bc18a8f4887c54b8a08))
* **channel limiter:** limit access to channels listed in config ([24ded13](https://github.com/fr1t2/zond-faucet/commit/24ded13b2317755f01cddb3ead53ab3e745b63ab))
* **live reload:** live reload funcitonality using nodemon ([d80ecdd](https://github.com/fr1t2/zond-faucet/commit/d80ecdda57f250e0b2fe888b53cef2dd7d353400))
* **qrl block lookup:** latest block data or given block # ([b648075](https://github.com/fr1t2/zond-faucet/commit/b64807579d061a7892c8b7e03fe7deeb32284d9f))
* **qrladdress:** oTS Index and balance info + known address list ([2d26ecc](https://github.com/fr1t2/zond-faucet/commit/2d26eccb4bb244f895aa1b4d00e67cd91b75cddb))
* **swagger:** add swagger api endpoints and server ([88c0b87](https://github.com/fr1t2/zond-faucet/commit/88c0b873b27e858ae180c41a8c7c437033d18855)), closes [#14](https://github.com/fr1t2/zond-faucet/issues/14)
* **truncatehash:** reduce hash to readable format with head and tail of given length (8 default) ([7df2bd5](https://github.com/fr1t2/zond-faucet/commit/7df2bd55de1f0bb212cbc48714fb8ef745e15520))
* **zond block:** lookup zond block by number ([c1ca428](https://github.com/fr1t2/zond-faucet/commit/c1ca428ef0b4dd4b088fbd4296885fd34f8f5e0a))


### BREAKING CHANGES

* **api:** moving to the API may break the old function
* **module-alias:** path requires have all changed which if not correct may lead to crashes



## 1.0.3 (2024-09-10)


### Bug Fixes

* **linting:** fix linting report ([7ca1c93](https://github.com/fr1t2/zond-faucet/commit/7ca1c93cd15e2f6e29747cc894bf61110ef7cca4))
* **start script:** add new script location ([7254bb1](https://github.com/fr1t2/zond-faucet/commit/7254bb1a210cd374572e5bda4201bdb981443d3e))
* **start script:** add new script location ([db57e93](https://github.com/fr1t2/zond-faucet/commit/db57e934357025cdf5a1df1b8f947b986262048b))


### Code Refactoring

* **module-alias:** add module-alias to simplify path traversal ([9920862](https://github.com/fr1t2/zond-faucet/commit/992086289efd056e571f44feea79a9d19f349f6d)), closes [#13](https://github.com/fr1t2/zond-faucet/issues/13)


### Features

* **api:** add additional api funcitons ([a95c8e4](https://github.com/fr1t2/zond-faucet/commit/a95c8e42f9f40f001a7fb8981d72783e5c21c061))
* **api:** add additional api funcitons ([aab5256](https://github.com/fr1t2/zond-faucet/commit/aab525649fe3df2479fb51a5f75c514d5f9160f8))
* **api:** add functions ([dd2f9c1](https://github.com/fr1t2/zond-faucet/commit/dd2f9c1d60fb89938b99258da219ea595925a51a))
* **api:** add functions ([209e949](https://github.com/fr1t2/zond-faucet/commit/209e9493fee4ef2be321b7b0c60d2921497c02e8))
* **api:** add new api function to segragate bot actions ([88ee028](https://github.com/fr1t2/zond-faucet/commit/88ee028e1fd6c261b669b5eb24abe5e01f5d1396))
* **api:** add new api function to segragate bot actions ([934d626](https://github.com/fr1t2/zond-faucet/commit/934d6266a42247d0d1149b75810ffd43739510a8))
* **api:** impliment api into block and balance lookups ([e55a220](https://github.com/fr1t2/zond-faucet/commit/e55a220b79d8e5e94acbd57aea9958239ff7ea27))
* **api:** move to api internal calls ([268e6dc](https://github.com/fr1t2/zond-faucet/commit/268e6dc78bbc2afb00c97265c383cf82301145a8))
* **channel limiter:** limit access to bot commands based on list in config ([69f987c](https://github.com/fr1t2/zond-faucet/commit/69f987ccedb149c02f494bc18a8f4887c54b8a08))
* **channel limiter:** limit access to channels listed in config ([24ded13](https://github.com/fr1t2/zond-faucet/commit/24ded13b2317755f01cddb3ead53ab3e745b63ab))
* **live reload:** live reload funcitonality using nodemon ([d80ecdd](https://github.com/fr1t2/zond-faucet/commit/d80ecdda57f250e0b2fe888b53cef2dd7d353400))
* **qrl block lookup:** latest block data or given block # ([b648075](https://github.com/fr1t2/zond-faucet/commit/b64807579d061a7892c8b7e03fe7deeb32284d9f))
* **qrladdress:** oTS Index and balance info + known address list ([2d26ecc](https://github.com/fr1t2/zond-faucet/commit/2d26eccb4bb244f895aa1b4d00e67cd91b75cddb))
* **swagger:** add swagger api endpoints and server ([88c0b87](https://github.com/fr1t2/zond-faucet/commit/88c0b873b27e858ae180c41a8c7c437033d18855)), closes [#14](https://github.com/fr1t2/zond-faucet/issues/14)
* **truncatehash:** reduce hash to readable format with head and tail of given length (8 default) ([7df2bd5](https://github.com/fr1t2/zond-faucet/commit/7df2bd55de1f0bb212cbc48714fb8ef745e15520))
* **zond block:** lookup zond block by number ([c1ca428](https://github.com/fr1t2/zond-faucet/commit/c1ca428ef0b4dd4b088fbd4296885fd34f8f5e0a))


### BREAKING CHANGES

* **api:** moving to the API may break the old function
* **module-alias:** path requires have all changed which if not correct may lead to crashes



## 1.0.3 (2024-09-10)


### Bug Fixes

* **linting:** fix linting report ([7ca1c93](https://github.com/fr1t2/zond-faucet/commit/7ca1c93cd15e2f6e29747cc894bf61110ef7cca4))
* **start script:** add new script location ([7254bb1](https://github.com/fr1t2/zond-faucet/commit/7254bb1a210cd374572e5bda4201bdb981443d3e))
* **start script:** add new script location ([db57e93](https://github.com/fr1t2/zond-faucet/commit/db57e934357025cdf5a1df1b8f947b986262048b))


### Code Refactoring

* **module-alias:** add module-alias to simplify path traversal ([9920862](https://github.com/fr1t2/zond-faucet/commit/992086289efd056e571f44feea79a9d19f349f6d)), closes [#13](https://github.com/fr1t2/zond-faucet/issues/13)


### Features

* **api:** add additional api funcitons ([a95c8e4](https://github.com/fr1t2/zond-faucet/commit/a95c8e42f9f40f001a7fb8981d72783e5c21c061))
* **api:** add additional api funcitons ([aab5256](https://github.com/fr1t2/zond-faucet/commit/aab525649fe3df2479fb51a5f75c514d5f9160f8))
* **api:** add functions ([dd2f9c1](https://github.com/fr1t2/zond-faucet/commit/dd2f9c1d60fb89938b99258da219ea595925a51a))
* **api:** add functions ([209e949](https://github.com/fr1t2/zond-faucet/commit/209e9493fee4ef2be321b7b0c60d2921497c02e8))
* **api:** add new api function to segragate bot actions ([88ee028](https://github.com/fr1t2/zond-faucet/commit/88ee028e1fd6c261b669b5eb24abe5e01f5d1396))
* **api:** add new api function to segragate bot actions ([934d626](https://github.com/fr1t2/zond-faucet/commit/934d6266a42247d0d1149b75810ffd43739510a8))
* **api:** impliment api into block and balance lookups ([e55a220](https://github.com/fr1t2/zond-faucet/commit/e55a220b79d8e5e94acbd57aea9958239ff7ea27))
* **api:** move to api internal calls ([268e6dc](https://github.com/fr1t2/zond-faucet/commit/268e6dc78bbc2afb00c97265c383cf82301145a8))
* **channel limiter:** limit access to bot commands based on list in config ([69f987c](https://github.com/fr1t2/zond-faucet/commit/69f987ccedb149c02f494bc18a8f4887c54b8a08))
* **channel limiter:** limit access to channels listed in config ([24ded13](https://github.com/fr1t2/zond-faucet/commit/24ded13b2317755f01cddb3ead53ab3e745b63ab))
* **live reload:** live reload funcitonality using nodemon ([d80ecdd](https://github.com/fr1t2/zond-faucet/commit/d80ecdda57f250e0b2fe888b53cef2dd7d353400))
* **qrl block lookup:** latest block data or given block # ([b648075](https://github.com/fr1t2/zond-faucet/commit/b64807579d061a7892c8b7e03fe7deeb32284d9f))
* **qrladdress:** oTS Index and balance info + known address list ([2d26ecc](https://github.com/fr1t2/zond-faucet/commit/2d26eccb4bb244f895aa1b4d00e67cd91b75cddb))
* **swagger:** add swagger api endpoints and server ([88c0b87](https://github.com/fr1t2/zond-faucet/commit/88c0b873b27e858ae180c41a8c7c437033d18855)), closes [#14](https://github.com/fr1t2/zond-faucet/issues/14)
* **truncatehash:** reduce hash to readable format with head and tail of given length (8 default) ([7df2bd5](https://github.com/fr1t2/zond-faucet/commit/7df2bd55de1f0bb212cbc48714fb8ef745e15520))
* **zond block:** lookup zond block by number ([c1ca428](https://github.com/fr1t2/zond-faucet/commit/c1ca428ef0b4dd4b088fbd4296885fd34f8f5e0a))


### BREAKING CHANGES

* **api:** moving to the API may break the old function
* **module-alias:** path requires have all changed which if not correct may lead to crashes



## 1.0.2 (2024-09-10)


### Bug Fixes

* **linting:** fix linting report ([7ca1c93](https://github.com/fr1t2/zond-faucet/commit/7ca1c93cd15e2f6e29747cc894bf61110ef7cca4))
* **start script:** add new script location ([7254bb1](https://github.com/fr1t2/zond-faucet/commit/7254bb1a210cd374572e5bda4201bdb981443d3e))
* **start script:** add new script location ([db57e93](https://github.com/fr1t2/zond-faucet/commit/db57e934357025cdf5a1df1b8f947b986262048b))


### Code Refactoring

* **module-alias:** add module-alias to simplify path traversal ([9920862](https://github.com/fr1t2/zond-faucet/commit/992086289efd056e571f44feea79a9d19f349f6d)), closes [#13](https://github.com/fr1t2/zond-faucet/issues/13)


### Features

* **api:** add additional api funcitons ([a95c8e4](https://github.com/fr1t2/zond-faucet/commit/a95c8e42f9f40f001a7fb8981d72783e5c21c061))
* **api:** add additional api funcitons ([aab5256](https://github.com/fr1t2/zond-faucet/commit/aab525649fe3df2479fb51a5f75c514d5f9160f8))
* **api:** add functions ([dd2f9c1](https://github.com/fr1t2/zond-faucet/commit/dd2f9c1d60fb89938b99258da219ea595925a51a))
* **api:** add functions ([209e949](https://github.com/fr1t2/zond-faucet/commit/209e9493fee4ef2be321b7b0c60d2921497c02e8))
* **api:** add new api function to segragate bot actions ([88ee028](https://github.com/fr1t2/zond-faucet/commit/88ee028e1fd6c261b669b5eb24abe5e01f5d1396))
* **api:** add new api function to segragate bot actions ([934d626](https://github.com/fr1t2/zond-faucet/commit/934d6266a42247d0d1149b75810ffd43739510a8))
* **api:** impliment api into block and balance lookups ([e55a220](https://github.com/fr1t2/zond-faucet/commit/e55a220b79d8e5e94acbd57aea9958239ff7ea27))
* **api:** move to api internal calls ([268e6dc](https://github.com/fr1t2/zond-faucet/commit/268e6dc78bbc2afb00c97265c383cf82301145a8))
* **channel limiter:** limit access to bot commands based on list in config ([69f987c](https://github.com/fr1t2/zond-faucet/commit/69f987ccedb149c02f494bc18a8f4887c54b8a08))
* **channel limiter:** limit access to channels listed in config ([24ded13](https://github.com/fr1t2/zond-faucet/commit/24ded13b2317755f01cddb3ead53ab3e745b63ab))
* **live reload:** live reload funcitonality using nodemon ([d80ecdd](https://github.com/fr1t2/zond-faucet/commit/d80ecdda57f250e0b2fe888b53cef2dd7d353400))
* **qrl block lookup:** latest block data or given block # ([b648075](https://github.com/fr1t2/zond-faucet/commit/b64807579d061a7892c8b7e03fe7deeb32284d9f))
* **qrladdress:** oTS Index and balance info + known address list ([2d26ecc](https://github.com/fr1t2/zond-faucet/commit/2d26eccb4bb244f895aa1b4d00e67cd91b75cddb))
* **swagger:** add swagger api endpoints and server ([88c0b87](https://github.com/fr1t2/zond-faucet/commit/88c0b873b27e858ae180c41a8c7c437033d18855)), closes [#14](https://github.com/fr1t2/zond-faucet/issues/14)
* **truncatehash:** reduce hash to readable format with head and tail of given length (8 default) ([7df2bd5](https://github.com/fr1t2/zond-faucet/commit/7df2bd55de1f0bb212cbc48714fb8ef745e15520))
* **zond block:** lookup zond block by number ([c1ca428](https://github.com/fr1t2/zond-faucet/commit/c1ca428ef0b4dd4b088fbd4296885fd34f8f5e0a))


### BREAKING CHANGES

* **api:** moving to the API may break the old function
* **module-alias:** path requires have all changed which if not correct may lead to crashes



## 1.0.2 (2024-03-29)


### Bug Fixes

* **start script:** add new script location ([7254bb1](https://github.com/fr1t2/zond-faucet/commit/7254bb1a210cd374572e5bda4201bdb981443d3e))
* **start script:** add new script location ([db57e93](https://github.com/fr1t2/zond-faucet/commit/db57e934357025cdf5a1df1b8f947b986262048b))


### Code Refactoring

* **module-alias:** add module-alias to simplify path traversal ([9920862](https://github.com/fr1t2/zond-faucet/commit/992086289efd056e571f44feea79a9d19f349f6d)), closes [#13](https://github.com/fr1t2/zond-faucet/issues/13)


### Features

* **api:** add additional api funcitons ([aab5256](https://github.com/fr1t2/zond-faucet/commit/aab525649fe3df2479fb51a5f75c514d5f9160f8))
* **api:** add functions ([dd2f9c1](https://github.com/fr1t2/zond-faucet/commit/dd2f9c1d60fb89938b99258da219ea595925a51a))
* **api:** add functions ([209e949](https://github.com/fr1t2/zond-faucet/commit/209e9493fee4ef2be321b7b0c60d2921497c02e8))
* **api:** add new api function to segragate bot actions ([934d626](https://github.com/fr1t2/zond-faucet/commit/934d6266a42247d0d1149b75810ffd43739510a8))
* **api:** impliment api into block and balance lookups ([e55a220](https://github.com/fr1t2/zond-faucet/commit/e55a220b79d8e5e94acbd57aea9958239ff7ea27))
* **api:** move to api internal calls ([268e6dc](https://github.com/fr1t2/zond-faucet/commit/268e6dc78bbc2afb00c97265c383cf82301145a8))
* **channel limiter:** limit access to bot commands based on list in config ([69f987c](https://github.com/fr1t2/zond-faucet/commit/69f987ccedb149c02f494bc18a8f4887c54b8a08))
* **channel limiter:** limit access to channels listed in config ([24ded13](https://github.com/fr1t2/zond-faucet/commit/24ded13b2317755f01cddb3ead53ab3e745b63ab))
* **swagger:** add swagger api endpoints and server ([88c0b87](https://github.com/fr1t2/zond-faucet/commit/88c0b873b27e858ae180c41a8c7c437033d18855)), closes [#14](https://github.com/fr1t2/zond-faucet/issues/14)


### BREAKING CHANGES

* **api:** moving to the API may break the old function
* **module-alias:** path requires have all changed which if not correct may lead to crashes



## 1.0.1 (2024-03-29)


### Bug Fixes

* **start script:** add new script location ([7254bb1](https://github.com/fr1t2/zond-faucet/commit/7254bb1a210cd374572e5bda4201bdb981443d3e))
* **start script:** add new script location ([db57e93](https://github.com/fr1t2/zond-faucet/commit/db57e934357025cdf5a1df1b8f947b986262048b))


### Code Refactoring

* **module-alias:** add module-alias to simplify path traversal ([9920862](https://github.com/fr1t2/zond-faucet/commit/992086289efd056e571f44feea79a9d19f349f6d)), closes [#13](https://github.com/fr1t2/zond-faucet/issues/13)


### Features

* **api:** add additional api funcitons ([aab5256](https://github.com/fr1t2/zond-faucet/commit/aab525649fe3df2479fb51a5f75c514d5f9160f8))
* **api:** add functions ([dd2f9c1](https://github.com/fr1t2/zond-faucet/commit/dd2f9c1d60fb89938b99258da219ea595925a51a))
* **api:** add functions ([209e949](https://github.com/fr1t2/zond-faucet/commit/209e9493fee4ef2be321b7b0c60d2921497c02e8))
* **api:** add new api function to segragate bot actions ([934d626](https://github.com/fr1t2/zond-faucet/commit/934d6266a42247d0d1149b75810ffd43739510a8))
* **api:** impliment api into block and balance lookups ([e55a220](https://github.com/fr1t2/zond-faucet/commit/e55a220b79d8e5e94acbd57aea9958239ff7ea27))
* **api:** move to api internal calls ([268e6dc](https://github.com/fr1t2/zond-faucet/commit/268e6dc78bbc2afb00c97265c383cf82301145a8))
* **swagger:** add swagger api endpoints and server ([88c0b87](https://github.com/fr1t2/zond-faucet/commit/88c0b873b27e858ae180c41a8c7c437033d18855)), closes [#14](https://github.com/fr1t2/zond-faucet/issues/14)


### BREAKING CHANGES

* **api:** moving to the API may break the old function
* **module-alias:** path requires have all changed which if not correct may lead to crashes



# 1.0.0 (2024-03-29)


### Bug Fixes

* **start script:** add new script location ([7254bb1](https://github.com/fr1t2/zond-faucet/commit/7254bb1a210cd374572e5bda4201bdb981443d3e))
* **start script:** add new script location ([db57e93](https://github.com/fr1t2/zond-faucet/commit/db57e934357025cdf5a1df1b8f947b986262048b))


### Code Refactoring

* **module-alias:** add module-alias to simplify path traversal ([9920862](https://github.com/fr1t2/zond-faucet/commit/992086289efd056e571f44feea79a9d19f349f6d)), closes [#13](https://github.com/fr1t2/zond-faucet/issues/13)


### Features

* **api:** add additional api funcitons ([aab5256](https://github.com/fr1t2/zond-faucet/commit/aab525649fe3df2479fb51a5f75c514d5f9160f8))
* **api:** add functions ([dd2f9c1](https://github.com/fr1t2/zond-faucet/commit/dd2f9c1d60fb89938b99258da219ea595925a51a))
* **api:** add functions ([209e949](https://github.com/fr1t2/zond-faucet/commit/209e9493fee4ef2be321b7b0c60d2921497c02e8))
* **api:** add new api function to segragate bot actions ([934d626](https://github.com/fr1t2/zond-faucet/commit/934d6266a42247d0d1149b75810ffd43739510a8))
* **api:** impliment api into block and balance lookups ([e55a220](https://github.com/fr1t2/zond-faucet/commit/e55a220b79d8e5e94acbd57aea9958239ff7ea27))
* **api:** move to api internal calls ([268e6dc](https://github.com/fr1t2/zond-faucet/commit/268e6dc78bbc2afb00c97265c383cf82301145a8))
* **swagger:** add swagger api endpoints and server ([88c0b87](https://github.com/fr1t2/zond-faucet/commit/88c0b873b27e858ae180c41a8c7c437033d18855)), closes [#14](https://github.com/fr1t2/zond-faucet/issues/14)


### BREAKING CHANGES

* **api:** moving to the API may break the old function
* **module-alias:** path requires have all changed which if not correct may lead to crashes



# 1.0.0 (2024-03-28)
