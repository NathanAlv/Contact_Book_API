import { Router } from 'express'
import { ContactController } from '../controllers/ContactController'

export const contactsRouter = Router()
const contactCtrl = new ContactController()

contactsRouter.post('/', (req, res) => contactCtrl.save(req, res))
contactsRouter.get('/name/:name', (req, res) =>
  contactCtrl.findByName(req, res)
)
contactsRouter.get('/birthday', (req, res) =>
  contactCtrl.findByBirthdayPeriod(req, res)
)
contactsRouter.get('/email/:email', (req, res) => 
  contactCtrl.findByEmail(req, res)
)

