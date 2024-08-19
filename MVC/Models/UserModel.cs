namespace MVC.Models
{
    //Estos modelos se enfocan solo en lo necesario para la logica de la vista
    //Los DTO si reciben todos los atributos null de la tabla sql de herencia
    public class UserModel
    {
        public int Cedula { get; set; } // cedula es un int pero un varchar en la bd
        public string RolUsuario { get; set; }
        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }        
        public float? TarifaHoraEntrenadorPersonal { get; set; }
        public string? TipoEntrenador { get; set; }
        public bool Estado { get; set; }
        public int? IdMembresia { get; set; }
        public DateTime FechaPago { get; set; }



    }
}
