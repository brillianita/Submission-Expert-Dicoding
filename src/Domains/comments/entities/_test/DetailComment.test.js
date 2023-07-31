const DetailComment = require('../DetailComment');

describe('a DetailComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      content: 'isi comment,',
    };

    // action & assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 111,
      username: {},
      date: true,
      content: [],
    };

    // action & assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment object properly', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: 'thread-123,',
      content: 'isi comment',
    };

    const detailComment = new DetailComment(payload);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
  });
});
