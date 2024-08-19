using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class PayPalJson
    {
        public string intent { get; set; }

        public List<PurchaseUnit> purchase_units { get; set; }

    }
}
