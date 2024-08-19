using DataAccess.Dao;
using DTO;

namespace DataAccess.Mapper
{
    public class ClaseMapper : ICrudStatements, IObjectMapper
    {


        //No agregamos los atributos que marcamos como nullable en el DTO
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            return new Clase()
            {
                Id = int.Parse(objectRow["idClase"].ToString()),
                NombreClase = objectRow["nombreClase"].ToString(),
                FechaClase = Convert.ToDateTime(objectRow["fechaClase"]),
                Cupos = int.Parse(objectRow["cupos"].ToString()),
                Entrenador = int.Parse(objectRow["idTUsuario"].ToString())
            };
        }

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

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addClase";

            Clase clase = (Clase)entityDTO;

            operation.AddVarcharParam("nombreClase", clase.NombreClase);
            operation.AddDateTimeParam("fechaClase", clase.FechaClase);
            operation.AddIntegerParam("cupos", clase.Cupos);
            operation.AddIntegerParam("idTUsuario", clase.Entrenador);

            return operation;
        }

        public SqlOperation GetDeleteStatement(int id)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveAllStatement()
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getClases" // llama nombre, fecha/hora, cupos y cedula de entrenador
            };

            return operation;
        }

        public SqlOperation GetUpdateCupoStatement(int idClase)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_updateCupoClase";

            operation.AddIntegerParam("IdClase", idClase);

            return operation;
        }


        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveByEmailStatement(string cedula)
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