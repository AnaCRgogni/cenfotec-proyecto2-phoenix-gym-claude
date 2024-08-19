using Microsoft.AspNetCore.Mvc;
using MVC.Models;

namespace MVC.Controllers
{
    public class RecepcionistaController : Controller
    {
        public IActionResult VerCuenta()
        {
            return View();
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult CitasMedicion()
        {
            return View();
        }
        public IActionResult Clases()
        {
            return View();
        }
        public IActionResult Clientes()
        {
            return View();
        }
        public IActionResult Pagos()
        {
            return View();
        }
        public IActionResult ManejoDeCuentas(EntrenadorModel entrenador)
        {
            return View(entrenador);
        }
        public IActionResult ViewClient()
        {
            return View();
        }

        public IActionResult PerfilUser()
        {
            return View();
        }
    }
}
