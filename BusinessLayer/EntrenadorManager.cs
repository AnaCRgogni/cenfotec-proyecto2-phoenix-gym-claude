using DTO;
using DataAccess.Crud;

namespace BusinessLayer
{
    public class EntrenadorManager
    {
        public void CreateEntrenador(Entrenador entrenador)
        {
            EntrenadorCrudFactory entrenadorCrud = new EntrenadorCrudFactory();
            entrenadorCrud.Create(entrenador);
        }

        public List<Entrenador> GetAllEntrenadores(string rolUsuario)
        {
            EntrenadorCrudFactory entrenadorCrud = new EntrenadorCrudFactory();

            return entrenadorCrud.RetrieveAllByRole<Entrenador>(rolUsuario);
        }

        public List<ResultadoRutina> GetRutinasById(string cedula) 
        { 
            EntrenadorCrudFactory entrenadorCrud = new EntrenadorCrudFactory();
            return entrenadorCrud.RetrieveRutinasById<ResultadoRutina>(cedula);
        }

        public List<EntrenamientoCompartido> getEntrenamientosCompartidosByUserId(string cedula)
        {
            EntrenadorCrudFactory entrenadorCrud = new EntrenadorCrudFactory();
            return entrenadorCrud.RetrieveEntrenamientosCompartidosByUserId<EntrenamientoCompartido>(cedula);
        }
    }
}
