using DataAccess.Crud;
using DTO;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class PasswordService
    {

        // Se  recibe la contraña
        // Se genera una sal (un texto aleatorio) 
        // Se encrypta la contraseña junto con la sal. 
        // Guardar por aparte la sal y la encryptación.

        // Cuando el usuario inicia sesión me da la contraseña.
        // Busco la sal del usuario.
        // Encrypto la sal con la contraseña.
        // Comparo la nueva encryptación con la encryptación guardada. 
        // Si son iguales, la contraseña era correcta. 
        public byte[] GenerateSalt()
        {
            byte[] salt = new byte[16]; // 16 bytes = 128 bits
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(salt);
            }
            return salt;
        }

        // Hash password with salt using PBKDF2
        public byte[] HashPassword(string password, byte[] salt)
        {
            int iterations = 10000; // Number of iterations
            int hashByteSize = 32; // 256 bits
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations))
            {
                return pbkdf2.GetBytes(hashByteSize);
            }
        }

        // Verify if entered password matches stored hashed password
        public bool VerifyPassword(string enteredPassword, byte[] storedHash, byte[] storedSalt)
        {
            byte[] enteredHash;
            using (var pbkdf2 = new Rfc2898DeriveBytes(enteredPassword, storedSalt, 10000))
            {
                enteredHash = pbkdf2.GetBytes(32);
            }

            // Compare storedHash with enteredHash
            return StructuralComparisons.StructuralEqualityComparer.Equals(enteredHash, storedHash);
        }

        public List<byte[]> GenerateHashedPassword(string password) //recibo contra
        {
            byte[] salt = GenerateSalt(); //genero sal
            byte[] hashedPassword = HashPassword(password, salt); //encripto la contra con la sal generada arriba

            List<byte[]> response = new List<byte[]>
            {
                salt,
                hashedPassword
            };
            return response;
        }

        public void SaveSalt(SaltData saltData)
        {
            PasswordCrudFactory passCrud = new PasswordCrudFactory();
            passCrud.Create(saltData);
        }

        public SaltData GetLogInData(string email)
        {
            PasswordCrudFactory passCrud = new PasswordCrudFactory();
            return (SaltData)passCrud.RetrieveByEmail(email);

        }

        public SessionUser GetLoggedUser(string email)
        {
            PasswordCrudFactory passCrud = new PasswordCrudFactory();
            LoggedUser result = (LoggedUser)passCrud.RetrieveByEmail(email);
            SessionUser user = new SessionUser
            {
                Email = result.Email,
                RolUsuario = result.RolUsuario,
                Cedula = result.Cedula,
                Estado = result.Estado
            };
            return user;

        }

        public bool VerifyLast5Passwords(Cliente cliente, string saltValue, string passwordString)
        {
            PasswordCrudFactory passCrud = new PasswordCrudFactory();
            List<Passwords> previousPasswords = passCrud.RetrieveLastFivePasswords(cliente.Cedula);
            byte[] newSalt = Convert.FromBase64String(saltValue);
            byte[] newHashedPassword = Convert.FromBase64String(cliente.Contrasena);

            if (previousPasswords.Count == 0)
            {
                DateTime currentDate1 = DateTime.Now;
                passCrud.SaveNewPassword(cliente.Cedula, newHashedPassword, newSalt, currentDate1);
                return true;
            }

            foreach (var passwordRecord in previousPasswords)
            {
                if (VerifyPassword(passwordString, passwordRecord.PasswordHash, passwordRecord.Salt))
                {
                    return false;
                }
            }

            DateTime currentDate = DateTime.Now;
            passCrud.SaveNewPassword(cliente.Cedula, newHashedPassword, newSalt, currentDate);
            return true;
        }


        public void UpdatePassword(Cliente cliente, string saltValue)
        {
            PasswordCrudFactory passCrud = new PasswordCrudFactory();

            passCrud.DeleteOldestPassword(cliente.Cedula);
            passCrud.UpdatePassword(cliente, saltValue);
        }
    }
}

