using DataAccess.Crud;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class LogInManager
    {

        public int AuthenticateUser(string email, string password)
        {
            PasswordCrudFactory passCrud = new PasswordCrudFactory();
            LoggedUser user = (LoggedUser)passCrud.RetrieveByEmail(email);
            int result;

            if (user == null) // verifica si el correo existe en db
            {
                result = -1;
            }
            else
            {
                string stringPassword = user.Contrasena;
                byte[] bytePassword = Convert.FromBase64String(stringPassword);

                //// Necesitamos mandar a traer la salt de este usuario
                string base64StringSalt = user.SaltValue;
                byte[] salt = Convert.FromBase64String(base64StringSalt);

                PasswordService passService = new PasswordService();

                bool isAuthenticated = passService.VerifyPassword(password, bytePassword, salt); //verifica si la contra es correcta

                if (isAuthenticated) //si contra es correcta
                {

                    result = 0;
                    
                }
                else
                {
                    result = -2;
                }
            }

            return result;
        }

    }
}
