using DataAccess.Crud;
using DTO;

namespace BusinessLayer
{
    public class HorarioEntrenadorPersonalManager
    {
        public void CreateHorarioEntrenadorPersonal(HorarioEntrenadorPersonal horarioEntrenadorPersonal)
        {
            HorarioEntrenadorPersonalCrudFactory horarioEntrenadorPersonalCrud = new HorarioEntrenadorPersonalCrudFactory();
            horarioEntrenadorPersonalCrud.Create(horarioEntrenadorPersonal);
        }
        public List<HorarioEntrenadorPersonal> GetAllHorarioEntrenadorPersonalByCedula(string cedula)
        {
            HorarioEntrenadorPersonalCrudFactory horarioEntrenadorPersonalCrud = new HorarioEntrenadorPersonalCrudFactory();

            return horarioEntrenadorPersonalCrud.RetrieveByCedula<HorarioEntrenadorPersonal>(cedula);
        }
        public BaseClass GetRetrieveByIdEvo(string idEvo)
        {
            HorarioEntrenadorPersonalCrudFactory horarioEntrenadorPersonalCrud = new HorarioEntrenadorPersonalCrudFactory();

            return horarioEntrenadorPersonalCrud.RetrieveByIdEvo(idEvo);
        }
        public void DeleteHorarioEntrenadorPersonal(string idEvo)
        {
            HorarioEntrenadorPersonalCrudFactory horarioEntrenadorPersonalCrud = new HorarioEntrenadorPersonalCrudFactory();

            horarioEntrenadorPersonalCrud.DeleteHorarioEntrenadorPersonal(idEvo);
        }

        public void UpdateHorarioEntrenador(HorarioEntrenadorPersonal horarioEntrenadorPersonal)
        {
            HorarioEntrenadorPersonalCrudFactory horarioCrud = new HorarioEntrenadorPersonalCrudFactory();
            horarioCrud.UpdateCalendarEventbyIdEvo(horarioEntrenadorPersonal);
        }

        public void UpdateCancelHorarioEntrenador(HorarioEntrenadorPersonal horarioEntrenadorPersonal)
        {
            HorarioEntrenadorPersonalCrudFactory horarioCrud = new HorarioEntrenadorPersonalCrudFactory();
            horarioCrud.UpdateCancelCalendarEventbyIdEvo(horarioEntrenadorPersonal);
        }
    }
}