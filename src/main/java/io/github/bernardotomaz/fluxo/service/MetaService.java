package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.dto.request.MetaRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.MetaResponseDTO;
import io.github.bernardotomaz.fluxo.entity.Meta;
import io.github.bernardotomaz.fluxo.enums.StatusMeta;
import io.github.bernardotomaz.fluxo.exceptions.MetaNaoEncontradaException;
import io.github.bernardotomaz.fluxo.mapper.MetaMapper;
import io.github.bernardotomaz.fluxo.repository.MetaRepository;
import io.github.bernardotomaz.fluxo.specification.MetaSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
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

    public List<MetaResponseDTO> listar(String titulo, String descricao, BigDecimal valorMin, BigDecimal valorMax, LocalDate inicio, LocalDate fim, StatusMeta status){
        Specification<Meta> spec = Specification.unrestricted();
        if (titulo != null && !titulo.isBlank()){
            spec = spec.and(MetaSpecification.titulo(titulo));
        }
        if (descricao != null && !descricao.isBlank()){
            spec = spec.and(MetaSpecification.descricao(descricao));
        }
        if (valorMin != null && valorMax != null){
            spec = spec.and(MetaSpecification.valorMetaEntre(valorMin, valorMax));

        }
        else if (valorMin != null){
            spec = spec.and(MetaSpecification.valorMetaMin(valorMin));
        }
        else if (valorMax != null){
            spec = spec.and(MetaSpecification.valorMetaMax(valorMax));
        }
        if (inicio != null && fim != null){
            spec = spec.and(MetaSpecification.prazoEntre(inicio, fim));
        }
        else if (inicio != null){
            spec = spec.and(MetaSpecification.prazoInicio(inicio));
        }
        else if (fim != null){
            spec = spec.and(MetaSpecification.prazoFim(fim));
        }
        if (status != null) {
            spec = spec.and(MetaSpecification.status(status));
        }
        return metaRepository.findAll(spec).stream()
                .map(metaMapper::toResponseDTO)
                .toList();
    };
}
