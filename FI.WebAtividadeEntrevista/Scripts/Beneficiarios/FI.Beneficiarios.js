
// array com os beneficiarios que estão salvos no banco de dados
let beneficiariosOriginais = [];

// array que será manipulado no frontEnd . Quando salvar o cliente,
//o sistema verifica se teve alteração com relação ao original
let beneficiariosAlterados = [];

function salvarBeneficiario() {

    const beneficiarioId = $('#beneficiarioId').val();
    const tempId = $('#tempId').val();
    const cpf = removerMascaraCPF($('#cpfBeneficiario').val());
    const nome = $('#nomeBeneficiario').val();

    if (!cpf || !nome) {        
        ModalDialog("Ocorreu um erro", "Por favor, preencha todos os campos.");
        return;
    }

    if (!validarCPF(cpf)) {
        ModalDialog("Ocorreu um erro", "O CPF informado é inválido.");
        return;
    }

    
    if (beneficiarioId === '' ) {

        //Incluir Beneficiario no array
        
        const cpfExistente = beneficiariosAlterados.some(b => b.CPF === cpf);
        if (cpfExistente) {
            ModalDialog("Ocorreu um erro", "Já existe um beneficiario cadastrado com esse CPF.");
            return;
        }

        const novoBeneficiario = {
            Id: 0,
            CPF: cpf,
            Nome: nome,
            IdCliente: 0,
            TempId: gerarIdAleatorio()
        };

        beneficiariosAlterados.push(novoBeneficiario);

    }
    else if (tempId != '' && beneficiarioId === '0' ) {

        //Edição de beneficario que ainda não tem Id criado no bando de dados

        const cpfExistente = beneficiariosAlterados.some(b => b.CPF === cpf && b.TempId !== tempId);
        if (cpfExistente) {
            ModalDialog("Ocorreu um erro", "Já existe um beneficiario cadastrado com esse CPF.");
            return;
        }

        const beneficiario = beneficiariosAlterados.findIndex(b => b.TempId === tempId);


        beneficiariosAlterados[beneficiario].CPF = cpf;
        beneficiariosAlterados[beneficiario].Nome = nome;

    }
    else
    {
        // Editar Beneficiario que já existe no banco de dados

        const beneficiarioIndex = beneficiariosAlterados.findIndex(b => b.Id === parseInt(beneficiarioId));

        if (beneficiarioIndex === -1) {
            ModalDialog("Ocorreu um erro", "Beneficiário não encontrado.");
            return;
        }

        // Verificar se o CPF 
        const cpfExistente = beneficiariosAlterados.some(b => b.CPF === cpf && b.Id !== parseInt(beneficiarioId));
        if (cpfExistente) {
            ModalDialog("Ocorreu um erro", "Já existe um beneficiário cadastrado com esse CPF.");
            return;
        }

        beneficiariosAlterados[beneficiarioIndex].CPF = cpf;
        beneficiariosAlterados[beneficiarioIndex].Nome = nome;
                
    }

    limparCamposBeneficiario();
    renderBeneficiariosTable(beneficiariosAlterados);

    
}

function gerarIdAleatorio() {

    // essa função auxilia a manipulação dos beneficiarios que foram salvos no array 
    // temporario , mas ainda não tem um id na tabela beneficiarios por não terem sido salvos em Incluir/Alterar Cliente

    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let idAleatorio = '';
    for (let i = 0; i < 5; i++) {
        idAleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return idAleatorio;
}

function renderBeneficiariosTable(beneficiarios) {

    // função que recarrega a <table> dentro do modal de cadastro/manutenção de beneficiários

    let tableBody = $('#beneficiariosList');
    tableBody.empty();

    
    beneficiarios.forEach(beneficiario => {

        tableBody.append(`
            <tr>
                <td>${formatarCPFStatic(beneficiario.CPF)}</td>
                <td>${beneficiario.Nome}</td>
                <td>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-sm btn-primary me-2" onclick="carregarBeneficiario(${beneficiario.CPF})">Alterar</button>
                        <button class="btn btn-sm btn-danger" onclick="excluirBeneficiario(${beneficiario.CPF})">Excluir</button>
                    </div>
                </td>
            </tr>
        `);
    });
}



function excluirBeneficiario(beneficiarioCPF) {

    const beneficiario = beneficiariosAlterados.findIndex(b => b.CPF.trim() === String(beneficiarioCPF).trim());

    if (beneficiario !== -1)
    {
        beneficiariosAlterados.splice(beneficiario, 1);
    }
    else
    {
        ModalDialog("Ocorreu um erro", "Beneficiário não encontrado.");
        return;
    }

    limparCamposBeneficiario();

    renderBeneficiariosTable(beneficiariosAlterados);

}

function carregarBeneficiario(beneficiarioCPF) {

    // carrega na tela os dados do Beneficiario que foi selecionado para edição

    const beneficiario = beneficiariosAlterados.find(b => b.CPF.trim() === String(beneficiarioCPF).trim());

    if (beneficiario) {       
        $('#beneficiarioId').val(beneficiario.Id);
        $('#tempId').val(beneficiario.TempId);
        $('#cpfBeneficiario').val(formatarCPFStatic(beneficiario.CPF));
        $('#nomeBeneficiario').val(beneficiario.Nome);
        $('#btnIncluirBeneficiario').text('Salvar'); 
    } else {
        console.error('Beneficiário não encontrado.');
    }
}


$(document).ready(function () {
   
    $('#beneficiariosModal').on('show.bs.modal', function () {
        limparCamposBeneficiario();
    });

});

function limparCamposBeneficiario() {

    $('#cpfBeneficiario').val('');
    $('#nomeBeneficiario').val('');
    $('#beneficiarioId').val('');
    $('#tempId').val('');
    $('#btnIncluirBeneficiario').text('Incluir');

}

function getAlteracoes() {

    //    Função que cria as listas para passar para a controller 
    // todas as alterações realizadas nos beneficiários

    const novos = [];
    const alterados = [];
    const excluidos = [];

    const originaisMap = new Map(beneficiariosOriginais.map(b => [b.Id, b]));

    // Verificar alterações e novos beneficiários
    beneficiariosAlterados.forEach(beneficiario => {
        if (beneficiario.Id === 0) {
            // Novo beneficiário
            novos.push(beneficiario);
        } else {
            const beneficiarioOriginal = originaisMap.get(beneficiario.Id);
            if (beneficiarioOriginal &&
                (beneficiarioOriginal.Nome !== beneficiario.Nome || beneficiarioOriginal.CPF !== beneficiario.CPF)) {
                // Beneficiário alterado
                alterados.push(beneficiario);
            }
            originaisMap.delete(beneficiario.Id);
        }
    });

    // Qualquer item restante no map original foi excluído
    originaisMap.forEach((beneficiarioOriginal) => {
        excluidos.push(beneficiarioOriginal);
    });

    return { novos, alterados, excluidos };
}


function validarCPF(cpf) {
    // Remove qualquer caractere que não seja número
    cpf = cpf.replace(/[^\d]+/g, '');

    // Verifica se o CPF tem 11 dígitos ou se é uma sequência de dígitos repetidos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let primeiroDigitoVerificador = 11 - (soma % 11);
    if (primeiroDigitoVerificador >= 10) primeiroDigitoVerificador = 0;
    if (primeiroDigitoVerificador !== parseInt(cpf.charAt(9))) {
        return false;
    }

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let segundoDigitoVerificador = 11 - (soma % 11);
    if (segundoDigitoVerificador >= 10) segundoDigitoVerificador = 0;
    if (segundoDigitoVerificador !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}


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