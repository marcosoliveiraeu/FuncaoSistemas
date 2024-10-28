
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        const clienteModel = {
            "Nome": $(this).find("#Nome").val(),
            "Cep": $(this).find("#CEP").val(),
            "Email": $(this).find("#Email").val(),
            "Sobrenome": $(this).find("#Sobrenome").val(),
            "Nacionalidade": $(this).find("#Nacionalidade").val(),
            "Estado": $(this).find("#Estado").val(),
            "Cidade": $(this).find("#Cidade").val(),
            "Logradouro": $(this).find("#Logradouro").val(),
            "Telefone": $(this).find("#Telefone").val(),
            "CPF": $(this).find("#CPF").val()
        };

        const { novos, alterados, excluidos } = getAlteracoes(beneficiariosOriginais, beneficiariosAlterados);

        const beneficiarioAlteracoes = {
            novos: novos,
            alterados: alterados,
            excluidos: excluidos
        };

        $.ajax({
            url: urlPost,
            method: "POST",
            contentType: "application/json; charset=utf-8", 
            dataType: "json", 
            data: JSON.stringify({ model: clienteModel, beneficiarioAlteracoes: beneficiarioAlteracoes }),
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 409)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
            }
        });
               
    })

    $('#btnIncluirBeneficiario').on('click', salvarBeneficiario);

    
})

document.addEventListener("DOMContentLoaded", function () {
    const cpfInput = document.getElementById("CPF");
    aplicarMascaraCPF(cpfInput);

    var cpfBeneficiario = document.getElementById("cpfBeneficiario");
    aplicarMascaraCPF(cpfBeneficiario);
});

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}











