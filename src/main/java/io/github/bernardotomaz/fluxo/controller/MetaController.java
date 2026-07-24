package io.github.bernardotomaz.fluxo.controller;


import io.github.bernardotomaz.fluxo.dto.request.MetaRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.MetaResponseDTO;
import io.github.bernardotomaz.fluxo.dto.response.TransacaoResponseDTO;
import io.github.bernardotomaz.fluxo.entity.Meta;
import io.github.bernardotomaz.fluxo.enums.StatusMeta;
import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import io.github.bernardotomaz.fluxo.service.MetaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    public List<MetaResponseDTO> listar(@RequestParam(required = false) String titulo,
                                        @RequestParam(required = false) String descricao,
                                        @RequestParam(required = false) BigDecimal valorMetaMin,
                                        @RequestParam(required = false) BigDecimal valorMetaMax,
                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim,
                                        @RequestParam(required = false) StatusMeta status){
        return metaService.listar(titulo, descricao, valorMetaMin, valorMetaMax, inicio, fim, status);
    }
}
