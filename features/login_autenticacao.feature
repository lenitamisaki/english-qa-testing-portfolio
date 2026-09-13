# language: pt
# Épico: QAZ-1 - LOGIN / AUTENTICACAO
# Ativo protegido: identidade/conta do usuário (porta de entrada para conversas privadas,
# progresso e acesso premium). Propriedades: Autenticação (base da Autorização).
# Tags: @funcional (funciona?), @seguranca (resiste a ataque? - CT-STE)
# ATENÇÃO: cenários @seguranca com viés ofensivo (brute force, injeção) só devem ser
# executados em ambiente autorizado, com escopo combinado por escrito com a organização.

Funcionalidade: Login e Autenticação
  Como usuária do English QA
  Quero autenticar com segurança
  Para acessar meus dados e conteúdos de forma protegida

  # ---------------------------------------------------------------
  # FUNCIONAIS
  # ---------------------------------------------------------------

  @funcional
  Cenário: Login com credenciais válidas
    Dado que estou na tela de login
    E possuo uma conta válida cadastrada
    Quando informo meu e-mail e senha corretos
    E clico em "Entrar"
    Então devo ser autenticada e redirecionada para a tela inicial

  @funcional
  Cenário: Login com senha incorreta
    Dado que estou na tela de login
    E possuo uma conta válida cadastrada
    Quando informo meu e-mail correto e uma senha incorreta
    E clico em "Entrar"
    Então devo permanecer na tela de login
    E devo ver uma mensagem de erro de autenticação

  @funcional
  Cenário: Login com e-mail não cadastrado
    Dado que estou na tela de login
    Quando informo um e-mail que não possui conta
    E informo qualquer senha
    E clico em "Entrar"
    Então devo permanecer na tela de login
    E devo ver uma mensagem de erro de autenticação

  @funcional
  Esquema do Cenário: Campos obrigatórios não preenchidos
    Dado que estou na tela de login
    Quando deixo o campo "<campo_vazio>" em branco
    E clico em "Entrar"
    Então devo ver uma indicação de campo obrigatório
    E o login não deve ser submetido

    Exemplos:
      | campo_vazio |
      | e-mail      |
      | senha       |
      | ambos       |

  @funcional
  Cenário: Formato de e-mail inválido
    Dado que estou na tela de login
    Quando informo um e-mail sem formato válido
    E clico em "Entrar"
    Então devo ver uma mensagem de formato de e-mail inválido

  @funcional
  Cenário: Logout encerra a sessão
    Dado que estou autenticada no sistema
    Quando clico em "Sair"
    Então minha sessão deve ser encerrada
    E ao tentar voltar a uma página interna devo ser levada à tela de login

  # ---------------------------------------------------------------
  # SEGURANÇA - CT-STE
  # ---------------------------------------------------------------

  @seguranca
  Cenário: Proteção contra tentativas repetidas de senha (brute force)
    Dado que estou na tela de login
    E possuo uma conta válida cadastrada
    Quando erro a senha por várias tentativas consecutivas
    Então o sistema deve limitar novas tentativas
    E deve aplicar bloqueio temporário, atraso ou desafio (ex.: captcha)

  @seguranca
  Cenário: Mensagem de erro não revela se o e-mail existe
    Dado que estou na tela de login
    Quando tento login com um e-mail inexistente
    E tento login com um e-mail existente e senha errada
    Então a mensagem de erro deve ser genérica nos dois casos
    E não deve permitir descobrir quais e-mails estão cadastrados

  @seguranca
  Cenário: Campos de login resistem a tentativa de injeção
    Dado que estou na tela de login
    Quando insiro nos campos entradas que tentam simular comandos de banco de dados
    E clico em "Entrar"
    Então o sistema deve tratar a entrada como texto comum
    E não deve autenticar nem apresentar erro de banco de dados

  @seguranca
  Cenário: Campos de login resistem a tentativa de script (XSS)
    Dado que estou na tela de login
    Quando insiro nos campos uma entrada que tenta injetar script
    E submeto o formulário
    Então o conteúdo não deve ser executado
    E deve ser exibido ou tratado de forma segura

  @seguranca
  Cenário: Credenciais trafegam de forma protegida
    Dado que estou na tela de login
    Quando submeto minhas credenciais
    Então a comunicação deve ocorrer sobre canal seguro (HTTPS)
    E a senha não deve trafegar nem ser armazenada em texto puro

  @seguranca
  Cenário: Senha é mascarada na interface
    Dado que estou na tela de login
    Quando digito minha senha
    Então os caracteres devem ser exibidos de forma mascarada

  @seguranca
  Cenário: Sessão expira após período de inatividade
    Dado que estou autenticada no sistema
    Quando permanço inativa por tempo superior ao limite definido
    E tento realizar uma ação que exige autenticação
    Então devo ser desconectada e levada à tela de login

  @seguranca
  Cenário: Acesso a página interna sem autenticação é bloqueado
    Dado que não estou autenticada
    Quando tento acessar diretamente a URL de uma página interna
    Então devo ser redirecionada para a tela de login
    E não devo ver o conteúdo protegido
