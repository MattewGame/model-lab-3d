// ============================================
// КОНФИГУРАЦИОННЫЕ ПЕРЕМЕННЫЕ ДЛЯ КАЛЬКУЛЯТОРА
// ============================================

//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

// Цены для клиента (руб/см³)
const CLIENT_PRICES = {
    pla: 40,    // PLA
    abs: 60,    // ABS
    petg: 70,   // PETG
    nylon: 100   // Нейлон
};

// Ваша себестоимость материалов (руб/см³)
const YOUR_COST_PRICES = {
    pla: 25,     // PLA - ваши расходы
    abs: 35,     // ABS - ваши расходы
    petg: 40,    // PETG - ваши расходы
    nylon: 60    // Нейлон - ваши расходы
};

// Коэффициенты сложности
const COMPLEXITY_FACTORS = {
    simple: 1.0,    // Простая модель
    medium: 1.3,    // Средняя сложность
    complex: 1.7    // Высокая сложность
};

// Цена постобработки для клиента (руб)
const POSTPROCESSING_CLIENT_PRICES = {
    none: 0,        // Без обработки
    sanding: 200,   // Шлифовка
    painting: 500,  // Покраска
    coating: 800    // Покраска + покрытие
};

// Ваша себестоимость постобработки (руб)
const POSTPROCESSING_YOUR_COST = {
    none: 0,        // Без обработки
    sanding: 50,    // Шлифовка
    painting: 150,  // Покраска
    coating: 250    // Покраска + покрытие
};

// Другие параметры
const MIN_ORDER_PRICE = 250;           // Минимальный заказ
const HOURLY_RATE_CLIENT = 100;        // Ставка для клиента за час
const HOURLY_RATE_YOUR_COST = 80;      // Ваши расходы за час (электричество+амортизация)
const PRINT_SPEED = 8;                 // Скорость печати (см³/час)
const MIN_PRINT_TIME = 1;              // Минимальное время печати (часы)

// Ваш целевой процент прибыли (от выручки)
const TARGET_PROFIT_MARGIN = 0.45;     // 45% прибыли

// ============================================
// КОНФИГУРАЦИЯ ПОРТФОЛИО
// ============================================

const PORTFOLIO_IMAGES = [
    { filename: 'work1.jpg', title: 'Архитектурный макет', description: 'Макет жилого комплекса' },
    { filename: 'work2.jpg', title: 'Прототип устройства', description: 'Корпус электронного устройства' },
    { filename: 'work3.jpg', title: 'Сувенирная продукция', description: 'Фигурки для подарков' },
    { filename: 'work4.jpg', title: 'Деталь механизма', description: 'Запасная часть для оборудования' },
    { filename: 'work5.jpg', title: 'Дизайнерский объект', description: 'Декоративный элемент интерьера' },
    { filename: 'work6.jpg', title: 'Образец материала', description: 'Тестовые отпечатки материалов' }
];

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1565638423442-6e1e8d285999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bbcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1576086961377-4c4c0c61d88b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
];

// ============================================
// ОСНОВНОЙ КОД
// ============================================

// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
    });
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks?.classList.remove('active');
        }
    });
});

// ============================================
// ЗАГРУЗКА ПОРТФОЛИО
// ============================================

function loadPortfolio() {
    const portfolioContainer = document.getElementById('portfolio-container');
    if (!portfolioContainer) return;
    
    portfolioContainer.innerHTML = '';
    
    PORTFOLIO_IMAGES.forEach((image, index) => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        
        const img = document.createElement('img');
        img.alt = image.title;
        img.loading = 'lazy';
        img.src = `images/portfolio/${image.filename}`;
        
        img.onerror = function() {
            this.src = FALLBACK_IMAGES[index] || FALLBACK_IMAGES[0];
            this.alt = `${image.title} (из интернета)`;
        };
        
        const portfolioInfo = document.createElement('div');
        portfolioInfo.className = 'portfolio-info';
        portfolioInfo.innerHTML = `<h3>${image.title}</h3><p>${image.description}</p>`;
        
        portfolioItem.appendChild(img);
        portfolioItem.appendChild(portfolioInfo);
        portfolioContainer.appendChild(portfolioItem);
    });
    
    if (PORTFOLIO_IMAGES.length === 0) {
        portfolioContainer.innerHTML = `
            <div class="portfolio-fallback">
                <i class="fas fa-images"></i>
                <h3>Портфолио в разработке</h3>
                <p>Скоро здесь появятся наши работы</p>
            </div>
        `;
    }
}

// ============================================
// КАЛЬКУЛЯТОР С РАСЧЕТОМ ПРИБЫЛИ
// ============================================

