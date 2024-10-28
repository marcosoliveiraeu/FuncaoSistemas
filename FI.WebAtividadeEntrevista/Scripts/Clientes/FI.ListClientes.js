
$(document).ready(function () {

    if (document.getElementById("gridClientes"))
        $('#gridClientes').jtable({
            title: 'Clientes',
            paging: true, //Enable paging
            pageSize: 5, //Set page size (default: 10)
            sorting: true, //Enable sorting
            defaultSorting: 'Nome ASC', //Set default sorting
            actions: {
                listAction: urlClienteList,
            },
            fields: {
                Nome: {
                    title: 'Nome',
                    width: '40%'
                },
                Email: {
                    title: 'Email',
                    width: '30%'
                },
                Alterar: {
                    title: '',
                    width: '15%',
                    display: function (data) {
                        return '<button onclick="window.location.href=\'' + urlAlteracao + '/' + data.record.Id + '\'" class="btn btn-primary btn-sm">Alterar</button>';
                    }
                },
                Excluir: {
                    title: '',
                    width: '15%',
                    display: function (data) {
                        return '<button onclick="excluirCliente(' + data.record.Id + ')" class="btn btn-danger btn-sm">Excluir</button>';
                    }
                }
            }
        });




    //Load student list from server
    if (document.getElementById("gridClientes"))
        $('#gridClientes').jtable('load');
})


function excluirCliente(id) {

    // Abre o modal de confirmação
    $('#confirmarExclusaoModal').modal('show');

    // Ao clicar em "Excluir", envia a requisição para excluir o cliente
    $('#btnConfirmarExclusao').off('click').on('click', function () {
        $.ajax({
            url: '/Cliente/Excluir/' + id,
            type: 'POST',
            success: function (response) {
               
                $('#gridClientes').jtable('reload');
            },
            error: function (xhr, status, error) {
                alert('Erro ao tentar excluir o cliente: ' + error);
            }
        });
       
        $('#confirmarExclusaoModal').modal('hide');
    });


}