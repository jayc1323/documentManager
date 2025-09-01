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
import { middleware } from '#start/kernel'
const authController = new AuthController()
const documentsController = new DocumentsController()


router.get('/', async () => {
  return {
    hello: 'world',
  }
})


router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

router
  .post('/documents', documentsController.upload)
  .use(middleware.auth({ guards: ['basicAuth'] }));

router
  .get('/dashboard', documentsController.showAll)
  .use(middleware.auth({ guards: ['basicAuth'] }));

router
  .get('/retrieve/:id', documentsController.retrieve)
  .use(middleware.auth({ guards: ['basicAuth'] }));


router
  .delete('/delete/:id', documentsController.delete)
  .use(middleware.auth({ guards: ['basicAuth'] }));
