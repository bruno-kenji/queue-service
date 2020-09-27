interface MessageDTO {
  message: string;
};

interface MessagesDTO extends Array<MessageDTO>{};

export default MessagesDTO;
