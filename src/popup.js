document.addEventListener('DOMContentLoaded', () => {
  const memoTextarea = document.getElementById('memo');
  const themeToggle = document.getElementById('theme-toggle');
  const saveButton = document.querySelector('.action-button:nth-child(1)');
  const copyButton = document.querySelector('.action-button:nth-child(2)');
  const themeIcon = themeToggle.querySelector('.material-icons');

  // Update placeholder text to English
  memoTextarea.placeholder = 'Enter your memo here...';

  // Load saved memo and theme
  chrome.storage.sync.get(['memo', 'isDarkMode'], (result) => {
    if (result.memo) {
      memoTextarea.value = result.memo;
    }
    
    if (result.isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
      themeIcon.textContent = 'light_mode';
    }
  });

  // Auto-save memo when typing
  let saveTimeout;
  memoTextarea.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveMemo();
    }, 500);
  });

  // Save memo function
  function saveMemo() {
    const memo = memoTextarea.value;
    chrome.storage.sync.set({ memo }, () => {
      // Show save indicator
      showNotification('Saved');
    });
  }

  // Manual save button
  saveButton.addEventListener('click', () => {
    saveMemo();
  });

  // Copy button
  copyButton.addEventListener('click', () => {
    memoTextarea.select();
    document.execCommand('copy');
    showNotification('Copied to clipboard');
  });

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? '' : 'dark';
    const newIcon = currentTheme === 'dark' ? 'dark_mode' : 'light_mode';
    
    document.body.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newIcon;
    
    chrome.storage.sync.set({ isDarkMode: newTheme === 'dark' });
  });

  // Notification system
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--primary-color);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1000;
    `;

    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);

    // Hide and remove notification
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }

  // Add tooltip attributes
  saveButton.setAttribute('title', 'Save memo');
  copyButton.setAttribute('title', 'Copy to clipboard');
  themeToggle.setAttribute('title', 'Toggle theme');
}); 