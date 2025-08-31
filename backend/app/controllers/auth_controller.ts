import crypto from 'crypto';
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user';
import mail from '@adonisjs/mail/services/main'
//import hash from '@adonisjs/core/services/hash'


export default class AuthController {
  // Signup a new user
  public async signup({ request, response }: HttpContext) {
    const data = request.only(['email', 'password', 'name']); // Adjust fields as needed
   const user = await User.create({
  email: data.email,
  password: data.password, // you must hash it here
}); // Create a new user
   // console.log('User signup passwd:', user.password);
    return response.created({ message: 'User created successfully', user });
  }

  public async login({ request,response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)
      if (user) {
        console.log(user);
     //  await auth.use('web').login(user) // if you're using sessions or tokens
       
        return response.ok({
          message: 'Login successful',
        
          //token,
        });
      } else {
        return response.unauthorized({ message: 'Invalid email or password' })
      }
    } catch (error) {
      return response.unauthorized({ message: 'Valid email/passwd combination but auth failed'})
    }
  }


  // Logout the authenticated user
  public async logout({ auth, response }: HttpContext) {
    try {
      await auth.use('web').logout(); // Revoke the session
      return response.ok({ message: 'Logout successful' });
    } catch (error) {
      return response.internalServerError({ message: 'Logout failed' });
    }
  }

  // Request a password reset
  public async requestPasswordReset({ request, response }: HttpContext) {
    const { email } = request.only(['email']);
    const user = await User.findByOrFail('email', email);

    // Generate a reset token using crypto
    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token; // Save the token (ensure you have a column for this)
    await user.save();
    console.log(user);
    // Send the token via email
    await mail.send((message) => {
      message
        .to(user.email)
        .from('jayc13231999@gmail.com') // Replace with your app's email
        .subject('Password Reset Request')
        .htmlView('reset_password', { token }); // Ensure you have this view
    });

    return response.ok({ message: 'Password reset token sent to email' });
  }

  // Reset the password
  public async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.only(['token', 'password']);
    const user = await User.findByOrFail('resetToken', token); // Find user by token
    user.password = password; // Update the password
    user.resetToken = null; // Clear the reset token
    await user.save();

    return response.ok({ message: 'Password reset successful' });
  }
}