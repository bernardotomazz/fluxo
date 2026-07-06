package io.github.bernardotomaz.fluxo.controller;

import io.github.bernardotomaz.fluxo.entity.Transacao;
import io.github.bernardotomaz.fluxo.service.TransacaoService;
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
    public Transacao cadastrar(@RequestBody Transacao transacao) {
        return transacaoService.cadastrar(transacao);
    }

    @GetMapping("/{id}")
    public Transacao buscarPorId(@PathVariable Long id) {
        return transacaoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Transacao atualizar(@PathVariable Long id,@RequestBody Transacao transacao) {
        transacao.setId(id);
        return transacaoService.editar(transacao);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        transacaoService.excluir(id);
    }

    @GetMapping
    public List<Transacao> listarTodas() {
        return transacaoService.listarTodas();
    }

}
