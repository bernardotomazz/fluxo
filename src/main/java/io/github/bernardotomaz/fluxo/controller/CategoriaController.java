package io.github.bernardotomaz.fluxo.controller;

import io.github.bernardotomaz.fluxo.dto.request.CategoriaRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.CategoriaResponseDTO;
import io.github.bernardotomaz.fluxo.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;
    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @PostMapping
    public CategoriaResponseDTO cadastrar(@Valid @RequestBody CategoriaRequestDTO categoria) {
        return categoriaService.cadastrar(categoria);
    }

    @GetMapping("/{id}")
    public CategoriaResponseDTO buscarPorId(@PathVariable Long id) {
        return categoriaService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public CategoriaResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequestDTO categoria) {
        return categoriaService.editar(id, categoria);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        categoriaService.excluir(id);
    }

    @GetMapping
    public List<CategoriaResponseDTO> listarTodas() {
        return categoriaService.listarTodas();
    }
}

