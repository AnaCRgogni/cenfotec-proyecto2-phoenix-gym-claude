using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class ApiResponse
    {
        public string StatusCode { get; set; }
        public string Message { get; set; }
        public string Content { get; set; }
    }
}