const materialSelect = document.getElementById('material');
const volumeSlider = document.getElementById('volume');
const volumeValue = document.getElementById('volume-value');
const complexitySelect = document.getElementById('complexity');
const postprocessingSelect = document.getElementById('postprocessing');
const calculateBtn = document.getElementById('calculate-btn');

// Элементы для отображения (только для клиента)
const materialCostElem = document.getElementById('material-cost');
const complexityCostElem = document.getElementById('complexity-cost');
const postprocessingCostElem = document.getElementById('postprocessing-cost');
const totalCostElem = document.getElementById('total-cost');
const costElem = document.getElementById('cost');

// Обновление значения объема
if (volumeSlider && volumeValue) {
    volumeSlider.addEventListener('input', () => {
        volumeValue.textContent = volumeSlider.value;
    });
}

// Функция расчета стоимости с учетом вашей прибыли
function calculateCost() {
    if (!materialSelect || !volumeSlider || !complexitySelect || !postprocessingSelect) return;
    
    // Получаем значения из формы
    const materialType = materialSelect.value;
    const volume = parseFloat(volumeSlider.value);
    const complexityType = complexitySelect.value;
    const postprocessingType = postprocessingSelect.value;
    
    // 1. РАСЧЕТ ЦЕНЫ ДЛЯ КЛИЕНТА
    const clientMaterialPrice = CLIENT_PRICES[materialType] || CLIENT_PRICES.pla;
    const complexityFactor = COMPLEXITY_FACTORS[complexityType] || COMPLEXITY_FACTORS.simple;
    const clientPostprocessingPrice = POSTPROCESSING_CLIENT_PRICES[postprocessingType] || 0;
    
    // Стоимость материалов для клиента
    const clientMaterialCost = clientMaterialPrice * volume;
    
    // Время печати и стоимость работы для клиента
    const estimatedPrintTime = Math.max(volume / PRINT_SPEED, MIN_PRINT_TIME);
    const clientPrintCost = estimatedPrintTime * HOURLY_RATE_CLIENT;
    
    // Базовая стоимость для клиента
    const clientBaseCost = clientMaterialCost + clientPrintCost;
    
    // Наценка за сложность
    const clientComplexityMarkup = clientBaseCost * (complexityFactor - 1);
    
    // Итоговая цена для клиента
    let totalClientPrice = clientBaseCost + clientComplexityMarkup + clientPostprocessingPrice;
    totalClientPrice = Math.max(totalClientPrice, MIN_ORDER_PRICE);
    
    // 2. РАСЧЕТ ВАШИХ РАСХОДОВ И ПРИБЫЛИ
    const yourMaterialCost = (YOUR_COST_PRICES[materialType] || YOUR_COST_PRICES.pla) * volume;
    const yourPostprocessingCost = POSTPROCESSING_YOUR_COST[postprocessingType] || 0;
    const yourPrintCost = estimatedPrintTime * HOURLY_RATE_YOUR_COST;
    const yourTotalCost = yourMaterialCost + yourPostprocessingCost + yourPrintCost;
    
    // Ваша прибыль
    const yourProfit = totalClientPrice - yourTotalCost;
    const profitPercentage = totalClientPrice > 0 ? (yourProfit / totalClientPrice) * 100 : 0;
    
    // 3. ОТОБРАЖЕНИЕ ЦЕНЫ ДЛЯ КЛИЕНТА
    if (materialCostElem) materialCostElem.textContent = Math.round(clientMaterialCost);
    if (complexityCostElem) complexityCostElem.textContent = Math.round(clientComplexityMarkup);
    if (postprocessingCostElem) postprocessingCostElem.textContent = clientPostprocessingPrice;
    if (totalCostElem) totalCostElem.textContent = Math.round(totalClientPrice);
    if (costElem) costElem.textContent = Math.round(totalClientPrice);
    
    // 4. ВЫВОД ИНФОРМАЦИИ О ПРИБЫЛИ В КОНСОЛЬ (ТОЛЬКО ДЛЯ ВАС)
    console.log('=== РАСЧЕТ ПРИБЫЛИ ===');
    console.log(`Выручка от клиента: ${Math.round(totalClientPrice)} руб`);
    console.log(`Ваши расходы: ${Math.round(yourTotalCost)} руб`);
    console.log(`Из них:`);
    console.log(`  - Материалы: ${Math.round(yourMaterialCost)} руб`);
    console.log(`  - Постобработка: ${yourPostprocessingCost} руб`);
    console.log(`  - Печать (электричество+амортизация): ${Math.round(yourPrintCost)} руб`);
    console.log(`Ваша прибыль: ${Math.round(yourProfit)} руб`);
    console.log(`Рентабельность: ${profitPercentage.toFixed(1)}%`);
    console.log(`Целевая рентабельность: ${(TARGET_PROFIT_MARGIN * 100).toFixed(0)}%`);
    
    // Проверка достижения целевой прибыли
    if (profitPercentage >= TARGET_PROFIT_MARGIN * 100) {
        console.log('✅ Хорошая прибыль! Заказ выгодный.');
    } else if (profitPercentage > 20) {
        console.log('⚠️  Прибыль ниже целевой, но приемлемая.');
    } else {
        console.log('❌ Низкая прибыль. Рассмотрите увеличение цены.');
    }
    
    // Сохраняем данные расчета в localStorage (для вашего анализа)
    const calculationData = {
        timestamp: new Date().toISOString(),
        clientPrice: Math.round(totalClientPrice),
        yourCost: Math.round(yourTotalCost),
        yourProfit: Math.round(yourProfit),
        profitPercentage: parseFloat(profitPercentage.toFixed(1)),
        volume: volume,
        material: materialType,
        complexity: complexityType,
        postprocessing: postprocessingType
    };
    
    // Сохраняем последние 10 расчетов
    let recentCalculations = JSON.parse(localStorage.getItem('modelLabCalculations') || '[]');
    recentCalculations.unshift(calculationData);
    if (recentCalculations.length > 10) recentCalculations = recentCalculations.slice(0, 10);
    localStorage.setItem('modelLabCalculations', JSON.stringify(recentCalculations));
}

