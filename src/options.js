$(document).ready(function() {
  const $darkMode = $('#darkMode');

  // 저장된 설정 불러오기
  chrome.storage.local.get(['darkMode'], function(result) {
    if (result.darkMode !== undefined) {
      $darkMode.prop('checked', result.darkMode);
      toggleDarkMode(result.darkMode);
    }
  });

  // 다크 모드 토글
  $darkMode.on('change', function() {
    const newSetting = $(this).is(':checked');
    chrome.storage.local.set({ darkMode: newSetting }, function() {
      console.log('설정이 저장되었습니다.');
      toggleDarkMode(newSetting);
    });
  });

  function toggleDarkMode(isDark) {
    if (isDark) {
      $('body').addClass('dark-mode');
    } else {
      $('body').removeClass('dark-mode');
    }
  }
}); 