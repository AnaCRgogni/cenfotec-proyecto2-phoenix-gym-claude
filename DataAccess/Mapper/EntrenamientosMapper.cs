using DataAccess.Dao;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Mapper
{
    public class EntrenamientosMapper : IObjectMapper
    {
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            return new ResultadoEntrenamiento()
            {
                Id = int.Parse(objectRow["IDEntrenamiento"].ToString()),
                Nombre = objectRow["Nombre"].ToString(),
                Fecha = Convert.ToDateTime(objectRow["Fecha"])
            };
        }

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            var lstResult = new List<BaseClass>();

            foreach (var objRow in objectRows)
            {
                var entrenamiento = BuildObject(objRow);
                lstResult.Add(entrenamiento);
            }
            return lstResult;
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addEntrenamiento";

            Entrenamiento entrenamiento= (Entrenamiento)entityDTO;

            operation.AddVarcharParam("Nombre", entrenamiento.Name);
            operation.AddVarcharParam("IDCliente", entrenamiento.IdCliente);
            operation.AddOutputParam("@ReturnValue"); //Esta linea recibe la respuesta del SQL en este caso el ID de rutina para crear los sets
            Console.WriteLine(operation);
            return operation;
        }
        public SqlOperation GetEntrenamientosByClientId(string cedula)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getEntrenamientosByCliente"
            };

            operation.AddVarcharParam("IDCliente", cedula);

            return operation;
        }
        public SqlOperation GetDeleteStatement(int id)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_DeleteEntrenamientoById"
            };

            operation.AddIntegerParam("idEntrenamiento", id);

            return operation;
        }

        public SqlOperation GetRetrieveByIdStatement(int id)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_GetEntrenamientoById"
            };

            operation.AddIntegerParam("idEntrenamiento", id);

            return operation;
        }
    }
}
