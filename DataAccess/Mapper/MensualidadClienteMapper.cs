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
    public class MensualidadClienteMapper : ICrudStatements, IObjectMapper
    {
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            var mensualidadCliente = new MensualidadCliente()
            {
                Id = int.Parse(objectRow["id"].ToString()),
                Cedula = objectRow["cedula"].ToString(),
                Nombre = objectRow["nombre"].ToString(),
                Email = objectRow["email"].ToString(),
                Mensualidad = float.Parse(objectRow["mensualidad"].ToString()),
                Estado = string.IsNullOrEmpty(objectRow["estado"].ToString()) ? false : Boolean.Parse(objectRow["estado"].ToString())
            };
            return mensualidadCliente;
        }

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            var lstResult = new List<BaseClass>();

            foreach (var objRow in objectRows)
            {
                var mensualidadCliente = BuildObject(objRow);
                lstResult.Add(mensualidadCliente);
            }
            return lstResult;
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_getReporteMensualidad2";

            MensualidadCliente mensualidadCliente = (MensualidadCliente)entityDTO;
            operation.AddVarcharParam("name", mensualidadCliente.Nombre);
            operation.AddVarcharParam("email", mensualidadCliente.Email);
            operation.AddFloatParam("mensualidad", mensualidadCliente.Mensualidad);

            return operation;

        }

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveAllStatement() // este es el query que solo llama los datos 
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getReporteMensualidad2"
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
