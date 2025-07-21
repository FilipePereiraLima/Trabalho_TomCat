package com.cadastro.controller;

import com.cadastro.model.Pessoa;
import com.cadastro.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pessoas")
@CrossOrigin(origins = "*")
public class PessoaController {
    
    @Autowired
    private PessoaRepository pessoaRepository;
    
    @GetMapping
    public ResponseEntity<List<Pessoa>> listarPessoas() {
        List<Pessoa> pessoas = pessoaRepository.findAll();
        return ResponseEntity.ok(pessoas);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> cadastrarPessoa(@RequestBody Pessoa pessoa) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validação básica
            if (pessoa.getNome() == null || pessoa.getNome().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Nome é obrigatório");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (pessoa.getCpf() == null || pessoa.getCpf().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "CPF é obrigatório");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (pessoa.getDatanascimento() == null) {
                response.put("success", false);
                response.put("message", "Data de nascimento é obrigatória");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Verificar se CPF já existe
            if (pessoaRepository.existsByCpf(pessoa.getCpf())) {
                response.put("success", false);
                response.put("message", "CPF já cadastrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            Pessoa pessoaSalva = pessoaRepository.save(pessoa);
            response.put("success", true);
            response.put("message", "Pessoa cadastrada com sucesso");
            response.put("pessoa", pessoaSalva);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro interno do servidor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
