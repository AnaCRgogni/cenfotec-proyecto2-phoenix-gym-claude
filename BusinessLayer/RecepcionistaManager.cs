using DTO;
using DataAccess.Dao;
using DataAccess.Crud;

namespace BusinessLayer
{
    public class RecepcionistaManager
    {
        public void CreateRecepcionista(Recepcionista recepcionista)
        {
            RecepcionistaCrudFactory entrenadorCrud = new RecepcionistaCrudFactory();
            entrenadorCrud.Create(recepcionista);
        }
    }
}
