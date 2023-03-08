import { Subjects, Publisher, PaymentCreatedEvent } from "@konark/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    
}