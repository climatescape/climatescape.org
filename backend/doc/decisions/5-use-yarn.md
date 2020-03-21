Decided to use yarn package manager instead of npm because of the [issue](https://github.com/yarnpkg/yarn/issues/5962)
with node-gyp package installation: with node 12.15.0 and Mac OS X, which I was able to resolve only in yarn by running
```
 $ yarn global add node-gyp
 $ yarn global remove node-gyp
```

As described [here](https://github.com/yarnpkg/yarn/issues/5962#issuecomment-435576447).

See [extra context and discussion](https://github.com/climatescape/climatescape.org/pull/87#discussion_r383366463) about
the issue and the choice of yarn over npm.

Using Yarn 1.x because there are yet some problems with using Yarn 2 in Heroku.