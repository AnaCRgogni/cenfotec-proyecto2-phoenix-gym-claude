namespace DTO
{
  public class Passwords : BaseClass
  {
    public string Cedula { get; set; }
    public byte[] PasswordHash { get; set; }
    public byte[] Salt { get; set; }
    public DateTime FechaCambio { get; set; }
  }
}
