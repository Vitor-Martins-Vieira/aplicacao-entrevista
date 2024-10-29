$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "Cpf": LimparCpf($(this).find("#CPF").val()),
                "Beneficiarios": GetListaBeneficiarios(true)
            },
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
                }
        });
    })
    
})


function MascaraCPF(campo) {
    campo.value = campo.value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{2})$/, '$1-$2');
}

function VerificarCPF(campo) {
    if (campo.value.length < 14)
        return;

    let copiaCpfLimpo = LimparCpf(campo.value);
    let cpfSemVerf = copiaCpfLimpo.substring(0, 9)
    let dgtVerificadorUm = 0;
    let dgtVerificadorDois = 0;

    dgtVerificadorUm = FormulaCpfVerificador(1, cpfSemVerf);
    cpfSemVerf += dgtVerificadorUm;
    dgtVerificadorDois = FormulaCpfVerificador(2, cpfSemVerf);
    cpfSemVerf += dgtVerificadorDois
    if (copiaCpfLimpo == cpfSemVerf) {
        return;
    }
    else {
        ModalDialog("Atenção!", "O CPF informado é inválido. Por favor, verifique.");
        campo.value = '';
    };
}

function FormulaCpfVerificador(verificador, cpf) {
    let posicaoCpf = 0;
    let dgtVerificador = 0;
    for (let x = (9 + verificador); x >= 2; x--) {
        dgtVerificador += (parseInt(cpf[posicaoCpf]) * x);
        posicaoCpf++;
    }
    let dgtAux = dgtVerificador % 11
    if (dgtAux == 0 || dgtAux == 1) {
        dgtVerificador = 0
    }
    else {
        dgtVerificador = 11 - dgtAux
    }
    return dgtVerificador;
}
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

function AbrirModalBeneficiarios() {
    $('#modalBeneficiarios').modal('show');
}

function LimparCpf(cpf) {
    return cpf.replace(/\./g, '').replace('-', '');
}

function AdicionarBeneficario() {
    const table = document.getElementById("listBeneficarios").getElementsByTagName('tbody')[0];
    let nomeBeneficario = $("#NomeBeneficiario")[0];
    let cpfBeneficiario = $("#CPFBeneficiario")[0];
    let listaErros = [];
    let listaAtual = GetListaBeneficiarios();
    if (nomeBeneficario.value == '') {
        listaErros.push('nome');
    }

    if (cpfBeneficiario.value == '') {
        listaErros.push('CPF');
    }
    if (listaErros.length > 0) {
        let mensagemErro = listaErros.length > 1 ? 'Os campos' : 'O campo';
        for (let x = 0; x < listaErros.length; x++) {
            mensagemErro += " " + listaErros[x]
            if (x == 0 && listaErros.length > 1)
                mensagemErro += ' e ';
        }
        mensagemErro += listaErros.length > 1 ? " não foram informados." : " não foi informado.";
        mensagemErro += " Por favor, verifique.";
        ModalDialog("Atenção!", mensagemErro);
        return;
    }
    let obj = { nome: nomeBeneficario.value, cpf: cpfBeneficiario.value };
    if (!listaAtual.some(item => item.cpf === obj.cpf)) {
        listaAtual.push({ nome: nomeBeneficario.value, cpf: cpfBeneficiario.value });
        SetListBeneficiarios(listaAtual);
        PopularTabela();
        nomeBeneficario.value = '';
        cpfBeneficiario.value = '';
        return;
    }
    else {
        ModalDialog("Atenção!", "O beneficiário informado já foi adicionado. Por favor, verifique.");
        return;
    }


}

function PopularTabela() {

    const tableBody = document.getElementById('listBeneficarios').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    GetListaBeneficiarios().forEach((item, index) => {
        const newRow = tableBody.insertRow();

        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        cell1.innerHTML = item.nome;
        cell2.innerHTML = item.cpf;
        cell3.innerHTML = "<div style=\"padding-right: 0.5rem\"><button type=\"button\" class=\"btn btn-sm btn-primary\" onclick=\"AlterarBeneficario(this)\">Alterar</button></div>"
            + "<div style=\"padding-left: 0.5rem\"><button type=\"button\" class=\"btn btn-sm btn-primary\" onclick=\"RemoverBeneficario('" + item.cpf + "')\">Excluir</button></div>";
        cell3.style = 'display:flex';
    });
}

function GetListaBeneficiarios(montarObj = false) {
    if (montarObj) {
        let lista = $('#Beneficiarios')[0].value.length ? JSON.parse($('#Beneficiarios')[0].value) : [];
        if (lista.length) {
            let novaLista = []
            lista.forEach(x => {
                novaLista.push({ cpf: LimparCpf(x.cpf), nome: x.nome });
            })
            return novaLista;
        }
        else return [];
    }
    return $('#Beneficiarios')[0].value.length ? JSON.parse($('#Beneficiarios')[0].value) : [];
    
}

function SetListBeneficiarios(beneficiariosList) {
    return $('#Beneficiarios')[0].value = JSON.stringify(beneficiariosList);
}

function RemoverBeneficario(cpf) {
    let listaAtual = GetListaBeneficiarios();
    listaAtual.splice(listaAtual.indexOf(x => { x.cpf == cpf }), 1);
    SetListBeneficiarios(listaAtual);
    PopularTabela();
}
