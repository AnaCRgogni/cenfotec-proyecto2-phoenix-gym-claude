using DataAccess.Dao;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Mapper
{
    public class MedicionMapper : ICrudStatements, IObjectMapper
    {
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            var medicion = new Medicion()
            {
                Id = int.Parse(objectRow["idMedicion"].ToString()),
                Fecha = Convert.ToDateTime(objectRow["fecha"]),
                Peso = float.Parse(objectRow["Peso"].ToString()),
                Altura = float.Parse(objectRow["Altura"].ToString()),
                Imc = int.Parse(objectRow["imc"].ToString()),
                Igc = int.Parse(objectRow["igc"].ToString()),
                IdUsuario = objectRow["idUsuario"].ToString(),
                IdCliente = objectRow["idCliente"].ToString(),

            };
            return medicion;
        }

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            var lstResult = new List<BaseClass>();

            foreach (var objRow in objectRows)
            {
                var medicion = BuildObject(objRow);
                lstResult.Add(medicion);
            }
            return lstResult;
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addMedicion";

            Medicion medicion = (Medicion)entityDTO;

            operation.AddDateTimeParam("fecha", medicion.Fecha);
            operation.AddFloatParam("Peso", medicion.Peso);
            operation.AddFloatParam("Altura", medicion.Altura);
            operation.AddIntegerParam("imc", medicion.Imc);
            operation.AddIntegerParam("igc", medicion.Igc);
            operation.AddVarcharParam("idUsuario",medicion.IdUsuario);
            operation.AddVarcharParam("idCliente", medicion.IdCliente);

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
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getMedicionByCliente"
            };
            operation.AddVarcharParam("idCliente", cedula);
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
    }
}
