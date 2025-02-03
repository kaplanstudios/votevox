import fetch, { Request } from 'node-fetch';

global.Request = Request;

export default {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: '/api/ranks/:id',
        destination: '/api/ranks/[id]',
      },
    ];
  },
};