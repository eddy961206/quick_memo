$(document).ready(function() {
  const $memo = $('#memo');

  // 저장된 메모 불러오기
  chrome.storage.local.get(['userMemo'], function(result) {
    if (result.userMemo) {
      $memo.val(result.userMemo);
    }
  });

  // 메모 자동 저장
  $memo.on('input', function() {
    const newMemo = $(this).val();
    chrome.storage.local.set({ userMemo: newMemo }, function() {
      console.log('메모가 저장되었습니다.');
    });
  });
}); 