using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using FI.WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model, BeneficiariosAlteracoesModel beneficiarioAlteracoes)
        {
            BoCliente bo = new BoCliente();

            if (!Validador.ValidarCPF(model.CPF))
            {
                ModelState.AddModelError("CPF", "O CPF informado é inválido.");                
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else 
            {
                try
                {

                    string cpfCliente = model.CPF.Replace(".", "").Replace("-", "");

                    if (bo.VerificarExistencia(cpfCliente))
                    {
                        Response.StatusCode = 409;
                        return Json("Erro ao incluir. CPF já cadastrado na base de dados.");
                    }


                    model.Id = bo.Incluir(new Cliente()
                    {
                        CEP = model.CEP,
                        Cidade = model.Cidade,
                        Email = model.Email,
                        Estado = model.Estado,
                        Logradouro = model.Logradouro,
                        Nacionalidade = model.Nacionalidade,
                        Nome = model.Nome,
                        Sobrenome = model.Sobrenome,
                        Telefone = model.Telefone,
                        CPF = cpfCliente
                    });

                    if (beneficiarioAlteracoes.Novos != null && beneficiarioAlteracoes.Novos.Any())
                    {
                        // Processar os novos beneficiários
                        foreach (var novoBeneficiario in beneficiarioAlteracoes.Novos)
                        {
                            bo.IncluirBeneficiario(new Beneficiario()
                            {
                                CPF = novoBeneficiario.CPF,
                                Nome = novoBeneficiario.Nome,
                                IdCliente = model.Id

                            });

                        }
                    }

                    return Json("Cadastro efetuado com sucesso");
                }
                catch (Exception ex) {

                    return Json("Ocorreu um erro ao salvar o cliente: " + ex.Message);

                }
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model, BeneficiariosAlteracoesModel beneficiarioAlteracoes)
        {
            BoCliente bo = new BoCliente();


            if (!Validador.ValidarCPF(model.CPF))
            {
                ModelState.AddModelError("CPF", "O CPF informado é inválido.");
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {

                try
                {
                    string cpfCliente = model.CPF.Replace(".", "").Replace("-", "");

                    bo.Alterar(new Cliente()
                    {
                        Id = model.Id,
                        CEP = model.CEP,
                        Cidade = model.Cidade,
                        Email = model.Email,
                        Estado = model.Estado,
                        Logradouro = model.Logradouro,
                        Nacionalidade = model.Nacionalidade,
                        Nome = model.Nome,
                        Sobrenome = model.Sobrenome,
                        Telefone = model.Telefone,
                        CPF = cpfCliente
                    });

                    if (beneficiarioAlteracoes.Novos != null && beneficiarioAlteracoes.Novos.Any())
                    {
                        // Processar os novos beneficiários
                        foreach (var novoBeneficiario in beneficiarioAlteracoes.Novos)
                        {
                            bo.IncluirBeneficiario(new Beneficiario()
                            {
                                CPF = novoBeneficiario.CPF,
                                Nome = novoBeneficiario.Nome,
                                IdCliente = model.Id

                            });

                        }
                    }

                    if (beneficiarioAlteracoes.Alterados != null && beneficiarioAlteracoes.Alterados.Any())
                    {
                        // Processar beneficiários alterados
                        foreach (var beneficiarioAlterado in beneficiarioAlteracoes.Alterados)
                        {
                            bo.AlterarBeneficiario(new Beneficiario()
                            {
                                Id = beneficiarioAlterado.Id,
                                CPF = beneficiarioAlterado.CPF,
                                Nome = beneficiarioAlterado.Nome,
                                IdCliente = model.Id
                            });
                        }
                    }

                    if (beneficiarioAlteracoes.Excluidos != null && beneficiarioAlteracoes.Excluidos.Any())
                    {
                        // Processar beneficiários excluídos
                        foreach (var beneficiarioExcluido in beneficiarioAlteracoes.Excluidos)
                        {

                            bo.ExcluirBeneficiario(beneficiarioExcluido.Id);

                        }
                    }

                    
                    return Json("Cadastro alterado com sucesso");

                }
                catch (Exception ex) 
                {
                    return Json(new { Result = "ERROR", message = "erro ao salvar cliente: " + ex.Message });
                }
            }
        }

        [HttpPost]
        public ActionResult Excluir(long id)
        {

            try
            {

                Console.WriteLine("entrou em excluir");

                BoCliente bo = new BoCliente();

                bo.Excluir(id);

                return Json(new { Result = "OK", message = "Cadastro excluído com sucesso" });
            }
            catch (Exception ex)
            {
                
                return Json(new { Result = "ERROR", message = "erro ao excluir: " + ex.Message });

            }

        }


        [HttpGet]
        public ActionResult Alterar(long id)
        {

         
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF
                };


            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {

                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult getBeneficiariosPorCliente(string cpf)
        {
            try
            {
                BoCliente bo = new BoCliente();
                var beneficiarios = bo.ConsultarBeneficiarioPorCliente(cpf);


                return Json(beneficiarios, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)  
            {
                return Json(new { Result = "ERROR", message = "erro : " + ex.Message });
            }

            
        }
    }
}