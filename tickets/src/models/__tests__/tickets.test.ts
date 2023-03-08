import { Ticket } from "../ticket";

it('implements optimistic concurrecy control', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstace = await Ticket.findById(ticket.id);

    firstInstance?.set({price: 10});
    secondInstace?.set({price: 15});
    
    await firstInstance!.save();

    try {
        await secondInstace!.save();
    } catch (err) {
        return;
    }

    throw new Error('should not reach this point');
})

it('increment the version on every save', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: '123'
    })

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})