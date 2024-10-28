
$(document).ready(function () {

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);
        $('#formCadastro #Id').val(obj.Id);
    }

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
            "CPF": $(this).find("#CPF").val(),
            "Id" : $(this).find("#Id").val()
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
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();                                
                window.location.href = urlRetorno;
            }
        });
    })

    $('#beneficiariosModal').on('show.bs.modal', function () {
        let cpfCliente = removerMascaraCPF($('#CPF').val()); 

        if (beneficiariosOriginais.length === 0 && beneficiariosAlterados.length === 0) {

            $.ajax({
                url: urlListBeneficiarios, // retorna os beneficiarios por CPF do cliente
                type: 'GET',
                data: { cpf: cpfCliente },
                success: function (data) {
                    renderBeneficiariosTable(data);
                    beneficiariosOriginais = JSON.parse(JSON.stringify(data));
                    beneficiariosAlterados = JSON.parse(JSON.stringify(data));
                }
            });

        }
    });

       
    $('#btnIncluirBeneficiario').on('click', salvarBeneficiario);

    
})

document.addEventListener("DOMContentLoaded", function () {

    const cpfInput = document.getElementById("CPF");
    if (cpfInput && obj.CPF) {
        var cpfformatado = formatarCPFStatic(String(obj.CPF));
        setTimeout(function () {
            cpfInput.value = cpfformatado;
        }, 50);
    }

    const cpfBeneficiario = document.getElementById("cpfBeneficiario");
    aplicarMascaraCPF(cpfBeneficiario);

});


function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade" tabindex="-1" role="dialog">                                                               ' +
        '        <div class="modal-dialog" role="document">                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <h5 class="modal-title">' + titulo + '</h5>                                                    ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">                   ' +
        '                       <span aria-hidden="true">&times;</span>                                                     ' +
        '                    </button>                                                                                      ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>           ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);

    var $modal = $('#' + random);


    $modal.modal('show');

    $modal.on('hidden.bs.modal', function () {
        $modal.remove();
    });
}


