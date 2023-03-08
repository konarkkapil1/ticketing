import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderStatus, ExpirationCompleteEvent } from '@konark/common';
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        price: 10
    })
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asvabaef',
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    }

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return {listener, order, ticket, data, message};
}

it('updates the order status to cancelled', async () => {
    const { listener, order, ticket, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emits and order cancelled event', async () => {
    const { listener, order, ticket, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
})

it('acks the messgae', async () => {
    const { listener, order, ticket, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
})
