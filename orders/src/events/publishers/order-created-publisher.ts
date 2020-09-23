import { Publisher, OrderCreatedEvent, Subjects } from '@tcosmintickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
