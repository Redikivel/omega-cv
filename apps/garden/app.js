/* ═══════════════════════════════════════════════════════
   OMEGA GARDEN — app.js
   Vanilla JS · no framework · Vercel static
   API calls → /api/search?q=… and /api/plant?id=…
   (served by generate.py as Vercel Python functions)
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── i18n strings ─────────────────────────────────────── */
const TRANSLATIONS = {
  de: {
    add: 'Pflanze hinzufügen', today: 'Heute · Brauchen Wasser',
    noWater: 'Alle Pflanzen sind versorgt 🌿', searchPlants: 'Pflanzen suchen…',
    all: 'Alle', needsWater: 'Brauchen Wasser', emptyTitle: 'Noch keine Pflanzen',
    emptySub: 'Füge deine erste Pflanze hinzu, um loszulegen.',
    addPlant: 'Pflanze hinzufügen', stepSearch: 'Suchen', stepSelect: 'Auswählen',
    stepConfigure: 'Konfigurieren', searchHint: 'Tippe mindestens 2 Zeichen…',
    back: '← Zurück zur Suche', customName: 'Mein Name für die Pflanze',
    location: 'Standort (optional)', potSize: 'Topfgröße',
    small: 'Klein', medium: 'Mittel', large: 'Groß',
    addPlantConfirm: 'Pflanze hinzufügen', editPlant: 'Pflanze bearbeiten',
    delete: 'Löschen', save: 'Speichern', watered: 'Gegossen ✓',
    waterBtn: '💧 Gießen', healthy: 'Gesund', waterSoon: 'Bald gießen',
    needsWaterStatus: 'Braucht Wasser', water: 'Wasser', locationLabel: 'Standort',
    noResults: 'Keine Pflanzen gefunden.', loading: 'Suche…',
    toastWatered: '💧 Gegossen!', toastAdded: '🌱 Pflanze hinzugefügt!',
    toastDeleted: '🗑 Pflanze gelöscht.', toastSaved: '✓ Gespeichert.',
    searchPlantAPI: 'Pflanze suchen, z.B. Monstera…',
    noWaterInfo: 'Keine Bewässerungsdaten — Pflanze kann nicht hinzugefügt werden.',
  },
  en: {
    add: 'Add plant', today: 'Today · Need watering',
    noWater: 'All plants are taken care of 🌿', searchPlants: 'Search plants…',
    all: 'All', needsWater: 'Need watering', emptyTitle: 'No plants yet',
    emptySub: 'Add your first plant to get started.',
    addPlant: 'Add plant', stepSearch: 'Search', stepSelect: 'Select',
    stepConfigure: 'Configure', searchHint: 'Type at least 2 characters…',
    back: '← Back to search', customName: 'My name for this plant',
    location: 'Location (optional)', potSize: 'Pot size',
    small: 'Small', medium: 'Medium', large: 'Large',
    addPlantConfirm: 'Add plant', editPlant: 'Edit plant',
    delete: 'Delete', save: 'Save', watered: 'Watered ✓',
    waterBtn: '💧 Water', healthy: 'Healthy', waterSoon: 'Water soon',
    needsWaterStatus: 'Needs water', water: 'Water', locationLabel: 'Location',
    noResults: 'No plants found.', loading: 'Searching…',
    toastWatered: '💧 Watered!', toastAdded: '🌱 Plant added!',
    toastDeleted: '🗑 Plant deleted.', toastSaved: '✓ Saved.',
    searchPlantAPI: 'Search plant, e.g. Monstera…',
    noWaterInfo: 'No watering data — plant cannot be added.',
  },
  fr: {
    add: 'Ajouter une plante', today: 'Aujourd\'hui · À arroser',
    noWater: 'Toutes les plantes sont arrosées 🌿', searchPlants: 'Rechercher…',
    all: 'Toutes', needsWater: 'À arroser', emptyTitle: 'Aucune plante',
    emptySub: 'Ajoutez votre première plante.', addPlant: 'Ajouter une plante',
    stepSearch: 'Chercher', stepSelect: 'Choisir', stepConfigure: 'Configurer',
    searchHint: 'Tapez au moins 2 caractères…', back: '← Retour',
    customName: 'Mon nom pour cette plante', location: 'Emplacement (optionnel)',
    potSize: 'Taille du pot', small: 'Petit', medium: 'Moyen', large: 'Grand',
    addPlantConfirm: 'Ajouter', editPlant: 'Modifier la plante',
    delete: 'Supprimer', save: 'Enregistrer', watered: 'Arrosée ✓',
    waterBtn: '💧 Arroser', healthy: 'En bonne santé', waterSoon: 'Arroser bientôt',
    needsWaterStatus: 'Besoin d\'eau', water: 'Eau', locationLabel: 'Emplacement',
    noResults: 'Aucune plante trouvée.', loading: 'Recherche…',
    toastWatered: '💧 Arrosée !', toastAdded: '🌱 Plante ajoutée !',
    toastDeleted: '🗑 Plante supprimée.', toastSaved: '✓ Sauvegardé.',
    searchPlantAPI: 'Chercher une plante…', noWaterInfo: 'Données d\'arrosage manquantes.',
  },
  es: {
    add: 'Añadir planta', today: 'Hoy · Necesitan agua',
    noWater: 'Todas las plantas están cuidadas 🌿', searchPlants: 'Buscar plantas…',
    all: 'Todas', needsWater: 'Necesitan agua', emptyTitle: 'Sin plantas aún',
    emptySub: 'Añade tu primera planta para empezar.', addPlant: 'Añadir planta',
    stepSearch: 'Buscar', stepSelect: 'Seleccionar', stepConfigure: 'Configurar',
    searchHint: 'Escribe al menos 2 caracteres…', back: '← Volver',
    customName: 'Mi nombre para esta planta', location: 'Ubicación (opcional)',
    potSize: 'Tamaño de maceta', small: 'Pequeño', medium: 'Mediano', large: 'Grande',
    addPlantConfirm: 'Añadir planta', editPlant: 'Editar planta',
    delete: 'Eliminar', save: 'Guardar', watered: 'Regada ✓',
    waterBtn: '💧 Regar', healthy: 'Saludable', waterSoon: 'Regar pronto',
    needsWaterStatus: 'Necesita agua', water: 'Agua', locationLabel: 'Ubicación',
    noResults: 'No se encontraron plantas.', loading: 'Buscando…',
    toastWatered: '💧 ¡Regada!', toastAdded: '🌱 ¡Planta añadida!',
    toastDeleted: '🗑 Planta eliminada.', toastSaved: '✓ Guardado.',
    searchPlantAPI: 'Buscar planta…', noWaterInfo: 'Sin datos de riego.',
  },
  pt: {
    add: 'Adicionar planta', today: 'Hoje · Precisam de água',
    noWater: 'Todas as plantas estão cuidadas 🌿', searchPlants: 'Procurar plantas…',
    all: 'Todas', needsWater: 'Precisam de água', emptyTitle: 'Sem plantas ainda',
    emptySub: 'Adicione a sua primeira planta.', addPlant: 'Adicionar planta',
    stepSearch: 'Pesquisar', stepSelect: 'Selecionar', stepConfigure: 'Configurar',
    searchHint: 'Digite pelo menos 2 caracteres…', back: '← Voltar',
    customName: 'Meu nome para esta planta', location: 'Localização (opcional)',
    potSize: 'Tamanho do vaso', small: 'Pequeno', medium: 'Médio', large: 'Grande',
    addPlantConfirm: 'Adicionar planta', editPlant: 'Editar planta',
    delete: 'Excluir', save: 'Salvar', watered: 'Regada ✓',
    waterBtn: '💧 Regar', healthy: 'Saudável', waterSoon: 'Regar em breve',
    needsWaterStatus: 'Precisa de água', water: 'Água', locationLabel: 'Localização',
    noResults: 'Nenhuma planta encontrada.', loading: 'Pesquisando…',
    toastWatered: '💧 Regada!', toastAdded: '🌱 Planta adicionada!',
    toastDeleted: '🗑 Planta excluída.', toastSaved: '✓ Salvo.',
    searchPlantAPI: 'Pesquisar planta…', noWaterInfo: 'Sem dados de rega.',
  },
  it: { add:'Aggiungi pianta',today:'Oggi · Hanno bisogno d\'acqua',noWater:'Tutte le piante sono curate 🌿',searchPlants:'Cerca piante…',all:'Tutte',needsWater:'Hanno bisogno d\'acqua',emptyTitle:'Nessuna pianta',emptySub:'Aggiungi la tua prima pianta.',addPlant:'Aggiungi pianta',stepSearch:'Cerca',stepSelect:'Seleziona',stepConfigure:'Configura',searchHint:'Digita almeno 2 caratteri…',back:'← Indietro',customName:'Il mio nome per questa pianta',location:'Posizione (opzionale)',potSize:'Dimensione vaso',small:'Piccolo',medium:'Medio',large:'Grande',addPlantConfirm:'Aggiungi pianta',editPlant:'Modifica pianta',delete:'Elimina',save:'Salva',watered:'Annaffiata ✓',waterBtn:'💧 Annaffia',healthy:'In salute',waterSoon:'Annaffia presto',needsWaterStatus:'Ha bisogno d\'acqua',water:'Acqua',locationLabel:'Posizione',noResults:'Nessuna pianta trovata.',loading:'Ricerca…',toastWatered:'💧 Annaffiata!',toastAdded:'🌱 Pianta aggiunta!',toastDeleted:'🗑 Pianta eliminata.',toastSaved:'✓ Salvato.',searchPlantAPI:'Cerca pianta…',noWaterInfo:'Nessun dato di irrigazione.' },
  nl: { add:'Plant toevoegen',today:'Vandaag · Water nodig',noWater:'Alle planten zijn verzorgd 🌿',searchPlants:'Zoek planten…',all:'Alle',needsWater:'Water nodig',emptyTitle:'Nog geen planten',emptySub:'Voeg je eerste plant toe om te beginnen.',addPlant:'Plant toevoegen',stepSearch:'Zoeken',stepSelect:'Selecteren',stepConfigure:'Configureren',searchHint:'Typ minimaal 2 tekens…',back:'← Terug',customName:'Mijn naam voor deze plant',location:'Locatie (optioneel)',potSize:'Potmaat',small:'Klein',medium:'Medium',large:'Groot',addPlantConfirm:'Plant toevoegen',editPlant:'Plant bewerken',delete:'Verwijderen',save:'Opslaan',watered:'Gegoten ✓',waterBtn:'💧 Gieten',healthy:'Gezond',waterSoon:'Binnenkort gieten',needsWaterStatus:'Heeft water nodig',water:'Water',locationLabel:'Locatie',noResults:'Geen planten gevonden.',loading:'Zoeken…',toastWatered:'💧 Gegoten!',toastAdded:'🌱 Plant toegevoegd!',toastDeleted:'🗑 Plant verwijderd.',toastSaved:'✓ Opgeslagen.',searchPlantAPI:'Plant zoeken…',noWaterInfo:'Geen gietgegevens.' },
  pl: { add:'Dodaj roślinę',today:'Dziś · Wymagają podlewania',noWater:'Wszystkie rośliny są zadbane 🌿',searchPlants:'Szukaj roślin…',all:'Wszystkie',needsWater:'Wymagają wody',emptyTitle:'Brak roślin',emptySub:'Dodaj pierwszą roślinę, aby rozpocząć.',addPlant:'Dodaj roślinę',stepSearch:'Szukaj',stepSelect:'Wybierz',stepConfigure:'Skonfiguruj',searchHint:'Wpisz co najmniej 2 znaki…',back:'← Wróć',customName:'Moja nazwa rośliny',location:'Lokalizacja (opcjonalnie)',potSize:'Rozmiar doniczki',small:'Mała',medium:'Średnia',large:'Duża',addPlantConfirm:'Dodaj roślinę',editPlant:'Edytuj roślinę',delete:'Usuń',save:'Zapisz',watered:'Podlana ✓',waterBtn:'💧 Podlej',healthy:'Zdrowa',waterSoon:'Wkrótce podlej',needsWaterStatus:'Potrzebuje wody',water:'Woda',locationLabel:'Lokalizacja',noResults:'Nie znaleziono roślin.',loading:'Szukam…',toastWatered:'💧 Podlana!',toastAdded:'🌱 Roślina dodana!',toastDeleted:'🗑 Roślina usunięta.',toastSaved:'✓ Zapisano.',searchPlantAPI:'Szukaj rośliny…',noWaterInfo:'Brak danych o podlewaniu.' },
  ja: { add:'植物を追加',today:'今日・水やりが必要',noWater:'すべての植物は管理済みです 🌿',searchPlants:'植物を検索…',all:'すべて',needsWater:'水やりが必要',emptyTitle:'植物がありません',emptySub:'最初の植物を追加してください。',addPlant:'植物を追加',stepSearch:'検索',stepSelect:'選択',stepConfigure:'設定',searchHint:'2文字以上入力…',back:'← 戻る',customName:'植物の名前',location:'場所（任意）',potSize:'鉢のサイズ',small:'小',medium:'中',large:'大',addPlantConfirm:'植物を追加',editPlant:'植物を編集',delete:'削除',save:'保存',watered:'水やり済み ✓',waterBtn:'💧 水やり',healthy:'健康',waterSoon:'もうすぐ水やり',needsWaterStatus:'水が必要',water:'水',locationLabel:'場所',noResults:'植物が見つかりません。',loading:'検索中…',toastWatered:'💧 水やりしました！',toastAdded:'🌱 植物を追加しました！',toastDeleted:'🗑 植物を削除しました。',toastSaved:'✓ 保存しました。',searchPlantAPI:'植物を検索…',noWaterInfo:'水やりデータがありません。' },
  zh: { add:'添加植物',today:'今天・需要浇水',noWater:'所有植物都已照料好 🌿',searchPlants:'搜索植物…',all:'全部',needsWater:'需要浇水',emptyTitle:'还没有植物',emptySub:'添加您的第一株植物以开始。',addPlant:'添加植物',stepSearch:'搜索',stepSelect:'选择',stepConfigure:'配置',searchHint:'请输入至少2个字符…',back:'← 返回',customName:'我给这株植物起的名字',location:'位置（可选）',potSize:'花盆大小',small:'小',medium:'中',large:'大',addPlantConfirm:'添加植物',editPlant:'编辑植物',delete:'删除',save:'保存',watered:'已浇水 ✓',waterBtn:'💧 浇水',healthy:'健康',waterSoon:'即将浇水',needsWaterStatus:'需要浇水',water:'水',locationLabel:'位置',noResults:'未找到植物。',loading:'搜索中…',toastWatered:'💧 已浇水！',toastAdded:'🌱 植物已添加！',toastDeleted:'🗑 植物已删除。',toastSaved:'✓ 已保存。',searchPlantAPI:'搜索植物…',noWaterInfo:'没有浇水数据。' },
};