// ============================================
// ПОКАЗАТЬ СТАТИСТИКУ ПРИБЫЛИ (по специальной команде)
// ============================================

// Эта функция покажет статистику прибыли при нажатии Ctrl+Shift+P
function showProfitStats() {
    const calculations = JSON.parse(localStorage.getItem('modelLabCalculations') || '[]');
    
    if (calculations.length === 0) {
        console.log('Статистика прибыли: пока нет данных о расчетах.');
        return;
    }
    
    console.log('=== СТАТИСТИКА ПРИБЫЛИ MODEL LAB 3D ===');
    console.log(`Всего расчетов: ${calculations.length}`);
    
    const totalProfit = calculations.reduce((sum, calc) => sum + calc.yourProfit, 0);
    const avgProfit = totalProfit / calculations.length;
    const avgPercentage = calculations.reduce((sum, calc) => sum + calc.profitPercentage, 0) / calculations.length;
    
    console.log(`Средняя прибыль за заказ: ${Math.round(avgProfit)} руб`);
    console.log(`Средняя рентабельность: ${avgPercentage.toFixed(1)}%`);
    console.log(`Общая потенциальная прибыль: ${Math.round(totalProfit)} руб`);
    
    // Анализ по материалам
    const materialStats = {};
    calculations.forEach(calc => {
        if (!materialStats[calc.material]) {
            materialStats[calc.material] = { count: 0, totalProfit: 0, avgVolume: 0 };
        }
        materialStats[calc.material].count++;
        materialStats[calc.material].totalProfit += calc.yourProfit;
        materialStats[calc.material].avgVolume = (materialStats[calc.material].avgVolume * (materialStats[calc.material].count - 1) + calc.volume) / materialStats[calc.material].count;
    });
    
    console.log('--- Статистика по материалам ---');
    Object.entries(materialStats).forEach(([material, stats]) => {
        const avgProfitPerOrder = stats.totalProfit / stats.count;
        console.log(`${material.toUpperCase()}: ${stats.count} заказов, средняя прибыль: ${Math.round(avgProfitPerOrder)} руб, средний объем: ${Math.round(stats.avgVolume)} см³`);
    });
}

// Добавляем комбинацию клавиш для просмотра статистики
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        showProfitStats();
    }
});

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    // Загружаем портфолио
    loadPortfolio();
    
    // Инициализируем калькулятор
    calculateCost();
    
    // Обновляем год в футере
    const yearElement = document.querySelector('.copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2023', currentYear);
    }
    
    // Настраиваем обработчики событий для калькулятора
    if (materialSelect) materialSelect.addEventListener('change', calculateCost);
    if (volumeSlider) volumeSlider.addEventListener('input', calculateCost);
    if (complexitySelect) complexitySelect.addEventListener('change', calculateCost);
    if (postprocessingSelect) postprocessingSelect.addEventListener('change', calculateCost);
    if (calculateBtn) calculateBtn.addEventListener('click', calculateCost);
    
    // Инструкция для вас в консоли
    console.log('=== MODEL LAB 3D ===');
    console.log('Для просмотра статистики прибыли нажмите Ctrl+Shift+P');
    console.log('Все расчеты прибыли сохраняются в localStorage');
});

// Обработка изображения принтера
const printerImage = document.getElementById('printer-image');
if (printerImage) {
    printerImage.addEventListener('error', function() {
        this.src = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        this.alt = '3D принтер - изображение по умолчанию';
    });
}