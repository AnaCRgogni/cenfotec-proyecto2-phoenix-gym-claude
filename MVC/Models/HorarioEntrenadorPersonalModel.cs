namespace MVC.Models
{
    public class HorarioEntrenadorPersonalModel
    {
        public int? Id { get; set; }
        public string Cedula { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string? Type { get; set; } = "Disponibilidad";
        public bool? EveryYear { get; set; } = false;
        public string? Color { get; set; } = "#04E90C";
        public string? Nombre { get; set; }
        public string? Apellido1 { get; set; }
        public string? Apellido2 { get; set; }
        public string? Description { get; set; }
    }
}