/* ── App state ────────────────────────────────────────── */
let state = {
  plants: [],
  lang: 'de',
  filter: 'all',
  searchQuery: '',
  currentStep: 1,
  selectedApiPlant: null,
  editingPlantId: null,
};

/* ── LocalStorage ─────────────────────────────────────── */
const STORAGE_KEY = 'omega_garden_v1';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state.plants = saved.plants || [];
      state.lang   = saved.lang   || 'de';
    }
  } catch(e) { console.warn('Storage read error', e); }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      plants: state.plants,
      lang:   state.lang,
    }));
  } catch(e) { console.warn('Storage write error', e); }
}

/* ── i18n ────────────────────────────────────────────── */
function t(key) {
  return (TRANSLATIONS[state.lang] || TRANSLATIONS['de'])[key] || key;
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  document.getElementById('lang-select').value = state.lang;
}

/* ── Water engine ─────────────────────────────────────── */
const BASE_DECAY = { low: 5, medium: 10, high: 18 };
const LIGHT_ADJ  = { 'full sun': 2, 'part shade': 0, 'low light': -1 };
const SIZE_MULT  = { small: 1.3, medium: 1.0, large: 0.75 };

function getDailyDecay(plant) {
  const base  = BASE_DECAY[plant.wateringNeed] || 10;
  const light = LIGHT_ADJ[plant.lightNeed]     ?? 0;
  const size  = SIZE_MULT[plant.potSize]        || 1.0;
  return Math.min(25, Math.max(1, (base + light) * size));
}

