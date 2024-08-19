using System.Data.SqlTypes;

namespace DTO
{

  public class ClasesXCliente : BaseClass
  {
    public int IdClase { get; set; }
    public string NombreClase { get; set; }
    public DateTime FechaClase { get; set; }
    public int Cupos { get; set; }
    public string IdCliente { get; set; }
    public int IdMembresia { get; set; }
    public int Estado { get; set; }
  }
}
