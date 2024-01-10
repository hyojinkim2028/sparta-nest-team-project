const currentUrl = String(window.location.href);
let getBoardId = currentUrl.split('/').pop();

async function getBoardDetail() {
  try {
    const boardDetailData = await axios.get(`/api/boards/${getBoardId}`);
    const boardDetail = boardDetailData.data.data;
    console.log(boardDetail.backgroundColor);
    document.querySelector('.kanban').style.backgroundColor =
      boardDetail.backgroundColor;
    document.getElementById('boardName').innerHTML =
      `${boardDetail.boardTitle} _ `;
    document.getElementById('boardDescription').innerHTML =
      boardDetail.description;

    const collaboratorData = await axios.get(
      `/api/boards/${getBoardId}/invite`,
    );
    const collaborators = collaboratorData.data.data;
    console.log(collaborators);
    // 초대된 유저 사이드바
    collaborators.forEach((data) => {
      let collaborator = `
                <li>
            <div class="nav-link text-white align-items-center">
              <i style="font-size: 21px;">${data.name}</i>
            </div>
          </li>
                `;
      document
        .querySelector('.invitedEmailUl')
        .insertAdjacentHTML('beforeend', collaborator);
    });

    document
      .querySelector('.board-delete-btn')
      .addEventListener('click', async function () {
        try {
          await axios.delete(`/api/boards/${getBoardId}`);
          if (confirm('정말 삭제 하시겠습니까?')) {
            alert('삭제 완료!');
            window.location.href = 'http://localhost:3001/api/home';
          } else {
            alert('취소합니다.');
          }
        } catch (error) {
          console.error('Error fetching post:', error.message);
        }
      });
  } catch (error) {
    console.log(error);
  }
}
getBoardDetail();

async function updateBoard() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const backgroundColor = color;

  // 클릭된 div의 색상 출력
  console.log('Selected Color:', backgroundColor);
  try {
    await axios({
      method: 'PATCH',
      url: `/api/boards/${getBoardId}`,
      data: {
        boardTitle: title,
        description,
        backgroundColor, // 클릭된 div의 색상을 전달
      },
    })
      .then((res) => {
        alert('보드 수정 성공!');
        location.reload();
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
  } catch (error) {
    console.log(error);
  }
}

const updateBtn = document.getElementById('updateBtn');
updateBtn.addEventListener('click', updateBoard);

async function createInvite() {
  const inviteEmail = document.getElementById('inviteEmail').value;

  try {
    await axios({
      method: 'POST',
      url: `/api/boards/${getBoardId}/invite`,
      data: {
        email: inviteEmail,
      },
    })
      .then((res) => {
        alert('초대 성공!');
        location.reload();
      })
      .catch((error) => {
        alert('초대에 실패하였습니다. 이메일을 다시 확인해주세요');
        console.log(error);
        throw new Error(error);
      });
  } catch (error) {
    console.log(error);
  }
}

const inviteBtn = document.getElementById('inviteBtn');
inviteBtn.addEventListener('click', createInvite);
