namespace DTO
{
    public class User // esta es una clase maestra que hereda todos los atributos de un usuario ya creado para poder modificarlo
    {
        //Ponemos nullable los atributos que no corresponden a este tipo de usuario
        public string? Cedula { get; set; }
        public string? RolUsuario { get; set; }
        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string TipoEntrenador { get; set; }
        public float? TarifaHoraEntrenadorPersonal { get; set; }
        public int? IdMembresia { get; set; }
        public bool? Estado { get; set; }
    }
  
}
