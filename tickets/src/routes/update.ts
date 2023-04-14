import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@awu_tickets/common';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price is need to be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    // check if the person is the same person who bought the ticket
    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    // update the tickets
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    // update to the db
    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
