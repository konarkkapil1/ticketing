import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@konark/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123'
    });
    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: '123',
        expiresAt: '123',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, msg, ticket, listener };
}

it('sets the userId of the ticket', async () => {
    const {data, msg, ticket, listener} = await setup();
    await listener.onMessage(data, msg);
    
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
})

it('acks the message', async () => {
    const {data, msg, ticket, listener} = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const {data, msg, ticket, listener} = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId);
});