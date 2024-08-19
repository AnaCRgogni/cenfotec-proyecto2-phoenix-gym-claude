using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;
using DataAccess.Crud;
using AppLogic;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ViewUsersController : ControllerBase
    {
        [HttpGet]
        public List<MedicionCliente> GetMedicionCliente()
        {
            ViewUsersManager am = new ViewUsersManager();

            return am.GetAllViewUsers();
        }
        [HttpGet]
        public List<MedicionCliente> GetMedicionUsers()
        {
            ViewUsersManager am = new ViewUsersManager();

            return am.GetAllViewUsers2();
        }
    }
}
