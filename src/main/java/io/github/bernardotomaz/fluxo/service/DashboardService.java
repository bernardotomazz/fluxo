package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.dto.response.*;
import io.github.bernardotomaz.fluxo.entity.Meta;
import io.github.bernardotomaz.fluxo.entity.Transacao;
import io.github.bernardotomaz.fluxo.enums.StatusMeta;
import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import io.github.bernardotomaz.fluxo.mapper.CategoriaMapper;
import io.github.bernardotomaz.fluxo.mapper.MetaMapper;
import io.github.bernardotomaz.fluxo.mapper.TransacaoMapper;
import io.github.bernardotomaz.fluxo.repository.CategoriaRepository;
import io.github.bernardotomaz.fluxo.repository.MetaRepository;
import io.github.bernardotomaz.fluxo.repository.TransacaoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;


@Service
public class DashboardService {
    private final TransacaoRepository transacaoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MetaRepository metaRepository;

    private final TransacaoMapper transacaoMapper;
    private final MetaMapper metaMapper;
    private final CategoriaMapper categoriaMapper;

    public DashboardService(TransacaoRepository transacaoRepository, CategoriaRepository categoriaRepository, MetaRepository metaRepository, TransacaoMapper transacaoMapper, MetaMapper metaMapper, CategoriaMapper categoriaMapper) {
        this.transacaoRepository = transacaoRepository;
        this.categoriaRepository = categoriaRepository;
        this.metaRepository = metaRepository;
        this.transacaoMapper = transacaoMapper;
        this.metaMapper = metaMapper;
        this.categoriaMapper = categoriaMapper;
    }

    public DashboardResponseDTO buscarDashboard() {

        DashboardResponseDTO dto = new DashboardResponseDTO();

        dto.setResumoFinanceiroMes(buscarResumoFinanceiroMes());

        dto.setReceitaVsDespesaUltimosMeses(
                buscarReceitaVsDespesaUltimosMeses());

        dto.setGastosPorCategoria(
                buscarGastosPorCategoria());

        dto.setResumoMes(
                buscarResumoMes());

        dto.setUltimasTransacoes(
                buscarUltimasTransacoes());

        dto.setProximasMetas(
                buscarProximasMetas());

        dto.setCategorias(
                buscarCategorias());

        dto.setComparativoMensal(
                buscarComparativoMensal()
        );

        return dto;
    }

    private BigDecimal calcularSaldoAtual() {
        BigDecimal receitaAtual = transacaoRepository.calcularTotalPorTipo(TipoTransacao.RECEITA);
        BigDecimal despesaAtual = transacaoRepository.calcularTotalPorTipo(TipoTransacao.DESPESA);
        return receitaAtual.subtract(despesaAtual);
    }

    private ReceitaDespesaDTO buscarResumoFinanceiroMes(){
        ReceitaDespesaDTO dto = new ReceitaDespesaDTO();
        LocalDate hoje =  LocalDate.now();
        LocalDate inicio = hoje.withDayOfMonth(1);
        LocalDate fim = hoje.withDayOfMonth(hoje.lengthOfMonth());
        BigDecimal receitas = transacaoRepository
                .calcularTotalMesPorTipo(TipoTransacao.RECEITA, inicio, fim);

        BigDecimal despesas = transacaoRepository
                .calcularTotalMesPorTipo(TipoTransacao.DESPESA, inicio, fim);

        BigDecimal saldoMes = receitas.subtract(despesas);
        BigDecimal saldoAtual = calcularSaldoAtual();

        dto.setSaldoMes(saldoMes);
        dto.setSaldoAtual(saldoAtual);
        dto.setReceitasMes(receitas);
        dto.setDespesasMes(despesas);
        return dto;
    }

    private BigDecimal calcularSaldoMes() {
        LocalDate hoje = LocalDate.now();
        LocalDate inicio = hoje.withDayOfMonth(1);
        LocalDate fim = hoje.withDayOfMonth(hoje.lengthOfMonth());
        BigDecimal receitas = transacaoRepository.calcularTotalMesPorTipo(TipoTransacao.RECEITA, inicio, fim);
        BigDecimal despesas = transacaoRepository.calcularTotalMesPorTipo(TipoTransacao.DESPESA, inicio, fim);
        return receitas.subtract(despesas);
    }

    private BigDecimal calcularSaldoMesAnterior(){

        LocalDate hoje = LocalDate.now();
        LocalDate inicioMesAnterior = hoje.minusMonths(1).withDayOfMonth(1);
        LocalDate fimMesAnterior = inicioMesAnterior.withDayOfMonth(inicioMesAnterior.lengthOfMonth());

        BigDecimal receitas = transacaoRepository.calcularTotalMesPorTipo(TipoTransacao.RECEITA, inicioMesAnterior, fimMesAnterior);

        BigDecimal despesas = transacaoRepository.calcularTotalMesPorTipo(TipoTransacao.DESPESA, inicioMesAnterior, fimMesAnterior);

        return receitas.subtract(despesas);
    }

