import type { HttpContext } from '@adonisjs/core/http'
import Document from '#models/Document';
import User from '#models/user';
import drive from '@adonisjs/drive/services/main'

export default class DocumentsController {

  // Upload a document
  public async upload({ request, auth, response }: HttpContext) {
    const user = await auth.authenticate() as User; //  
    const file = request.file('document',{
      size: '5mb',
      extnames: ['pdf', 'doc', 'docx', 'jpg', 'png']
    });
    if (!file) {
      return response.badRequest({ message: 'No file uploaded' });
    }

    const fileName = `${new Date().getTime()}_${file.clientName}`;
    await file.moveToDisk('./uploads', { name: fileName });

    const document = await Document.create({
      userId: user.id, // Associate the document with the logged-in user
      url: fileName,
    });

    return response.created(document);
  }

  // Retrieve/download a document
  public async retrieve({ params, auth, response }: HttpContext) {
    const user = await auth.authenticate() as User;
    const document = await Document.query()
      .where('id', params.id)
      .andWhere('user_id', user.id) // Ensure the document belongs to the logged-in user
      .firstOrFail();

    const filePath = `./uploads/${document.url}`;
    return response.download(filePath);
  }

  // Delete a document
  public async delete({ params, auth, response }: HttpContext) {
    const user = await auth.authenticate() as User;
    const document = await Document.query()
      .where('id', params.id)
      .andWhere('user_id', user.id) // Ensure the document belongs to the logged-in user
      .firstOrFail();

    // Delete the file from the drive

    await drive.use('fs').delete(`./uploads/${document.url}`);

    // Delete the document record from the database
    await document.delete();

    return response.ok({ message: 'Document deleted successfully' });
  }

  // Show all documents uploaded by a user
  public async showAll({  response }: HttpContext) {
   // const user = await auth.authenticate() as User; // Ensure the user is authenticated
    console.log('Fetching documents for user:', 2);
    const documents = await Document.query()
      .where('user_id', 2) // Fetch documents belonging to the authenticated user
      .orderBy('created_at', 'desc'); // Order by creation date (most recent first)

    return response.ok(documents);
  }
}