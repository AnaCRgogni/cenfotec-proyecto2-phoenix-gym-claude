using DataAccess.Dao;
using DTO;
using System;

namespace DataAccess.Mapper
{
    public class UserMapper : ICrudStatements, IObjectMapper
    {
        public User BuildObject(Dictionary<string, object> objectRow)
        {
            
            return new User()
            {
                Email = objectRow["email"].ToString(),
                Cedula = objectRow["cedula"].ToString(),
                RolUsuario = objectRow["rolUsuario"].ToString(),
                Nombre = objectRow["nombre"].ToString(),
                Apellido1 = objectRow["apellido1"].ToString(),
                Apellido2 = objectRow["apellido2"].ToString(),
                Telefono = objectRow["telefono"].ToString(),
                TipoEntrenador = objectRow["tipoEntrenador"].ToString(),
                TarifaHoraEntrenadorPersonal = string.IsNullOrEmpty(objectRow["tarifaHoraEntrenadorPersonal"].ToString()) ? 0.0f : float.Parse(objectRow["tarifaHoraEntrenadorPersonal"].ToString()),
                IdMembresia = string.IsNullOrEmpty(objectRow["idMembresia"].ToString()) ? 0 : int.Parse(objectRow["idMembresia"].ToString()),
                Estado = string.IsNullOrEmpty(objectRow["estado"].ToString()) ? false : Boolean.Parse(objectRow["estado"].ToString())
            };
        }

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            throw new NotImplementedException();
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
                ProcedureName = "dbo.sp_getUsers"
            };

            return operation;
        }

        public SqlOperation GetRetrieveByIdStatement(int Id)
        {
            throw new NotImplementedException();
        }

        
        public SqlOperation GetRetrieveByCedulaStatement(string Cedula)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_getUsers"
            };

            operation.AddVarcharParam("cedula", Cedula);
            return operation;
        }

        

        BaseClass IObjectMapper.BuildObject(Dictionary<string, object> objectRow)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetUpdateStatement(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetUpdateUserStatement(User user)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_UpdateUsers";

            User updatedUser = (User)user;

            operation.AddVarcharParam("Cedula", user.Cedula);
            operation.AddVarcharParam("RolUsuario", user.RolUsuario);
            operation.AddVarcharParam("Nombre", user.Nombre);
            operation.AddVarcharParam("Apellido1", user.Apellido1);
            operation.AddVarcharParam("Apellido2", user.Apellido2);
            operation.AddVarcharParam("Email", user.Email);
            operation.AddVarcharParam("Telefono", user.Telefono);
            operation.AddVarcharParam("TipoEntrenador", user.TipoEntrenador);
            operation.AddNullableFloatParam("TarifaHoraEntrenadorPersonal", user.TarifaHoraEntrenadorPersonal ?? 0); 
            operation.AddNullableIntegerParam("IdMembresia", user.IdMembresia ?? 0);
            operation.AddNullableIntegerParam("Estado", user.Estado.HasValue ? (user.Estado.Value ? 1 : 0) : (int?)null);
            return operation;
        }

        public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }
    }
}