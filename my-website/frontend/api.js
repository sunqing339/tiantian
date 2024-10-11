const response = await fetch('/api/proxy-request', {
  method: 'POST',
  body: JSON.stringify({ endpoint: 'https://api.example.com/data' })
});

// 添加一个函数来检查 Font Awesome 是否正确加载
function checkFontAwesome() {
  const span = document.createElement('span');
  span.className = 'fa';
  span.style.display = 'none';
  document.body.insertBefore(span, document.body.firstChild);
  
  const isFontAwesomeLoaded = window.getComputedStyle(span, null).getPropertyValue('font-family') === 'FontAwesome';
  
  document.body.removeChild(span);
  
  if (!isFontAwesomeLoaded) {
    console.warn('Font Awesome 可能未正确加载。请检查您的 Font Awesome 链接。');
  } else {
    console.log('Font Awesome 已成功加载。');
  }
}

// 在页面加载完成后调用检查函数
window.addEventListener('load', checkFontAwesome);