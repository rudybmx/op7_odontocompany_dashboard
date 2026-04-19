# Guia de Estrutura de Dados e Componentes - Meta Ads (Wer'Sun)

Este documento foi criado para guiar agentes inteligentes, desenvolvedores back-end e engenheiros de dados na estruturação de tabelas de banco de dados e integração de APIs (como a Meta Graph API) para as dashboards de Meta Ads da plataforma Wer'Sun.

Os componentes de frontend atuais utilizam tipagens TypeScript estritas que definem as métricas de performance e os níveis hierárquicos dos anúncios. Para integrar com dados reais, as informações retornadas do backend devem mapear perfeitamente para as entidades descritas abaixo.

## 📁 Localização das Tipagens no Projeto
As interfaces e enums de contrato para o frontend estão localizados em:
- `src/types/meta-ads.ts`
- `src/types/meta-ads-anuncios.ts`
- `src/types/meta-ads-campanhas.ts`
- `src/types/meta-ads-criativos.ts`
- `src/types/meta-ads-publicos.ts`

---

## 🏗️ Hierarquia e Entidades Principais (Modelo Relacional)

A arquitetura do Meta Ads exige basicamente 4 tabelas relacionais primárias, além de tabelas agregadas para insights, públicos e análise diária.

### 1. Tabela: `meta_contas` (Conta de Anúncios)
Agrega dados gerais da conta no nível mais amplo.  
**Atributos essenciais Baseados em `ContaAnuncio` (`meta-ads.ts`):**
- `id` (String/UUID - ID da conta no Meta)
- `nome` (String)
- `status` (Enum: `ACTIVE`, `DISABLED`, `UNSETTLED`)
- `saldo` / `saldoInicial` (Numeric/Float)
- **Métricas Agregadas da Conta:** `investimento`, `leads`, `leadsMensagem`, `leadsCadastro`, `leadsCompra`, `cpl`, `ctr`, `cpc`, `cpm`, `alcance`, `impressoes`, `frequencia`.

### 2. Tabela: `meta_campanhas`
Representa as Campanhas rodando. Baseado em `Campanha` (`meta-ads-campanhas.ts`).  
**Atributos essenciais:**
- `id` (String/UUID - ID no Meta)
- `conta_id` (Chave Estrangeira -> meta_contas)
- `nome` / `nomeAbreviado` (String)
- `objetivo` (Enum: `LEAD_GENERATION`, `CONVERSIONS`, `BRAND_AWARENESS`, `TRAFFIC`, `REACH`, `VIDEO_VIEWS`)
- `status` (Enum: `ACTIVE`, `PAUSED`, `DELETED`, `ARCHIVED`, `LEARNING`)
- `plataformas` (Array de Enum ou relação Many-to-Many: `facebook`, `instagram`, `whatsapp`, `audience_network`)
- `orcamentoDiario` (Numeric - Opcional)
- `dataAtualizacao` (Timestamp / ISO date de `updated_time`)
- **Métricas:** `investimento`, `leads`, `cpl`, `ctr`, `cpc`, `cpm`, `alcance`, `impressoes`, `frequencia`, `indiceDesempenho`.

### 3. Tabela: `meta_conjuntos` (Ad Sets)
Representa os conjuntos de anúncios sob uma campanha. Baseado em `ConjuntoAnuncios`.  
**Atributos essenciais:**
- `id` (String/UUID - ID no Meta)
- `campanha_id` (Chave Estrangeira -> meta_campanhas)
- `nome` (String)
- `status` (Enum idêntico à campanha)
- `plataformas` (Array de Enum)
- `orcamentoDiario` (Numeric)
- `dataAtualizacao` (Timestamp)
- **Métricas:** Mesmas contidas nas campanhas (investimento, leads, cpl, etc.)

### 4. Tabela/Entidade: `meta_anuncios` (Ads)
Nível mais granular do anúncio final, com referências para os arquivos de mídias (Criativos). Baseado em `Anuncio` em `meta-ads-anuncios.ts`.  
**Atributos essenciais:**
- `id` (String/UUID)
- `conjunto_id` (Chave Estrangeira -> meta_conjuntos)
- `campanha_id` (Desnormalizado opcional para queries fáceis)
- `nome`, `campanhaNome`, `conjuntoNome`
- `tipo` (Enum: `IMAGE`, `VIDEO`, `CAROUSEL`)
- `status` (Enum: `ACTIVE`, `PAUSED`, `LEARNING`, `ARCHIVED`)
- `thumbnailUrl` (String de URL da imagem renderizada)
- `corFundo` (Color HEX String)
- **Métricas Financeiras/Performance:** `investimento`, `leads`, `leadsMensagem`, `leadsCadastro`, `cpl`, `ctr`, `cpc`, `cpm`, `alcance`, `impressoes`, `frequencia`.
- **Métricas de Qualidade (Calculadas na Aplicação ou via IA):** `score` (0-100), `tendencia` (`subindo`, `estavel`, `caindo`), `diasAtivo`.

