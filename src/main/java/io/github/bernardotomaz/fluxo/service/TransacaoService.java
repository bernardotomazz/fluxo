package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.exceptions.TransacaoInvalidaException;
import io.github.bernardotomaz.fluxo.entity.Transacao;

import io.github.bernardotomaz.fluxo.exceptions.TransacaoNaoEncontradaException;
import io.github.bernardotomaz.fluxo.repository.TransacaoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;

    public TransacaoService(TransacaoRepository transacaoRepository) {
        this.transacaoRepository = transacaoRepository;
    }


    //VALIDAÇÕES
    public void validarTransacao(Transacao transacao){
        //VERIFICA O NOME
        if (transacao.getNome() == null || transacao.getNome().isBlank()){
            throw new TransacaoInvalidaException("Nome inválido.");
        }
        //VERIFICA SE TEM VALOR
        if (transacao.getValor() == null){
            throw new TransacaoInvalidaException("Valor inválido!");
        }
        // VERIFICA SE O VALOR DA TRANSAÇÃO É IGUAL OU MENOR QUE 0
        if (transacao.getValor().compareTo(BigDecimal.ZERO) <= 0){
            throw new TransacaoInvalidaException("Valor menor ou igual a zero!");
        }
        // VERIFICA O TIPO
        if (transacao.getTipo() == null) {
            throw new TransacaoInvalidaException("Tipo inválido!");
        }
        // VERIFICA CATEGORIA
        if (transacao.getCategoria() == null){
            throw new TransacaoInvalidaException("Categoria inválida!");
        }
        // VERIFICA DATA
        if (transacao.getDataTransacao() == null){
            throw new TransacaoInvalidaException("Data inválida!");
        }
    }


    public Transacao buscarPorId(Long id) {
        return transacaoRepository.findById(id).orElseThrow(() -> new TransacaoNaoEncontradaException("Transação não encontrada."));
    }

    public Transacao cadastrar(Transacao transacao){
        validarTransacao(transacao);
        return transacaoRepository.save(transacao);
    }

    public Transacao editar(Transacao transacao){
        if (transacao.getId() == null) {
            throw new TransacaoInvalidaException("ID obrigatório.");
        }
        buscarPorId(transacao.getId());
        validarTransacao(transacao);
        return transacaoRepository.save(transacao);
    }

    public void excluir(Long id){
        transacaoRepository.delete(buscarPorId(id));
    }
    public List<Transacao> listarTodas() {
        return transacaoRepository.findAll();
    }
}
