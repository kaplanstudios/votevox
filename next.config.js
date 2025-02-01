// next.config.js
import fetch, { Request } from 'node-fetch';

global.Request = Request;

export default {
  reactStrictMode: true,
};