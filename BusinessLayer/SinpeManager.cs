using DTO;
using DataAccess.Crud;
using DataAccess.Dao;
using System;

namespace BusinessLayer
{
    public class SinpeManager
    {
        public Sinpe GetSinpe(string cedula)
        {
            SinpeCrudFactory sinpeCrud = new SinpeCrudFactory();
            Sinpe result = sinpeCrud.RetrieveById(cedula);
            return result;
        }
        public List<Sinpe> GetAllSinpes()
        {
            SinpeCrudFactory sinpeCrud = new SinpeCrudFactory();

            return sinpeCrud.RetrieveAll<Sinpe>();
        }
        public List<Sinpe> GetAllPagos(string cedula)
        {
            SinpeCrudFactory sinpeCrud = new SinpeCrudFactory();
            List<Sinpe> sinpe = sinpeCrud.RetrieveAllPagos(cedula);
            return sinpe;
        }               
    }
}
