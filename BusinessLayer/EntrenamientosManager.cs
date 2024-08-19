using DataAccess.Crud;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class EntrenamientosManager
    {
        public int CreateEntrenamiento(Entrenamiento entrenamiento)
        {
            EntrenamientosCrudFactory entrenamientoCrud = new EntrenamientosCrudFactory();
            int entrenamientoId = entrenamientoCrud.Create(entrenamiento);
            if (entrenamientoId > 0)
            {
                // Create each Set associated with the Rutina
                foreach (var set in entrenamiento.Sets)
                {
                    set.RutinaID = entrenamientoId;
                    SetsCrudFactory setsCrud = new SetsCrudFactory();
                    setsCrud.Create(set);
                }
            }

            return entrenamientoId;
        }

        public ResultadoEntrenamiento getEntrenamientoById(int id) 
        {
            EntrenamientosCrudFactory entrenamientoCrud = new EntrenamientosCrudFactory();
            ResultadoEntrenamiento entrenamiento = (ResultadoEntrenamiento)entrenamientoCrud.RetrieveById(id);
            return entrenamiento;
        }

        public List<ResultadoSets> GetSetsByEntrenamiento(int id)
        {
            SetsCrudFactory setsCrud = new SetsCrudFactory();

            return setsCrud.RetrieveAllById<ResultadoSets>(id);
        }

        public int CompartirEntrenamiento(EntrenamientoCompartido entrenamientoCompartido) 
        {
            EntrenamientoCompartidoCrudFactory entrenamientoCompCrud = new EntrenamientoCompartidoCrudFactory();
            return entrenamientoCompCrud.Create(entrenamientoCompartido);
        }

        public void DeleteEntrenamientoCompartido(int id)
        {
            EntrenamientoCompartidoCrudFactory entrenamientoCompCrud = new EntrenamientoCompartidoCrudFactory();

            entrenamientoCompCrud.Delete(id);
        }

        public void DeleteEntrenamiento(int id)
        {
            EntrenamientosCrudFactory entrenamientoCrud = new EntrenamientosCrudFactory();

            entrenamientoCrud.Delete(id);
        }
    }
}
