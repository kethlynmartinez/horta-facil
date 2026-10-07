/*
  Planejamento e organização: época de plantio e plantas companheiras.
  Referência de época: Sul do Brasil (clima subtropical). Varia por região e variedade.
  Estações: P primavera (set-nov), V verão (dez-fev), O outono (mar-mai), I inverno (jun-ago).
  As relações de companheirismo vêm de práticas comuns de consórcio em hortas e são orientações gerais.
*/
(function () {
  const ESTACOES = `
Alface|PVOI
Rúcula|OIP
Couve|PVOI
Espinafre|OI
Agrião|OIP
Acelga|PVOI
Chicória|OIP
Escarola|OI
Repolho|OI
Couve-flor|OI
Brócolis|OI
Mostarda|OI
Radicchio|OI
Manjericão|PV
Cebolinha|PVOI
Salsa|OIP
Coentro|OIP
Orégano|PVO
Manjerona|PV
Tomilho|OIP
Alecrim|PVOI
Sálvia|OP
Hortelã|PVO
Hortelã-pimenta|PVO
Louro|PVOI
Endro|OIP
Funcho|OI
Estragão|PV
Cebolinha-francesa|PVO
Aipo|OIP
Segurelha|PV
Cerefólio|OI
Tomate|PV
Tomate-cereja|PV
Pimentão|PV
Pimenta-malagueta|PV
Pimenta-biquinho|PV
Berinjela|PV
Jiló|PV
Pepino|PV
Abobrinha|PV
Abóbora|PV
Chuchu|PV
Quiabo|PV
Maxixe|PV
Melancia|PV
Melão|PV
Milho|PV
Morango|OI
Cenoura|OIP
Beterraba|OIP
Rabanete|PVOI
Nabo|OI
Batata-doce|PV
Batata|PV
Mandioca|IP
Inhame|PV
Cará|PV
Gengibre|PV
Cúrcuma|PV
Alho|OI
Cebola|OI
Alho-poró|OI
Mandioquinha|OI
Taioba|PV
Ora-pro-nóbis|PVO
Peixinho-da-horta|PVO
Serralha|OIP
Beldroega|PV
Capuchinha|OP
Bertalha|PV
Caruru|PV
Major-gomes|PV
Vinagreira|PV
Azedinha|OIP
Dente-de-leão|OIP
Trapoeraba|PVO
Begônia|PVO
Cardo-santo|PV
Mamão-macho|PV
Jambu|PV
Tansagem|PVOI
Picão-preto|PV
Linhaça|OI
Boldo|PVO
Capim-limão|PV
Camomila|OI
Erva-cidreira|PVO
Melissa|PVO
Babosa|PVOI
Arruda|PVO
Hortelã-graúda|PVO
Poejo|PVO
Losna|PVO
Calêndula|OIP
Guaco|PVO
Alfavaca|PV
Citronela|PV
Lavanda|OIP
Erva-doce|OP
Gerânio-cheiroso|PVO
Carqueja|PVO
Chá-verde|IP
Hibisco|PV
Feijão|PV
Ervilha|OI
Vagem|PV
Fava|OI
Feijão-de-corda|PV
Soja|PV
Amendoim|PV
Grão-de-bico|OI
Lentilha|OI
Guandu|PV
Limão|OIP
Laranja|OIP
Tangerina|OIP
Banana|PV
Mamão|PV
Maracujá|PV
Goiaba|PVO
Acerola|PV
Pitanga|PVO
Amora|IP
Jabuticaba|PVO
Abacaxi|PV
Girassol|PV
Tagetes|PV
Amor-perfeito|OI
Borragem|OIP
Rosa|IP
Cosmos|PV
Cravo-de-defunto|PV
Violeta|OI
`;

  // [planta, [boas companheiras], [evitar por perto]]
  const RELACOES = [
    ["Tomate", ["Manjericão", "Cebolinha", "Cenoura", "Salsa", "Alho", "Calêndula", "Tagetes", "Borragem"], ["Batata", "Funcho", "Couve", "Repolho", "Milho"]],
    ["Tomate-cereja", ["Manjericão", "Cebolinha", "Cenoura", "Alho", "Tagetes"], ["Batata", "Funcho", "Couve", "Repolho"]],
    ["Alface", ["Cenoura", "Rabanete", "Cebolinha", "Morango", "Pepino", "Beterraba", "Cebola"], []],
    ["Cenoura", ["Cebola", "Alho", "Alho-poró", "Alface", "Rabanete", "Tomate", "Sálvia", "Alecrim", "Ervilha"], ["Funcho", "Endro"]],
    ["Cebola", ["Cenoura", "Beterraba", "Alface", "Tomate", "Camomila", "Morango"], ["Feijão", "Ervilha"]],
    ["Alho", ["Tomate", "Cenoura", "Beterraba", "Morango", "Rosa"], ["Feijão", "Ervilha"]],
    ["Alho-poró", ["Cenoura", "Aipo", "Cebola", "Morango"], ["Feijão", "Ervilha"]],
    ["Feijão", ["Milho", "Cenoura", "Abóbora", "Pepino", "Couve", "Batata"], ["Cebola", "Alho", "Alho-poró", "Funcho"]],
    ["Vagem", ["Milho", "Cenoura", "Pepino", "Batata"], ["Cebola", "Alho", "Funcho"]],
    ["Milho", ["Feijão", "Abóbora", "Pepino", "Ervilha", "Girassol"], ["Tomate"]],
    ["Abóbora", ["Milho", "Feijão", "Capuchinha"], ["Batata"]],
    ["Abobrinha", ["Milho", "Feijão", "Capuchinha", "Borragem"], ["Batata"]],
    ["Pepino", ["Feijão", "Milho", "Alface", "Girassol", "Endro", "Rabanete"], ["Batata", "Sálvia"]],
    ["Couve", ["Cebola", "Alho", "Camomila", "Tomilho", "Capuchinha", "Beterraba", "Hortelã", "Alecrim"], ["Tomate", "Morango"]],
    ["Repolho", ["Cebola", "Alho", "Camomila", "Tomilho", "Capuchinha", "Beterraba", "Hortelã", "Sálvia", "Aipo"], ["Tomate", "Morango"]],
    ["Brócolis", ["Cebola", "Alho", "Camomila", "Capuchinha", "Beterraba", "Hortelã"], ["Tomate", "Morango"]],
    ["Couve-flor", ["Cebola", "Alho", "Camomila", "Capuchinha", "Beterraba", "Hortelã"], ["Tomate", "Morango"]],
    ["Beterraba", ["Cebola", "Alho", "Alface", "Couve", "Repolho"], ["Feijão"]],
    ["Rabanete", ["Alface", "Cenoura", "Pepino", "Ervilha", "Capuchinha"], []],
    ["Manjericão", ["Tomate", "Pimentão", "Pimenta-malagueta", "Berinjela"], ["Arruda"]],
    ["Salsa", ["Tomate", "Cenoura", "Cebola", "Alho-poró"], ["Hortelã"]],
    ["Hortelã", ["Couve", "Repolho", "Tomate"], ["Salsa"]],
    ["Alecrim", ["Sálvia", "Couve", "Cenoura", "Feijão"], []],
    ["Coentro", ["Tomate", "Alface", "Batata"], ["Funcho", "Endro"]],
    ["Funcho", [], ["Tomate", "Feijão", "Cenoura", "Coentro", "Pimentão", "Berinjela", "Vagem"]],
    ["Pimentão", ["Manjericão", "Cebola", "Cenoura", "Tomate"], ["Funcho"]],
    ["Pimenta-malagueta", ["Manjericão", "Cebola", "Cenoura", "Tomate"], ["Funcho"]],
    ["Berinjela", ["Feijão", "Tagetes", "Manjericão", "Tomilho"], ["Funcho"]],
    ["Morango", ["Alface", "Alho", "Cebola", "Borragem", "Espinafre"], ["Couve", "Repolho", "Brócolis", "Couve-flor"]],
    ["Ervilha", ["Cenoura", "Rabanete", "Milho", "Pepino"], ["Cebola", "Alho", "Alho-poró"]],
    ["Batata", ["Feijão", "Milho", "Couve", "Tagetes"], ["Tomate", "Abóbora", "Pepino", "Abobrinha"]],
    ["Espinafre", ["Morango", "Ervilha", "Couve"], []],
    ["Capuchinha", ["Abóbora", "Pepino", "Repolho", "Tomate", "Couve"], []],
    ["Tagetes", ["Tomate", "Feijão", "Batata", "Berinjela"], []],
    ["Cravo-de-defunto", ["Tomate", "Feijão", "Batata", "Berinjela"], []],
    ["Calêndula", ["Tomate", "Alface"], []],
    ["Camomila", ["Cebola", "Repolho", "Couve"], []],
    ["Girassol", ["Pepino", "Milho", "Abóbora"], []],
    ["Borragem", ["Tomate", "Morango", "Abóbora"], []],
    ["Aipo", ["Tomate", "Feijão", "Repolho", "Alho-poró"], []],
    ["Tomilho", ["Repolho", "Tomate", "Berinjela"], []],
    ["Sálvia", ["Cenoura", "Repolho", "Alecrim"], ["Pepino"]],
    ["Endro", ["Pepino", "Alface", "Repolho"], ["Cenoura", "Tomate"]]
  ];

  const NOMES_ESTACAO = { P: "Primavera", V: "Verão", O: "Outono", I: "Inverno" };
  const ORDEM = ["P", "V", "O", "I"];

  const porNome = {};
  HortaPlantas.todas.forEach(p => { porNome[HortaPlantas.normalizar(p.nome)] = p; });

  ESTACOES.trim().split("\n").forEach(l => {
    const [nome, est] = l.split("|");
    const p = porNome[HortaPlantas.normalizar(nome)];
    if (p) p.estacoes = est.split("");
  });

  const amigas = {};
  const evitar = {};
  function ligar(mapa, a, b) {
    const ka = HortaPlantas.normalizar(a), kb = HortaPlantas.normalizar(b);
    (mapa[ka] = mapa[ka] || new Set()).add(b);
    (mapa[kb] = mapa[kb] || new Set()).add(a);
  }
  RELACOES.forEach(([nome, boas, ruins]) => {
    boas.forEach(b => ligar(amigas, nome, b));
    ruins.forEach(r => ligar(evitar, nome, r));
  });
  // conflito prevalece sobre combinação quando as fontes divergem
  Object.keys(evitar).forEach(k => {
    if (!amigas[k]) return;
    evitar[k].forEach(r => amigas[k].delete(r));
  });

  function estacaoDoMes(mes) {
    if (mes === 11 || mes <= 1) return "V";
    if (mes <= 4) return "O";
    if (mes <= 7) return "I";
    return "P";
  }

  function lista(mapa, nome) {
    const s = mapa[HortaPlantas.normalizar(nome)];
    return s ? Array.from(s).filter(n => porNome[HortaPlantas.normalizar(n)]).sort() : [];
  }

  // analisa os pares de um conjunto de nomes
  function analisar(nomes) {
    const boas = [], ruins = [];
    for (let i = 0; i < nomes.length; i++) {
      for (let j = i + 1; j < nomes.length; j++) {
        const a = nomes[i], b = nomes[j];
        if (!a || !b) continue;
        const kb = HortaPlantas.normalizar(b);
        const ka = HortaPlantas.normalizar(a);
        if (evitar[ka] && Array.from(evitar[ka]).some(x => HortaPlantas.normalizar(x) === kb)) ruins.push([a, b]);
        else if (amigas[ka] && Array.from(amigas[ka]).some(x => HortaPlantas.normalizar(x) === kb)) boas.push([a, b]);
      }
    }
    return { boas, ruins };
  }

  Object.assign(HortaPlantas, {
    NOMES_ESTACAO,
    ORDEM_ESTACOES: ORDEM,
    estacaoDoMes,
    estacaoAtual: () => estacaoDoMes(new Date().getMonth()),
    plantarEm: (p, est) => !!(p.estacoes && p.estacoes.includes(est)),
    companheiras: nome => lista(amigas, nome),
    evitarPerto: nome => lista(evitar, nome),
    analisar
  });
})();
