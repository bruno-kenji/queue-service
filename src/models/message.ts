import { v4 as uuidv4 } from 'uuid';

export default class Message {
  id: String;
  body: String;
  timestamp: number;

  constructor(body) {
    this.id = uuidv4();
    this.body = body;
    this.timestamp = Date.now();
  }
};
