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
    public class EntrenamientoCompartidoCrudFactory:CrudFactory
    {
        private EntrenamientoCompartidoMapper mapper;

        public EntrenamientoCompartidoCrudFactory():base()
        {
            mapper = new EntrenamientoCompartidoMapper();
            dao = SqlDao.GetInstance();

        }

        public override int Create(BaseClass entrenamientoCompartido)
        {
            SqlOperation operation = mapper.GetCreateStatement(entrenamientoCompartido);
            return dao.ExecuteStoredProcedure(operation);
        }

        public override int Delete(int id)
        {
            SqlOperation operation = mapper.GetDeleteStatement(id);
            return dao.ExecuteStoredProcedure(operation);
        }

        public override void DeleteCitaMedicion(string idEvo)
        {
            throw new NotImplementedException();
        }

        public override void DeleteHorarioEntrenadorPersonal(string idEvo)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAll<T>()
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAllById<T>(int id)
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

        public override List<T> RetrieveByCedula<T>(string cedula)
        {
            throw new NotImplementedException();
        }

        public override BaseClass RetrieveByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public override BaseClass RetrieveById(int id)
        {
            SqlOperation operation = mapper.GetRetrieveByIdStatement(id);
            Dictionary<string, object> result = dao.ExecuteStoredProcedureWithUniqueResult(operation);
            return mapper.BuildObject(result);
        }

        public override BaseClass RetrieveByIdEvo(string idEvo)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveEntrenamientosById<T>(string cedula)
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

        public override int RetrieveMensualidadByCliente(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveRutinasById<T>(string cedula)
        {
            throw new NotImplementedException();
        }

        public override int Update(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }
    }
}
