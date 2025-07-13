---
title: "Minha Jornada com AstroJS: Performance e Frustração"
slug: "experiencia-astro-js"
date: 2025-06-19
author: "Skittz"
description: "Uma análise sobre o desenvolvimento com AstroJS"
lang: "pt-br"
---

# Minha Jornada com AstroJS: Performance e Frustração

Depois de construir este projeto com **AstroJS**, resolvi compartilhar minha experiência com esse gerador de sites estáticos que vem ganhando muita popularidade. Embora o Astro prometa alta performance e recursos amigáveis ao desenvolvedor, minha trajetória foi uma mistura de capacidades impressionantes e frustrações notáveis.

## O lado positivo: por que me encantei pelo Astro

O AstroJS cumpre muitas de suas promessas principais. A **arquitetura island** 🏝️ — que permite hidratar apenas os componentes que precisam de interatividade — é um diferencial. O resultado da build é extremamente enxuto, e os índices de performance falam por si só.

Outro ponto forte é a **flexibilidade para criar componentes**. Você pode escrever componentes em React, Vue, Svelte ou mesmo HTML puro dentro do mesmo projeto, o que é ótimo. A curva de aprendizado é suave e a documentação, completa. As coleções de conteúdo facilitam muito a gestão de arquivos Markdown, e a integração com TypeScript é bastante fluida.

## A dura realidade: fluxo de desenvolvimento frustrante

Porém, há um ponto crítico que atrapalhou bastante a experiência de desenvolvimento: os **tempos lentos de compilação durante o desenvolvimento** 🐢. Toda alteração, por menor que seja, pode disparar um ciclo de processamento que se torna **desnecessariamente demorado** ⏳. O que deveria ser uma rápida iteração acaba virando um teste de paciência.

Na minha experiência, o principal culpado foi a **integração com o Tailwind CSS**. Ao rodar o servidor de desenvolvimento com `astro dev --verbose`, percebi que o processamento do Tailwind contribui significativamente para o tempo de compilação, especialmente conforme o projeto e as folhas de estilo aumentam. Embora o Tailwind em si não seja lento, a forma como ele se integra ao processo de build do Astro pode causar atrasos perceptíveis no feedback do desenvolvimento.

Isso não é exatamente culpa do Astro, mas sim de como frameworks CSS como o Tailwind interagem com ele. Ainda assim, essa combinação pode resultar numa experiência de desenvolvimento lenta, prejudicando o estado de fluxo essencial para um **codar produtivo** 🚧.

O hot module replacement (HMR) 🔁 funciona quando quer, mas a inconsistência faz você recorrer ao botão de atualizar o navegador 🔄 ou até reiniciar o servidor de desenvolvimento com frequência, o que gera uma sensação frustrante de "liga e desliga" durante o processo.

## Para concluir...

Eu recomendaria o Astro? Sim, mas com ressalvas ⚠️. Se você estiver construindo sites com muito conteúdo e conseguir tolerar as interrupções no fluxo de desenvolvimento, os benefícios do Astro superam os contratempos.

Vale lembrar que o AstroJS ainda é um framework relativamente jovem 🌱 e algumas integrações podem não estar tão otimizadas quanto as de ferramentas mais maduras do mercado. Conforme o ecossistema evoluir, esses pontos devem melhorar — mas por enquanto, prepare-se para alguns solavancos ao longo da jornada 😄.
