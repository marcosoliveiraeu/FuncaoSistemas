using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FI.WebAtividadeEntrevista.Util
{
    public static class Validador
    {
        public static bool ValidarCPF(string cpf)
        {
            // Remove caracteres especiais
            cpf = cpf.Replace(".", "").Replace("-", "").Trim();

            // Verifica se o CPF tem 11 dígitos
            if (cpf.Length != 11 || !cpf.All(char.IsDigit))
                return false;

            // Cálculo do primeiro dígito verificador
            int[] numeros = cpf.Select(c => int.Parse(c.ToString())).ToArray();
            int soma = 0;
            for (int i = 0; i < 9; i++)
                soma += numeros[i] * (10 - i);

            int primeiroDigito = (soma * 10) % 11;
            if (primeiroDigito == 10 || primeiroDigito == 11)
                primeiroDigito = 0;

            if (primeiroDigito != numeros[9])
                return false;

            // Cálculo do segundo dígito verificador
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += numeros[i] * (11 - i);

            int segundoDigito = (soma * 10) % 11;
            if (segundoDigito == 10 || segundoDigito == 11)
                segundoDigito = 0;

            return segundoDigito == numeros[10];
        }
    }

}