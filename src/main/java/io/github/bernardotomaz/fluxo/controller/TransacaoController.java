package io.github.bernardotomaz.fluxo.controller;

import io.github.bernardotomaz.fluxo.dto.request.TransacaoRequestDTO;
import io.github.bernardotomaz.fluxo.dto.response.TransacaoResponseDTO;

import io.github.bernardotomaz.fluxo.service.TransacaoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/transacoes")
public class TransacaoController {

    private final TransacaoService transacaoService;

    public TransacaoController(TransacaoService transacaoService) {
        this.transacaoService = transacaoService;
    }

    @PostMapping
    public TransacaoResponseDTO cadastrar(@Valid @RequestBody TransacaoRequestDTO transacao) {
        return transacaoService.cadastrar(transacao);
    }

    @GetMapping("/{id}")
    public TransacaoResponseDTO buscarPorId(@PathVariable Long id) {
        return transacaoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public TransacaoResponseDTO atualizar(@PathVariable Long id,@Valid @RequestBody TransacaoRequestDTO transacao) {
        return transacaoService.editar(id, transacao);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        transacaoService.excluir(id);
    }

    @GetMapping
    public List<TransacaoResponseDTO> listarTodas() {
        return transacaoService.listarTodas();
    }

}
