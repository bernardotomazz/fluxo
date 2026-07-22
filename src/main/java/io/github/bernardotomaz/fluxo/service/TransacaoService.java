package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.dto.request.TransacaoRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.TransacaoResponseDTO;
import io.github.bernardotomaz.fluxo.entity.Categoria;

import io.github.bernardotomaz.fluxo.entity.Transacao;

import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import io.github.bernardotomaz.fluxo.exceptions.TransacaoNaoEncontradaException;
import io.github.bernardotomaz.fluxo.mapper.TransacaoMapper;
import io.github.bernardotomaz.fluxo.repository.TransacaoRepository;
import io.github.bernardotomaz.fluxo.specification.TransacaoSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final CategoriaService categoriaService;
    private final TransacaoMapper transacaoMapper;

    public TransacaoService(TransacaoRepository transacaoRepository, CategoriaService categoriaService, TransacaoMapper transacaoMapper) {
        this.transacaoRepository = transacaoRepository;
        this.categoriaService = categoriaService;
        this.transacaoMapper = transacaoMapper;
    }

    private Transacao buscarEntidade(Long id){
        return transacaoRepository.findById(id).orElseThrow(() -> new TransacaoNaoEncontradaException("Transação não encontrada."));
    }

    public TransacaoResponseDTO buscarPorId(Long id) {
        return transacaoMapper.toResponseDTO(buscarEntidade(id));
    }

    public TransacaoResponseDTO cadastrar(TransacaoRequestDTO transacaoDTO){
        Categoria categoria = categoriaService.buscarEntidade(transacaoDTO.getCategoria());
        Transacao transacao = transacaoMapper.toEntity(transacaoDTO, categoria);
        Transacao salva = transacaoRepository.save(transacao);
        return transacaoMapper.toResponseDTO(salva);
    }

    public TransacaoResponseDTO editar(Long id, TransacaoRequestDTO transacaoDTO){

        Transacao transacao = buscarEntidade(id);
        Categoria categoria = categoriaService.buscarEntidade(transacaoDTO.getCategoria());

        transacaoMapper.updateEntity(transacao, transacaoDTO, categoria);

        Transacao salva = transacaoRepository.save(transacao);
        return transacaoMapper.toResponseDTO(salva);
    }

    public void excluir(Long id){
        transacaoRepository.delete(buscarEntidade(id));
    }

    public List<TransacaoResponseDTO> listarTodas() {
        return transacaoRepository.findAll()
                .stream()
                .map(transacaoMapper::toResponseDTO)
                .toList();
    }

    public List<TransacaoResponseDTO> listar(String nome, LocalDate dataInicio, LocalDate dataFim, Long idCategoria, TipoTransacao tipo) {
        Specification<Transacao> spec = Specification.unrestricted();
        if (nome != null && !nome.isBlank()) {
            spec = spec.and(TransacaoSpecification.nome(nome));
        }
        if (tipo != null) {
            spec = spec.and(TransacaoSpecification.tipo(tipo));
        }
        if (dataInicio != null && dataFim != null) {
            spec = spec.and(TransacaoSpecification.dataTransacao(dataInicio, dataFim));
        }
        if (idCategoria != null) {
            spec = spec.and(TransacaoSpecification.categoria(idCategoria));
        }
        return transacaoRepository.findAll(spec).stream().map(transacaoMapper::toResponseDTO).toList();
    }
}
