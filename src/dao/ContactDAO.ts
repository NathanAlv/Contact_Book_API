import { FilterQuery } from 'mongoose'
import { Contact, ContactModel } from '../domains/ContactModel'

export class ContactDAO {
  async save(contact: Contact) {
    const savedContact = await ContactModel.create(contact)
    return savedContact
  }

  async findByName(name: string) {
    const contacts = await ContactModel.find<Contact>({
      name: {
        $regex: name,
        $options: 'i',
      },
    })

    return contacts
  }

  async findByBirthdayPeriod(start: Date, end: Date) {
    const contacts = await ContactModel.find<Contact>({
      birthday: {
        $gte: start,
        $lte: end,
      },
    })

    return contacts
  }
  async findByEmail(email: string) {
      const options: FilterQuery<Contact> = { email }
      const contact = await ContactModel.findOne(options)
      return contact
  }
     
        


  
}
