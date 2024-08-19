using DataAccess.Crud;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class MedicionManager
    {
        public int CreateMedicion(Medicion medicion) 
        { 
            MedicionCrudFactory medicionCrud = new MedicionCrudFactory();
            var id = medicionCrud.Create(medicion);
            return id;
        }

        public List<Medicion> GetMedicionesByClientId(string cedula)
        {
            MedicionCrudFactory medicionCrud = new MedicionCrudFactory();
            return medicionCrud.RetrieveByCedula<Medicion>(cedula);
        }

    }
}
