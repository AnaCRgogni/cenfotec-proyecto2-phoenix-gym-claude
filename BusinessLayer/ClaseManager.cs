using DTO;
using DataAccess.Crud;

namespace BusinessLayer
{
    public class ClaseManager
    {
        public void CreateClase(Clase clase)
        {
            ClaseCrudFactory claseCrud = new ClaseCrudFactory();
            claseCrud.Create(clase);
        }

        public void CreateInscripcion(Inscripcion inscripcion)
        {
            ClaseCrudFactory claseCrud = new ClaseCrudFactory();
            claseCrud.CreateInscripcion(inscripcion);
        }

        public List<Clase> GetAllClases()
        {
            ClaseCrudFactory claseCrud = new ClaseCrudFactory();

            return claseCrud.RetrieveAll<Clase>();
        }

        public List<ClasesXCliente> GetClasesXCliente(string cedula)
        {
            ClaseCrudFactory claseCrud = new ClaseCrudFactory();
            List<ClasesXCliente> users = claseCrud.RetrieveClasesXCliente<ClasesXCliente>(cedula);
            return users;
        }

        public bool validacionXSemana(string cedula, DateTime classDate)
        {
            List<ClasesXCliente> clientReservations = GetClasesXCliente(cedula);

            int reservationsCount = clientReservations
                .Where(r => r.IdCliente == cedula &&
                            r.FechaClase >= StartOfWeek(classDate) &&
                            r.FechaClase < EndOfWeek(classDate))
                .Count();

            return reservationsCount < 2;
        }

        public static DateTime StartOfWeek(DateTime dt, DayOfWeek startOfWeek = DayOfWeek.Monday)
        {
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            return dt.AddDays(-1 * diff).Date;
        }

        public static DateTime EndOfWeek(DateTime dt, DayOfWeek startOfWeek = DayOfWeek.Monday)
        {
            return StartOfWeek(dt, startOfWeek).AddDays(7).Date;
        }

        public int validacionXMembresia(string email)
        {
            ClienteManager clienteManager = new ClienteManager();
            Cliente cliente = clienteManager.GetDataCliente(email);

            int membresia = cliente.idMembresia;
            if (membresia > 0)
            {
                return membresia;
            }
            return 0;
        }

        public bool validarFechaHora(string cedula, DateTime fechaClase)
        {
            List<ClasesXCliente> clienteInscripciones = GetClasesXCliente(cedula);

            DateTime fechaClaseUTC = fechaClase.AddHours(-6);

            foreach (var i in clienteInscripciones)
            {
                Console.WriteLine($"Comparing {i.FechaClase} with {fechaClaseUTC}");
            }

            return clienteInscripciones.Any(i => i.FechaClase == fechaClaseUTC);
        }


        public bool validarXCupo(int idClase)
        {
            List<Clase> clienteInscripciones = GetAllClases();

            var clase = clienteInscripciones.FirstOrDefault(c => c.Id == idClase);

            return clase != null && clase.Cupos > 0;
        }

        public int UpdateCupo(int idClase)
        {
            ClaseCrudFactory claseCrud = new ClaseCrudFactory();
            return claseCrud.UpdateCupo(idClase);
        }
    }
}
