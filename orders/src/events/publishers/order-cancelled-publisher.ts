import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from '@tcosmintickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
