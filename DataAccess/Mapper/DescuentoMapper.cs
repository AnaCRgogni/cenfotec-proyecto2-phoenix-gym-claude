using DataAccess.Dao;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Mapper
{
    public class DescuentoMapper : IObjectMapper
    {
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            var descuento = new Descuento()
            {
                Id = int.Parse(objectRow["idDescuento"].ToString()),
                Codigo = objectRow["codigo"].ToString(),
                Porcentaje = float.Parse(objectRow["porcentaje"].ToString()),
                Estado = (bool)objectRow["estado"]
            };
            return descuento;
        }

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            var lstResult = new List<BaseClass>();

            foreach (var objRow in objectRows)
            {
                var descuento = BuildObject(objRow);
                lstResult.Add(descuento);
            }
            return lstResult;
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addDescuento";

            Descuento descuento = (Descuento)entityDTO;

            operation.AddVarcharParam("codigo", descuento.Codigo);
            operation.AddFloatParam("porcentaje", descuento.Porcentaje);
            operation.AddBoolParam("estado",descuento.Estado);
            operation.AddOutputParam("@ReturnValue");
            return operation;
        }

        public SqlOperation GetDeleteStatement(int id)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_DeleteDescuento"
            };

            operation.AddIntegerParam("idDescuento", id);

            return operation;
        }

        public SqlOperation GetRetrieveAllStatement()
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "sp_getAllDescuentos"
            };
            return operation;
        }

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveByIdStatement(int Id)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_getDescuentoById"
            };

            operation.AddIntegerParam("idDescuento", Id);

            return operation;
        }

        public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetUpdateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_updateDescuento";

            Descuento descuento = (Descuento)entityDTO;

            operation.AddIntegerParam("idDescuento", descuento.Id);
            operation.AddVarcharParam("codigo", descuento.Codigo);
            operation.AddFloatParam("porcentaje", descuento.Porcentaje);
            operation.AddBoolParam("estado", descuento.Estado);
            operation.AddOutputParam("@ReturnValue");
            return operation;
        }

        public SqlOperation getVerifiedDiscount(string codigo)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_getDescuentoPorcentaje"
            };

            operation.AddVarcharParam("codigo", codigo);
            operation.AddOutputParam("@ReturnValue");

            return operation;
        }

    }
}
