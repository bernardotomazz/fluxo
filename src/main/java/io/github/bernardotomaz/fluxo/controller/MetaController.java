package io.github.bernardotomaz.fluxo.controller;


import io.github.bernardotomaz.fluxo.dto.request.MetaRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.MetaResponseDTO;
import io.github.bernardotomaz.fluxo.entity.Meta;
import io.github.bernardotomaz.fluxo.service.MetaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/metas")
public class MetaController {

    private final MetaService metaService;

    public MetaController(MetaService metaService) {
        this.metaService = metaService;
    }

    @PostMapping
    public MetaResponseDTO cadastrar(@Valid @RequestBody MetaRequestDTO meta) {
        return metaService.cadastrar(meta);
    }

    @GetMapping("/{id}")
    public MetaResponseDTO buscarPorId(@PathVariable Long id) {
        return metaService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public MetaResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody MetaRequestDTO meta) {
        return metaService.editar(id, meta);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        metaService.excluir(id);
    }

    @GetMapping
    public List<MetaResponseDTO> listarTodas() {
        return metaService.listarTodas();
    }
}
