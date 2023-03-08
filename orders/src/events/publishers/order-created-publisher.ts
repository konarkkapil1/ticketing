import { Publisher, OrderCreatedEvent, Subjects } from "@konark/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}