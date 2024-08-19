namespace DTO
{
    public class Rutina : BaseClass
    {
        public string Name { get; set; }
        public string Fecha { get; set; }
        public string IdUsuario { get; set; }
        public string IdCliente { get; set; }
        public List<Set> Sets { get; set; }

    }

}

