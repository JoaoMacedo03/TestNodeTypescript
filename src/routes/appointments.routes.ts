import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsController.all();
  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const findAppointmentsInSameDate = appointmentsController.findByDate(
    parsedDate,
  );

  if (findAppointmentsInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  const appointment = appointmentsController.create({
    provider,
    date,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
