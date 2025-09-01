import type { HttpContext } from '@adonisjs/core/http'
import Document from '#models/Document';
import User from '#models/user';
import drive from '@adonisjs/drive/services/main'
import app from '@adonisjs/core/services/app'

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
    await file.moveToDisk(fileName);

    const document = await Document.create({
      userId: user.id, // Associate the document with the logged-in user
      url: fileName,
    });

    return response.created(document);
  }

  // Retrieve/download a document
  public async retrieve({ params, auth, response }: HttpContext) {
    const user = await auth.authenticate() as User;
    let document;
    console.error('Fetching document for user: ', user.id,' docid ', params.id);
    try {
        document = await Document.query()
                  .where('id', params.id)
                  .andWhere('user_id', user.id)
                  .firstOrFail();

                console.error('Found document in DB:', document.toJSON());
        } catch (error) {
          console.error('DB query failed:', error);
          return response.notFound({ message: 'Document not found in Model' });
        }

     const filePath = app.makePath('storage',`${document.url}`);
     console.error('Path requested is ',filePath)
              try {
                console.log('Attempting to download file at:', filePath);
                await response.download(filePath);
              } catch (error) {
                console.error(' File download failed:', error);
                response.status(error.code === 'ENOENT' ? 404 : 500);
                response.send('Cannot get file from storage');
              }
    }

  // Delete a document
  public async delete({ params, auth, response }: HttpContext) {
    const user = await auth.authenticate() as User;
    let document;
    try{document = await Document.query()
      .where('id', params.id)
      .andWhere('user_id', user.id) // Ensure the document belongs to the logged-in user
      .firstOrFail();
    
    console.error('Doc to delete ',document.url)}
    catch(error){
       console.error('Doc not found',params.id) 
       return response.notFound({ message: 'Document not found in Model' });
    }
    // Delete the file from the drive
    try{
    await drive.use('fs').delete(`${document.url}`);
    }
    catch(e){
      console.error('cannot delete from storage')
      response.notFound('cannot delete file from storage')
    }
    // Delete the document record from the database
    await document.delete();

    return response.ok({ message: 'Document deleted successfully' });
  }

  // Show all documents uploaded by a user
  public async showAll({ auth, response }: HttpContext) {
    const user = await auth.authenticate() as User; // Ensure the user is authenticated
    console.log('Fetching documents for user:', user.id);
    const documents = await Document.query()
      .where('user_id', user.id) // Fetch documents belonging to the authenticated user
      .orderBy('created_at', 'desc'); // Order by creation date (most recent first)
    
    const dNames = documents.filter( (doc) => doc.url)
    return response.ok(dNames);
  }
}