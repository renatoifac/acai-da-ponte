# Especificação do site — Açaí da Ponte

## 1. Objetivo

Criar um site leve, sofisticado e fácil de usar para a açaiteria de bairro Açaí da Ponte, em Sena Madureira (AC). O cliente deve consultar o funcionamento e o cardápio, montar um pedido para retirada e encaminhá-lo à loja pelo WhatsApp.

## 2. Público e contexto de uso

- Clientes que acessam principalmente pelo celular, inclusive na rua e com apenas uma mão.
- O site deve funcionar bem em telas pequenas, com conexão móvel e sem exigir instalação ou cadastro.
- O conteúdo e as ações principais devem estar em português do Brasil.

## 3. Escopo

### Incluído

- Exibição do estado da loja (aberta ou fechada) e dos horários de funcionamento.
- Cardápio de tamanhos de copo e complementos, com seus preços.
- Montagem e edição de um pedido para retirada.
- Cálculo do total durante a seleção.
- Envio do resumo do pedido pelo WhatsApp da loja.
- Uma única fonte de configuração para itens e preços, facilitando atualizações pelo dono.

### Fora do escopo

- Pagamento pelo site, entrega, acompanhamento do pedido ou confirmação automática pela loja.
- Conta de cliente, histórico de pedidos ou integração com sistema de caixa.
- Envio automático de mensagem sem ação e confirmação do cliente no WhatsApp.

## 4. Estrutura da página

1. **Cabeçalho**
   - Nome ou logotipo “Açaí da Ponte”.
   - Indicador de estado: “Aberto agora” ou “Fechado agora”.
   - Horário de funcionamento, visível sem precisar abrir um menu.
2. **Cardápio**
   - Seção de tamanhos de copo com nome, descrição opcional e preço.
   - Seção de complementos com nome, descrição opcional e preço.
   - A apresentação deve deixar claro quais opções podem ser selecionadas e seus valores.
3. **Montador do pedido**
   - Seleção de um tamanho de copo.
   - Seleção de até três complementos.
   - Resumo das escolhas e total atualizado.
   - Ações para remover escolhas e recomeçar o pedido.
4. **Ação de envio**
   - Botão destacado para enviar o pedido pelo WhatsApp para retirada.
   - Em celular, manter o resumo do total e o botão acessíveis junto à parte inferior da tela, sem encobrir conteúdo ou controles.

## 5. Requisitos funcionais

### 5.1 Estado da loja

- Calcular o estado aberto/fechado com base nos horários configurados e no horário local de Sena Madureira, usando o fuso `America/Rio_Branco`.
- Mostrar os horários por dia da semana, inclusive quando houver dias sem atendimento.
- Se a loja estiver fechada, informar o próximo horário de funcionamento quando isso puder ser determinado pela configuração.
- Os horários reais ainda precisam ser fornecidos pelo dono; não devem ser inventados.

### 5.2 Cardápio e configuração

- Manter tamanhos, complementos, descrições e preços em um único local de configuração, sem espalhar valores pela interface.
- Cada item deve ter um nome identificável e um preço em reais.
- O cardápio deve poder ser atualizado pelo dono alterando essa configuração, sem precisar redesenhar cada tela.
- Os nomes, opções e preços reais ainda precisam ser fornecidos pelo dono.

### 5.3 Montagem e edição do pedido

- O cliente seleciona exatamente um tamanho para iniciar um pedido.
- O cliente pode selecionar de zero a três complementos.
- Não permitir selecionar um quarto complemento; explicar o limite de forma breve.
- Exibir o preço do tamanho e de cada complemento selecionado.
- Atualizar o total imediatamente a cada seleção ou remoção.
- Permitir remover individualmente o tamanho ou qualquer complemento. Se o tamanho for removido, o pedido deixa de estar pronto para envio até que outro seja escolhido.
- Disponibilizar “Recomeçar pedido”, que limpa as escolhas após confirmação quando já houver itens selecionados.
- Não permitir enviar pedido sem um tamanho selecionado.

### 5.4 Envio pelo WhatsApp

