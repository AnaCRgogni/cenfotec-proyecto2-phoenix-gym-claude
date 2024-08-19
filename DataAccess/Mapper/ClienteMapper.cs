using DataAccess.Dao;
using DataAccess.Mapper;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace DataAccess.Mapper
{
    public class ClienteMapper : ICrudStatements, IObjectMapper
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
            return new Cliente()
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
                FotoIdCliente = objectRow["fotoIdCliente"] != DBNull.Value ? objectRow["fotoIdCliente"].ToString() : null,
                FotoPerfilCliente = objectRow["fotoPerfilCliente"] != DBNull.Value ? objectRow["fotoPerfilCliente"].ToString() : null,
                GeneroCliente = objectRow["generoCliente"] != DBNull.Value ? objectRow["generoCliente"].ToString() : null,
                idMembresia = objectRow["idMembresia"] != DBNull.Value ? (int)objectRow["idMembresia"] : default,
                Estado = (bool)objectRow["estado"]
            };

        }
        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addCliente";

            Cliente user = (Cliente)entityDTO;
            operation.AddVarcharParam("cedula", user.Cedula);
            operation.AddVarcharParam("nombre", user.Nombre);
            operation.AddVarcharParam("apellido1", user.Apellido1);
            operation.AddVarcharParam("apellido2", user.Apellido2);
            operation.AddVarcharParam("email", user.Email);
            operation.AddVarcharParam("contrasena", user.Contrasena);
            operation.AddVarcharParam("telefono", user.Telefono);
            operation.AddDateTimeParam("fechaNacimiento", user.FechaNacimiento);
            operation.AddVarcharParam("fotoIdCliente", user.FotoIdCliente);
            operation.AddVarcharParam("fotoPerfilCliente", user.FotoPerfilCliente);
            operation.AddVarcharParam("generoCliente", user.GeneroCliente);
            operation.AddIntegerParam("idMembresia", user.idMembresia);
            operation.AddOutputParam("@ReturnValue");
            return operation;
        }


        public SqlOperation GetUpdateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_updateCliente";

            Cliente user = (Cliente)entityDTO;

            operation.AddVarcharParam("cedula", user.Cedula);
            operation.AddVarcharParam("nombre", user.Nombre);
            operation.AddVarcharParam("apellido1", user.Apellido1);
            operation.AddVarcharParam("apellido2", user.Apellido2);
            operation.AddVarcharParam("email", user.Email);
            operation.AddVarcharParam("contrasena", user.Contrasena);
            operation.AddVarcharParam("telefono", user.Telefono);
            operation.AddDateTimeParam("fechaNacimiento", user.FechaNacimiento);
            operation.AddVarcharParam("fotoIdCliente", user.FotoIdCliente);
            operation.AddVarcharParam("fotoPerfilCliente", user.FotoPerfilCliente);
            operation.AddVarcharParam("generoCliente", user.GeneroCliente);
            operation.AddIntegerParam("idMembresia", user.idMembresia);
            operation.AddBoolParam("estado", user.Estado);
            operation.AddNullableVarcharParam("newSalt", null);
            operation.AddOutputParam("@ReturnValue");

            return operation;
        }

        public SqlOperation GetRetrieveAllStatement()
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getInfoMensualidadCliente2" // solo llama nombre, email y mensualidadCliente
            };

            return operation;
        }


        public SqlOperation GetRetrieveByEmailStatement(string email)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_GetUserInfoByEmail"
            };

            operation.AddVarcharParam("email", email);

            return operation;
        }

        public SqlOperation GetDeleteStatement(int id)
        {
            throw new NotImplementedException();
        }
        public SqlOperation GetDeleteStatement(string cedula)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_deleteCedCliente"
            };
            operation.AddVarcharParam("Cedula", cedula);
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


        //Método para hacer consultas por diferentes criterios de filtro
        //Cada criterio que queramos evaluar, va a ser un search type y el valor el
        //search phrase
        public SqlOperation GetRetrieveByPhraseStatement(string searchType, string searchPhrase)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetUpdateEstadoStatement(string cedula)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_updateEstadoCliente";

            // Add parameter for the stored procedure
            operation.AddVarcharParam("Cedula", cedula);

            return operation;
        }
        public SqlOperation GetUpdateEstadoDeshabilitarStatement(string cedula)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_updateDeshabilitarCuenta";

            // Add parameter for the stored procedure
            operation.AddVarcharParam("Cedula", cedula);

            return operation;
        }

    }
}