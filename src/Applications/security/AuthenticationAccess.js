class AuthenticationAccess {
  async verifyToken(id) {
    throw new Error('TOKEN_ACCESS.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthenticationAccess;
