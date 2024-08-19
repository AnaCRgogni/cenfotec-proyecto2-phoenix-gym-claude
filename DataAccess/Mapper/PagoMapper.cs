using DataAccess.Dao;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Mapper
{
    public class PagoMapper : ICrudStatements, IObjectMapper
    {
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            var pago = new Pago()
            {
                Id = int.Parse(objectRow["idPago"].ToString()),
                FechaPago = Convert.ToDateTime(objectRow["fechaPago"]),
                MetodoPago = objectRow["metodoPago"].ToString(),
                Comprobante = objectRow["comprobante"].ToString(),
                Estado = (bool)objectRow["estado"],
                CedulaUsuario = objectRow["cedulaUsuario"].ToString(),
                Total = float.Parse(objectRow["total"].ToString()),
                IdMembresia = (int)objectRow["idMembresia"]

            };
            return pago;
        }

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addPago";

            Pago pago = (Pago)entityDTO;

            operation.AddDateTimeParam("fechaPago", pago.FechaPago);
            operation.AddVarcharParam("metodoPago", pago.MetodoPago);
            operation.AddVarcharParam("comprobante", pago.Comprobante);
            operation.AddBoolParam("estado", pago.Estado);
            operation.AddVarcharParam("cedulaUsuario", pago.CedulaUsuario);
            operation.AddFloatParam("total", pago.Total);
            operation.AddIntegerParam("idMembresia", pago.IdMembresia);
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

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveByIdStatement(int Id)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetUpdateStatement(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }
    }
}