function getCurrentWaterLevel(plant) {
  const ms = Date.now() - new Date(plant.lastWateredAt).getTime();
  const days = ms / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.round(plant.waterLevel - getDailyDecay(plant) * days));
}

function getStatus(level) {
  if (level >= 60) return 'healthy';
  if (level >= 30) return 'soon';
  return 'urgent';
}

function getStatusLabel(level) {
  if (level >= 60) return t('healthy');
  if (level >= 30) return t('waterSoon');
  return t('needsWaterStatus');
}

/* ── Unique ID ────────────────────────────────────────── */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ── Render ───────────────────────────────────────────── */
function renderAll() {
  applyI18n();
  renderTodayStrip();
  renderGrid();
}

function renderTodayStrip() {
  const strip = document.getElementById('today-strip');
  const badge = document.getElementById('today-count');

  const urgent = state.plants.filter(p => {
    const lv = getCurrentWaterLevel(p);
    return lv < 60;
  });

  badge.textContent = urgent.length || '';
  badge.setAttribute('data-count', urgent.length);

  if (urgent.length === 0) {
    strip.innerHTML = `<p class="empty-today">${t('noWater')}</p>`;
    return;
  }

  strip.innerHTML = urgent.map(p => {
    const lv = getCurrentWaterLevel(p);
    const status = getStatus(lv);
    return `
      <div class="today-card" data-id="${p.id}" title="${p.customName}">
        <div class="today-card-name">${esc(p.customName)}</div>
        <div class="today-card-species">${esc(p.species)}</div>
        <div class="water-bar-track" style="margin-top:6px">
          <div class="water-bar-fill" data-level="${lv >= 60 ? 'high' : lv >= 30 ? 'medium' : 'low'}" style="width:${lv}%"></div>
        </div>
        <div class="status-badge status-badge--${status}" style="margin-top:6px;font-size:10px">
          <span class="status-dot"></span>${getStatusLabel(lv)}
        </div>
      </div>`;
  }).join('');

  strip.querySelectorAll('.today-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      document.querySelector(`.plant-card[data-id="${id}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function renderGrid() {
  const grid  = document.getElementById('plant-grid');
  const empty = document.getElementById('empty-state');
  const q     = state.searchQuery.toLowerCase();

  let plants = [...state.plants];

  if (state.filter === 'today') {
    plants = plants.filter(p => getCurrentWaterLevel(p) < 60);
  }
  if (q) {
    plants = plants.filter(p =>
      p.customName.toLowerCase().includes(q) ||
      p.species.toLowerCase().includes(q)
    );
  }

  if (state.plants.length === 0) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  grid.innerHTML = plants.map(p => {
    const lv     = getCurrentWaterLevel(p);
    const status = getStatus(lv);
    const barLev = lv >= 60 ? 'high' : lv >= 30 ? 'medium' : 'low';

    const imgHtml = p.imageUrl
      ? `<img class="card-image" src="${esc(p.imageUrl)}" alt="${esc(p.customName)}" loading="lazy" />`
      : `<div class="card-image-placeholder">🌿</div>`;

    const locHtml = p.location
      ? `<div class="card-location">
           <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
             <path d="M6 1a3.5 3.5 0 0 1 3.5 3.5c0 2.5-3.5 6.5-3.5 6.5S2.5 7 2.5 4.5A3.5 3.5 0 0 1 6 1z" stroke="currentColor" stroke-width="1.1"/>
             <circle cx="6" cy="4.5" r="1" fill="currentColor"/>
           </svg>
           ${esc(p.location)}
         </div>`
      : '';

    return `
      <article class="plant-card" data-id="${p.id}">
        ${imgHtml}
        <div class="card-body">
          <div class="card-name">${esc(p.customName)}</div>
          <div class="card-species">${esc(p.species)}</div>
          ${locHtml}
          <div class="water-bar-wrap">
            <div class="water-bar-label">
              <span>${t('water')}</span>
              <span>${lv}%</span>
            </div>
            <div class="water-bar-track">
              <div class="water-bar-fill" data-level="${barLev}" style="width:${lv}%"></div>
            </div>
          </div>
          <div class="status-badge status-badge--${status}">
            <span class="status-dot"></span>
            ${getStatusLabel(lv)}
          </div>
        </div>
        <div class="card-footer">
          <button class="btn-water" data-id="${p.id}">
            💧 ${t('waterBtn').replace('💧 ', '')}
          </button>
          <button class="btn-card-edit" data-id="${p.id}" aria-label="Edit">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </article>`;
  }).join('');

  // Water buttons
  grid.querySelectorAll('.btn-water').forEach(btn => {
    btn.addEventListener('click', () => waterPlant(btn.getAttribute('data-id')));
  });

  // Edit buttons
  grid.querySelectorAll('.btn-card-edit').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-id')));
  });
}

