$(document).ready(() => {
  const $memoTextarea = $('#memo');
  const $themeToggle = $('#theme-toggle');
  const $saveButton = $('.action-button:nth-child(1)');
  const $copyButton = $('.action-button:nth-child(2)');
  const $themeIcon = $themeToggle.find('.material-icons');

  // 자동저장 토글 버튼 추가
  const $autoSaveToggle = $('<button>', {
    class: 'action-button',
    title: 'Toggle auto save',
    html: '<span class="material-icons">auto_mode</span>'
  }).insertBefore($saveButton);

  // 플레이스홀더 설정
  $memoTextarea.attr('placeholder', 'Enter your memo here...');

  // 저장된 메모, 테마, 자동저장 설정 불러오기
  chrome.storage.sync.get(['memo', 'isDarkMode', 'isAutoSave'], (result) => {
    if (result.memo) {
      $memoTextarea.val(result.memo);
    }

    if (result.isDarkMode) {
      $('body').attr('data-theme', 'dark');
      $themeIcon.text('light_mode');
    }

    // 자동저장 상태 설정
    const isAutoSave = result.isAutoSave ?? true; // 기본값은 자동저장 켜짐
    updateAutoSaveUI(isAutoSave);
  });

  // 자동저장 UI 업데이트 함수
  function updateAutoSaveUI(isAutoSave) {
    const $autoSaveIcon = $autoSaveToggle.find('.material-icons');
    if (isAutoSave) {
      $autoSaveIcon.css('color', 'var(--primary-color)');
      $saveButton.hide();
    } else {
      $autoSaveIcon.css('color', 'var(--text-color)');
      $saveButton.show();
    }
  }

  // 메모 저장 함수
  function saveMemo(showNotification = false) {
    const memo = $memoTextarea.val();
    chrome.storage.sync.set({ memo }, () => {
      if (showNotification) {
        showNotification('Saved');
      }
    });
  }

  // 글자 입력 시 자동저장
  $memoTextarea.on('input', () => {
    chrome.storage.sync.get(['isAutoSave'], (result) => {
      if (result.isAutoSave) {
        saveMemo(false);
      }
    });
  });

  // 수동 저장 버튼
  $saveButton.on('click', () => {
    saveMemo(true);
    showNotification('Saved');
  });

  // 자동저장 토글 버튼
  $autoSaveToggle.on('click', () => {
    chrome.storage.sync.get(['isAutoSave'], (result) => {
      const newAutoSave = !result.isAutoSave;
      if (newAutoSave) {
        saveMemo(false); // 자동저장 켜질 때 메모 저장
      }
      chrome.storage.sync.set({ isAutoSave: newAutoSave }, () => {
        updateAutoSaveUI(newAutoSave);
        showNotification(newAutoSave ? 'Auto save on' : 'Auto save off');
      });
    });
  });

  // 복사 버튼
  $copyButton.on('click', () => {
    $memoTextarea.select();
    document.execCommand('copy');
    showNotification('Copied to clipboard');
  });

  // 테마 토글
  $themeToggle.on('click', () => {
    const $body = $('body');
    const currentTheme = $body.attr('data-theme');
    const newTheme = currentTheme === 'dark' ? '' : 'dark';
    const newIcon = currentTheme === 'dark' ? 'dark_mode' : 'light_mode';

    $body.attr('data-theme', newTheme);
    $themeIcon.text(newIcon);

    chrome.storage.sync.set({ isDarkMode: newTheme === 'dark' });
  });

  // 알림 시스템
  function showNotification(message) {
    const $notification = $('<div>', {
      class: 'notification',
      text: message
    }).css({
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '4px',
      fontSize: '14px',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      zIndex: 1000
    });

    $('body').append($notification);

    // 알림 표시 시간 조정
    setTimeout(() => {
      $notification.css('opacity', 1);
    }, 10);

    // 알림 사라지는 시간 조정
    setTimeout(() => {
      $notification.css('opacity', 0);
      setTimeout(() => {
        $notification.remove();
      }, 200);
    }, 1200);
  }

  // 툴팁 설정
  $saveButton.attr('title', 'Save memo');
  $copyButton.attr('title', 'Copy to clipboard');
  $themeToggle.attr('title', 'Toggle theme');
}); 