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
Girassol|Helianthus annuus|PANCs|Sol pleno|Moderada
Tagetes|Tagetes erecta|PANCs|Sol pleno|Moderada
Amor-perfeito|Viola tricolor|PANCs|Meia-sombra|Moderada
Borragem|Borago officinalis|PANCs|Sol pleno|Moderada
Rosa|Rosa chinensis|PANCs|Sol pleno|Moderada
Cosmos|Cosmos sulphureus|PANCs|Sol pleno|Leve
Cravo-de-defunto|Tagetes patula|PANCs|Sol pleno|Moderada
Violeta|Viola odorata|PANCs|Meia-sombra|Moderada
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

  // Fotos já resolvidas pela API (iNaturalist e Wikipédia) e gravadas aqui para o catálogo abrir rápido.
  // Se alguma planta não estiver nesta lista, a foto é buscada na API na hora e guardada em cache.
  const FOTOS = {
    "Rúcula": "https://inaturalist-open-data.s3.amazonaws.com/photos/280772297/medium.jpeg",
    "Espinafre": "https://inaturalist-open-data.s3.amazonaws.com/photos/41981/medium.jpg",
    "Agrião": "https://inaturalist-open-data.s3.amazonaws.com/photos/203236672/medium.jpeg",
    "Chicória": "https://static.inaturalist.org/photos/42416775/medium.jpg",
    "Escarola": "https://static.inaturalist.org/photos/223171923/medium.jpeg",
    "Mostarda": "https://inaturalist-open-data.s3.amazonaws.com/photos/81020/medium.jpg",
    "Salsa": "https://inaturalist-open-data.s3.amazonaws.com/photos/395413717/medium.jpg",
    "Coentro": "https://inaturalist-open-data.s3.amazonaws.com/photos/30423712/medium.jpeg",
    "Tomilho": "https://static.inaturalist.org/photos/28120667/medium.jpg",
    "Alecrim": "https://static.inaturalist.org/photos/87326219/medium.jpg",
    "Sálvia": "https://inaturalist-open-data.s3.amazonaws.com/photos/289195364/medium.jpg",
    "Hortelã": "https://inaturalist-open-data.s3.amazonaws.com/photos/1186004/medium.jpg",
    "Hortelã-pimenta": "https://inaturalist-open-data.s3.amazonaws.com/photos/226081574/medium.jpg",
    "Louro": "https://inaturalist-open-data.s3.amazonaws.com/photos/150103946/medium.jpg",
    "Endro": "https://inaturalist-open-data.s3.amazonaws.com/photos/400755541/medium.jpeg",
    "Funcho": "https://static.inaturalist.org/photos/50868492/medium.jpg",
    "Estragão": "https://inaturalist-open-data.s3.amazonaws.com/photos/148015980/medium.jpeg",
    "Cebolinha-francesa": "https://inaturalist-open-data.s3.amazonaws.com/photos/93917472/medium.jpg",
    "Aipo": "https://inaturalist-open-data.s3.amazonaws.com/photos/5647843/medium.jpeg",
    "Segurelha": "https://inaturalist-open-data.s3.amazonaws.com/photos/11345886/medium.jpeg",
    "Cerefólio": "https://inaturalist-open-data.s3.amazonaws.com/photos/268761918/medium.jpeg",
    "Tomate": "https://inaturalist-open-data.s3.amazonaws.com/photos/115407615/medium.jpg",
    "Pimentão": "https://inaturalist-open-data.s3.amazonaws.com/photos/81790849/medium.jpeg",
    "Pimenta-malagueta": "https://static.inaturalist.org/photos/18301410/medium.jpeg",
    "Pimenta-biquinho": "https://inaturalist-open-data.s3.amazonaws.com/photos/13473235/medium.jpg",
    "Berinjela": "https://static.inaturalist.org/photos/66635115/medium.jpg",
    "Jiló": "https://static.inaturalist.org/photos/99659021/medium.jpg",
    "Pepino": "https://inaturalist-open-data.s3.amazonaws.com/photos/346972380/medium.jpg",
    "Abobrinha": "https://inaturalist-open-data.s3.amazonaws.com/photos/101476279/medium.png",
    "Abóbora": "https://inaturalist-open-data.s3.amazonaws.com/photos/99968013/medium.jpg",
    "Quiabo": "https://static.inaturalist.org/photos/78980367/medium.jpg",
    "Maxixe": "https://inaturalist-open-data.s3.amazonaws.com/photos/34434304/medium.jpeg",
    "Melancia": "https://inaturalist-open-data.s3.amazonaws.com/photos/490493/medium.jpg",
    "Melão": "https://inaturalist-open-data.s3.amazonaws.com/photos/232583670/medium.jpeg",
    "Milho": "https://static.inaturalist.org/photos/88716363/medium.jpeg",
    "Morango": "https://inaturalist-open-data.s3.amazonaws.com/photos/74966564/medium.jpg",
    "Cenoura": "https://static.inaturalist.org/photos/84336733/medium.jpeg",
    "Beterraba": "https://static.inaturalist.org/photos/131362143/medium.jpeg",
    "Rabanete": "https://inaturalist-open-data.s3.amazonaws.com/photos/28387821/medium.jpeg",
    "Nabo": "https://static.inaturalist.org/photos/179299209/medium.jpeg",
    "Batata-doce": "https://inaturalist-open-data.s3.amazonaws.com/photos/64415778/medium.jpeg",
    "Batata": "https://inaturalist-open-data.s3.amazonaws.com/photos/171954168/medium.jpeg",
    "Inhame": "https://inaturalist-open-data.s3.amazonaws.com/photos/281981579/medium.jpeg",
    "Mandioca": "https://inaturalist-open-data.s3.amazonaws.com/photos/249495572/medium.jpeg",
    "Cará": "https://inaturalist-open-data.s3.amazonaws.com/photos/569462991/medium.jpg",
    "Gengibre": "https://static.inaturalist.org/photos/247973845/medium.jpeg",
    "Alho": "https://static.inaturalist.org/photos/533119870/medium.jpg",
    "Cúrcuma": "https://static.inaturalist.org/photos/428017250/medium.jpeg",
    "Cebola": "https://inaturalist-open-data.s3.amazonaws.com/photos/136608703/medium.jpg",
    "Alho-poró": "https://inaturalist-open-data.s3.amazonaws.com/photos/63378263/medium.jpg",
    "Mandioquinha": "https://inaturalist-open-data.s3.amazonaws.com/photos/33770841/medium.jpeg",
    "Taioba": "https://inaturalist-open-data.s3.amazonaws.com/photos/4676869/medium.jpg",
    "Serralha": "https://inaturalist-open-data.s3.amazonaws.com/photos/15490773/medium.jpeg",
    "Beldroega": "https://inaturalist-open-data.s3.amazonaws.com/photos/4732574/medium.jpg",
    "Capuchinha": "https://static.inaturalist.org/photos/30477591/medium.jpeg",
    "Bertalha": "https://inaturalist-open-data.s3.amazonaws.com/photos/59103714/medium.jpeg",
    "Caruru": "https://inaturalist-open-data.s3.amazonaws.com/photos/243125755/medium.jpg",
    "Major-gomes": "https://inaturalist-open-data.s3.amazonaws.com/photos/45204174/medium.jpeg",
    "Azedinha": "https://inaturalist-open-data.s3.amazonaws.com/photos/130014502/medium.jpeg",
    "Dente-de-leão": "https://inaturalist-open-data.s3.amazonaws.com/photos/23575133/medium.jpg",
    "Trapoeraba": "https://inaturalist-open-data.s3.amazonaws.com/photos/481102528/medium.jpg",
    "Begônia": "https://static.inaturalist.org/photos/246807657/medium.jpeg",
    "Cardo-santo": "https://inaturalist-open-data.s3.amazonaws.com/photos/20424490/medium.jpeg",
    "Mamão-macho": "https://static.inaturalist.org/photos/176927180/medium.jpeg",
    "Jambu": "https://inaturalist-open-data.s3.amazonaws.com/photos/56329688/medium.jpeg",
    "Tansagem": "https://inaturalist-open-data.s3.amazonaws.com/photos/349979346/medium.jpeg",
    "Picão-preto": "https://inaturalist-open-data.s3.amazonaws.com/photos/121375780/medium.jpg",
    "Linhaça": "https://inaturalist-open-data.s3.amazonaws.com/photos/420040739/medium.jpg",
    "Capim-limão": "https://inaturalist-open-data.s3.amazonaws.com/photos/61513592/medium.jpg",
    "Boldo": "https://inaturalist-open-data.s3.amazonaws.com/photos/126898243/medium.jpeg",
    "Erva-cidreira": "https://inaturalist-open-data.s3.amazonaws.com/photos/612537976/medium.jpg",
    "Camomila": "https://inaturalist-open-data.s3.amazonaws.com/photos/528185258/medium.jpg",
    "Babosa": "https://inaturalist-open-data.s3.amazonaws.com/photos/340224811/medium.jpg",
    "Melissa": "https://inaturalist-open-data.s3.amazonaws.com/photos/117133120/medium.jpeg",
    "Hortelã-graúda": "https://inaturalist-open-data.s3.amazonaws.com/photos/204367596/medium.jpeg",
    "Arruda": "https://inaturalist-open-data.s3.amazonaws.com/photos/33838148/medium.jpg",
    "Losna": "https://inaturalist-open-data.s3.amazonaws.com/photos/323796606/medium.jpg",
    "Poejo": "https://inaturalist-open-data.s3.amazonaws.com/photos/86016750/medium.jpg",
    "Guaco": "https://static.inaturalist.org/photos/114009890/medium.jpeg",
    "Calêndula": "https://inaturalist-open-data.s3.amazonaws.com/photos/633270916/medium.jpg",
    "Alfavaca": "https://inaturalist-open-data.s3.amazonaws.com/photos/259467412/medium.jpeg",
    "Citronela": "https://inaturalist-open-data.s3.amazonaws.com/photos/126610149/medium.jpeg",
    "Lavanda": "https://inaturalist-open-data.s3.amazonaws.com/photos/157057/medium.jpg",
    "Erva-doce": "https://inaturalist-open-data.s3.amazonaws.com/photos/11075402/medium.jpg",
    "Carqueja": "https://inaturalist-open-data.s3.amazonaws.com/photos/295757157/medium.jpeg",
    "Gerânio-cheiroso": "https://inaturalist-open-data.s3.amazonaws.com/photos/240032312/medium.jpg",
    "Hibisco": "https://static.inaturalist.org/photos/115046668/medium.jpeg",
    "Chá-verde": "https://inaturalist-open-data.s3.amazonaws.com/photos/3431826/medium.jpeg",
    "Feijão": "https://static.inaturalist.org/photos/74035162/medium.jpeg",
    "Ervilha": "https://static.inaturalist.org/photos/135114132/medium.jpeg",
    "Fava": "https://inaturalist-open-data.s3.amazonaws.com/photos/154129962/medium.jpg",
    "Feijão-de-corda": "https://inaturalist-open-data.s3.amazonaws.com/photos/105581586/medium.jpeg",
    "Soja": "https://inaturalist-open-data.s3.amazonaws.com/photos/28348393/medium.jpeg",
    "Amendoim": "https://inaturalist-open-data.s3.amazonaws.com/photos/105026294/medium.jpeg",
    "Grão-de-bico": "https://inaturalist-open-data.s3.amazonaws.com/photos/107085259/medium.jpg",
    "Guandu": "https://inaturalist-open-data.s3.amazonaws.com/photos/56019499/medium.jpeg",
    "Laranja": "https://inaturalist-open-data.s3.amazonaws.com/photos/65848421/medium.jpg",
    "Banana": "https://static.inaturalist.org/photos/79447750/medium.jpg",
    "Mamão": "https://static.inaturalist.org/photos/176927180/medium.jpeg",
    "Maracujá": "https://static.inaturalist.org/photos/155106210/medium.jpeg",
    "Goiaba": "https://inaturalist-open-data.s3.amazonaws.com/photos/259834166/medium.jpeg",
    "Acerola": "https://inaturalist-open-data.s3.amazonaws.com/photos/229069922/medium.jpg",
    "Amora": "https://inaturalist-open-data.s3.amazonaws.com/photos/260207304/medium.jpg",
    "Pitanga": "https://inaturalist-open-data.s3.amazonaws.com/photos/654004464/medium.jpg",
    "Jabuticaba": "https://static.inaturalist.org/photos/32053755/medium.jpg",
    "Abacaxi": "https://inaturalist-open-data.s3.amazonaws.com/photos/179291263/medium.jpeg",
    "Girassol": "https://inaturalist-open-data.s3.amazonaws.com/photos/323768714/medium.jpg",
    "Tagetes": "https://inaturalist-open-data.s3.amazonaws.com/photos/446036067/medium.jpeg",
    "Borragem": "https://inaturalist-open-data.s3.amazonaws.com/photos/60861953/medium.jpg",
    "Amor-perfeito": "https://inaturalist-open-data.s3.amazonaws.com/photos/9555/medium.jpg",
    "Rosa": "https://inaturalist-open-data.s3.amazonaws.com/photos/236476292/medium.jpg",
    "Cosmos": "https://inaturalist-open-data.s3.amazonaws.com/photos/26247862/medium.jpeg",
    "Cravo-de-defunto": "https://inaturalist-open-data.s3.amazonaws.com/photos/150976716/medium.jpg",
    "Violeta": "https://inaturalist-open-data.s3.amazonaws.com/photos/622851735/medium.jpg",
    "Couve": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Couve-galega.JPG/330px-Couve-galega.JPG",
    "Acelga": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Swiss_Chard.jpg/330px-Swiss_Chard.jpg",
    "Repolho": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Cabbage.jpg/330px-Cabbage.jpg",
    "Couve-flor": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Bloemkool.jpg/330px-Bloemkool.jpg",
    "Brócolis": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Broccoli_and_cross_section_edit.jpg/330px-Broccoli_and_cross_section_edit.jpg",
    "Radicchio": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Illustration_Cichorium_intybus0_clean.jpg/330px-Illustration_Cichorium_intybus0_clean.jpg",
    "Tomate-cereja": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Yellow_cherry_tomatoes.jpg/330px-Yellow_cherry_tomatoes.jpg",
    "Chuchu": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Chayote_cross_section_BNC.jpg/330px-Chayote_cross_section_BNC.jpg",
    "Vinagreira": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Roselle_%28Hibiscus_sabdariffa%29_fruits.jpg/330px-Roselle_%28Hibiscus_sabdariffa%29_fruits.jpg",
    "Vagem": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Cut_Green_Beans.jpg/330px-Cut_Green_Beans.jpg",
    "Lentilha": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Illustration_Lens_culinaris0.jpg/330px-Illustration_Lens_culinaris0.jpg",
    "Limão": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Lemon_-_whole_and_split.jpg/330px-Lemon_-_whole_and_split.jpg",
    "Tangerina": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Mandarin_Oranges_%28Citrus_Reticulata%29.jpg/330px-Mandarin_Oranges_%28Citrus_Reticulata%29.jpg"
  };

  const PLANTAS = RAW.trim().split("\n").map((linha, i) => {
    const [nome, cientifico, categoria, sol, rega] = linha.split("|");
    return { id: i + 1, nome, cientifico, categoria, sol, rega, imgLocal: IMAGENS_LOCAIS[nome] || FOTOS[nome] || null };
  });

  const CACHE_KEY = "horta_img_cache_v2";
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch (e) { cache = {}; }
  function salvarCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* cache cheio ou bloqueado */ }
  }

  // Plantas cujo nome científico não devolve a espécie certa na API: usam a Wikipédia (título em pt)
  const WIKI_PRIMEIRO = {
    "Couve": "Couve", "Acelga": "Acelga", "Repolho": "Repolho", "Couve-flor": "Couve-flor",
    "Brócolis": "Brócolis", "Radicchio": "Radicchio", "Tomate-cereja": "Tomate-cereja",
    "Vagem": "Vagem", "Chuchu": "Chuchu", "Lentilha": "Lentilha", "Laranja": "Laranja",
    "Tangerina": "Tangerina", "Vinagreira": "Hibiscus sabdariffa"
  };
  // nomes aceitos no iNaturalist quando o nome científico usado aqui é sinônimo
  const ALIAS_INAT = {
    "Boldo": ["Coleus barbatus"],
    "Hortelã-graúda": ["Coleus amboinicus"],
    "Rabanete": ["Raphanus raphanistrum sativus"]
  };

  function limparNome(n) { return (n || "").toLowerCase().replace(/×/g, "").replace(/\s+/g, " ").trim(); }

  async function buscarINaturalist(planta) {
    const url = "https://api.inaturalist.org/v1/taxa?rank=species,variety,subspecies,hybrid&per_page=5&q=" + encodeURIComponent(planta.cientifico);
    const r = await fetch(url);
    if (!r.ok) throw new Error("iNaturalist " + r.status);
    const d = await r.json();
    const aceitos = [planta.cientifico].concat(ALIAS_INAT[planta.nome] || []).map(limparNome);
    // só aceita o táxon exato: o primeiro resultado da busca nem sempre é a espécie pedida
    const taxon = (d.results || []).find(t => aceitos.includes(limparNome(t.name)) && t.default_photo);
    return taxon ? (taxon.default_photo.medium_url || taxon.default_photo.square_url) : null;
  }

  async function buscarWikipedia(titulo) {
    const url = "https://pt.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(titulo.replace(/ /g, "_"));
    const r = await fetch(url);
    if (!r.ok) throw new Error("Wikipedia " + r.status);
    const d = await r.json();
    if (d.type === "disambiguation") return null;
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
        const tentativas = WIKI_PRIMEIRO[planta.nome]
          ? [() => buscarWikipedia(WIKI_PRIMEIRO[planta.nome]), () => buscarINaturalist(planta)]
          : [() => buscarINaturalist(planta), () => buscarWikipedia(planta.cientifico)];
        for (const tentar of tentativas) {
          try { url = await tentar(); } catch (e) { /* tenta a próxima fonte */ }
          if (url) break;
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
