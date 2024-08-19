namespace MVC.Models
{
    public class EntrenadorModel
    {
        public int? Id { get; set; }
        public string cedula { get; set; }
        public string? RolUsuario { get; set; }
        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }
        public string Email { get; set; }
        public string Contrasena { get; set; }
        public string Telefono { get; set; }
        //Parece que SQL server no entiende DateOnly y habría que hacer la conversión igual
        public DateTime FechaNacimiento { get; set; }
        public string tipoEntrenador { get; set; }
        public float? tarifaHoraEntrenadorPersonal { get; set; }
    }
}
