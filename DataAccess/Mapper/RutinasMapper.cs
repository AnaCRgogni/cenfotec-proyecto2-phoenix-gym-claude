using DataAccess.Dao;
using DTO;
using System;
using System.Collections.Generic;

namespace DataAccess.Mapper
{
    public class RutinasMapper : IObjectMapper
    {
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            return new ResultadoRutina()
            {
                Id = int.Parse(objectRow["IDRutina"].ToString()),
                Nombre = objectRow["Nombre"].ToString(),
                Fecha = Convert.ToDateTime(objectRow["Fecha"])
            };
        }

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            var lstResult = new List<BaseClass>();

            foreach (var objRow in objectRows)
            {
                var rutina = BuildObject(objRow);
                lstResult.Add(rutina);
            }
            return lstResult;
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addRutina";

            Rutina rutina = (Rutina)entityDTO;

            operation.AddVarcharParam("Nombre", rutina.Name);
            operation.AddVarcharParam("IDUsuario", rutina.IdUsuario);
            operation.AddVarcharParam("IDCliente", rutina.IdCliente);
            operation.AddOutputParam("@ReturnValue"); //Esta linea recibe la respuesta del SQL en este caso el ID de rutina para crear los sets
            Console.WriteLine(operation);
            return operation;
        }

        public SqlOperation GetRetrieveAllStatement()
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getRutinas" // solo llama nombre, email y mensualidadCliente
            };

            return operation;
        }

        public SqlOperation GetRutinasByUserId(string cedula)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getRutinasByEntrenador"
            };

            operation.AddVarcharParam("IDUsuario", cedula);

            return operation;
        }
        public SqlOperation GetRutinasByClientId(string cedula)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getRutinasByCliente"
            };

            operation.AddVarcharParam("IDCliente", cedula);

            return operation;
        }

        public SqlOperation GetDeleteRutina(int idEvo)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_deleteRutina"
            };

            operation.AddIntegerParam("idRut", idEvo);

            return operation;
        }

    }
}