/* ── Water action ─────────────────────────────────────── */
function waterPlant(id) {
  const plant = state.plants.find(p => p.id === id);
  if (!plant) return;
  plant.waterLevel   = 100;
  plant.lastWateredAt = new Date().toISOString();
  plant.updatedAt    = new Date().toISOString();
  saveToStorage();
  renderAll();
  showToast(t('toastWatered'));
}

/* ── Add plant modal ──────────────────────────────────── */
let searchDebounce = null;

function openAddModal() {
  state.currentStep = 1;
  state.selectedApiPlant = null;
  document.getElementById('api-search-input').value = '';
  document.getElementById('input-custom-name').value = '';
  document.getElementById('input-location').value = '';
  document.querySelector('input[name="pot-size"][value="medium"]').checked = true;
  document.getElementById('search-results').innerHTML =
    `<p class="search-hint">${t('searchHint')}</p>`;
  setStep(1);
  document.getElementById('modal-backdrop').hidden = false;
  document.getElementById('api-search-input').focus();
}

function closeAddModal() {
  document.getElementById('modal-backdrop').hidden = true;
}

function setStep(n) {
  state.currentStep = n;
  [1, 2, 3].forEach(i => {
    const stepEl = document.getElementById(`step-${i}`);
    const indEl  = document.querySelector(`.step[data-step="${i}"]`);
    if (stepEl) stepEl.classList.toggle('hidden', i !== n);
    if (indEl) {
      indEl.classList.toggle('active', i === n);
      indEl.classList.toggle('done',   i < n);
    }
  });
}

