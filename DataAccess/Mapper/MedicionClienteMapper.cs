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
    public class MedicionClienteMapper : ICrudStatements, IObjectMapper
    {
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            var medicionCliente = new MedicionCliente()
            {
                Id = int.Parse(objectRow["ID"].ToString()),
                Cedula = objectRow["cedula"].ToString(),
                Nombre = objectRow["nombre"].ToString(),
                Email = objectRow["email"].ToString(),
                idMembresia = (int)objectRow["idMembresia"],
                RolUsuario = objectRow["rolUsuario"].ToString(),
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

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveAllStatement() // este es el query que solo llama los datos 
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getEmailClientes"
            };

            return operation;
        }

        public SqlOperation GetDeleteStatement(int id)
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

        public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }
    }
}
