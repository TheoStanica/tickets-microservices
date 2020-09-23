import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@tcosmintickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