### 5. Tabela/Entidade: `meta_criativos` (Modelagem Específica de Mídia)
Os criativos são analisados individualmente de forma cruzada, pois um mesmo criativo pode estar em várias campanhas. Baseado em `Criativo` em `meta-ads-criativos.ts`.  
**Atributos essenciais:**
- `id` (String/UUID)
- `nome`
- `tipo` (`IMAGE`, `VIDEO`, `CAROUSEL`)
- `status` (`evergreen`, `novo`, `atencao`, `fadiga`)
- `thumbnailUrl` (String URL)
- `diasAtivo`, `campanhas` (Contagem de uso)
- **Métricas de Vídeo (Essenciais caso seja vídeo):** `hookRate`, `holdRate`, `videoViews3s`, `videoViews15s`, `videoThruPlays`.
- **Métricas Gerais do Criativo:** (Score, leads gerados, cpl, investimento gasto por esta mídia globalmente).

---

## 📊 Entidades de Dados Agregados (Views, Materialized Views ou Tabelas de Time-Series)

Para a plataforma funcionar rapidamente sem calcular no backend toda vez, são necessários agregados de tempo e demografia (`meta-ads-publicos.ts` e diários):

### Tabelas / Collections Recomendadas para Relatórios:
1. **Métricas Diárias de performance (`DadosDiarios`)**
   - Data, Conta/Campanha Referência, Gastos Diários (`investimento`), Leads Gerados Diários (`leads`).
2. **Públicos por Demografia (`DadosDemograficos`)**
   - `faixa` ('18–24', '25–34', etc.), `genero`, dados de investimento e conversão.
3. **Placements (Locais de Publicação)**
   - Plataforma/Nome de placement, percentual do uso.
4. **Geo/Localização (`DadosCidade`)**
   - Agrupamento por Cidades e CPL local.
5. **Comportamento por Hora/Dia (`DadosHora`)**
   - Heatmap que exige 168 ocorrências (24h * 7 dias da semana) de contagem e intensidade de leads para preencher o mapa de calor da UI.

---

## 🤖 Sistema de IA (Insights Automáticos)
A interface depende largamente de alertas gerados por IA (`InsightIA`, `InsightCriativo`, `InsightPublico`).
Pode ser criada uma tabela unificada: `ai_insights`.
- `id` (UUID)
- `referencia_id` (ID do Anúncio, Criativo ou Público envolvido)
- `tipo_entidade` ('anuncio', 'criativo', 'publico')
- `severidade` (`alerta`, `oportunidade`, `info`)
- `titulo`, `mensagem`, `analiseCompleta` (Texto explicativo da IA)
- `labelAcao` (String do botão recomendado, como "Pausar", "Escalar")

## 🔗 Recomendações para o Agente Desenvolvedor Backend:
1. Ao buscar as métricas usando a **Graph API do Facebook (Meta)** e o endpoint `/v18.0/act_<ID>/insights`, mantenha scripts diários (`cron jobs` ou Celery/RabbitMQ) para extrair, converter (taxas como CPC, CPL, CTR) e persistir nessas tabelas.
2. Certifique-se de que os ENUMS de Status do Facebook cheguem ao Frontend mapeados perfeitamente (ex. status PAUSED não pode chegar lowercase caso a tipagem espere ACTIVE/PAUSED estrito, dependendo de como o parser for feito).
3. Todas as referências monetárias (`investimento`, `cpl`, `cpm`, etc.) estão sendo apresentadas como numéricos de ponto flutuante. Mantenha no banco como `DECIMAL` para evitar falha em contas, mas retorne como `number` / float no JSON pro Frontend.
4. `thumbnailUrl` é muito importante no Frontend para a imersão visual dos dashboards. Use a field `adcreatives` do Meta API, pegando o campo `image_url` ou a miniatura do vídeo de lá.
