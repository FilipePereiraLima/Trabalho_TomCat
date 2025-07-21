// Configuração da API
const API_BASE_URL = 'http://localhost:8080/cadastro-pessoas/pessoas';

// Elementos do DOM
const formCadastro = document.getElementById('formCadastro');
const alertContainer = document.getElementById('alertContainer');
const listaPessoas = document.getElementById('listaPessoas');
const inputCpf = document.getElementById('cpf');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    carregarPessoas();
    configurarMascaraCPF();
});

formCadastro.addEventListener('submit', function(e) {
    e.preventDefault();
    cadastrarPessoa();
});

// Configurar máscara do CPF
function configurarMascaraCPF() {
    inputCpf.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        
        e.target.value = value;
    });
}

// Função para mostrar alertas
function mostrarAlerta(tipo, mensagem) {
    const alertHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show fade-in" role="alert">
            <strong>${tipo === 'success' ? '✅ Sucesso!' : '⚠️ Atenção!'}</strong> ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.innerHTML = alertHTML;
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let dv1 = resto < 2 ? 0 : resto;
    
    if (parseInt(cpf.charAt(9)) !== dv1) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let dv2 = resto < 2 ? 0 : resto;
    
    return parseInt(cpf.charAt(10)) === dv2;
}

// Função para cadastrar pessoa
async function cadastrarPessoa() {
    const nome = document.getElementById('nome').value.trim();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const cpf = document.getElementById('cpf').value.trim();
    
    // Validações frontend
    if (!nome) {
        mostrarAlerta('danger', 'Nome é obrigatório!');
        return;
    }
    
    if (!dataNascimento) {
        mostrarAlerta('danger', 'Data de nascimento é obrigatória!');
        return;
    }
    
    if (!cpf) {
        mostrarAlerta('danger', 'CPF é obrigatório!');
        return;
    }
    
    if (!validarCPF(cpf)) {
        mostrarAlerta('danger', 'CPF inválido! Verifique os números digitados.');
        return;
    }
    
    // Verificar se a data não é futura
    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    if (dataNasc > hoje) {
        mostrarAlerta('danger', 'Data de nascimento não pode ser futura!');
        return;
    }
    
    const pessoa = {
        nome: nome,
        datanascimento: dataNascimento,
        cpf: cpf
    };
    
    try {
        // Mostrar loading
        const btnSubmit = formCadastro.querySelector('button[type="submit"]');
        const originalText = btnSubmit.textContent;
        btnSubmit.textContent = '⏳ Cadastrando...';
        btnSubmit.disabled = true;
        
        const response = await fetch(`${API_BASE_URL}/pessoas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pessoa)
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarAlerta('success', data.message);
            limparFormulario();
            carregarPessoas();
        } else {
            mostrarAlerta('danger', data.message);
        }
        
        // Restaurar botão
        btnSubmit.textContent = originalText;
        btnSubmit.disabled = false;
        
    } catch (error) {
        console.error('Erro:', error);
        mostrarAlerta('danger', 'Erro ao conectar com o servidor. Verifique se a API está rodando.');
        
        // Restaurar botão
        const btnSubmit = formCadastro.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Cadastrar Pessoa';
        btnSubmit.disabled = false;
    }
}

// Função para carregar pessoas
async function carregarPessoas() {
    try {
        listaPessoas.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-2">Carregando pessoas...</p>
            </div>
        `;
        
        const response = await fetch(`${API_BASE_URL}/pessoas`);
        const pessoas = await response.json();
        
        if (pessoas.length === 0) {
            listaPessoas.innerHTML = `
                <div class="text-center text-muted">
                    <h5>📝 Nenhuma pessoa cadastrada</h5>
                    <p>Cadastre a primeira pessoa usando o formulário acima.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        pessoas.forEach((pessoa, index) => {
            const dataFormatada = new Date(pessoa.datanascimento + 'T00:00:00').toLocaleDateString('pt-BR');
            const idade = calcularIdade(pessoa.datanascimento);
            
            html += `
                <div class="pessoa-card fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="row">
                        <div class="col-md-8">
                            <h6 class="mb-1 text-primary">👤 ${pessoa.nome}</h6>
                            <small class="text-muted">
                                📅 ${dataFormatada} (${idade} anos) | 
                                🆔 ${pessoa.cpf}
                            </small>
                        </div>
                        <div class="col-md-4 text-md-end">
                            <small class="badge bg-primary">ID: ${pessoa.id}</small>
                        </div>
                    </div>
                </div>
            `;
        });
        
        listaPessoas.innerHTML = html;
        
    } catch (error) {
        console.error('Erro:', error);
        listaPessoas.innerHTML = `
            <div class="alert alert-danger">
                <strong>❌ Erro!</strong> Não foi possível carregar as pessoas cadastradas.
                <br><small>Verifique se a API está rodando em ${API_BASE_URL}</small>
            </div>
        `;
    }
}

// Função para calcular idade
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento + 'T00:00:00');
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    return idade;
}

// Função para limpar formulário
function limparFormulario() {
    formCadastro.reset();
    alertContainer.innerHTML = '';
}

// Função para formatar CPF
function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
