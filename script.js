// Ambil elemen dari HTML 
const cells = document.querySelectorAll('.cell'); // Ambil semua sel di papan 
const xPlayerDisplay = document.querySelector('#xPlayerDisplay'); // Ambil elemen untuk pemain X
const oPlayerDisplay = document.querySelector('#oPlayerDisplay'); // Ambil elemen untuk pemain O
const restartBtn = document.querySelector('#restartBtn'); // Ambil tombol restart
const startPopup = document.getElementById('startPopup'); // Ambil popup pemilihan pemain
const titleHeader = document.getElementById('titleHeader'); // Ambil judul tampilan giliran pemain

const popup = document.getElementById('popup'); // Ambil popup hasil permainan
const popupMessage = document.getElementById('popupMessage'); // Ambil elemen untuk pesan di popup
const closePopup = document.getElementById('closePopup'); // Ambil tombol untuk menutup popup

// Variabel untuk status permainan
let player = 'X';
let initialPlayer = 'X';
let isPauseGame = false; // Status permainan, apakah sedang terjeda
let isGameStart = false; // Status permainan, apakah sudah dimulai

// Array untuk nyimpen status sel
const inputCells = Array(9).fill('');
const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Tambah event listener untuk setiap sel
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => tapCell(cell, index));
});

// Fungsi saat cell ditekan 
function tapCell(cell, index) {
  if (cell.textContent === '' && !isPauseGame) {
    isGameStart = true;
    updateCell(cell, index);
    if (!checkWinner()) {
      changePlayer();
      randomPick(); // AI bot main otomatis setelah player
    }
  }
}

// Fungsi untuk memperbarui sel
function updateCell(cell, index) {
  cell.textContent = player;
  inputCells[index] = player;
  cell.style.color = player === 'X' ? '#1892EA' : '#A737FF';
}

// Fungsi untuk mengganti pemain
function changePlayer() {
  player = player === 'X' ? 'O' : 'X';
  updateTurnHighlight();
  titleHeader.textContent = `${player}'s Turn`;
}

// untuk memperbarui tampilan giliran pemain
function updateTurnHighlight() {
  if (player === 'X') {
    xPlayerDisplay.classList.add('player-active');
    oPlayerDisplay.classList.remove('player-active');
  } else {
    xPlayerDisplay.classList.remove('player-active');
    oPlayerDisplay.classList.add('player-active');
  }
}

// Bot memilih secara acak cell kosong 
function randomPick() {
  isPauseGame = true; // Jeda permainan
  setTimeout(() => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * inputCells.length);
    } while (inputCells[randomIndex] !== '');

    updateCell(cells[randomIndex], randomIndex);

    if (!checkWinner()) { // Cek apakah ada pemenang
      changePlayer(); // Ganti pemain
      isPauseGame = false; // Lanjutkan permainan
    }
  }, 1000);
}

// Cek kondisi menang atau seri
function checkWinner() {
  for (const [a, b, c] of winConditions) {
    const val = inputCells[a];
    if (val !== '' && val === inputCells[b] && val === inputCells[c]) {
      declareWinner([a, b, c], val); // Umumkan pemenang
      return true;
    }
  }

  if (inputCells.every(cell => cell !== '')) {
    declareDraw(); // Umumkan hasil seri
    return true;
  }

  return false; // Tidak ada pemenang
}

// Tampilkan pemenang
function declareWinner(indices, winner) {
  titleHeader.textContent = `${winner} Win`;
  isPauseGame = true;
  indices.forEach(index => cells[index].style.background = '#2A2343');
  restartBtn.style.visibility = 'visible'; // Tampil tombol restart

  popupMessage.textContent = `🎉 Player ${winner} Wins!`; // Tampil pesan pemenang
  popup.classList.remove('hidden'); //Tampil popup
}

// Tampilkan hasil seri 
function declareDraw() {
  titleHeader.textContent = 'Draw!';
  isPauseGame = true;
  restartBtn.style.visibility = 'visible';

  popupMessage.textContent = `😐 It's a Draw!`;
  popup.classList.remove('hidden');
}


// Pilih pemain awal 
function choosePlayer(selectedPlayer) {
  player = selectedPlayer;
  updateTurnHighlight();
  titleHeader.textContent = `${player}'s Turn`;
}

// untuk mulai permainan
function startGame(selectedPlayer) {
  initialPlayer = selectedPlayer;
  choosePlayer(selectedPlayer);
  startPopup.classList.add('hidden');
}

// Event listener tombol restart
restartBtn.addEventListener('click', () => {
  restartBtn.style.visibility = 'hidden';
  inputCells.fill('');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.background = '';
  });
  isPauseGame = false;
  isGameStart = false;
  player = initialPlayer;
  choosePlayer(player);
});

// Event listener untuk tombol tutup popup
closePopup.addEventListener('click', () => {
  popup.classList.add('hidden');
});
