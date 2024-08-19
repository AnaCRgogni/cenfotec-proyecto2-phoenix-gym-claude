using DataAccess.Crud;
using DTO;
using Newtonsoft.Json;

namespace AppLogic
{
    public class ViewUsersManager
    {
        public ViewUsersManager() { }

        public List<MedicionCliente> GetAllViewUsers() // solo trae entrenadores y clientes
        {
            ViewUsersCrudFactory artCrud = new ViewUsersCrudFactory();

            return artCrud.RetrieveAll<MedicionCliente>();
        }

        public List<MedicionCliente> GetAllViewUsers2() // trae recepcionistas, entrenadores y clientes
        {
            ViewUsersCrudFactory artCrud = new ViewUsersCrudFactory();

            return artCrud.RetrieveAllUsers<MedicionCliente>();
        }
    }
}