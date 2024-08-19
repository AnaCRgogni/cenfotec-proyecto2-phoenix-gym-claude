using DataAccess.Dao;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Mapper
{
    public class ViewUsersMapper : ICrudStatements, IObjectMapper
    {
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            var medicionCliente = new MedicionCliente()
            {
                Id = int.Parse(objectRow["ID"].ToString()),
                Nombre = objectRow["nombre"].ToString(),
                Cedula = objectRow["cedula"].ToString(),
                Email = objectRow["email"].ToString(),
                RolUsuario = objectRow["rolUsuario"].ToString()
            };
            return medicionCliente;
        }

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            var lstResult = new List<BaseClass>();

            foreach (var objRow in objectRows)
            {
                var medicionCliente = BuildObject(objRow);
                lstResult.Add(medicionCliente);
            }
            return lstResult;
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            throw new NotImplementedException();

        }

        internal SqlOperation GetRetrieveAllStatement() // este es el query que solo llama a los clientes 
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getEmailUsuarios"
            };

            return operation;
        }
        internal SqlOperation GetRetrieveAllUsersStatement() // este es el query que solo llama a los clientes 
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getEmailUsuarios2"
            };

            return operation;
        }
        SqlOperation ICrudStatements.GetRetrieveAllStatement()
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getEmailUsuarios"
            };

            return operation;
        }

        SqlOperation ICrudStatements.GetRetrieveByIdStatement(int Id)
        {
            throw new NotImplementedException();
        }

        SqlOperation ICrudStatements.GetUpdateStatement(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetDeleteStatement(int id)
        {
            throw new NotImplementedException();
        }
    }
}
