using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FI.WebAtividadeEntrevista.Models
{
    public class BeneficiariosAlteracoesModel
    {
        public List<BeneficiarioModel> Novos { get; set; }
        public List<BeneficiarioModel> Alterados { get; set; }
        public List<BeneficiarioModel> Excluidos { get; set; }
    }
}