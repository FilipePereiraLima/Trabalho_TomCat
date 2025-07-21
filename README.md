📋 Sistema de Cadastro de Pessoas
Sistema completo de cadastro de pessoas com backend em Java Spring Boot e frontend responsivo. Permite cadastrar, listar e validar informações de pessoas incluindo nome, data de nascimento e CPF com validação.
🛠️ Tecnologias Utilizadas

Backend: Java 11, Spring Boot 2.7.14, Spring Data JPA
Frontend: HTML5, CSS3, JavaScript ES6, Bootstrap 5
Banco de Dados: PostgreSQL
Servidor: Apache Tomcat 9
Build: Maven

📁 Estrutura do Projeto
cadastro-pessoas/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── cadastro/
│   │       │           ├── CadastroApplication.java
│   │       │           ├── controller/
│   │       │           │   └── PessoaController.java
│   │       │           ├── model/
│   │       │           │   └── Pessoa.java
│   │       │           ├── repository/
│   │       │           │   └── PessoaRepository.java
│   │       │           └── config/
│   │       │               └── DatabaseConfig.java
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── target/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── database/
│   └── init.sql
└── README.md

🚀 Guia de Instalação e Deploy
1. 🐘 Configuração do PostgreSQL
Instalação no Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

Configuração do Banco:
sudo -u postgres psql

Execute os comandos SQL:
-- Criar database e usuário
CREATE DATABASE cadastro_pessoas;
CREATE USER cadastro_user WITH PASSWORD 'cadastro123';
GRANT ALL PRIVILEGES ON DATABASE cadastro_pessoas TO cadastro_user;
\q

Executar Script de Inicialização:
sudo -u postgres psql -d cadastro_pessoas -f database/init.sql


2. ☕ Configuração do Java e Maven
Instalação do Java 11:
sudo apt update
sudo apt install openjdk-11-jdk maven

Verificar versões:
java -version
mvn -version


3. 🦊 Instalação e Configuração do Tomcat 9
Download e Instalação:
# Baixar Tomcat
cd /tmp
wget https://downloads.apache.org/tomcat/tomcat-9/v9.0.89/bin/apache-tomcat-9.0.89.tar.gz

# Extrair
sudo tar -xzf apache-tomcat-9.0.89.tar.gz -C /opt/
sudo mv /opt/apache-tomcat-9.0.89 /opt/tomcat9

# Configurar permissões
sudo chown -R $USER:$USER /opt/tomcat9/
sudo chmod +x /opt/tomcat9/bin/*.sh

Configurar variáveis de ambiente:
echo 'export CATALINA_HOME=/opt/tomcat9' >> ~/.bashrc
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc

4. 🔧 Build e Deploy da Aplicação
Compilar o Backend:
cd cadastro-pessoas/backend
mvn clean package

Deploy no Tomcat:
# Parar Tomcat (se estiver rodando)
sudo /opt/tomcat9/bin/shutdown.sh

# Limpar deployments anteriores
sudo rm -rf /opt/tomcat9/webapps/cadastro-pessoas*
sudo rm -rf /opt/tomcat9/work/Catalina/localhost/cadastro-pessoas*
sudo rm -rf /opt/tomcat9/temp/*

# Deploy do Backend (WAR)
sudo cp target/cadastro-pessoas-1.0.0.jar /opt/tomcat9/webapps/cadastro-pessoas.war

# Deploy do Frontend
sudo rm -rf /opt/tomcat9/webapps/ROOT/*
sudo cp -r ../frontend/* /opt/tomcat9/webapps/ROOT/

# Corrigir permissões
sudo chown -R $USER:$USER /opt/tomcat9/webapps/

Configurar URL da API no Frontend:
# Editar arquivo da API
nano /opt/tomcat9/webapps/ROOT/js/app.js

# Alterar a linha:
const API_BASE_URL = 'http://localhost:8080/cadastro-pessoas';


5. 🚀 Iniciar a Aplicação
# Iniciar Tomcat
sudo /opt/tomcat9/bin/startup.sh

# Verificar se está rodando
ps aux | grep tomcat

# Verificar portas
sudo netstat -tlnp | grep java

# Acompanhar logs
tail -f /opt/tomcat9/logs/catalina.out


🌐 Acesso à Aplicação
URLs de Acesso:

Frontend: http://localhost:8080/
API Backend: http://localhost:8080/cadastro-pessoas/
Listar Pessoas: http://localhost:8080/cadastro-pessoas/pessoas


Testes de Funcionamento:
# Testar frontend
curl -I http://localhost:8080/

# Testar API
curl http://localhost:8080/cadastro-pessoas/pessoas

# Testar cadastro via API
curl -X POST http://localhost:8080/cadastro-pessoas/pessoas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Usuario","datanascimento":"1990-01-01","cpf":"123.456.789-00"}'


🔧 Configurações Importantes
Arquivo application.properties:
# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/cadastro_pessoas
spring.datasource.username=cadastro_user
spring.datasource.password=cadastro123

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Servidor
server.port=8080
server.servlet.context-path=/api

# CORS
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*


🛡️ Funcionalidades
Frontend:

✅ Interface responsiva com Bootstrap 5
✅ Formulário de cadastro com validação
✅ Máscara automática para CPF
✅ Validação de CPF (dígitos verificadores)
✅ Listagem de pessoas cadastradas
✅ Cálculo automático de idade
✅ Alertas informativos
✅ Loading states

Backend:

✅ API RESTful
✅ Validação de dados
✅ Persistência em PostgreSQL
✅ Tratamento de erros
✅ CORS configurado
✅ Responses padronizadas

🚨 Solução de Problemas
Problema: Tomcat não inicia
# Verificar logs
tail -f /opt/tomcat9/logs/catalina.out

# Verificar se porta está ocupada
sudo netstat -tlnp | grep :8080

# Limpar cache
sudo rm -rf /opt/tomcat9/work/*
sudo rm -rf /opt/tomcat9/temp/*


Problema: Erro de conexão com banco
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão
psql -h localhost -U cadastro_user -d cadastro_pessoas

Problema: API não responde
# Verificar se aplicação iniciou
grep "Started CadastroApplication" /opt/tomcat9/logs/catalina.out

# Verificar endpoint correto
curl http://localhost:8080/cadastro-pessoas/pessoas

Problema: Frontend não carrega
# Verificar arquivos
ls -la /opt/tomcat9/webapps/ROOT/

# Verificar permissões
sudo chown -R $USER:$USER /opt/tomcat9/webapps/ROOT/


🔄 Comandos Úteis
Gerenciar Tomcat:
# Iniciar
sudo /opt/tomcat9/bin/startup.sh

# Parar
sudo /opt/tomcat9/bin/shutdown.sh

# Restart
sudo /opt/tomcat9/bin/shutdown.sh && sudo /opt/tomcat9/bin/startup.sh

# Logs em tempo real
tail -f /opt/tomcat9/logs/catalina.out

Rebuild da aplicação:
cd backend/
mvn clean package
sudo cp target/cadastro-pessoas-1.0.0.jar /opt/tomcat9/webapps/cadastro-pessoas.war
sudo /opt/tomcat9/bin/shutdown.sh && sudo /opt/tomcat9/bin/startup.sh

📊 Estrutura do Banco de Dados
Tabela pessoas:
CREATE TABLE pessoas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    datanascimento DATE NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE
);




#PROJETO FEITO POR FILIPE PEREIRA LIMA E JOSÉ EDUARDO CARDOZO
