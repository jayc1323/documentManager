/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import DocumentsController from '#controllers/documents_controller'

const authController = new AuthController()
const documentsController = new DocumentsController()


router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', authController.logout);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

router.post('/documents', documentsController.upload);
router.get('/dashboard', documentsController.showAll);
router.get('/retrieve', documentsController.retrieve);
