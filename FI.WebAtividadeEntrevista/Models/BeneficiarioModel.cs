using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FI.WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string CPF { get; set; }

        public long IdCliente { get; set; }
    }
}