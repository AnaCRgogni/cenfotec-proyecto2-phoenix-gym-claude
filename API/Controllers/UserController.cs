using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public ActionResult<User> GetUsersValue(string cedula)
        {
            UserManager manager = new UserManager();
            User user = manager.GetUser(cedula);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }
        [HttpPut("{cedula}")]
        public IActionResult UpdateUser(User user)
        {
            UserManager manager = new UserManager();
            manager.UpdateUser(user);
            return Ok(user);
        }
        [HttpGet]
        public ActionResult<User> GetUserNameByCedula(string cedula)
        {
            UserManager manager = new UserManager();
            return manager.GetUser(cedula);
        }
    }
}