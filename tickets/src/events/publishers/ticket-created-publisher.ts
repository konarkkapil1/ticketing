import { Publisher, Subjects, TicketCreatedEvent } from '@konark/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;   
}