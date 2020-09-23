import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@tcosmintickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
