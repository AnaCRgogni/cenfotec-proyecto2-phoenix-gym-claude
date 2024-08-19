namespace MVC.Models
{

  public class ResetPasswordModel
  {
    public string Token { get; set; }
    public string Email { get; set; }
    public string PasswordString { get; set; }
    public string Password { get; set; }
    public string ConfirmPassword { get; set; }
    public string SaltValue { get; set; }
  }
}