using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DAL
{

    /// <summary>
    /// Classe de acesso a dados de beneficiario
    /// </summary>
    internal class DaoBeneficiario : AcessoDados
    {

        /// <summary>
        /// Inclui um novo beneficiario
        /// </summary>
        internal long Incluir(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome));
            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF));
            parametros.Add(new System.Data.SqlClient.SqlParameter("IdCliente", beneficiario.IdCliente));


            DataSet ds = base.Consultar("FI_SP_IncBeneficiario", parametros);
            long ret = 0;
            if (ds.Tables[0].Rows.Count > 0)
                long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
            return ret;
        }


        internal List<DML.Beneficiario> ConsultarPorCliente(string cpf)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", cpf));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiarioPorCliente", parametros);
            List<DML.Beneficiario> benef = Converter(ds);

            return benef;
        }

        internal DML.Beneficiario ConsultarPorId(long Id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", Id));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiarioPorId", parametros);
            List<DML.Beneficiario> benef = Converter(ds);

            return benef.FirstOrDefault();
        }

        private List<DML.Beneficiario> Converter(DataSet ds)
        {
            List<DML.Beneficiario> lista = new List<DML.Beneficiario>();
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    DML.Beneficiario benef = new DML.Beneficiario();
                    benef.Id = row.Field<long>("Id");
                    benef.Nome = row.Field<string>("Nome");
                    benef.CPF = row.Field<string>("CPF");
                    benef.IdCliente = row.Field<long>("idCliente");

                    lista.Add(benef);
                }
            }

            return lista;
        }


        //internal bool VerificarExistencia(string CPF , long Id)
        //{
        //    List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

        //    parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", CPF));
        //    parametros.Add(new System.Data.SqlClient.SqlParameter("ID", Id));

        //    DataSet ds = base.Consultar("FI_SP_VerificaBeneficiario", parametros);

        //    return ds.Tables[0].Rows.Count > 0;
        //}

        internal void Alterar(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();
                        
            parametros.Add(new System.Data.SqlClient.SqlParameter("ID", beneficiario.Id));
            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF));
            parametros.Add(new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome));

            base.Executar("FI_SP_AltBeneficiario", parametros);
        }

        internal void Excluir(long Id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", Id));

            base.Executar("FI_SP_DelBeneficiario", parametros);
        }

    }
}
