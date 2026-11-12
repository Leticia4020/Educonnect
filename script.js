const formulario = document.querySelector('#form-cadastro');
const lista = document.querySelector('#lista');
const busca = document.querySelector('#busca');
const total = document.querySelector('#total');
const aviso = document.querySelector('#aviso');
const vazio = document.querySelector('#vazio');
const iconeLupa = document.getElementById('icone-lupa-clicavel');
const btnLimpar = document.getElementById('limpar');
const modalEditar = document.querySelector('#modal-editar');
const formEditar = document.querySelector('#form-editar');
const editarNome = document.querySelector('#editar-nome');
const editarEmail = document.querySelector('#editar-email');
const editarCurso = document.querySelector('#editar-curso');
const cancelarEdicao = document.querySelector('#cancelar-edicao');

let interessados = [];
let proximoId = 1;
let idEditando = null;

function criarTexto(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) {
    elemento.className = classe;
  }

  elemento.textContent = texto;

  return elemento;
}

function desenharLista() {
  lista.replaceChildren();

  const pesquisa = busca.value.trim().toLowerCase();

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

    const btnEditar = criarTexto('button', 'editar', 'Editar');
    btnEditar.type = 'button';

    btnEditar.addEventListener('click', () => {
      carregarCadastro(pessoa.id);
    });

    const btnExcluir = criarTexto('button', 'excluir', 'Excluir');
    btnExcluir.type = 'button';

    btnExcluir.addEventListener('click', () => {
      excluirInteressado(pessoa.id);
    });

    const botoes = document.createElement('div');

    botoes.append(btnEditar, btnExcluir);

    item.append(informacoes, botoes);

    lista.appendChild(item);
  });

  total.textContent = `${interessados.length} registro${interessados.length !== 1 ? 's' : ''}`;

  vazio.hidden = filtrados.length > 0;
}

formulario.addEventListener('submit', evento => {
  evento.preventDefault();

  const nome = document.querySelector('#nome').value.trim();
  const email = document.querySelector('#email').value.trim();
  const curso = document.querySelector('#curso').value;

  if (!nome || !email || !curso) {
    aviso.textContent = 'Preencha todos os campos.';
    aviso.className = 'aviso-erro';
    return;
  }

  const validarNome = /^[\p{L}\s'-]+$/u;

  if (!validarNome.test(nome)) {
    aviso.textContent = 'Incorreto. Digite sem números e caracteres especiais.';
    aviso.className = 'aviso-erro';
    return;
  }

  if (!document.querySelector('#email').checkValidity()) {
    aviso.textContent = 'Digite um e-mail válido.';
    aviso.className = 'aviso-erro';
    return;
  }

  if (idEditando !== null) {
    interessados = interessados.map(pessoa => {
      if (pessoa.id === idEditando) {
        return { ...pessoa, nome, email, curso };
      }

      return pessoa;
    });

    aviso.textContent = 'Cadastro atualizado com sucesso!';
    idEditando = null;

  } else {
    interessados.push({
      id: proximoId++,
      nome,
      email,
      curso
    });

    aviso.textContent = 'Interessado cadastrado com sucesso!';
  }

  aviso.className = 'aviso-certo';

  formulario.reset();

  busca.value = '';

  lista.replaceChildren();

  vazio.hidden = false;

  desenharLista();
});

function carregarCadastro(id) {
  const pessoa = interessados.find(pessoa => pessoa.id === id);

  if (!pessoa) return;

  idEditando = id;

  editarNome.value = pessoa.nome;
  editarEmail.value = pessoa.email;
  editarCurso.value = pessoa.curso;

  modalEditar.classList.add('ativo');
}

function excluirInteressado(id) {
  interessados = interessados.filter(pessoa => pessoa.id !== id);

  if (idEditando === id) {
    idEditando = null;
    formulario.reset();
  }

  aviso.textContent = 'Registro excluído.';
  aviso.className = 'aviso-certo';

  desenharLista();
}

if (iconeLupa && busca) {
  iconeLupa.addEventListener('click', () => {
    desenharLista();
  });
}

if (btnLimpar && busca) {
  btnLimpar.addEventListener('click', evento => {
    evento.preventDefault();

    busca.value = '';

    lista.replaceChildren();

    vazio.hidden = false;

    total.textContent = `${interessados.length} registro${interessados.length !== 1 ? 's' : ''}`;

    aviso.textContent = 'Pesquisa limpa com sucesso!';
    aviso.className = 'aviso-certo';

    busca.focus();
  });
}

desenharLista();
formEditar.addEventListener('submit', evento => {
  evento.preventDefault();

  const nome = editarNome.value.trim();
  const email = editarEmail.value.trim();
  const curso = editarCurso.value;

  const validarNome = /^[\p{L}\s'-]+$/u;

  if (!nome || !email || !curso) {
    alert('Preencha todos os campos.');
    return;
  }

  if (!validarNome.test(nome)) {
    alert('Digite um nome válido, sem números ou caracteres especiais.');
    return;
  }

  if (!editarEmail.checkValidity()) {
    alert('Digite um e-mail válido.');
    return;
  }

  interessados = interessados.map(pessoa => {
    if (pessoa.id === idEditando) {
      return { ...pessoa, nome, email, curso };
    }

    return pessoa;
  });

  idEditando = null;

  modalEditar.classList.remove('ativo');

  formEditar.reset();

  busca.value = '';

  aviso.textContent = 'Cadastro atualizado com sucesso!';
  aviso.className = 'aviso-certo';

  desenharLista();
});

cancelarEdicao.addEventListener('click', () => {
  modalEditar.classList.remove('ativo');

  formEditar.reset();

  idEditando = null;
});
