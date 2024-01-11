// 아래 내용이 모달을 불러오는 버튼에 붙어 있어야함
// data-bs-toggle="modal" data-bs-target="#불러올 모달 ID" data-bs-whatever="@login"

const exampleModal = document.getElementById('exampleModal');
if (exampleModal) {
  exampleModal.addEventListener('show.bs.modal', (event) => {
    // 모달을 트리거하는 버튼 - 타켓 붙여놔야함
    const button = event.relatedTarget;
    // data-bs-* 에서 정보 가져오기
    // const recipient = button.getAttribute('data-bs-whatever');
    // 필요하면 recipient값 가져와서 모달에 넣기 가능

    // 모달에 업데이트
    // const modalTitle = exampleModal.querySelector('.modal-title');
    // const modalBodyInput = exampleModal.querySelector('.modal-body input');

    // modalTitle.textContent = `New message to ${recipient}`;
    // modalBodyInput.value = recipient;
  });
}

// // 엑시오스 포스트
