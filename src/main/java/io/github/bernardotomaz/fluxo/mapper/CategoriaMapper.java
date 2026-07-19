package io.github.bernardotomaz.fluxo.mapper;

import io.github.bernardotomaz.fluxo.dto.request.CategoriaRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.CategoriaResponseDTO;
import io.github.bernardotomaz.fluxo.entity.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {
    //Transforma uma CategoriaRequestDTO em uma entidade categoria
    public Categoria toEntity(CategoriaRequestDTO categoriaRequestDTO) {
        Categoria categoria = new Categoria();
        updateEntity(categoria, categoriaRequestDTO);
        return categoria;
    }
    public void updateEntity(Categoria categoria,CategoriaRequestDTO categoriaRequestDTO) {
        categoria.setNome(categoriaRequestDTO.getNome());
        categoria.setCor(categoriaRequestDTO.getCor());
        categoria.setIcon(categoriaRequestDTO.getIcon());
        categoria.setTipo(categoriaRequestDTO.getTipo().name());
    }

    public CategoriaResponseDTO toResponseDTO(Categoria categoria) {
        CategoriaResponseDTO categoriaDTO = new CategoriaResponseDTO();
        categoriaDTO.setId(categoria.getId());
        categoriaDTO.setNome(categoria.getNome());
        categoriaDTO.setCor(categoria.getCor());
        categoriaDTO.setIcon(categoria.getIcon());
        categoriaDTO.setTipo(categoria.getTipo());
        return categoriaDTO;
    }
}
