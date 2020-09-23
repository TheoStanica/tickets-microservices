import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@tcosmintickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
