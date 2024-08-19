namespace DTO
{
    public class Entrenador : BaseUserClass
    {
        public string TipoEntrenador {  get; set; }
        public float? TarifaHoraEntrenadorPersonal { get; set; }
        public bool Estado { get; set; }
    }
}
