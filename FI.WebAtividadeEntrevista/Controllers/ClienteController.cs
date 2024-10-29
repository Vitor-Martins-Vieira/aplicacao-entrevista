using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using System.Text;

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
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente boCli = new BoCliente();
            BoBeneficiario boBen = new BoBeneficiario();
            string[] cpfComErro = { };
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
                
                model.Id = boCli.Incluir(new Cliente()
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
                    CPF = model.CPF
                });

                if (model.Id == 0)
                {
                    Response.StatusCode = 400;
                    return Json("CPF já cadastrado.");
                }
                else if(model.Id != 0 && model.Beneficiarios.Length > 0)
                {
                
                    foreach(BeneficarioModel beneficario in model.Beneficiarios)
                    {
                        long idRetorno = boBen.Incluir(new Beneficiario() 
                        {
                            CPF = beneficario.CPF, 
                            Nome = beneficario.Nome, 
                            IdCliente = model.Id 
                        });
                        if (idRetorno == 0)
                        {
                            cpfComErro.Append(beneficario.CPF);
                        }
                    }
                }

                if(cpfComErro.Length == 0)
                    return Json("Cadastro efetuado com sucesso");
                else
                {
                    StringBuilder retorno = new StringBuilder();
                    bool maisDeUm = cpfComErro.Length > 1;
                    retorno.Append("Cadastro efetuado com sucesso.")
                        .Append(maisDeUm ? "Os beneficiarios" : "O beneficiario")
                        .Append("com cpf:");
                    for (int i = 0; i < cpfComErro.Length; i++)
                    {
                        string cpfAtual = cpfComErro[i];
                        retorno.Append($"{cpfAtual.Substring(0, 3)}.{cpfAtual.Substring(3, 3)}.{cpfAtual.Substring(6, 3)}-{cpfAtual.Substring(9, 2)}");
                        if (i == cpfComErro.Length - 2)
                        {
                            retorno.Append(" e ");
                        }
                        else if(i != cpfComErro.Length - 1)
                        {
                            retorno.Append(' ');
                        }
                    }
                    retorno.Append(maisDeUm ? " não puderam ser incluídos." : "não pôde ser incluído.");
                    return Json(retorno.ToString());
                }

            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
       
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
                    Telefone = model.Telefone
                });
                               
                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

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
                    Telefone = cliente.Telefone
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
    }
}