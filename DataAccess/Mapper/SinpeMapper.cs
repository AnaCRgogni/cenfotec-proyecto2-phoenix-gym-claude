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
    public class SinpeMapper : ICrudStatements, IObjectMapper
    {
        public Sinpe BuildObject(Dictionary<string, object> objectRow)
        {
            return new Sinpe()
            {
                Cedula = objectRow.ContainsKey("cedula") && !string.IsNullOrWhiteSpace(objectRow["cedula"]?.ToString())
                    ? objectRow["cedula"].ToString()
                    : string.Empty,  // Default to empty string if blank or null

                Nombre = objectRow.ContainsKey("nombreCompleto") && !string.IsNullOrWhiteSpace(objectRow["nombreCompleto"]?.ToString())
                    ? objectRow["nombreCompleto"].ToString()
                    : string.Empty,  // Default to empty string if blank or null

                Comprobante = objectRow.ContainsKey("comprobante") && !string.IsNullOrWhiteSpace(objectRow["comprobante"]?.ToString())
                    ? objectRow["comprobante"].ToString()
                    : string.Empty,  // Default to empty string if blank or null

                FechaPago = objectRow.ContainsKey("fechaPago") && DateTime.TryParse(objectRow["fechaPago"]?.ToString(), out DateTime fechaPago)
                    ? fechaPago
                    : default(DateTime),  // Default to DateTime.MinValue if invalid

                EstadoUsuario = objectRow.ContainsKey("estadoUsuario") && bool.TryParse(objectRow["estadoUsuario"]?.ToString(), out bool estadoUsuario)
                    ? estadoUsuario
                    : false,  // Default to false if blank or invalid

                EstadoPago = objectRow.ContainsKey("estadoPago") && bool.TryParse(objectRow["estadoPago"]?.ToString(), out bool estadoPago)
                    ? estadoPago
                    : false,  // Default to false if blank or invalid

                Total = objectRow.ContainsKey("total") && float.TryParse(objectRow["total"]?.ToString(), out float total)
                    ? total
                    : 0f  // Default to 0 if blank or invalid
            };
        }


        public List<Sinpe> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            var lstResult = new List<Sinpe>();

            foreach (var objRow in objectRows)
            {
                var sinpe = BuildObject(objRow);
                lstResult.Add(sinpe);
            }
            return lstResult;
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetDeleteStatement(int id)
        {
            throw new NotImplementedException();
        }
        public SqlOperation GetRetrieveAllStatement()
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getAllSinpes" // solo llama nombre, email y mensualidadCliente
            };

            return operation;
        }
        public SqlOperation GetRetrieveAllPagos(string cedula)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getHistorialPago" // solo llama nombre, email y mensualidadCliente
            };
            operation.AddVarcharParam("cedula", cedula);
            return operation;
        }

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_getSinpe2"
            };

            operation.AddVarcharParam("cedula", cedula);
            return operation;
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

        BaseClass IObjectMapper.BuildObject(Dictionary<string, object> objectRow)
        {
            throw new NotImplementedException();
        }

        List<BaseClass> IObjectMapper.BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            throw new NotImplementedException();
        }
    }
}
