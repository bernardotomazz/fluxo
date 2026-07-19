package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.dto.request.MetaRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.MetaResponseDTO;
import io.github.bernardotomaz.fluxo.entity.Meta;
import io.github.bernardotomaz.fluxo.enums.StatusMeta;
import io.github.bernardotomaz.fluxo.exceptions.MetaInvalidaException;
import io.github.bernardotomaz.fluxo.exceptions.MetaNaoEncontradaException;
import io.github.bernardotomaz.fluxo.mapper.MetaMapper;
import io.github.bernardotomaz.fluxo.repository.MetaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MetaService {
    private final MetaRepository metaRepository;
    private final MetaMapper metaMapper;

    public MetaService(MetaRepository metaRepository, MetaMapper metaMapper) {
        this.metaRepository = metaRepository;
        this.metaMapper = metaMapper;
    }

    public Meta buscarEntidade(Long id){
        return metaRepository.findById(id).orElseThrow(() -> new MetaNaoEncontradaException("Meta não encontrada"));
    }
    public MetaResponseDTO buscarPorId(Long id){
       return metaMapper.toResponseDTO(buscarEntidade(id));
    }

    public MetaResponseDTO cadastrar(MetaRequestDTO metaDTO){
        Meta meta = metaMapper.toEntity(metaDTO);
        meta.setValorAtual(BigDecimal.ZERO);
        meta.setStatus(StatusMeta.EM_ANDAMENTO);
        Meta salva = metaRepository.save(meta);
        return metaMapper.toResponseDTO(salva);
    }

    public MetaResponseDTO editar(Long id, MetaRequestDTO metaDTO){
        Meta meta = buscarEntidade(id);
        metaMapper.updateEntity(meta, metaDTO);
        Meta salva = metaRepository.save(meta);
        return metaMapper.toResponseDTO(salva);
    }
    public void excluir(Long id){
        metaRepository.delete(buscarEntidade(id));
    }
    public List<MetaResponseDTO> listarTodas(){
        return metaRepository.findAll().
                stream().
                map(metaMapper::toResponseDTO)
                .toList();
    }
}
