const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const LoginTestHelper = require('../../../../tests/LoginTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 401 when request missing authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'isi thread',
      };
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      console.log('response message', response);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'lorem ipsum',
      };
      const server = await createServer(container);

      const { accessToken } = await LoginTestHelper.getToken({ server });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    // it('should response 400 when request payload not meet data type specification', async () => {
    //   // Arrange
    //   const requestPayload = {
    //     title: 'lorem ipsum',
    //     body: true,
    //   };
    //   const server = await createServer(container);

    //   const { accessToken } = await LoginTestHelper.getToken({ server });

    //   // Action
    //   const response = await server.inject({
    //     method: 'POST',
    //     url: '/threads',
    //     payload: requestPayload,
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   });

    //   // Assert
    //   const responseJson = JSON.parse(response.payload);
    //   expect(response.statusCode).toEqual(400);
    //   expect(responseJson.status).toEqual('fail');
    //   expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    // });

    // it('should response 201 and persisted thread', async () => {
    //   // Arrange
    //   const requestPayload = {
    //     title: 'lorem ipsum',
    //     body: 'dolor sit amet',
    //   };
    //   const server = await createServer(container);

    //   const { accessToken } = await LoginTestHelper.getToken({ server });

    //   // Action
    //   const response = await server.inject({
    //     method: 'POST',
    //     url: '/threads',
    //     payload: requestPayload,
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   });

    //   // Assert
    //   const responseJson = JSON.parse(response.payload);
    //   expect(response.statusCode).toEqual(201);
    //   expect(responseJson.status).toEqual('success');
    //   expect(responseJson.data.addedThread).toBeDefined();
    // });
  });
});
