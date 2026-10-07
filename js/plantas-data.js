/*
  Catálogo de plantas da Horta Fácil.
  - Dados de cultivo: lista local abaixo (nome, nome científico, categoria, sol, rega).
  - Fotos: buscadas na API pública do iNaturalist (sem chave, com CORS) pelo nome científico,
    com Wikipédia como alternativa. O resultado fica em cache no localStorage.
  - Plantas com foto própria em src/plantas usam a imagem local.
*/
(function () {
  const RAW = `
Alface|Lactuca sativa|Folhosas|Sol pleno|Frequente
Rúcula|Eruca vesicaria|Folhosas|Sol pleno|Frequente
Couve|Brassica oleracea var. acephala|Folhosas|Sol pleno|Moderada
Espinafre|Spinacia oleracea|Folhosas|Sol pleno|Frequente
Agrião|Nasturtium officinale|Folhosas|Meia-sombra|Frequente
Acelga|Beta vulgaris var. cicla|Folhosas|Sol pleno|Moderada
Chicória|Cichorium intybus|Folhosas|Sol pleno|Moderada
Escarola|Cichorium endivia|Folhosas|Sol pleno|Moderada
Repolho|Brassica oleracea var. capitata|Folhosas|Sol pleno|Moderada
Couve-flor|Brassica oleracea var. botrytis|Folhosas|Sol pleno|Moderada
Brócolis|Brassica oleracea var. italica|Folhosas|Sol pleno|Moderada
Mostarda|Brassica juncea|Folhosas|Sol pleno|Moderada
Radicchio|Cichorium intybus var. foliosum|Folhosas|Sol pleno|Moderada
Manjericão|Ocimum basilicum|Temperos|Sol pleno|Moderada
Cebolinha|Allium schoenoprasum|Temperos|Sol pleno|Leve
Salsa|Petroselinum crispum|Temperos|Sol pleno|Moderada
Coentro|Coriandrum sativum|Temperos|Sol pleno|Moderada
Orégano|Origanum vulgare|Temperos|Sol pleno|Leve
Manjerona|Origanum majorana|Temperos|Sol pleno|Moderada
Tomilho|Thymus vulgaris|Temperos|Sol pleno|Leve
Alecrim|Salvia rosmarinus|Temperos|Sol pleno|Leve
Sálvia|Salvia officinalis|Temperos|Sol pleno|Leve
Hortelã|Mentha spicata|Temperos|Meia-sombra|Frequente
Hortelã-pimenta|Mentha × piperita|Temperos|Meia-sombra|Frequente
Louro|Laurus nobilis|Temperos|Sol pleno|Leve
Endro|Anethum graveolens|Temperos|Sol pleno|Moderada
Funcho|Foeniculum vulgare|Temperos|Sol pleno|Moderada
Estragão|Artemisia dracunculus|Temperos|Sol pleno|Leve
Cebolinha-francesa|Allium tuberosum|Temperos|Sol pleno|Moderada
Aipo|Apium graveolens|Temperos|Meia-sombra|Frequente
Segurelha|Satureja hortensis|Temperos|Sol pleno|Leve
Cerefólio|Anthriscus cerefolium|Temperos|Meia-sombra|Moderada
Manjericão-roxo|Ocimum basilicum var. purpurascens|Temperos|Sol pleno|Moderada
Tomate|Solanum lycopersicum|Frutos|Sol pleno|Frequente
Tomate-cereja|Solanum lycopersicum var. cerasiforme|Frutos|Sol pleno|Frequente
Pimentão|Capsicum annuum|Frutos|Sol pleno|Moderada
Pimenta-malagueta|Capsicum frutescens|Frutos|Sol pleno|Moderada
Pimenta-biquinho|Capsicum chinense|Frutos|Sol pleno|Moderada
Berinjela|Solanum melongena|Frutos|Sol pleno|Frequente
Jiló|Solanum aethiopicum|Frutos|Sol pleno|Moderada
Pepino|Cucumis sativus|Frutos|Sol pleno|Frequente
Abobrinha|Cucurbita pepo|Frutos|Sol pleno|Frequente
Abóbora|Cucurbita maxima|Frutos|Sol pleno|Moderada
Chuchu|Sechium edule|Frutos|Sol pleno|Moderada
Quiabo|Abelmoschus esculentus|Frutos|Sol pleno|Moderada
Maxixe|Cucumis anguria|Frutos|Sol pleno|Moderada
Melancia|Citrullus lanatus|Frutos|Sol pleno|Moderada
Melão|Cucumis melo|Frutos|Sol pleno|Moderada
Milho|Zea mays|Frutos|Sol pleno|Moderada
Morango|Fragaria × ananassa|Frutos|Sol pleno|Frequente
Cenoura|Daucus carota|Raízes e tubérculos|Sol pleno|Moderada
Beterraba|Beta vulgaris|Raízes e tubérculos|Sol pleno|Moderada
Rabanete|Raphanus sativus|Raízes e tubérculos|Sol pleno|Frequente
Nabo|Brassica rapa|Raízes e tubérculos|Sol pleno|Moderada
Batata-doce|Ipomoea batatas|Raízes e tubérculos|Sol pleno|Moderada
Batata|Solanum tuberosum|Raízes e tubérculos|Sol pleno|Moderada
Mandioca|Manihot esculenta|Raízes e tubérculos|Sol pleno|Leve
Inhame|Dioscorea alata|Raízes e tubérculos|Meia-sombra|Moderada
Cará|Dioscorea bulbifera|Raízes e tubérculos|Meia-sombra|Moderada
Gengibre|Zingiber officinale|Raízes e tubérculos|Meia-sombra|Moderada
Cúrcuma|Curcuma longa|Raízes e tubérculos|Meia-sombra|Moderada
Alho|Allium sativum|Raízes e tubérculos|Sol pleno|Leve
Cebola|Allium cepa|Raízes e tubérculos|Sol pleno|Leve
Alho-poró|Allium ampeloprasum|Raízes e tubérculos|Sol pleno|Moderada
Mandioquinha|Arracacia xanthorrhiza|Raízes e tubérculos|Meia-sombra|Moderada
Taioba|Xanthosoma sagittifolium|PANCs|Meia-sombra|Frequente
Ora-pro-nóbis|Pereskia aculeata|PANCs|Sol pleno|Moderada
Peixinho-da-horta|Stachys byzantina|PANCs|Meia-sombra|Frequente
Serralha|Sonchus oleraceus|PANCs|Sol pleno|Moderada
Beldroega|Portulaca oleracea|PANCs|Sol pleno|Leve
Capuchinha|Tropaeolum majus|PANCs|Sol pleno|Moderada
Bertalha|Basella alba|PANCs|Sol pleno|Frequente
Caruru|Amaranthus viridis|PANCs|Sol pleno|Moderada
Major-gomes|Talinum paniculatum|PANCs|Sol pleno|Leve
Vinagreira|Hibiscus sabdariffa|PANCs|Sol pleno|Moderada
Azedinha|Rumex acetosa|PANCs|Meia-sombra|Moderada
Dente-de-leão|Taraxacum officinale|PANCs|Sol pleno|Moderada
Trapoeraba|Commelina erecta|PANCs|Meia-sombra|Frequente
Begônia|Begonia cucullata|PANCs|Meia-sombra|Moderada
Cardo-santo|Cnidoscolus aconitifolius|PANCs|Sol pleno|Moderada
Mamão-macho|Carica papaya|PANCs|Sol pleno|Moderada
Jambu|Acmella oleracea|PANCs|Sol pleno|Frequente
Tansagem|Plantago major|PANCs|Sol pleno|Moderada
Picão-preto|Bidens pilosa|PANCs|Sol pleno|Leve
Linhaça|Linum usitatissimum|PANCs|Sol pleno|Leve
Boldo|Plectranthus barbatus|Medicinais e chás|Meia-sombra|Moderada
Capim-limão|Cymbopogon citratus|Medicinais e chás|Sol pleno|Moderada
Camomila|Matricaria chamomilla|Medicinais e chás|Sol pleno|Moderada
Erva-cidreira|Melissa officinalis|Medicinais e chás|Meia-sombra|Moderada
Melissa|Lippia alba|Medicinais e chás|Sol pleno|Moderada
Babosa|Aloe vera|Medicinais e chás|Sol pleno|Leve
Arruda|Ruta graveolens|Medicinais e chás|Sol pleno|Leve
Hortelã-graúda|Plectranthus amboinicus|Medicinais e chás|Meia-sombra|Moderada
Poejo|Mentha pulegium|Medicinais e chás|Meia-sombra|Frequente
Losna|Artemisia absinthium|Medicinais e chás|Sol pleno|Leve
Calêndula|Calendula officinalis|Medicinais e chás|Sol pleno|Moderada
Guaco|Mikania glomerata|Medicinais e chás|Meia-sombra|Moderada
Alfavaca|Ocimum gratissimum|Medicinais e chás|Sol pleno|Moderada
Citronela|Cymbopogon nardus|Medicinais e chás|Sol pleno|Moderada
Lavanda|Lavandula angustifolia|Medicinais e chás|Sol pleno|Leve
Erva-doce|Pimpinella anisum|Medicinais e chás|Sol pleno|Moderada
Gerânio-cheiroso|Pelargonium graveolens|Medicinais e chás|Sol pleno|Leve
Carqueja|Baccharis trimera|Medicinais e chás|Sol pleno|Leve
Chá-verde|Camellia sinensis|Medicinais e chás|Meia-sombra|Moderada
Hibisco|Hibiscus rosa-sinensis|Medicinais e chás|Sol pleno|Moderada
Feijão|Phaseolus vulgaris|Leguminosas|Sol pleno|Moderada
Ervilha|Pisum sativum|Leguminosas|Sol pleno|Moderada
Vagem|Phaseolus vulgaris var. vulgaris|Leguminosas|Sol pleno|Moderada
Fava|Vicia faba|Leguminosas|Sol pleno|Moderada
Feijão-de-corda|Vigna unguiculata|Leguminosas|Sol pleno|Moderada
Soja|Glycine max|Leguminosas|Sol pleno|Moderada
Amendoim|Arachis hypogaea|Leguminosas|Sol pleno|Moderada
Grão-de-bico|Cicer arietinum|Leguminosas|Sol pleno|Leve
Lentilha|Lens culinaris|Leguminosas|Sol pleno|Leve
Guandu|Cajanus cajan|Leguminosas|Sol pleno|Leve
Limão|Citrus × limon|Frutíferas|Sol pleno|Moderada
Laranja|Citrus × sinensis|Frutíferas|Sol pleno|Moderada
Tangerina|Citrus reticulata|Frutíferas|Sol pleno|Moderada
Banana|Musa × paradisiaca|Frutíferas|Sol pleno|Frequente
Mamão|Carica papaya|Frutíferas|Sol pleno|Moderada
Maracujá|Passiflora edulis|Frutíferas|Sol pleno|Moderada
Goiaba|Psidium guajava|Frutíferas|Sol pleno|Moderada
Acerola|Malpighia emarginata|Frutíferas|Sol pleno|Moderada
Pitanga|Eugenia uniflora|Frutíferas|Sol pleno|Moderada
Amora|Morus nigra|Frutíferas|Sol pleno|Moderada
Jabuticaba|Plinia cauliflora|Frutíferas|Sol pleno|Frequente
Abacaxi|Ananas comosus|Frutíferas|Sol pleno|Leve
Girassol|Helianthus annuus|Flores comestíveis|Sol pleno|Moderada
Tagetes|Tagetes erecta|Flores comestíveis|Sol pleno|Moderada
Amor-perfeito|Viola tricolor|Flores comestíveis|Meia-sombra|Moderada
Borragem|Borago officinalis|Flores comestíveis|Sol pleno|Moderada
Rosa|Rosa chinensis|Flores comestíveis|Sol pleno|Moderada
Cosmos|Cosmos sulphureus|Flores comestíveis|Sol pleno|Leve
Cravo-de-defunto|Tagetes patula|Flores comestíveis|Sol pleno|Moderada
Violeta|Viola odorata|Flores comestíveis|Meia-sombra|Moderada
`;

  // fotos próprias que já existem no projeto
  const IMAGENS_LOCAIS = {
    "Alface": "src/plantas/alface.jpg",
    "Manjericão": "src/plantas/manjericao.jpg",
    "Cebolinha": "src/plantas/cebolinha.jpg",
    "Manjerona": "src/plantas/manjerona.jpg",
    "Orégano": "src/plantas/oregano.jpg",
    "Ora-pro-nóbis": "src/plantas/orapronobis.png",
    "Peixinho-da-horta": "src/plantas/peixinho.png"
  };

  const PLANTAS = RAW.trim().split("\n").map((linha, i) => {
    const [nome, cientifico, categoria, sol, rega] = linha.split("|");
    return { id: i + 1, nome, cientifico, categoria, sol, rega, imgLocal: IMAGENS_LOCAIS[nome] || null };
  });

  const CACHE_KEY = "horta_img_cache_v1";
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch (e) { cache = {}; }
  function salvarCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* cache cheio ou bloqueado */ }
  }

  async function buscarINaturalist(cientifico) {
    const url = "https://api.inaturalist.org/v1/taxa?rank=species,variety,subspecies,hybrid&per_page=1&q=" + encodeURIComponent(cientifico);
    const r = await fetch(url);
    if (!r.ok) throw new Error("iNaturalist " + r.status);
    const d = await r.json();
    const foto = d.results && d.results[0] && d.results[0].default_photo;
    return foto ? (foto.medium_url || foto.square_url) : null;
  }

  async function buscarWikipedia(cientifico) {
    const url = "https://pt.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(cientifico.replace(/ /g, "_"));
    const r = await fetch(url);
    if (!r.ok) throw new Error("Wikipedia " + r.status);
    const d = await r.json();
    return d.thumbnail ? d.thumbnail.source : null;
  }

  // fila simples para não disparar dezenas de requisições ao mesmo tempo
  let ativos = 0;
  const fila = [];
  function proximo() {
    while (ativos < 4 && fila.length) {
      const tarefa = fila.shift();
      ativos++;
      tarefa().finally(() => { ativos--; proximo(); });
    }
  }

  function obterImagem(planta) {
    if (planta.imgLocal) return Promise.resolve(planta.imgLocal);
    if (cache[planta.cientifico]) return Promise.resolve(cache[planta.cientifico]);
    return new Promise(resolve => {
      fila.push(async () => {
        let url = null;
        try { url = await buscarINaturalist(planta.cientifico); } catch (e) { /* tenta a alternativa */ }
        if (!url) {
          try { url = await buscarWikipedia(planta.cientifico); } catch (e) { /* sem foto */ }
        }
        if (url) { cache[planta.cientifico] = url; salvarCache(); }
        resolve(url);
      });
      proximo();
    });
  }

  function normalizar(t) {
    return (t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }

  function buscarPorNome(nome) {
    const n = normalizar(nome);
    return PLANTAS.find(p => normalizar(p.nome) === n) || null;
  }

  window.HortaPlantas = {
    todas: PLANTAS,
    categorias: Array.from(new Set(PLANTAS.map(p => p.categoria))),
    obterImagem,
    buscarPorNome,
    normalizar
  };
})();
