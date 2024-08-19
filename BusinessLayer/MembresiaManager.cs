using DataAccess.Crud;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class MembresiaManager
    {
        public void CreateMembresia(Membresia membresia)
        {
            MensualidadCrudFactory membresiaCrud = new MensualidadCrudFactory();
            membresiaCrud.Create(membresia);
        }
        public int UpdateMembresia(Membresia membresia)
        {
            MensualidadCrudFactory membresiaCrud = new MensualidadCrudFactory();
            return membresiaCrud.Update(membresia);
        }

        public List<Membresia> GetAllMembresias()
        {
            MensualidadCrudFactory membresiaCrud = new MensualidadCrudFactory();
            return membresiaCrud.RetrieveAll<Membresia>();

        }

        public int VerifyMembresia(string cedula, string fecha)
        {
            MensualidadCrudFactory membresiaCrud = new MensualidadCrudFactory();
            return membresiaCrud.RetrieveMensualidadByCliente(cedula, fecha);

        }

        public Membresia getMembresiaById(int id) {
            MensualidadCrudFactory membresiaCrud = new MensualidadCrudFactory();
            Membresia membresia = (Membresia)membresiaCrud.RetrieveById(id);
            return membresia;
        }

        public void Delete(int id)
        {
            MensualidadCrudFactory membresiaCrud = new MensualidadCrudFactory();
            membresiaCrud.Delete(id);
        }
    }
}
