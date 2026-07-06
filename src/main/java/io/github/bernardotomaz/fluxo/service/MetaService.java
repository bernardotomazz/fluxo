package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.entity.Meta;
import io.github.bernardotomaz.fluxo.exceptions.MetaInvalidaException;
import io.github.bernardotomaz.fluxo.exceptions.MetaNaoEncontradaException;
import io.github.bernardotomaz.fluxo.repository.MetaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MetaService {
    private MetaRepository metaRepository;
    public MetaService(MetaRepository metaRepository) {
        this.metaRepository = metaRepository;
    }
    //VALIDAÇÕES
    public void validarMeta(Meta meta){
        //VERIFICA O TITULO
        if(meta.getTitulo() == null || meta.getTitulo().isBlank()){
            throw new MetaInvalidaException("Nome inválido");
        }
        //VERIFICA SE TEM VALOR META
        if (meta.getValorMeta() == null || meta.getValorMeta().compareTo(BigDecimal.ZERO) <= 0){
            throw new MetaInvalidaException("Valor de meta inválido!");
        }
        if (meta.getPrazo() == null) {
            throw new MetaInvalidaException("Prazo inválido");
        }
    }
    public Meta buscarPorId(Long id){
        return metaRepository.findById(id).orElseThrow(() -> new MetaNaoEncontradaException("Meta não encontrada"));
    }

    public Meta cadastrar(Meta meta){
        validarMeta(meta);
        return metaRepository.save(meta);
    }

    public Meta editar(Meta meta){
        if (meta.getId() == null){
            throw new MetaInvalidaException("ID obrigatório");
        }
        buscarPorId(meta.getId());
        validarMeta(meta);
        return metaRepository.save(meta);
    }
    public void excluir(Long id){
        metaRepository.delete(buscarPorId(id));
    }
    public List<Meta> listarTodas(){
        return metaRepository.findAll();
    }
}
