// 백그라운드 작업을 처리하는 스크립트

chrome.runtime.onInstalled.addListener(() => {
  console.log('Quick Memo 확장 프로그램이 설치되었습니다.');
});

// 메모 저장 및 불러오기 로직을 구현할 수 있습니다.