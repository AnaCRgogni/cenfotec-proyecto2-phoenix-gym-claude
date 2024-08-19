namespace DTO
{
    public class Sinpe
    {
        public string Nombre { get; set; }
        public string? Cedula { get; set; }
        public string? Comprobante { get; set; }
        public DateTime FechaPago { get; set; }
        public bool? EstadoUsuario { get; set; }
        public bool? EstadoPago { get; set; }
        public float Total { get; set; }
    }         
}
