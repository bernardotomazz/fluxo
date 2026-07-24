package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.dto.request.CategoriaRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.CategoriaResponseDTO;
import io.github.bernardotomaz.fluxo.entity.Categoria;
import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import io.github.bernardotomaz.fluxo.exceptions.CategoriaInvalidaException;
import io.github.bernardotomaz.fluxo.exceptions.CategoriaNaoEncontradaException;
import io.github.bernardotomaz.fluxo.mapper.CategoriaMapper;

import io.github.bernardotomaz.fluxo.repository.CategoriaRepository;
import io.github.bernardotomaz.fluxo.specification.CategoriaSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    public CategoriaService(CategoriaRepository categoriaRepository, CategoriaMapper categoriaMapper) {
        this.categoriaRepository = categoriaRepository;
        this.categoriaMapper = categoriaMapper;
    }

    public Categoria buscarEntidade(Long id) {
        return categoriaRepository.findById(id).orElseThrow(() -> new CategoriaNaoEncontradaException("Categoria não encontrada"));
    }

    public CategoriaResponseDTO buscarPorId(Long id) {
        return categoriaMapper.toResponseDTO(buscarEntidade(id));
    }

    public CategoriaResponseDTO cadastrar(CategoriaRequestDTO categoriaDTO) {
        Categoria categoria = categoriaMapper.toEntity(categoriaDTO);
        Categoria salva =  categoriaRepository.save(categoria);
        return categoriaMapper.toResponseDTO(salva);
    }

    public CategoriaResponseDTO editar(Long id, CategoriaRequestDTO categoriaDTO) {

        Categoria categoria = buscarEntidade(id);

        categoriaMapper.updateEntity(categoria, categoriaDTO);
        Categoria salva = categoriaRepository.save(categoria);
        return categoriaMapper.toResponseDTO(salva);
    }

    public void excluir(Long id){
        categoriaRepository.delete(buscarEntidade(id));
    }


    public List<CategoriaResponseDTO> listar(String nome,  TipoTransacao tipo) {
        Specification<Categoria> spec = Specification.unrestricted();
        if (nome != null && !nome.isBlank()) {
            spec = spec.and(CategoriaSpecification.nome(nome));
        }
        if (tipo != null) {
            spec = spec.and(CategoriaSpecification.tipo(tipo));
        }
        return categoriaRepository.findAll(spec)
                .stream().map(categoriaMapper::toResponseDTO).toList();
    }
}

