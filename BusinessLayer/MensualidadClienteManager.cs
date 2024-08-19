using DataAccess.Crud;
using DTO;
using Newtonsoft.Json;

namespace AppLogic
{
    public class MensualidadClienteManager
    {
        public MensualidadClienteManager() { }

        public List<MensualidadCliente> GetAllMensualidadCliente()
        {
            MensualidadClienteCrudFactory artCrud = new MensualidadClienteCrudFactory();
            return artCrud.RetrieveAll<MensualidadCliente>();
        }      
    }
}