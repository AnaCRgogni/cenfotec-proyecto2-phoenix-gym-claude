using DataAccess.Dao;
using DTO;

namespace DataAccess.Crud
{
    public abstract class CrudFactory
    {
        protected SqlDao dao;
        public abstract int Create(BaseClass entityDTO); //Estos deben retornar un Int si se necesita
        public abstract int Update(BaseClass entityDTO);
        public abstract int Delete(int id);
        public abstract void DeleteCitaMedicion(string idEvo);
        public abstract void DeleteHorarioEntrenadorPersonal(string idEvo);
        public abstract List<T> RetrieveAll<T>();
        public abstract BaseClass RetrieveById(int id);
        public abstract BaseClass RetrieveByIdEvo(string idEvo);
        public abstract List<T> RetrieveAllByRole<T>(string rolUsuario);
        public abstract List<T> RetrieveByCedula<T>(string cedula);
        public abstract List<T> RetrieveByCalendarDescription<T>(string nombreEntrenadorDescripcion);
        public abstract BaseClass RetrieveByEmail(string email);
        public abstract int RetrieveMensualidadByCliente(string cedula, string fecha);
        public abstract List<T> RetrieveAllById<T>(int id);
        public abstract List<T> RetrieveRutinasById<T>(string cedula);
        public abstract List<T> RetrieveEntrenamientosById<T>(string cedula);
        public abstract List<T> RetrieveEntrenamientosCompartidosById <T>(string cedula, int id);
        public abstract List<T> RetrieveEntrenamientosCompartidosByUserId<T>(string cedula);
    }
}
