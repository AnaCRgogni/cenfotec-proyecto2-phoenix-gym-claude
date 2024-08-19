using DataAccess.Crud;
using DTO;
using Newtonsoft.Json;

namespace AppLogic
{
    public class MedicionClienteManager
    {
        public MedicionClienteManager() { }

        public List<MedicionCliente> GetAllMedicionCliente()
        {
            MedicionClienteCrudFactory artCrud = new MedicionClienteCrudFactory();

            return artCrud.RetrieveAll<MedicionCliente>();
        } 
    }
}