const DetailThread = require('../DetailThread');

describe('an GetDetailThread entity', () => {
  it('should throw error if detail thread did not contain needed property', () => {
    // arrange
    const detailThread = {
      id: 'thread-123',
      title: 'sebuah thread',
    };

    // action and assert
    expect(() => new DetailThread(detailThread)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when detail thread did not meet data type specification', () => {
    // arrange
    const detailThread = {
      id: true,
      title: [],
      body: {},
      date: [],
      username: {},
      comments: 122,
    };
    expect(() => new DetailThread(detailThread)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread object correctly', () => {
    // arrange
    const detailThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'John Doe',
      comments: [],
    };
    // Action
    const getDetailThread = new DetailThread(detailThread);

    // Assert
    expect(getDetailThread.id).toEqual(detailThread.id);
    expect(getDetailThread.title).toEqual(detailThread.title);
    expect(getDetailThread.body).toEqual(detailThread.body);
    expect(getDetailThread.date).toEqual(detailThread.date);
    expect(getDetailThread.username).toEqual(detailThread.username);
    expect(getDetailThread.comments).toEqual(detailThread.comments);
  });
});
