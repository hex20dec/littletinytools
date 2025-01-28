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
  startingPrice: 613,             // Initial price
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




// ===== SEARCH FUNCTIONALITY =====
// ===== SEARCH FUNCTIONALITY =====
// ===== SEARCH FUNCTIONALITY =====


async function searchSitemap(e) {
  e.preventDefault();
  const searchTerm = document.getElementById('searchInput').value.trim();
  const resultsDiv = document.getElementById('searchResults');
  resultsDiv.innerHTML = 'Loading...';

  if (!searchTerm) {
    resultsDiv.innerHTML = 'Please enter a search term';
    return;
  }

  try {
    // Step 1: Get sitemap index
    const sitemapIndexResponse = await fetch('/sitemap-index.xml');
    const sitemapIndexText = await sitemapIndexResponse.text();
    const sitemapIndex = new DOMParser().parseFromString(sitemapIndexText, "text/xml");

    // Step 2: Get all sitemap locations
    const sitemapUrls = Array.from(sitemapIndex.getElementsByTagName('loc'))
      .map(loc => {
        let location = loc.textContent.trim();
        let splitted = location.split('/');
        let local = splitted[splitted.length - 1];
        return '/'+local;
      });

    // Step 3: Search through all sitemaps
    let foundUrl = [];
    let foundTitle = null;
    
    for (const sitemapUrl of sitemapUrls) {
      const sitemapResponse = await fetch(sitemapUrl);
      const sitemapText = await sitemapResponse.text();
      const sitemap = new DOMParser().parseFromString(sitemapText, "text/xml");
      
      const urls = Array.from(sitemap.getElementsByTagName('loc'));
      
      for (const urlElement of urls) {
        const pageUrl = urlElement.textContent.trim();
        const permalink = pageUrl.split('/').splice(3).join('/');
        // const pageSlug = pageUrl.toLowerCase().split('-').join(' ');
        let pageTitle = pageUrl.split('-').join(' ').split('/')[3].split(' ');
        pageTitle.splice(-4);
        pageTitle = pageTitle.join(' ');
        const searchSlug = searchTerm.toLowerCase();

        if (pageTitle.indexOf(searchSlug) > -1) {
          foundUrl.push(`<li><a class="dropdown-item" href="/${permalink}">${pageTitle}</a></li>`)
          // foundUrl.push('/'+permalink);
          // foundTitle.push(pageTitle);
          // break;
        }
      }
      
      // if (foundUrl) break;
    }

    // Step 4: Display results
    if (foundUrl.length > 0) {
      // resultsDiv.innerHTML = `Match found: <a href="${foundUrl}" target="_blank">${foundTitle}</a>`;
      resultsDiv.innerHTML = foundUrl.join('');
      resultsDiv.classList.add('show');
      
    } else {
      resultsDiv.innerHTML = 'No matching pages found';
    }
    foundUrl = [];

  } catch (error) {
    console.error('Search failed:', error);
    resultsDiv.innerHTML = 'Error searching sitemaps';
  }
}

// event listeners
document.getElementById('searchBtn').addEventListener('click', searchSitemap);
// when a user clicks outside the search results, hide them
document.addEventListener('click', function(e) {
  if (!document.getElementById('searchForm').contains(e.target)) {
    document.getElementById('searchResults').classList.remove('show');
  }
});