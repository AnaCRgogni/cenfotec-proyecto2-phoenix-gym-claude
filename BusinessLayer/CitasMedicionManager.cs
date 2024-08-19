using CloudinaryDotNet.Actions;
using DataAccess.Crud;
using DTO;

namespace BusinessLayer
{
    public class CitasMedicionManager
    {
        public void CreateCitasMedicion(CitasMedicion citasMedicion)
        {
            CitasMedicionCrudFactory citasMedicionCrud = new CitasMedicionCrudFactory();

            citasMedicionCrud.Create(citasMedicion);
        }
        public List<CitasMedicion> GetAllCitasMedicionByCedula(string cedula)
        {
            CitasMedicionCrudFactory citasMedicionCrud = new CitasMedicionCrudFactory();

            return citasMedicionCrud.RetrieveByCedula<CitasMedicion>(cedula);
        }

        public List<CitasMedicion> GetAllCitasMedicionForEntrenador(string description)
        {
            CitasMedicionCrudFactory citasMedicionCrud = new CitasMedicionCrudFactory();

            return citasMedicionCrud.RetrieveByCalendarDescription<CitasMedicion>(description);
        }
        public BaseClass GetRetrieveByIdEvo(string idEvo)
        {
            CitasMedicionCrudFactory citasMedicionCrud = new CitasMedicionCrudFactory();

            return citasMedicionCrud.RetrieveByIdEvo(idEvo);
        }
        public void DeleteCitaMedicionxCliente(string idEvo)
        {
            CitasMedicionCrudFactory citasMedicionCrud = new CitasMedicionCrudFactory();

            citasMedicionCrud.DeleteCitaMedicion(idEvo);
        }
    }
}