/* API search (calls generate.py via /api/search) */
async function doApiSearch(query) {
  const results = document.getElementById('search-results');
  if (query.length < 2) {
    results.innerHTML = `<p class="search-hint">${t('searchHint')}</p>`;
    return;
  }

  results.innerHTML = `<p class="search-loader">${t('loading')}</p>`;

  try {
    const res  = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data.plants || data.plants.length === 0) {
      results.innerHTML = `<p class="search-hint">${t('noResults')}</p>`;
      return;
    }

    results.innerHTML = data.plants.map(plant => {
      const thumb = plant.imageUrl
        ? `<img class="result-thumb" src="${esc(plant.imageUrl)}" alt="" loading="lazy" />`
        : `<div class="result-thumb-placeholder">🌿</div>`;
      return `
        <div class="search-result-item" data-plant='${JSON.stringify(plant).replace(/'/g, "&#39;")}'>
          ${thumb}
          <div class="result-info">
            <div class="result-name">${esc(plant.commonName)}</div>
            <div class="result-sci">${esc(plant.scientificName || '')}</div>
          </div>
          <span class="result-water-badge">${esc(plant.wateringNeed)}</span>
        </div>`;
    }).join('');

    results.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => selectApiPlant(
        JSON.parse(item.getAttribute('data-plant').replace(/&#39;/g, "'"))
      ));
    });

  } catch(err) {
    results.innerHTML = `<p class="search-hint" style="color:var(--red-text)">Fehler beim Laden der Daten.</p>`;
    console.error('API search error', err);
  }
}

