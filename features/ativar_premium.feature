# language: pt
# Épico: QAZ-2 - ATIVAR PREMIUM
# Ativo protegido: conteúdo pago + recursos/tokens de IA da aplicação.
# Propriedades: Autorização (principal) e Disponibilidade.
# Cupom de referência do projeto: QAZANDOENGLISH2025
# ATENÇÃO: cenários @seguranca de bypass/adulteração/abuso só em ambiente autorizado,
# com escopo combinado por escrito com a organização.

Funcionalidade: Ativação de conteúdo Premium
  Como usuária do English QA
  Quero ativar o conteúdo premium por cupom
  Para acessar apenas o que tenho direito, de forma controlada

  # ---------------------------------------------------------------
  # FUNCIONAIS
  # ---------------------------------------------------------------

  @funcional
  Cenário: Ativar premium com cupom válido
    Dado que estou autenticada com uma conta sem premium
    E estou na tela "Ativar Código Premium"
    Quando informo o cupom válido "QAZANDOENGLISH2025"
    E confirmo a ativação
    Então minha conta deve passar a ter acesso premium
    E o conteúdo premium deve ser liberado

  @funcional
  Cenário: Cupom inválido é rejeitado
    Dado que estou na tela "Ativar Código Premium"
    Quando informo um cupom inexistente
    E confirmo a ativação
    Então devo ver uma mensagem de cupom inválido
    E minha conta deve permanecer sem premium

  @funcional
  Cenário: Campo de cupom vazio
    Dado que estou na tela "Ativar Código Premium"
    Quando confirmo a ativação sem informar nenhum cupom
    Então devo ver uma indicação de campo obrigatório
    E nenhuma ativação deve ocorrer

  @funcional
  Cenário: Cupom expirado ou já utilizado
    Dado que possuo um cupom que já foi utilizado ou expirou
    E estou na tela "Ativar Código Premium"
    Quando informo esse cupom
    E confirmo a ativação
    Então devo ver uma mensagem indicando que o cupom não é mais válido
    E minha conta deve permanecer sem premium

  @funcional
  Cenário: Conteúdo premium fica visível após ativação
    Dado que ativei o premium com sucesso
    Quando acesso uma área antes bloqueada (ex.: Exercícios ou Histórias)
    Então devo conseguir visualizar o conteúdo sem o aviso de bloqueio

  # ---------------------------------------------------------------
  # SEGURANÇA - CT-STE (Autorização)
  # ---------------------------------------------------------------

  @seguranca
  Cenário: Usuário sem premium é bloqueado no conteúdo pago
    Dado que estou autenticada com uma conta sem premium
    Quando tento acessar uma funcionalidade exclusiva premium pela interface
    Então devo ver o aviso de conteúdo premium
    E não devo conseguir consumir o conteúdo

  @seguranca
  Cenário: Acesso direto por URL a recurso premium sem ativação (broken access control)
    Dado que estou autenticada com uma conta sem premium
    Quando tento acessar diretamente a URL de um recurso premium
    Então o servidor deve negar o acesso
    E não deve entregar o conteúdo protegido

  @seguranca
  Cenário: Adulteração do status para premium é rejeitada pelo servidor
    Dado que estou autenticada com uma conta sem premium
    Quando tento modificar a requisição para forçar o status "premium"
    Então a validação no servidor deve rejeitar a alteração
    E meu acesso deve permanecer restrito ao plano free

  @seguranca
  Cenário: Validação do cupom ocorre no servidor, não apenas no cliente
    Dado que estou na tela "Ativar Código Premium"
    Quando tento contornar a validação pelo lado cliente
    Então a decisão final de ativação deve depender do servidor
    E um cupom inválido não deve liberar acesso mesmo assim

  @seguranca
  Cenário: Proteção contra tentativa em massa de cupons (brute force)
    Dado que estou na tela "Ativar Código Premium"
    Quando submeto muitos códigos diferentes em sequência
    Então o sistema deve limitar a taxa de tentativas
    E deve dificultar a adivinhação de cupons válidos

  @seguranca
  Cenário: Cupom de uso único não pode ser reaproveitado
    Dado que um cupom de uso único já foi ativado em uma conta
    Quando tento ativar o mesmo cupom em outra conta
    Então a ativação deve ser recusada

  # ---------------------------------------------------------------
  # SEGURANÇA - CT-STE (Disponibilidade / abuso de recursos)
  # ---------------------------------------------------------------

  @seguranca
  Cenário: Limite de consumo de recursos de IA por usuário
    Dado que possuo acesso a funcionalidades que consomem tokens de IA
    Quando realizo um volume de uso muito acima do padrão em curto período
    Então o sistema deve aplicar limite de uso (rate limiting) ou cota
    E o serviço deve permanecer disponível para os demais usuários
