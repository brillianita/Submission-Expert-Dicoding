class AddThread {
  constructor({ title, body }) {
    if (!title || !body) {
      throw new Error('ADD_THREAD.NOT_CONTAIN NEEDED_PROPERTY');
    }
    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    this.title = title;
    this.body = body;
  }
}

module.exports = AddThread;
