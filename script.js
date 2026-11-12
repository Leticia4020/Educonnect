
// PROTÓTIPO DE TREINAMENTO: versão corrigida e integrada.

const formulario = document.querySelector('#form-cadastro');
const lista = document.querySelector('#lista');
const busca = document.querySelector('#busca');
const total = document.querySelector('#total');
const aviso = document.querySelector('#aviso');
const vazio = document.querySelector('#vazio');
const iconeLupa = document.getElementById('icone-lupa-clicavel');
const btnLimpar = document.getElementById('limpar');

let interessados = [];
let proximoId = 1;

function criarTexto(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) elemento.className = classe;

  elemento.textContent = texto;

  return elemento;
}

function desenharLista() {
  lista.replaceChildren();

  const pesquisa = busca.value.toLowerCase().trim();

  // Exibe somente quando o nome completo for digitado
  const filtrados = interessados.filter(pessoa =>
    pessoa.nome.toLowerCase() === pesquisa
  );

  filtrados.forEach(pessoa => {
    const item = criarTexto('li', 'registro', '');

    const informacoes = document.createElement('div');

    informacoes.append(
      criarTexto('strong', '', pessoa.nome || '(sem nome)'),
      criarTexto('small', '', pessoa.email),
      criarTexto('small', '', pessoa.curso || '(sem curso)')
    );

    const botao = criarTexto('button', 'excluir', 'Excluir');

    botao.type = 'button';
    botao.dataset.identificador = String(pessoa.id);

    botao.addEventListener('click', () =>
      excluirInteressado(botao.dataset.identificador)
    );

    item.append(informacoes, botao);

    lista.appendChild(item);
  });

  total.textContent = `${interessados.length} registro${interessados.length !== 1 ? 's' : ''}`;

  vazio.hidden = filtrados.length > 0;
}

function excluirInteressado(id) {
  interessados = interessados.filter(
    pessoa => String(pessoa.id) !== String(id)
  );

  aviso.textContent = 'Registro excluído.';

  desenharLista();
}

// Cadastro de interessados
formulario.addEventListener('submit', evento => {
  evento.preventDefault();

  const nome = document.querySelector('#nome').value.trim();
  const email = document.querySelector('#email').value.trim();
  const curso = document.querySelector('#curso').value;

  if (!nome || !email || !curso) {
    aviso.textContent = 'Preencha todos os campos.';
    return;
  }

  // Validação do nome
  if (!/^[\p{L}\s'-]+$/u.test(nome)) {
    aviso.textContent = 'Digite um nome válido.';
    return;
  }

  // Validação do e-mail
  if (!document.querySelector('#email').checkValidity()) {
    aviso.textContent = 'Digite um e-mail válido.';
    return;
  }

  interessados.push({
    id: proximoId++,
    nome,
    email,
    curso
  });

  aviso.textContent = 'Interessado cadastrado com sucesso!';

  formulario.reset();

  desenharLista();
});

// Funcionalidade da lupa
if (iconeLupa && busca) {
  iconeLupa.addEventListener('click', () => {
    busca.focus();
  });
}

// BOTÃO LIMPAR PESQUISA
if (btnLimpar && busca) {
  btnLimpar.addEventListener('click', evento => {
    evento.preventDefault();

    busca.value = '';

    desenharLista();

    aviso.textContent = 'Pesquisa limpa com sucesso!';

    busca.focus();
  });
}

// Pesquisa pelo nome completo
busca.addEventListener('input', desenharLista);

// Inicializa a lista
desenharLista();

formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  const nome = document.querySelector('#nome').value.trim();
  const email = document.querySelector('#email').value.trim();
  const curso = document.querySelector('#curso').value;

  const validarNome =/^[\p{L}\s]+$/u;;
  if (!validarNome.test(nome)) {
    aviso.textContent ='Incorreto. Digite sem números e caracteres especiais';
    aviso.className='aviso-erro';
    return;
  }

  interessados.push({ id: proximoId++, nome, email, curso });
  aviso.textContent = 'Interessado cadastrado com sucesso!';
  aviso.className='aviso-certo';
  formulario.reset();
  desenharLista();
});

busca.addEventListener('input', desenharLista);
desenharLista();
