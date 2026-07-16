package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.dto.request.TransacaoRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.TransacaoResponseDTO;
import io.github.bernardotomaz.fluxo.entity.Categoria;

import io.github.bernardotomaz.fluxo.entity.Transacao;

import io.github.bernardotomaz.fluxo.exceptions.TransacaoNaoEncontradaException;
import io.github.bernardotomaz.fluxo.mapper.TransacaoMapper;
import io.github.bernardotomaz.fluxo.repository.TransacaoRepository;
import org.springframework.stereotype.Service;


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
        Categoria categoria = categoriaService.buscarPorId(transacaoDTO.getCategoria());
        Transacao transacao = transacaoMapper.toEntity(transacaoDTO, categoria);
        Transacao salva = transacaoRepository.save(transacao);
        return transacaoMapper.toResponseDTO(salva);
    }

    public TransacaoResponseDTO editar(Long id, TransacaoRequestDTO transacaoDTO){

        Transacao transacao = buscarEntidade(id);
        Categoria categoria = categoriaService.buscarPorId(transacaoDTO.getCategoria());

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
}
