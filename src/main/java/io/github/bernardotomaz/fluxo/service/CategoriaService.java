package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.entity.Categoria;
import io.github.bernardotomaz.fluxo.entity.Transacao;
import io.github.bernardotomaz.fluxo.exceptions.CategoriaInvalidaException;
import io.github.bernardotomaz.fluxo.exceptions.CategoriaNaoEncontradaException;
import io.github.bernardotomaz.fluxo.repository.CategoriaRepository;
import io.github.bernardotomaz.fluxo.repository.TransacaoRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    //VALIDAÇÕES
    public void validarCategoria(Categoria categoria) {
        //VERIFICA O NOME
        if (categoria.getNome() == null || categoria.getNome().isBlank()) {
            throw new CategoriaInvalidaException("Nome inválido");
        }
        //VERIFICA SE TEM TIPO
        if (categoria.getTipo() == null){
            throw new CategoriaInvalidaException("Tipo inválido!");
        }
    }

    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id).orElseThrow(() -> new CategoriaNaoEncontradaException("Categoria não encontrada"));
    }

    public Categoria cadastrar(Categoria categoria) {
        validarCategoria(categoria);
        return categoriaRepository.save(categoria);
    }

    public Categoria editar(Categoria categoria) {
        if (categoria.getId() == null) {
            throw new CategoriaInvalidaException("ID obrigatório.");
        }
        buscarPorId(categoria.getId());
        validarCategoria(categoria);
        return categoriaRepository.save(categoria);
    }

    public void excluir(Long id){
        categoriaRepository.delete(buscarPorId(id));
    }
    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }
}

