(()=>{
    document.addEventListener('DOMContentLoaded', function(){
      document.querySelector('#year').textContent = new Date().getFullYear();
    });
})();



// graph
 // ===== CONFIGURATION VARIABLES =====
 const CONFIG = {
  // Visual Settings
  chartHeight: 50,                // Height of the chart in pixels
  lineColor: '#2196F3',           // Color of the price line
  lineWidth: 2,                   // Width of the price line
  backgroundColor: 'transparent',     // Background color of the chart
  
  // Animation Settings
  updateInterval: 50,             // Milliseconds between updates (lower = faster)
  maxDataPoints: 200,             // Number of points to show on chart
  
  // Price Settings
  startingPrice: 100,             // Initial price
  minPrice: 1,                    // Minimum possible price
  volatility: 5,                  // Max price change per update (higher = more volatile)
  
  // Display Settings
  decimalsToShow: 2,              // Number of decimal places in price label
  yAxisMargin: 0,              // Margin at top and bottom of chart (0.1 = 10%)
  
  // Advanced Settings
  priceChangeChance: 1,         // Probability of price changing each update (0-1)
  trendStrength: -0.9,             // Tendency to follow previous direction (0-1)
};

class StockChart {
  constructor() {
    this.points = [];
    this.maxPoints = CONFIG.maxDataPoints;
    this.currentPrice = isFinite(+localStorage.startingPrice) ? +localStorage.startingPrice : CONFIG.startingPrice;
    this.container = document.querySelector('.chart-container');
    this.svg = document.querySelector('svg');
    this.path = document.querySelector('.line');
    this.priceLabel = document.querySelector('.price-label');
    this.lastTimestamp = 0;
    this.frameInterval = CONFIG.updateInterval;
    this.lastPriceChange = 0;  // For trend following

    // Apply configured styles
    this.container.style.height = `${CONFIG.chartHeight}px`;
    this.container.style.setProperty('--chart-bg', CONFIG.backgroundColor);
    this.path.style.stroke = CONFIG.lineColor;
    this.path.style.strokeWidth = CONFIG.lineWidth;

    window.addEventListener('resize', () => this.resize());
    this.resize();
    this.animate();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
  }

  generateNewPrice() {
    // Only change price based on probability
    if (Math.random() > CONFIG.priceChangeChance) {
      return this.currentPrice;
    }

    // Calculate price change with trend following
    let change = (Math.random() - 0.5) * CONFIG.volatility;
    
    // Apply trend following
    change += this.lastPriceChange * CONFIG.trendStrength;
    
    this.lastPriceChange = change;
    this.currentPrice = Math.max(CONFIG.minPrice, this.currentPrice + change);
    localStorage.startingPrice = this.currentPrice;
    return this.currentPrice;
  }

  updatePath() {
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }

    const xStep = this.width / (this.maxPoints - 1);
    const maxPrice = Math.max(...this.points) * (1 + CONFIG.yAxisMargin);
    const minPrice = Math.min(...this.points) * (1 - CONFIG.yAxisMargin);
    const priceRange = maxPrice - minPrice;

    const pathData = this.points.map((price, index) => {
      const x = index * xStep;
      const y = this.height - ((price - minPrice) / priceRange * this.height * (1 - 2 * CONFIG.yAxisMargin) + this.height * CONFIG.yAxisMargin);
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    this.path.setAttribute('d', pathData);
    this.priceLabel.textContent = `$${this.currentPrice.toFixed(CONFIG.decimalsToShow)}`;
  }

  animate(timestamp) {
    if (timestamp - this.lastTimestamp > this.frameInterval) {
      const newPrice = this.generateNewPrice();
      this.points.push(newPrice);
      this.updatePath();
      this.lastTimestamp = timestamp;
    }
    requestAnimationFrame((ts) => this.animate(ts));
  }
}

// Initialize the chart
new StockChart();

