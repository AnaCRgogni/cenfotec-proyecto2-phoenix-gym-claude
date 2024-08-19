using CloudinaryDotNet.Actions;
using DataAccess.Dao;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Mapper
{
    public class EntrenamientoCompartidoMapper : ICrudStatements
    {
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            return new EntrenamientoCompartido()
            {
                Id = int.Parse(objectRow["idEntrenamientoComp"].ToString()),
                IdEntrenamiento = int.Parse(objectRow["idEntrenamiento"].ToString()),
                CedulaCliente = objectRow["cedulaCliente"].ToString(),
                CedulaUsuario = objectRow["cedulaUsuario"].ToString()
            };
        }

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            var lstResult = new List<BaseClass>();

            foreach (var objRow in objectRows)
            {
                var entrenamientoComp = BuildObject(objRow);
                lstResult.Add(entrenamientoComp);
            }
            return lstResult;
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addEntrenamientoCompartido";

            EntrenamientoCompartido entrenamientoCompartido = (EntrenamientoCompartido)entityDTO;
            operation.AddIntegerParam("idEntrenamiento", entrenamientoCompartido.IdEntrenamiento);
            operation.AddVarcharParam("cedulaCliente", entrenamientoCompartido.CedulaCliente);
            operation.AddVarcharParam("cedulaUsuario", entrenamientoCompartido.CedulaUsuario);
            operation.AddOutputParam("@ReturnValue");
            return operation;
        }

        public SqlOperation GetDeleteStatement(int id)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_DeleteEntrenamientoEntrenamientoCompartido"
            };

            operation.AddIntegerParam("idEntrenamientoComp", id);

            return operation;
        }

        public SqlOperation GetRetrieveAllStatement()
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveByIdStatement(int id)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_GetEntrenamientosCompartidoById"
            };

            operation.AddIntegerParam("idEntrenamientoComp", id);

            return operation;
        }

        public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetUpdateStatement(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetEntrenamientosCompartidosByClientId(string cedula, int id)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_GetEntrenamientosCompartidosByCliente"
            };

            operation.AddVarcharParam("cedulaCliente", cedula);
            operation.AddIntegerParam("idEntrenamiento", id);

            return operation;
        }

        public SqlOperation GetEntrenamientosCompartidosByUsertId(string cedula)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_GetEntrenamientosCompartidosByEntrenador"
            };

            operation.AddVarcharParam("cedulaUsuario", cedula);

            return operation;
        }
    }
}
