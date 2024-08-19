using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class ResultadoSets: BaseClass
    {
        public float Sets { get; set; }
        public float Peso { get; set; }
        public float Tiempo { get; set; }
        public int IdEjercicios { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; } 
        public string Imagen { get; set; }
        public string Equipo { get; set; }
        
    }
}