- O botão de envio abre o WhatsApp direcionado ao número configurado da loja, com a mensagem do pedido preenchida.
- A mensagem deve conter, no mínimo:
  - identificação de que é um pedido para retirada;
  - tamanho escolhido e respectivo preço;
  - complementos selecionados e respectivos preços, se houver;
  - total do pedido.
- O cliente revisa e confirma o envio no próprio WhatsApp. O site não deve afirmar que a loja recebeu ou aceitou o pedido.
- Número e texto devem ser preparados de forma compatível com o link oficial do WhatsApp e com caracteres acentuados.
- O número real de WhatsApp ainda precisa ser fornecido pelo dono.

## 6. Regras de preço

- O total é a soma do preço do tamanho com os preços dos complementos selecionados.
- Valores devem ser apresentados em reais, com formatação brasileira (por exemplo, `R$ 12,00`).
- O mesmo valor definido na configuração deve ser usado no cardápio, no resumo e na mensagem do WhatsApp.
- A especificação não determina se algum complemento é gratuito ou incluído no copo; essa regra e os preços devem ser confirmados pelo dono e refletidos na configuração do cardápio.

## 7. Experiência visual e interação

- Direção visual: sofisticada, moderna, acolhedora e apropriada a uma açaiteria de bairro.
- Paleta obrigatória:
  - Fundo claro: `#FAF7F2`
  - Roxo: `#4B1F5E`
  - Verde: `#2E7D32`
  - Texto escuro: `#2B2B2B`
- Usar o roxo para identidade e ações principais; reservar o verde para o estado “aberto” e sinais positivos. O estado “fechado” deve ser distinguível sem depender apenas de cor.
- Manter contraste legível, tipografia confortável e áreas de toque amplas.
- Priorizar uma coluna em celular, hierarquia visual clara e textos curtos.
- Tornar o total e a próxima ação fáceis de alcançar com o polegar.
- Mostrar estados claros para ausência de tamanho selecionado, limite de complementos e pedido pronto.
- Evitar animações ou elementos decorativos que atrasem ou dificultem a seleção.

## 8. Requisitos técnicos

- Implementação em HTML, CSS e JavaScript puros, sem frameworks.
- Não exigir backend para consultar o cardápio, calcular o pedido ou abrir o WhatsApp.
- O site deve ser responsivo e utilizável em navegadores móveis e de computador atuais.
- Não armazenar dados pessoais ou informações do pedido além do necessário para preparar a mensagem no navegador.
- A configuração do cardápio, horários e número de WhatsApp deve ser facilmente localizada e documentada para manutenção.

## 9. Acessibilidade e confiabilidade

- Controles utilizáveis por toque e teclado, com foco visível e rótulos compreensíveis.
- Informar seleções e alterações do total de modo perceptível também por tecnologias assistivas.
- Não comunicar estado ou preço somente por cor.
- Garantir que o conteúdo continue disponível com zoom e em telas estreitas.
- Se o link de WhatsApp não puder ser preparado por falta de configuração do número, apresentar uma mensagem clara em vez de simular sucesso.

## 10. Critérios de aceite

- Ao abrir o site, é possível identificar se a loja está aberta ou fechada e consultar os horários.
- O cardápio apresenta tamanhos, complementos e preços configurados.
- É possível escolher um tamanho e até três complementos, vendo o total atualizado a cada mudança.
- É possível remover uma escolha e recomeçar o pedido.
- Não é possível enviar um pedido sem tamanho nem escolher mais de três complementos.
- O botão abre o WhatsApp com uma mensagem contendo as escolhas e o total corretos, destinada à retirada.
- Os preços exibidos e enviados correspondem à mesma configuração.
- As ações principais são utilizáveis em uma tela de celular com uma mão.
- A solução usa somente HTML, CSS e JavaScript, sem frameworks.

## 11. Informações pendentes para publicação

- Horários de funcionamento por dia da semana e eventuais pausas.
- Tamanhos de copo, descrições e preços.
- Lista de complementos, preços e indicação de itens incluídos ou gratuitos, se houver.
- Número de WhatsApp da loja com código do país e DDD.
- Logotipo ou decisão de usar o nome da loja como identidade textual.
