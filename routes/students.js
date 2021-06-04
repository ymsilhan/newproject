import express from 'express'
import auth from '../middleware/auth.js'
import * as StudentsController from '../controllers/students.js'
import ROLES from '../utils/roles.js'

const router = express.Router()

router.get('/', auth(ROLES.ADMIN, ROLES.DEAN), StudentsController.getStudents)
router.get(
	'/:id/installments',
	auth(ROLES.ADMIN),
	StudentsController.getInstallments
)
router.post('/', auth(ROLES.STUDENT), StudentsController.createStudent)
router.delete('/:id', auth(ROLES.ADMIN), StudentsController.deleteStudent)
router.put('/:id', auth(ROLES.ADMIN), StudentsController.updateStudent)
router.get(
	'/pdf/:userId',
	auth(ROLES.ADMIN, ROLES.STUDENT),
	StudentsController.createPDF
)

export default router
