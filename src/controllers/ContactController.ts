import { Request, Response } from 'express'
import { validateContactInputs, ContactModel } from '../domains/ContactModel'
import { ContactDAO } from '../dao/ContactDAO'
import { validate as validateEmail } from 'email-validator';


export class ContactController {
  private _contactDAO: ContactDAO

  constructor() {
    this._contactDAO = new ContactDAO()
  }

  async save(req: Request, res: Response) {
    const errorMessages = validateContactInputs(req.body)

    if (errorMessages.length == 0) {
      const { name, email, phone, birthday } = req.body

      const contact = new ContactModel({
        name,
        email,
        phone,
        birthday: new Date(birthday),
      })

      const savedContact = await this._contactDAO.save(contact)
      return res.status(201).json({ contact: savedContact })
    }

    return res.status(400).json({ errorMessages })
  }

  async findByName(req: Request, res: Response) {
    const { name } = req.params

    const contacts = await this._contactDAO.findByName(name)

    return res.status(200).json({ contacts })
  }

  async findByBirthdayPeriod(req: Request, res: Response) {
    const { start, end } = req.query
    const dateComp = new RegExp(/^\d{4}\-\d{2}\-\d{2}$/);
    const errorMessages: string[] = []


    if(!dateComp.test(`${start}`) || !dateComp.test(`${end}`)) {
      errorMessages.push('Invalid date format')
    return res.status(400).json({ errorMessages })
    }

    const startDate = new Date(`${start}`)
    const endDate = new Date(`${end}`)

    if (startDate <= endDate) {
      const contacts = await this._contactDAO.findByBirthdayPeriod(
        startDate,
        endDate
      )

      return res.status(200).json({ contacts })
    }

    errorMessages.push('Start date cannot be greater than end date')
    return res.status(400).json({ errorMessages })
  }

  
  async findByEmail(req: Request, res: Response) {
    const { email } = req.params;
    const errorMessages: string[] = [];
    let message: boolean = false;

    if (!email) {
      errorMessages.push('Email not provided');
      message = true;
    }

    if (!validateEmail(email)) {
      errorMessages.push('Invalid email');
      message = true;
    }
    if (message) {
      return res.status(400).json({ errorMessages });
    } else {
      const contact = await this._contactDAO.findByEmail(email);
      return res.json({ contact });
    }


}
}