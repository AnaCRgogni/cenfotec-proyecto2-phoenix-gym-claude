namespace DTO
{
    public class MedicionCliente : BaseClass
    {
        public string Nombre { get; set; }
        public string Cedula { get; set; }
        public string Email { get; set; }
        public int idMembresia { get; set; }
        public string? RolUsuario { get; set; }
    }
}
