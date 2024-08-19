using DataAccess.Dao;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Mapper
{
    public class PasswordsMapper : ICrudStatements, IObjectMapper
    {
        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            var lstResult = new List<BaseClass>();

            foreach (var objRow in objectRows)
            {
                var article = BuildObject(objRow);
                lstResult.Add(article);
            }
            return lstResult;
        }

        //No agregamos los atributos que marcamos como nullable en el DTO

        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            objectRow.TryGetValue("cedula", out var cedulaValue);
            objectRow.TryGetValue("passwordHash", out var passwordHashValue);
            objectRow.TryGetValue("salt", out var saltValue);
            objectRow.TryGetValue("fechaCambio", out var fechaCambioValue);

            return new Passwords()
            {
                Cedula = cedulaValue?.ToString() ?? string.Empty,
                PasswordHash = passwordHashValue as byte[],
                Salt = saltValue as byte[],
                FechaCambio = fechaCambioValue != null ? Convert.ToDateTime(fechaCambioValue) : DateTime.MinValue
            };
        }


        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addSalt";

            SaltData salt = (SaltData)entityDTO;
            operation.AddVarcharParam("salt", salt.SaltValue);
            operation.AddVarcharParam("cedulaUsuario", salt.Cedula);

            return operation;

        }

        public SqlOperation GetRetrieveByEmailStatement(string email)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_getLogInData"
            };

            operation.AddVarcharParam("emailUsuario", email);
            return operation;
        }

        public SqlOperation GetDeleteStatement(int id)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveAllStatement()
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveByIdStatement(int Id)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetUpdateStatement(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveByPhraseStatement(string searchType, string searchPhrase)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetUpdatePasswordStatement(BaseClass entityDTO, string saltValue)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_updatePassword";
            Cliente user = (Cliente)entityDTO;
            operation.AddVarcharParam("cedula", user.Cedula);
            operation.AddVarcharParam("email", user.Email);
            operation.AddVarcharParam("contrasena", user.Contrasena);
            operation.AddVarcharParam("newSalt", saltValue);
            return operation;
        }

        public SqlOperation GetRetrieveLastFivePasswordsStatement(string cedula)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_getLastFivePasswords"
            };
            operation.AddVarcharParam("cedula", cedula);
            return operation;
        }

        public SqlOperation GetDeleteOldestPasswordStatement(string cedula)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_deleteOldestPassword"
            };
            operation.AddVarcharParam("cedula", cedula);
            return operation;
        }


        public SqlOperation GetSaveNewPasswordStatement(string cedula, byte[] hashedPassword, byte[] salt, DateTime fechaCambio)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_saveNewPassword"
            };
            operation.AddVarcharParam("cedula", cedula);
            operation.AddBinaryParam("passwordHash", hashedPassword);
            operation.AddBinaryParam("salt", salt);
            operation.AddDateTimeParam("fechaCambio", fechaCambio);
            return operation;
        }

    }
}

