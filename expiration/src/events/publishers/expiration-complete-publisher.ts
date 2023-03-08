import { Subjects, Publisher, ExpirationCompleteEvent } from "@konark/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    
}