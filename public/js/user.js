// 아래 내용이 모달을 불러오는 버튼에 붙어 있어야함
// data-bs-toggle="modal" data-bs-target="#불러올 모달 ID" data-bs-whatever="@login"

let exampleModal = document.getElementById('exampleModal');

exampleModal.addEventListener('show.bs.modal', function (event) {
  // 모달을 트리거하는 버튼
  var button = event.relatedTarget;
  // var recipient = button.getAttribute('data-bs-whatever');
});

// // // 엑시오스 포스트
