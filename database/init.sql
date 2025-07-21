CREATE TABLE IF NOT EXISTS pessoas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    datanascimento DATE NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE
);

-- Inserir alguns dados de exemplo
INSERT INTO pessoas (nome, datanascimento, cpf) VALUES 
('João Silva', '1990-05-15', '123.456.789-00'),
('Maria Santos', '1985-12-03', '987.654.321-11');
