using DataAccess.Crud;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO;

namespace BusinessLayer
{
    public class RutinasManager
    {
        public int CreateRutina(Rutina rutina)
        {
            RutinasCrudFactory rutinaCrud = new RutinasCrudFactory();
            int rutinaId = rutinaCrud.Create(rutina);
            if (rutinaId > 0)
            {
                // Create each Set associated with the Rutina
                foreach (var set in rutina.Sets)
                {
                    set.RutinaID = rutinaId;
                    SetsCrudFactory setsCrud = new SetsCrudFactory();
                    setsCrud.Create(set);
                }
            }

            return rutinaId;
        }

        public List<Rutina> GetAllRutinas()
        {
            RutinasCrudFactory rutinaCrud = new RutinasCrudFactory();
            return rutinaCrud.RetrieveAll<Rutina>();

        }

        public List<ResultadoSets> GetSetsByRutina(int id)
        {
            SetsCrudFactory setsCrud = new SetsCrudFactory();

            return setsCrud.RetrieveAllById<ResultadoSets>(id);
        }

        public void DeleteRutina(int idRut)
        {
            RutinasCrudFactory clienteCrud = new RutinasCrudFactory();
            clienteCrud.Delete(idRut);
        }



    }
}
