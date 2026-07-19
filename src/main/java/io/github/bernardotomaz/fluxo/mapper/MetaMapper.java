package io.github.bernardotomaz.fluxo.mapper;

import io.github.bernardotomaz.fluxo.dto.request.MetaRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.MetaResponseDTO;
import io.github.bernardotomaz.fluxo.entity.Meta;
import org.springframework.stereotype.Component;

@Component
public class MetaMapper {
    public Meta toEntity(MetaRequestDTO metaDTO){
        Meta meta = new Meta();
        updateEntity(meta, metaDTO);
        return meta;
    }

    public void updateEntity(Meta meta, MetaRequestDTO metaDTO){
        meta.setDescricao(metaDTO.getDescricao());
        meta.setValorMeta(metaDTO.getValorMeta());
        meta.setTitulo(metaDTO.getTitulo());
        meta.setPrazo(metaDTO.getPrazo());
    }

    public MetaResponseDTO toResponseDTO(Meta meta){
        MetaResponseDTO metaDTO = new MetaResponseDTO();
        metaDTO.setId(meta.getId());
        metaDTO.setDescricao(meta.getDescricao());
        metaDTO.setValorMeta(meta.getValorMeta());
        metaDTO.setStatus(meta.getStatus());
        metaDTO.setTitulo(meta.getTitulo());
        metaDTO.setValorAtual(meta.getValorAtual());
        metaDTO.setPrazo(meta.getPrazo());
        return metaDTO;
    }
}
