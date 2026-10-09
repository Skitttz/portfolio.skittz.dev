---
title: "Programando com IA: entre velocidade e revisão"
slug: "jornada-com-ia"
translationKey: "ai-journey"
date: 2026-10-06
author: "Skittz"
description: "Chegando um pouco atrasado no hype de IA e como está sendo a jornada."
lang: "pt-br"
---

Estamos na era da **IA**, e cada vez mais as pessoas estão impressionadas com o quanto ela se popularizou de alguns anos para cá. É curioso pensar em como o usuário final aderiu tão rápido a essa ferramenta. Eu, como desenvolvedor, peguei esse movimento com o barco já andando, e andando rápido.

## Chegando atrasado: um ano pescando ferramentas

Até certo tempo atrás, eu ainda estava tentando entender qual ferramenta se encaixaria melhor no meu workflow. Demorei um pouco para começar a usar ferramentas de IA porque tinha outras prioridades na frente.

Quando tive a oportunidade de começar a estudar de verdade, fiz uma pescaria por várias ferramentas: Cursor, Trae, Copilot (antes da pausa nas novas assinaturas individuais, em 2026), até chegar no Claude e no Codex, que, na minha opinião, são os mais mainstream atualmente. Também testei o Kimi por um mês, depois de ser selecionado para assinar.

Fiquei mais ou menos um ano testando as ferramentas novas, e de 2025 para 2026 foi o período em que mais explorei as coisas, mesmo que atrasado. Quando usei o Cursor pela primeira vez, ele já estava bastante evoluído: não peguei a fase do autocomplete e depois a do agent mode, peguei tudo de uma vez.

Depois comecei a estudar spec e arquitetura de IA, a conhecer frameworks como LangChain e Pydantic AI e a entender sobre tokenização, custo, RAG e MCP. E sei que ainda tem bastante coisa que não conheço. Nunca usei OpenClaw ou coisas do tipo. Também não cheguei a usar n8n, outra coisa que já teve seu hype em uma época: via que era útil nos projetos que alguns colegas de trabalho me mostravam, só não fazia muito sentido para mim.

## Do 0 ao 90: os 10 que faltam

Quem fala bastante sobre IA é o Fabio Akita, programador brasileiro bastante conhecido na comunidade pelo blog AkitaOnRails e pelo canal Akitando, no YouTube. Quero deixar claro que não concordo com algumas coisas que ele defende. Ainda assim, tenho a visão de que ele é aquele mestre de kung fu rígido, sabe? É durão, mas é daqueles com quem se aprende. Uma das minhas citações preferidas dele nessa época, e que ele repete bastante, é esta:

> "Sua empolgação com IA é inversamente proporcional ao seu conhecimento sobre IA."
>
> Fabio Akita, em [RANT: IA acabou com os programadores?](https://akitaonrails.com/2026/02/08/rant-ia-acabou-com-programadores/)

É sobre isso. A IA hoje facilita bastante o trabalho e realmente faz você sair do **0 ao 90** muito rápido. Mas os **10 que faltam** são algo que venho observando. Essa ideia do 0 ao 90 eu vi em um vídeo que não consegui reencontrar, mas já era algo que eu sentia.

Os modelos estão mais "inteligentes", e isso acaba gerando um erro no escuro: se a IA está mais inteligente, os erros também são mais **silenciosos**. Você não vai ver a IA errando besteiras que ficam evidentes, mas ela pode errar algo que se agrava lá na frente.

Um [preprint de janeiro de 2026](https://arxiv.org/abs/2601.01490) aponta para esse mesmo lado. Ele comparou o GPT-5.2 e o Gemini 3 Flash com e sem raciocínio, pedindo que recomendassem apenas artigos publicados em periódicos revisados por pares. Sem raciocínio, os modelos descumpriam a restrição em 66% a 75% das recomendações: indicavam artigos de conferência e preprints, mas trabalhos que existiam de verdade. Com raciocínio, o descumprimento caiu para 13% a 26%, mas a distorção praticamente dobrou: os modelos pegavam um artigo real de conferência e o apresentavam como se fosse de periódico, com volume e páginas inventados, para parecer que estavam cumprindo o pedido. Não é um estudo sobre código, mas o padrão me parece o mesmo: o erro que antes era evidente virou um erro difícil de detectar.

Além disso, tem o fator humano. No final, a IA é igual a um foguete, mas quem aciona o botão são os humanos, com as instruções. Se essas instruções não estiverem claras, pode acontecer de criar coisas com muitas falhas.

## Instruções claras: spec, skills e harness

Se quem aciona o botão somos nós, boa parte do trabalho passa a ser deixar as instruções claras. É aí que entram três coisas que hoje fazem parte do meu workflow.

A primeira é o **spec-driven development**: uso spec para definir as coisas técnicas antes de sair gerando código, e a IA implementa em cima do que foi definido. A segunda são as **skills**, instruções reutilizáveis que o agente carrega para um tipo de tarefa. Tenho skills para commits estruturados, skills de plano e por aí vai.

A terceira é o **harness**, que é tudo o que fica em volta do modelo: o código que decide o que ele guarda, o que ele busca e o que ele enxerga. O [paper do Meta-Harness](https://arxiv.org/abs/2603.28052), de março de 2026, abre citando que mudar só o harness, mantendo o mesmo modelo, pode gerar uma diferença de desempenho de até 6 vezes no mesmo benchmark. Ou seja, o resultado não depende só do modelo: depende também do que você coloca ao redor dele.

E, mesmo com instruções claras o suficiente, acho que ainda vale olhar o resultado. Mas essa é uma opinião cética minha :D

## Revisão não é gargalo: é validação

Delegar tudo para a IA ainda não faz parte do meu dia a dia. Porém, evidentemente, ela virou parte dele na hora de codar o começo de uma estrutura e de refinar, até chegar o momento da revisão. É aqui que o pessoal hoje fala que o gargalo é a revisão. Para mim, **revisão não é gargalo**: é uma forma de validar as coisas. Não vejo sentido em apressar tanto e correr o risco de gerar mais retrabalho.

É verdade que, mesmo revisando, talvez algo passe. Mas, se eu pegar algo antes, já é uma coisa a menos para ajustar depois.

Tem quem diga que código de IA tem que ser revisado por IA, e eu também acredito nisso. Só que o código da IA também foi feito a partir do nosso código. Quando eu não entendo o que ela entrega e também não acho nenhum problema, geralmente é sinal de que não olhei com atenção suficiente.

A IA ainda não entrega 100% do código seguindo boas práticas sem receber boas instruções. E o que conta como boa prática vai de cada um e, ao mesmo tempo, do padrão da equipe. Mas isso já daria outra conversa.

## Para concluir: vale não endoidar

Nesse mundo louco em que toda hora sai uma ferramenta nova e todo dia sai uma coisa nova, a única dica que eu dou é: **vale não endoidar**. E vale começar a analisar, ao redor, as dores das pessoas do seu cotidiano. Como ficou mais fácil criar as coisas, a gente consegue colocar em prática ideias que antes demorariam meses para fazer. Por isso, a **validação a curto prazo** está sendo uma das melhores coisas dessa era.

No final, o que vai diferenciar o seu app de outro, quando os dois times têm o mesmo nível técnico, é o **tato** que uma pessoa pode ter em relação às dores e a como resolvê-las da melhor forma. A gente sempre andou nessa direção. Antes, os softwares eram feitos para funcionar. Depois veio a leva de, além de funcionar, melhorar a experiência e a usabilidade. Agora, eu acredito que o ponto mais forte do software vai ser justamente essa parte de usabilidade. Com a barreira técnica diminuindo, o que vai realmente fazer a diferença, e que já fazia antes mesmo de a IA explodir, é a **experiência** e se o problema está sendo resolvido.

Sendo sincero, o usuário final até hoje não está nem aí se uma request demora 300 ms ou 800 ms, desde que resolva e não seja coisa de 10 segundos. Claro que não estou falando para negligenciar isso, mas deu para entender :)
