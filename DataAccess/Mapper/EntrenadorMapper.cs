using DataAccess.Dao;
using DTO;
using System;

namespace DataAccess.Mapper
{
    public class EntrenadorMapper : IObjectMapper
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

        //No agregamos los atributos que marcamos como nullable en el DTO
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            return new Entrenador()
            {
                Id = int.Parse(objectRow["idUsuario"].ToString()),
                Cedula = objectRow["cedula"].ToString(),
                RolUsuario = objectRow["rolUsuario"].ToString(),
                Nombre = objectRow["nombre"].ToString(),
                Apellido1 = objectRow["apellido1"].ToString(),
                Apellido2 = objectRow["apellido2"].ToString(),
                Email = objectRow["email"].ToString(),
                Contrasena = objectRow["contrasena"].ToString(),
                Telefono = objectRow["telefono"].ToString(),
                FechaNacimiento = Convert.ToDateTime(objectRow["fechaNacimiento"]),
                TipoEntrenador = objectRow["tipoEntrenador"].ToString(),
                TarifaHoraEntrenadorPersonal = objectRow["tarifaHoraEntrenadorPersonal"] != DBNull.Value ? (float?)Convert.ToSingle(objectRow["tarifaHoraEntrenadorPersonal"]) : null,
                Estado = (bool)objectRow["estado"]
            };

        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addEntrenadorxRecepcionista";

            Entrenador user = (Entrenador)entityDTO;

            user.RolUsuario = "Entrenador";
            user.Estado = true;

            operation.AddVarcharParam("cedula", user.Cedula);
            operation.AddVarcharParam("rolUsuario", user.RolUsuario);
            operation.AddVarcharParam("nombre", user.Nombre);
            operation.AddVarcharParam("apellido1", user.Apellido1);
            operation.AddVarcharParam("apellido2", user.Apellido2);
            operation.AddVarcharParam("telefono", user.Telefono);
            operation.AddVarcharParam("email", user.Email);
            operation.AddDateTimeParam("fechaNacimiento", user.FechaNacimiento);
            operation.AddVarcharParam("contrasena", user.Contrasena);
            operation.AddVarcharParam("tipoEntrenador", user.TipoEntrenador);
            operation.AddNullableFloatParam("tarifaHoraEntrenadorPersonal", user.TarifaHoraEntrenadorPersonal);
            operation.AddBoolParam("Estado", user.Estado);
            operation.AddOutputParam("@ReturnValue");

            return operation;
        }

        public SqlOperation GetDeleteStatement(int id)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveAllByRoleStatement(string rolUsuario)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getAllEntrenadores"
            };

            operation.AddVarcharParam("rolUsuario", rolUsuario);

            return operation;
        }

        public SqlOperation GetRetrieveByIdStatement(int Id)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_getPokemonCriolloById"
            };

            operation.AddIntegerParam("Id", Id);
            return operation;
        }

        public SqlOperation GetUpdateStatement(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }

        //Método para hacer consultas por diferentes criterios de filtro
        //Cada criterio que queramos evaluar, va a ser un search type y el valor el
        //search phrase
        public SqlOperation GetRetrieveByPhraseStatement(string searchType, string searchPhrase)
        {
            var operation = new SqlOperation()
            {
                ProcedureName = "PR_GET_ALL_ARTICLES_BY_PHRASE"
            };

            operation.AddVarcharParam("searchType", searchType);
            operation.AddVarcharParam("searchPhrase", searchPhrase);

            return operation;
        }

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }
        public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveAllStatement()
        {
            throw new NotImplementedException();
        }

    }
}
