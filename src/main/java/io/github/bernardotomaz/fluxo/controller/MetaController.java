package io.github.bernardotomaz.fluxo.controller;


import io.github.bernardotomaz.fluxo.entity.Meta;
import io.github.bernardotomaz.fluxo.service.MetaService;
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
    public Meta cadastrar(@RequestBody Meta meta) {
        return metaService.cadastrar(meta);
    }

    @GetMapping("/{id}")
    public Meta buscarPorId(@PathVariable Long id) {
        return metaService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Meta atualizar(@PathVariable Long id, @RequestBody Meta meta) {
        meta.setId(id);
        return metaService.editar(meta);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        metaService.excluir(id);
    }

    @GetMapping
    public List<Meta> listarTodas() {
        return metaService.listarTodas();
    }
}
