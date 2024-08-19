namespace MVC.Models
{
    //Estos modelos se enfocan solo en lo necesario para la logica de la vista
    //Los DTO si reciben todos los atributos null de la tabla sql de herencia
    public class ClienteModel
    {
        public int? Id { get; set; }
        public string? RolUsuario { get; set; }
        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        //Parece que SQL server no entiende DateOnly y habría que hacer la conversión igual
        public DateTime FechaNacimiento { get; set; }
        public string Contrasena { get; set; }
        public string FotoIdCliente { get; set; }
        public string FotoPerfilCliente { get; set; }
        public string GeneroCliente { get; set; }
        public float MatriculaCliente { get; set; }
        public float MensualidadCliente { get; set; }
        public DateTime FechaPagoCliente { get; set; }
        public string StatusPagoCliente { get; set; }
    }
}
