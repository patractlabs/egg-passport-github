'use strict';

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.isAuthenticated() || ctx.path.startsWith('/passport/github')) {
      await next();
    } else {
      // 如果没有用户，则跳转获取授权
      ctx.session.returnTo = ctx.path;
      ctx.redirect('/passport/github');
    }
  };
};
