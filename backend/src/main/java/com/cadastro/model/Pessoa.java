package com.cadastro.model;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "pessoas")
public class Pessoa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nome;
    
    @Column(nullable = false)
    private LocalDate datanascimento;
    
    @Column(nullable = false, unique = true)
    private String cpf;
    
    // Construtores
    public Pessoa() {}
    
    public Pessoa(String nome, LocalDate datanascimento, String cpf) {
        this.nome = nome;
        this.datanascimento = datanascimento;
        this.cpf = cpf;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public LocalDate getDatanascimento() { return datanascimento; }
    public void setDatanascimento(LocalDate datanascimento) { this.datanascimento = datanascimento; }
    
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
}
