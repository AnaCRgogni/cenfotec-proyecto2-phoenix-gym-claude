using DataAccess.Crud;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO;

namespace BusinessLayer
{
    public class EjercicioManager
    {
        public int CreateEjercicio(Ejercicio ejercicio)
        {
            EjercicioCrudFactory ejercicioCrud = new EjercicioCrudFactory();
            return ejercicioCrud.Create(ejercicio);
        }

        public int UpdateEjercicio(Ejercicio ejercicio)
        {
            EjercicioCrudFactory ejercicioCrud = new EjercicioCrudFactory();
            return ejercicioCrud.Update(ejercicio);
        }

        public int DeleteEjercicio(int Id)
        {
            EjercicioCrudFactory ejercicioCrud = new EjercicioCrudFactory();
            return ejercicioCrud.Delete(Id);
        }

        public List<Ejercicio> GetAllEjercicios()
        {
            EjercicioCrudFactory ejercicioCrud = new EjercicioCrudFactory();
            return ejercicioCrud.RetrieveAll<Ejercicio>();

        }
    }

}
