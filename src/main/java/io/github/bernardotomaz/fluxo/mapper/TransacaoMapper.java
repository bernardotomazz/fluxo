package io.github.bernardotomaz.fluxo.mapper;

import io.github.bernardotomaz.fluxo.dto.request.TransacaoRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.TransacaoResponseDTO;
import io.github.bernardotomaz.fluxo.entity.Categoria;
import io.github.bernardotomaz.fluxo.entity.Transacao;
import org.springframework.stereotype.Component;

@Component
public class TransacaoMapper {
    // Transforma um TransacaoRequestDTO em uma entidade Transacao
    public Transacao toEntity(TransacaoRequestDTO transacaoDTO, Categoria categoria) {
        Transacao transacao = new Transacao();
        updateEntity(transacao, transacaoDTO, categoria);
        return transacao;
    }

    public void updateEntity(Transacao transacao, TransacaoRequestDTO transacaoDTO, Categoria categoria) {
        transacao.setNome(transacaoDTO.getNome());
        transacao.setDescricao(transacaoDTO.getDescricao());
        transacao.setDataTransacao(transacaoDTO.getDataTransacao());
        transacao.setTipo(transacaoDTO.getTipo());
        transacao.setRecorrencia(transacaoDTO.isRecorrencia());
        transacao.setCategoria(categoria);
        transacao.setValor(transacaoDTO.getValor());
    }

    public TransacaoResponseDTO toResponseDTO(Transacao transacao) {
        TransacaoResponseDTO transacaoDTO = new TransacaoResponseDTO();
        transacaoDTO.setId(transacao.getId());
        transacaoDTO.setNome(transacao.getNome());
        transacaoDTO.setDataTransacao(transacao.getDataTransacao());
        transacaoDTO.setTipo(transacao.getTipo());
        transacaoDTO.setValor(transacao.getValor());
        transacaoDTO.setCategoria(transacao.getCategoria().getNome());
        return transacaoDTO;
    }
}
