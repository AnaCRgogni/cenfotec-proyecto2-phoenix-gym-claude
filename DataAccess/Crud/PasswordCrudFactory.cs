using DataAccess.Dao;
using DataAccess.Mapper;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Crud
{
    public class PasswordCrudFactory : CrudFactory
    {
        private PasswordMapper mapper;
        private PasswordsMapper passwordsMapper;

        public PasswordCrudFactory() : base()
        {
            mapper = new PasswordMapper();
            passwordsMapper = new PasswordsMapper();
            dao = SqlDao.GetInstance();
        }

        public override int Update(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }

        public override int Create(BaseClass Salt)
        {
            SqlOperation operation = mapper.GetCreateStatement((BaseClass)Salt);
            return dao.ExecuteStoredProcedure(operation);
        }

        public override BaseClass RetrieveByEmail(string email)
        {
            SqlOperation operation = mapper.GetRetrieveByEmailStatement(email);

            if (operation == null)
            {
                return null;
            }

            Dictionary<string, object> result = dao.ExecuteStoredProcedureWithUniqueResult(operation);

            if (result == null || result.Count == 0)
            {
                return null;
            }

            return mapper.BuildObject(result);
        }

        public List<Passwords> RetrieveLastFivePasswords(string cedula)
        {
            SqlOperation operation = passwordsMapper.GetRetrieveLastFivePasswordsStatement(cedula);
            List<Dictionary<string, object>> results = dao.ExecuteStoredProcedureWithQuery(operation);

            if (results == null || results.Count == 0)
            {
                return new List<Passwords>();
            }

            return results.Select(passwordsMapper.BuildObject).Cast<Passwords>().ToList();
        }

        public void DeleteOldestPassword(string cedula)
        {
            SqlOperation operation = passwordsMapper.GetDeleteOldestPasswordStatement(cedula);
            dao.ExecuteStoredProcedure(operation);
        }

        public void SaveNewPassword(string cedula, byte[] hashedPassword, byte[] salt, DateTime fechaCambio)
        {
            SqlOperation operation = passwordsMapper.GetSaveNewPasswordStatement(cedula, hashedPassword, salt, fechaCambio);
            dao.ExecuteStoredProcedure(operation);
        }


        public override int Delete(int id)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAll<T>()
        {
            throw new NotImplementedException();
        }

        public override BaseClass RetrieveById(int id)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveByCedula<T>(string cedula)
        {
            throw new NotImplementedException();
        }

        public override int RetrieveMensualidadByCliente(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAllByRole<T>(string rolUsuario)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveByCalendarDescription<T>(string nombreEntrenadorDescripcion)
        {
            throw new NotImplementedException();
        }

        public void UpdatePassword(BaseClass user, string saltValue)
        {
            SqlOperation operation = mapper.GetUpdatePasswordStatement(user, saltValue);
            dao.ExecuteStoredProcedure(operation);
        }

        public override List<T> RetrieveRutinasById<T>(string cedula)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAllById<T>(int id)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveEntrenamientosById<T>(string cedula)
        {
            throw new NotImplementedException();
        }

        public override void DeleteCitaMedicion(string idEvo)
        {
            throw new NotImplementedException();
        }

        public override BaseClass RetrieveByIdEvo(string idEvo)
        {
            throw new NotImplementedException();
        }

        public override void DeleteHorarioEntrenadorPersonal(string idEvo)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveEntrenamientosCompartidosById<T>(string cedula, int id)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveEntrenamientosCompartidosByUserId<T>(string cedula)
        {
            throw new NotImplementedException();
        }
    }
}