function selectApiPlant(plant) {
  state.selectedApiPlant = plant;

  const preview = document.getElementById('selected-preview');
  const imgHtml = plant.imageUrl
    ? `<img src="${esc(plant.imageUrl)}" alt="" />`
    : `<div style="width:56px;height:56px;background:var(--bg-3);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:28px">🌿</div>`;

  preview.innerHTML = `
    ${imgHtml}
    <div class="selected-plant-info">
      <div class="name">${esc(plant.commonName)}</div>
      <div class="sci">${esc(plant.scientificName || '')}</div>
    </div>`;

  // Pre-fill custom name with common name
  document.getElementById('input-custom-name').value = plant.commonName || '';

  setStep(3);
}

function confirmAddPlant() {
  const customName = document.getElementById('input-custom-name').value.trim();
  const location   = document.getElementById('input-location').value.trim();
  const potSize    = document.querySelector('input[name="pot-size"]:checked')?.value || 'medium';
  const p          = state.selectedApiPlant;

  if (!customName) {
    document.getElementById('input-custom-name').focus();
    return;
  }

  const plant = {
    id:              uid(),
    customName,
    species:         p.commonName      || '',
    scientificName:  p.scientificName  || '',
    imageUrl:        p.imageUrl        || null,
    location:        location          || null,
    wateringNeed:    p.wateringNeed    || 'medium',
    lightNeed:       p.lightNeed       || null,
    potSize,
    waterLevel:      100,
    lastWateredAt:   new Date().toISOString(),
    addedAt:         new Date().toISOString(),
    updatedAt:       new Date().toISOString(),
    // optional enrichment
    temperature:     p.temperature  || null,
    humidity:        p.humidity     || null,
    soilType:        p.soilType     || null,
    growthRate:      p.growthRate   || null,
    funFact:         p.funFact      || null,
  };

  state.plants.unshift(plant);
  saveToStorage();
  closeAddModal();
  renderAll();
  showToast(t('toastAdded'));
}

