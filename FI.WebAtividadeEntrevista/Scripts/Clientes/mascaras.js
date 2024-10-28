

function aplicarMascaraCPF(input) {

    function formatarCPF(valor) {
        valor = valor.replace(/\D/g, '');
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return valor;
    }

    input.value = formatarCPF(input.value);
    input.addEventListener("input", function () {
        input.value = formatarCPF(input.value);
    });

}


function formatarCPFStatic(valor) {
    if (!valor || valor.length !== 11) return valor; 

    valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    return valor;
}


function removerMascaraCPF(cpf) {
    if (typeof cpf !== "string") {
        console.error("Valor inválido:", cpf);
        return cpf;
    }
    return cpf.replace(/\D/g, ""); // Remove tudo que não é dígito
}