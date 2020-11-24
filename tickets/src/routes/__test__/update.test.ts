import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist ', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'sdgsdg',
      price: 20,
      latitude: 12,
      longitude: 13,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated ', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sdgsdg',
      price: 20,
      latitude: 12,
      longitude: 13,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket ', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sdgsdgs',
      price: 20,
      latitude: 12,
      longitude: 13,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'dgsdhsdhsdhdf',
      price: 45,
      latitude: 12,
      longitude: 13,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price ', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'sdgsdgs',
      price: 20,
      latitude: 12,
      longitude: 13,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
      latitude: 12,
      longitude: 13,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'sdgdsgsd',
      price: -19,
      latitude: 12,
      longitude: 13,
    })
    .expect(400);
});

it('updates the tocket provided with valid inputs ', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'sdgsdgs',
      price: 20,
      latitude: 12,
      longitude: 13,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 19,
      latitude: 12,
      longitude: 13,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(19);
});

it('publishes and event', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'sdgsdgs',
      price: 20,
      latitude: 12,
      longitude: 13,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 19,
      latitude: 12,
      longitude: 13,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'sdgsdgs',
      price: 20,
      latitude: 12,
      longitude: 13,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 19,
      latitude: 12,
      longitude: 13,
    })
    .expect(400);
});
