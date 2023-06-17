const AddThread = require('../../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AuthenticationAccess = require('../../../security/AuthenticationAccess');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'isi thread',
    };
    const headerAuthorization = 'Bearer token';

    const mockAddedThread = new AddedThread({
      id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      title: 'sebuah thread',
      owner: 'user-123',
    });

    // Creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockAuthencticationAccess = new AuthenticationAccess();

    // Mocking needed function
    mockThreadRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    // Creating use case instance
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
    
    }))
  });
});
