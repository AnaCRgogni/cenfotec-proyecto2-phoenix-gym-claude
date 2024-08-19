namespace MVC.Models
{
    //Estos modelos se enfocan solo en lo necesario para la logica de la vista
    //Los DTO si reciben todos los atributos null de la tabla sql de herencia
    public class RecepcionistaModel
    {
        public string Cedula { get; set; }
        public string? RolUsuario { get; set; }
        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }
        public string Email { get; set; }
        public string Contrasena { get; set; }
        public string Telefono { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string FotoIdCliente { get; set; }
        public string FotoPerfilCliente { get; set; }
        public string GeneroCliente { get; set; }
        public int IdMembresia { get; set; }
        public bool Estado { get; set; }

    }
}
