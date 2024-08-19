using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class Descuento:BaseClass
    {
        public string Codigo { get; set; }
        public float Porcentaje { get; set; }
        public bool Estado { get; set; }
    }
}
