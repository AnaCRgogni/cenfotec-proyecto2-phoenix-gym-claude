using DataAccess.Dao;
using DTO;
using System;

namespace DataAccess.Mapper
{
    public class RecepcionistaMapper : ICrudStatements, IObjectMapper
    {

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            throw new NotImplementedException();
        }

        //No agregamos los atributos que marcamos como nullable en el DTO
        public Recepcionista BuildObject(Dictionary<string, object> objectRow)
        {
            return new Recepcionista()
            {
                Cedula = objectRow["cedula"].ToString(),
                RolUsuario = objectRow["rolUsuario"].ToString(),
                Nombre = objectRow["nombre"].ToString(),
                Apellido1 = objectRow["apellido1"].ToString(),
                Apellido2 = objectRow["apellido2"].ToString(),
                Email = objectRow["email"].ToString(),
                Contrasena = objectRow["contrasena"].ToString(),
                Telefono = objectRow["telefono"].ToString(),
                FechaNacimiento = Convert.ToDateTime(objectRow["fechaNacimiento"]),
                GeneroCliente = objectRow["generoCliente"].ToString(),
                Estado = (bool)objectRow["estado"]
            };

        }

        public SqlOperation GetCreateStatement(Recepcionista entityDTO)
        {
            

            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "sp_addRecepcionista";

            Recepcionista user = (Recepcionista)entityDTO;

            user.RolUsuario = "Recepcionista";
            user.Estado = true;

            operation.AddVarcharParam("cedula", user.Cedula);
            operation.AddVarcharParam("rolUsuario", user.RolUsuario); // Always "Recepcionista"
            operation.AddVarcharParam("nombre", user.Nombre);
            operation.AddVarcharParam("apellido1", user.Apellido1);
            operation.AddVarcharParam("apellido2", user.Apellido2);
            operation.AddVarcharParam("email", user.Email);
            operation.AddVarcharParam("contrasena", user.Contrasena);
            operation.AddVarcharParam("telefono", user.Telefono);
            operation.AddDateTimeParam("fechaNacimiento", user.FechaNacimiento);
            operation.AddVarcharParam("generoCliente", user.GeneroCliente);
            operation.AddBoolParam("Estado", user.Estado); // Always true
            operation.AddOutputParam("@ReturnValue");

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
                ProcedureName = "PR_GET_ALL_ARTICLES"
            };

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

        BaseClass IObjectMapper.BuildObject(Dictionary<string, object> objectRow)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }
    }
}
