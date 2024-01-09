// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function () {
  let draggedItem = null;

  // 드래그 앤 드롭을 위한 초기화 함수
  function initializeDragDrop() {
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('dragstart', function () {
        draggedItem = card;
        card.classList.add('dragging');
        setTimeout(() => (card.style.display = 'none'), 0);
      });

      card.addEventListener('dragend', function () {
        setTimeout(() => {
          card.style.display = 'block';
          card.classList.remove('dragging');
          draggedItem = null;
          saveTasks(); // 드래그 종료 시 태스크 저장
        }, 0);
      });
    });
  }

  // 새 태스크 카드를 생성하는 함수
  function createTaskCard(title, dueDate, priority, content) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.innerHTML =
      '<strong>' +
      title +
      '</strong><br>' +
      '<span class="due-date">' +
      dueDate +
      '</span><br>' +
      '<span class="priority">' +
      priority +
      '</span><br>' +
      '<span class="content">' +
      content +
      '</span><br>' +
      '<button class="edit-btn">수정</button>' +
      '<button class="delete-btn">삭제</button>';
    return card;
  }

  // 태스크를 로컬 스토리지에 저장하는 함수
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.column').forEach((column) => {
      const columnTasks = Array.from(column.querySelectorAll('.card')).map(
        (card) => ({
          title: card.querySelector('strong').textContent,
          dueDate: card.querySelector('.due-date').textContent,
          priority: card.querySelector('.priority').textContent,
          content: card.querySelector('.content').textContent,
          status: column.id,
        }),
      );
      tasks.push({ column: column.id, tasks: columnTasks });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // 로컬 스토리지에서 태스크를 불러오는 함수
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
      tasks.forEach((columnData) => {
        const column = document.getElementById(columnData.column);
        columnData.tasks.forEach((taskData) => {
          const card = createTaskCard(
            taskData.title,
            taskData.dueDate,
            taskData.priority,
            taskData.content,
          );
          column.appendChild(card);
        });
      });
      initializeDragDrop();
    }
  }

  // 모달 관련 코드
  var modal = document.getElementById('taskModal');
  var btn = document.getElementById('add-task-btn');
  var span = document.getElementsByClassName('close')[0];

  // 모달 열기 이벤트
  btn.onclick = function () {
    modal.style.display = 'block';
    document.getElementById('modal-task-title').value = '';
    document.getElementById('modal-task-due-date').value = '';
    document.getElementById('modal-task-priority').value = 'medium';
    document.getElementById('modal-task-status').value = 'todo';
    document.getElementById('modal-task-content').value = '';
    document.getElementById('modal-submit-btn').textContent = '추가';
  };

  // 모달 닫기 이벤트
  span.onclick = function () {
    modal.style.display = 'none';
  };

  // 모달 외부 클릭 시 닫기 이벤트
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  // 태스크 추가 또는 수정을 처리하는 이벤트 리스너
  document
    .getElementById('modal-submit-btn')
    .addEventListener('click', function () {
      const title = document.getElementById('modal-task-title').value;
      const dueDate = document.getElementById('modal-task-due-date').value;
      const priority = document.getElementById('modal-task-priority').value;
      const status = document.getElementById('modal-task-status').value;
      const content = document.getElementById('modal-task-content').value;

      if (this.textContent === '추가') {
        const newCard = createTaskCard(title, dueDate, priority, content);
        document.getElementById(status).appendChild(newCard);
        initializeDragDrop();
      } else {
        const editingCard = document.querySelector('.editing');
        editingCard.querySelector('strong').textContent = title;
        editingCard.querySelector('.due-date').textContent = dueDate;
        editingCard.querySelector('.priority').textContent = priority;
        editingCard.querySelector('.content').textContent = content;
        document.getElementById(status).appendChild(editingCard);
        editingCard.classList.remove('editing');
      }
      modal.style.display = 'none';
      saveTasks();
    });

  // 태스크 수정 및 삭제 버튼 처리
  document.querySelector('.board').addEventListener('click', function (e) {
    if (e.target.className === 'edit-btn') {
      const card = e.target.parentNode;
      card.classList.add('editing');
      document.getElementById('modal-task-title').value =
        card.querySelector('strong').textContent;
      document.getElementById('modal-task-due-date').value =
        card.querySelector('.due-date').textContent;
      document.getElementById('modal-task-priority').value =
        card.querySelector('.priority').textContent;
      document.getElementById('modal-task-status').value =
        card.closest('.column').id;
      document.getElementById('modal-task-content').value =
        card.querySelector('.content').textContent;
      document.getElementById('modal-submit-btn').textContent = '수정';
      modal.style.display = 'block';
    } else if (e.target.className === 'delete-btn') {
      e.target.parentNode.remove();
      saveTasks();
    }
  });

  // 드래그 앤 드롭 처리
  document.querySelectorAll('.column').forEach((column) => {
    column.addEventListener('dragover', function (e) {
      e.preventDefault();
    });

    column.addEventListener('drop', function (e) {
      e.preventDefault();
      if (draggedItem) {
        let afterElement = getDragAfterElement(column, e.clientY);
        if (afterElement == null) {
          column.appendChild(draggedItem);
        } else {
          column.insertBefore(draggedItem, afterElement);
        }
        saveTasks();
      }
    });
  });

  // 드래그 후 요소 위치 결정
  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll('.card:not(.dragging)'),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
  }

  loadTasks();
});
