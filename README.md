# Queue service

This is an NodeJS API whose features include **publish** and **consume** messages from a in-memory queue.

##### Note: this has no real world application. Please use something like AWS SQS instead!

## Development

Install NodeJS with [nvm](https://github.com/nvm-sh/nvm):

```
nvm install
nvm use
```

Install all dependencies:

```
npm install
```

Start the API server:

```
npm run start
```

Run tests:

```
npm run test
```

## API Documentation & API usage

API docs are available at http://localhost:9898/api/v1/swagger

You don't need curl or Postman, just use the swagger interface in the URL above.

You can choose another port by changing the `PORT` env var or creating a `.env` file with `PORT=myport` before starting the application.

______________________________________________

## What could be improved?

- **The consumer should be a worker** instead of an endpoint. This allows the app to be continuously polling the queue for new messages. If using AWS SQS/SNS, there are some available libs for doing that, such as https://github.com/bbc/sqs-consumer. You can even define triggers by using a serverless architecture, such as publishing an AWS Lambda that will listen to any SNS published and process the message content.

- The worker mentioned above should be horizontally scalable. In production with high throughput we need to increase the number of consumers whenever is needed.

- **Save the message in a database**. In a realistic situation, the messages should never be wiped when the application goes down or even when the session ends. By saving it to a database, you can have multiple different applications producing and consuming from the same queue, which is common in a real microservice environment.

- **Implement a DLQ**. Instead of pushing the failed message back to the main queue, we should have a separate Dead Letter Queue. This is crucial to isolate and debug any possible problems that made a message fail. Sometimes those messages will never be successfully processed either because they are badly formatted or because the application has a problem that will prevent it to be consumed as expected. After debugging or fixing the app, you can make the application consume from the DLQ if you think those messages are reprocessable.

- Kafka should be a better choice than SQS in a environment with huge throughput or with dozens of applications interested in consuming the same message. With SQS, each application would need to have their own queues to consume from, because the messages are deleted once processed, and the producer would need to publish to every one of those queues. Kafka is a event streaming platform that offers a much bigger retention period, distribution and replication. It's also scalable and clusterable but this means you need to serve it's own infrastructure while SQS/SNS is way more plug-and-play.

- **Tests**. An API application should ideally have many unit tests to ensure each class does what is expected and integration tests to ensure that everything works when put together. I would choose [Jest](https://github.com/facebook/jest) with support of [supertest](https://github.com/visionmedia/supertest) for high-level abstraction of the endpoint tests.
