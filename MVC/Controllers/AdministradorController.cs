using Microsoft.AspNetCore.Mvc;
using MVC.Models;

namespace MVC.Controllers
{
    public class AdministradorController : Controller
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
        public IActionResult Pagos()
        {
            return View();
        }
        public IActionResult Usuarios()
        {
            return View();
        }

        public IActionResult Mensualidad()
        {
            return View();
        }

        public IActionResult Descuentos()
        {
            return View();
        }

        public IActionResult CreateRecepcionista(RecepcionistaModel recepcionista)
        {
            return View(recepcionista);
        }

        public IActionResult PerfilUser()
        {
            return View();
        }
        public IActionResult CreateEntrenador(EntrenadorModel entrenador)
        {
            return View();
        }
        
        public IActionResult Rutinas()
        {
            return View();
        }

        public IActionResult Ejercicios()
        {
            return View();
        }
        public IActionResult Equipo()
        {
            return View();
        }
    }
}
