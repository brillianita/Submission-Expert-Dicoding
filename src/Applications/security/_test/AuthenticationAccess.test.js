const AuthenticationAccess = require('../AuthenticationAccess');

describe('AuthenticationAccess interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const authAccess = new AuthenticationAccess();

    // Action & Assert
    await expect(authAccess.verifyAccess('user-321')).rejects.toThrowError('TOKEN_ACCESS.METHOD_NOT_IMPLEMENTED');
  });
});
