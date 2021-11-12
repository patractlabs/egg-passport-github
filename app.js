'use strict';

const debug = require('debug')('egg-passport-github');
const assert = require('assert');
const Strategy = require('passport-github').Strategy;

module.exports = app => {
  const config = app.config.passportGithub;
  config.passReqToCallback = true;
  assert(config.key, '[egg-passport-github] config.passportGithub.key required');
  assert(config.secret, '[egg-passport-github] config.passportGithub.secret required');
  config.clientID = config.key;
  config.clientSecret = config.secret;
  config.scope = ['email']

  // 挂载鉴权路由
  app.passport.mount('github');
  // 挂载跳转的中间件
  app.config.coreMiddleware.push('patractlabsAuth');

  // must require `req` params
  app.passport.use('github', new Strategy(config, (req, accessToken, refreshToken, params, profile, done) => {
    // format user
    const user = {
      login: profile.username,
      name: profile.displayName || profile.username,
      workid: profile.id,
      email: (profile.emails && profile.emails[0] && profile.emails[0].value) || '',
    };

    debug('%s %s get user: %j', req.method, req.url, user);

    // let passport do verify and call verify hook
    app.passport.doVerify(req, user, done);
  }));
};