    private List<GastoCategoriaDTO> buscarGastosPorCategoria() {
        return transacaoRepository
                .buscarGastosPorCategoria(
                        TipoTransacao.DESPESA,
                        PageRequest.of(0, 5)
                )
                .stream()
                .map(item -> {
                    GastoCategoriaDTO dto = new GastoCategoriaDTO();
                    dto.setNome(item.getNome());
                    dto.setIcon(item.getIcon());
                    dto.setCor(item.getCor());
                    dto.setValor(item.getValor());
                    return dto;
                })
                .toList();
    }

    private List<ReceitaDespesaMensalDTO> buscarReceitaVsDespesaUltimosMeses() {
        LocalDate inicio = LocalDate.now()
                .minusMonths(5)
                .withDayOfMonth(1);
        return transacaoRepository
                .buscarReceitaVsDespesaUltimosMeses(inicio)
                .stream()
                .map(item -> {
                    ReceitaDespesaMensalDTO dto =
                            new ReceitaDespesaMensalDTO();
                    dto.setReferencia(item.getReferencia());
                    dto.setReceitas(item.getReceitas());
                    dto.setDespesas(item.getDespesas());
                    return dto;
                }).toList();
    }

    private ResumoMesDTO buscarResumoMes(){
        ResumoMesDTO dto = new ResumoMesDTO();
        LocalDate hoje = LocalDate.now();
        LocalDate inicio = hoje.withDayOfMonth(1);
        LocalDate fim = hoje.withDayOfMonth(hoje.lengthOfMonth());
        // Maior gasto
        Transacao maiorGasto = transacaoRepository.findTopByTipoAndDataTransacaoBetweenOrderByValorDesc(TipoTransacao.DESPESA, inicio, fim);
        if (maiorGasto != null) {dto.setMaiorGasto(transacaoMapper.toResponseDTO(maiorGasto));}
        // Total de transações
        dto.setTotalTransacoes((int)transacaoRepository.countByDataTransacaoBetween(inicio, fim)
        );
        // Categorias cadastradas
        dto.setTotalCategorias((int) categoriaRepository.count()
        );

        // Metas ativas
        dto.setMetasAtivas((int) metaRepository.countByStatus(StatusMeta.EM_ANDAMENTO)
        );
        // Meta mais próxima
        Meta meta = metaRepository.findTopByStatusOrderByPrazoAsc(StatusMeta.EM_ANDAMENTO);
        if (meta != null) {dto.setMetaMaisProxima(metaMapper.toResponseDTO(meta));
        }
        // Economia mês anterior
        ComparativoMensalDTO comparativo = buscarComparativoMensal();
        dto.setEconomiaMesAnterior(
                comparativo.getEconomiaMesAnterior()
        );
        dto.setPercentual(
                comparativo.getPercentual()
        );
        return dto;
    }

    private List<TransacaoResponseDTO> buscarUltimasTransacoes(){
        return transacaoRepository
                .findTop8ByOrderByDataTransacaoDesc()
                .stream()
                .map(transacaoMapper::toResponseDTO)
                .toList();
    }

    private List<MetaResponseDTO> buscarProximasMetas(){
        return metaRepository
                .findTop8ByStatusOrderByPrazoAsc(StatusMeta.EM_ANDAMENTO)
                .stream()
                .map(metaMapper::toResponseDTO)
                .toList();
    }

    private List<CategoriaDashboardDTO> buscarCategorias(){
        return categoriaRepository
                .findTop8ByOrderByNomeAsc()
                .stream()
                .map(categoriaMapper::toDashboardDTO)
                .toList();
    }

    private ComparativoMensalDTO buscarComparativoMensal() {
        ComparativoMensalDTO dto = new ComparativoMensalDTO();

        BigDecimal economiaAtual = calcularSaldoMes();

        BigDecimal economiaAnterior = calcularSaldoMesAnterior();
        dto.setEconomiaMesAtual(economiaAtual);
        dto.setEconomiaMesAnterior(economiaAnterior);

        BigDecimal diferenca = economiaAtual.subtract(economiaAnterior);
        dto.setDiferenca(diferenca);

        if (economiaAnterior.compareTo(BigDecimal.ZERO) != 0) {
            double percentual = diferenca
                    .divide(economiaAnterior.abs(), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            dto.setPercentual(percentual);
        } else {
            dto.setPercentual(100.0);
        }
        return dto;
    }

}
