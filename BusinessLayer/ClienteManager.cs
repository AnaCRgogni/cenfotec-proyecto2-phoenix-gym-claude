using DTO;
using DataAccess.Crud;
using DataAccess.Dao;

namespace BusinessLayer
{
    public class ClienteManager
    {
        public int CreateCliente(Cliente cliente)
        {
            ClienteCrudFactory clienteCrud = new ClienteCrudFactory();
            return clienteCrud.Create(cliente);

        }
        public List<Cliente> GetAllClientes()
        {
            ClienteCrudFactory clienteCrud = new ClienteCrudFactory();

            return clienteCrud.RetrieveAll<Cliente>();
        }

        public Cliente GetDataCliente(string email)
        {
            ClienteCrudFactory clienteCrud = new ClienteCrudFactory();
            Cliente user = (Cliente)clienteCrud.RetrieveByEmail(email);
            return user;

        }

        public int UpdateCliente(Cliente cliente)
        {
            ClienteCrudFactory clienteCrud = new ClienteCrudFactory();
            return clienteCrud.Update(cliente);
        }

        public int UpdateClienteEstado(string cedula)
        {
            ClienteCrudFactory clienteCrud = new ClienteCrudFactory();
            return clienteCrud.UpdateCliente(cedula);
        }
        public int UpdateClienteEstadoDeshabilitar(string cedula)
        {
            ClienteCrudFactory clienteCrud = new ClienteCrudFactory();
            return clienteCrud.UpdateClienteDeshabilitar(cedula);
        }

        public void DeleteCliente(string cedula)
        {
            ClienteCrudFactory clienteCrud = new ClienteCrudFactory();
            clienteCrud.Delete(cedula);
        }
        public List<ResultadoRutina> GetRutinasById(string cedula)
        {
            ClienteCrudFactory clienteCrud = new ClienteCrudFactory();
            return clienteCrud.RetrieveRutinasById<ResultadoRutina>(cedula);
        }
        public List<ResultadoEntrenamiento> GetEntrenamientosById(string cedula)
        {
            ClienteCrudFactory clienteCrud = new ClienteCrudFactory();
            return clienteCrud.RetrieveEntrenamientosById<ResultadoEntrenamiento>(cedula);
        }

        public List<EntrenamientoCompartido> getEntrenamientosCompartidosById(string cedula,int id)
        {
            ClienteCrudFactory clienteCrud = new ClienteCrudFactory();
            return clienteCrud.RetrieveEntrenamientosCompartidosById<EntrenamientoCompartido>(cedula, id);
        }

    }
}
