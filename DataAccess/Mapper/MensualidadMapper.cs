using DataAccess.Dao;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Mapper
{
    public class MensualidadMapper : ICrudStatements, IObjectMapper
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

        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            return new Membresia()
            {
                Id = int.Parse(objectRow["idMembresia"].ToString()),
                Tipo = objectRow["tipo"].ToString(),
                Mensualidad = float.Parse(objectRow["mensualidad"].ToString()),
                Matricula = float.Parse(objectRow["matricula"].ToString())
            };

        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addMembresia";

            Membresia membresia = (Membresia)entityDTO;
            operation.AddVarcharParam("tipo", membresia.Tipo);
            operation.AddFloatParam("mensualidad", membresia.Mensualidad);
            operation.AddFloatParam("matricula", membresia.Matricula);

            return operation;

        }

        public SqlOperation GetDeleteStatement(int id)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_DeleteMembresia"
            };

            operation.AddIntegerParam("idMembresia", id);

            return operation;
        }

        public SqlOperation GetRetrieveAllStatement()
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "sp_getMembresias"
            };

            return operation;
        }

        public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_VerifyMensualidad";

            operation.AddVarcharParam("cedulaUsuario", cedula);
            operation.AddVarcharParam("fecha", fecha);
            operation.AddOutputParam("@ReturnValue");
            return operation;
        }

        public SqlOperation GetRetrieveByIdStatement(int Id)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_getMembresiaById"
            };

            operation.AddIntegerParam("IdMembresia", Id);

            return operation;
        }

        public SqlOperation GetUpdateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_updateMembresia2";

            Membresia membresia = (Membresia)entityDTO;
            operation.AddIntegerParam("idMembresia", membresia.Id);
            operation.AddVarcharParam("tipo", membresia.Tipo);
            operation.AddFloatParam("mensualidad", membresia.Mensualidad);
            operation.AddFloatParam("matricula", membresia.Matricula);
            operation.AddOutputParam("@ReturnValue");

            return operation;
        }

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }
    }
}
