let currentPage = 1;
let perPage = 5;
const USERS_URL = "https://randomuser.me/api/?seed=footbar";
const selectedUserNames = [];

const userCardsEl = document.querySelector(".userCards");
const errorMessageEl = document.querySelector(".error-message");
const selectedUserListEl = document.querySelector(".selectedUsers");
const [firstBtn, prevBtn, nextBtn] = document.querySelectorAll(".navBtn");
const perPageSelect = document.querySelector("#per-page");

fetchUsers(currentPage, perPage);

firstBtn.addEventListener("click", () => {
  userCardsEl.innerHTML = "";
  currentPage = 1;
  fetchUsers(currentPage, perPage);
  firstBtn.disabled = true;
  prevBtn.disabled = true;
});

prevBtn.addEventListener("click", () => {
  userCardsEl.innerHTML = "";
  currentPage--;
  fetchUsers(currentPage, perPage);
  if (currentPage > 1) {
    firstBtn.disabled = false;
    prevBtn.disabled = false;
  } else {
    firstBtn.disabled = true;
    prevBtn.disabled = true;
  }
});

nextBtn.addEventListener("click", () => {
  userCardsEl.innerHTML = "";
  currentPage++;
  fetchUsers(currentPage, perPage);
  firstBtn.disabled = false;
  prevBtn.disabled = false;
});

perPageSelect.addEventListener("change", (e) => {
  console.log(e);
  userCardsEl.innerHTML = "";
  currentPage = 1;
  perPage = e.target.value;
  fetchUsers(currentPage, perPage);
  firstBtn.disabled = true;
  prevBtn.disabled = true;
});

function fetchUsers(currentPage, perPage) {
  hideError();
  showLoader();
  fetch(`${USERS_URL}&page=${currentPage}&results=${perPage}`)
    .then((resonse) => resonse.json())
    .then(({ results }) => {
      generateUsers(results);
    })
    .catch((err) => showError(err.message))
    .finally(() => hideLoader());
}

function showError(message) {
  errorMessageEl.classList.remove("invisible");
  errorMessageEl.textContent = message;
}

function hideError() {
  errorMessageEl.classList.add("invisible");
}

function generateUsers(users) {
  users.forEach((user) => generateSingleUser(user));
}

function generateSingleUser({
  email,
  gender,
  picture: { large: imgSrc },
  dob: { age },
  name: { first, last },
}) {
  const userName = `${first} ${last}`;

  const userCard = createNewElement("article", [
    "userCard",
    `${gender === "male" ? "maleBoxShadow" : "femaleBoxShadow"}`,
  ]);
  if (selectedUserNames.includes(userName)) {
    userCard.classList.add("selectedUserCard");
  }
  userCardsEl.append(userCard);

  userCard.addEventListener("click", function (e) {
    if (!selectedUserNames.includes(userName)) {
      this.classList.add("selectedUserCard");
      selectedUserNames.push(userName);
    } else {
      this.classList.remove("selectedUserCard");
      const selectedUserIndex = selectedUserNames.findIndex(
        (un) => un === userName
      );
      selectedUserNames.splice(selectedUserIndex, 1);
    }
    selectedUserListEl.innerHTML = selectedUserNames
      .map((userName) => `<li>${userName}</li>`)
      .join("");

    console.log("sdfsdsdf");
  });

  const userImgEl = createNewImageElement(
    "img",
    ["userImg"],
    imgSrc,
    `${first} ${last} image`
  );
  const userInfoContainer = createNewElement("div", ["userInfoContainer"]);
  const userNameEl = createNewElement("h2", ["userName"], userName);
  const userEmailEl = createNewElement("p", ["userEmail"], email);
  const userAgeEl = createNewElement("p", ["userAge"], `${age} years old`);
  userInfoContainer.append(userNameEl, userEmailEl, userAgeEl);

  const genderIcon = createNewElement("i", [
    "gender",
    "fa-solid",
    `${gender === "male" ? "fa-mars" : "fa-venus"}`,
  ]);

  const trashBtn = createNewElement("button", ["trashIcon"]);
  const trachIcon = createNewElement("i", ["fa-solid", "fa-trash"]);
  trashBtn.append(trachIcon);

  userCard.append(userImgEl, userInfoContainer, genderIcon, trashBtn);

  trashBtn.addEventListener("click", function (e) {
    this.parentElement.remove();
    if (selectedUserNames.includes(userName)) {
      this.classList.remove("selectedUserCard");
      const selectedUserIndex = selectedUserNames.findIndex(
        (un) => un === userName
      );
      if (selectedUserIndex !== -1) {
        selectedUserNames.splice(selectedUserIndex, 1);
        selectedUserListEl.innerHTML = selectedUserNames
          .map((userName) => `<li>${userName}</li>`)
          .join("");
      }
    }
    e.stopPropagation();
  });
}

function createNewElement(type, classNames, content) {
  const el = document.createElement(type);
  addClassesToElement(el, classNames);
  if (content) {
    el.textContent = content;
  }
  return el;
}

function createNewImageElement(type, classNames, src, alt) {
  const el = document.createElement(type);
  addClassesToElement(el, classNames);
  el.src = src;
  el.alt = alt;
  return el;
}

function addClassesToElement(el, classes) {
  classes.forEach((className) => {
    el.classList.add(className);
  });
}