/* ── Edit modal ───────────────────────────────────────── */
function openEditModal(id) {
  const plant = state.plants.find(p => p.id === id);
  if (!plant) return;
  state.editingPlantId = id;

  document.getElementById('edit-custom-name').value = plant.customName;
  document.getElementById('edit-location').value    = plant.location || '';
  const ps = plant.potSize || 'medium';
  document.querySelector(`input[name="edit-pot-size"][value="${ps}"]`).checked = true;

  document.getElementById('edit-modal-backdrop').hidden = false;
}

function closeEditModal() {
  document.getElementById('edit-modal-backdrop').hidden = true;
  state.editingPlantId = null;
}

function saveEdit() {
  const plant = state.plants.find(p => p.id === state.editingPlantId);
  if (!plant) return;
  plant.customName = document.getElementById('edit-custom-name').value.trim() || plant.customName;
  plant.location   = document.getElementById('edit-location').value.trim() || null;
  plant.potSize    = document.querySelector('input[name="edit-pot-size"]:checked')?.value || 'medium';
  plant.updatedAt  = new Date().toISOString();
  saveToStorage();
  closeEditModal();
  renderAll();
  showToast(t('toastSaved'));
}

function deletePlant() {
  const id = state.editingPlantId;
  if (!id) return;
  state.plants = state.plants.filter(p => p.id !== id);
  saveToStorage();
  closeEditModal();
  renderAll();
  showToast(t('toastDeleted'));
}

/* ── Toast ────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

/* ── Escape helper ────────────────────────────────────── */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

/* ── Event listeners ──────────────────────────────────── */
function bindEvents() {
  // Language
  document.getElementById('lang-select').addEventListener('change', e => {
    state.lang = e.target.value;
    saveToStorage();
    renderAll();
  });

  // Open/close add modal
  document.getElementById('btn-open-modal').addEventListener('click', openAddModal);
  document.getElementById('btn-empty-add').addEventListener('click', openAddModal);
  document.getElementById('btn-close-modal').addEventListener('click', closeAddModal);

  // Modal backdrop click
  document.getElementById('modal-backdrop').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAddModal();
  });

  // API search debounce
  document.getElementById('api-search-input').addEventListener('input', e => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => doApiSearch(e.target.value.trim()), 400);
  });

  // Back buttons
  document.getElementById('btn-back-search').addEventListener('click', () => setStep(1));
  document.getElementById('btn-back-select').addEventListener('click', () => setStep(2));

  // Confirm add
  document.getElementById('btn-confirm-add').addEventListener('click', confirmAddPlant);

  // Edit modal
  document.getElementById('btn-close-edit').addEventListener('click', closeEditModal);
  document.getElementById('edit-modal-backdrop').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeEditModal();
  });
  document.getElementById('btn-save-edit').addEventListener('click', saveEdit);
  document.getElementById('btn-delete-plant').addEventListener('click', deletePlant);

  // Local search filter
  document.getElementById('search-input').addEventListener('input', e => {
    state.searchQuery = e.target.value.trim();
    renderGrid();
  });

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.filter = tab.getAttribute('data-filter');
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderGrid();
    });
  });

  // Keyboard ESC
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('modal-backdrop').hidden) closeAddModal();
    if (!document.getElementById('edit-modal-backdrop').hidden) closeEditModal();
  });
}

/* ── Init ────────────────────────────────────────────── */
function init() {
  loadFromStorage();
  bindEvents();
  renderAll();

  // Refresh water levels every minute
  setInterval(renderAll, 60 * 1000);
}

document.addEventListener('DOMContentLoaded', init);