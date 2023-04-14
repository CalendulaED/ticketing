import { Message } from 'node-nats-streaming';
import { Listener } from '../../../common/src/events/base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    // business logic here
    console.log('Event data!', data);

    console.log(data.id);

    // if failed during process, let it time out

    // mark as successful
    msg.ack();
  }
}
