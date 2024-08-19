using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class LoggedUser:SaltData
    {
        public string Email { get; set; }
        public string RolUsuario { get; set; }
        public string Contrasena { get; set; }
        public string Estado { get; set; }
    }
}
