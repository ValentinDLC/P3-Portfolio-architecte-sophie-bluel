const navFilters = document.querySelector(".filters-nav");
const gallery = document.querySelector(".gallery");
const asideModal = document.querySelector("#modal");
const galleryModal = document.querySelector(".modal-box-gallery");
const modalGallery = document.querySelector(".modal-gallery");
const addModal = document.querySelector(".modal-add-picture");
const selectForm = document.querySelector("#category");
const createButton = (category) => {
  const buttonFilters = document.createElement("button");
  buttonFilters.setAttribute("data-tag", category.name);
  buttonFilters.setAttribute("data-id", category.id);
  buttonFilters.innerText = category.name;
  navFilters.appendChild(buttonFilters);
};

const createProject = (project) => {
  const figureProject = document.createElement("figure");
  figureProject.setAttribute("data-tag", project.category.name);
  figureProject.setAttribute("data-id", project.id);

  const imageProject = document.createElement("img");
  imageProject.src = project.imageUrl;
  imageProject.alt = project.title;
  const figcaptionProject = document.createElement("figcaption");
  figcaptionProject.innerText = project.title;
  figureProject.appendChild(imageProject);
  figureProject.appendChild(figcaptionProject);
  gallery.appendChild(figureProject);
};

const createOption = (category) => {
  const optionForm = document.createElement("option");
  optionForm.setAttribute("value", category.id);
  optionForm.innerText = category.name;
  selectForm.appendChild(optionForm);
};

const removeElement = (parent_element) => {
  while (parent_element.childNodes.length > 0) {
    parent_element.removeChild(parent_element.lastChild);
  }
};

const getWorks = async (categoryId) => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("data recovery error");
      }
    })

    .then((project) => {
      removeElement(gallery);
      removeElement(modalGallery);
      project.forEach((project) => {
        if (categoryId == project.category.id || categoryId == null) {
          createProject(project);

          createModalProject(project);
        }
      });
    })

    .catch((error) => {
      console.log(error);
    });
};

const getCategories = async (category) => {
  await fetch("http://localhost:5678/api/categories")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("category data recovery error");
      }
    })

    .then((category) => {
      category.forEach((category) => {
        createButton(category);
        createOption(category);
      });
    })

    .then((Filter) => {
      const buttons = document.querySelectorAll(".filters-nav button");
      buttons.forEach((button) => {
        button.addEventListener("click", function () {
          let categoriesId = button.getAttribute("data-id");
          console.log(categoriesId);

          buttons.forEach((button) => button.classList.remove("is-active"));

          this.classList.add("is-active");

          getWorks(categoriesId);
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const main = async () => {
  await getWorks();
  await getCategories();
};

main();

const body = document.querySelector("body");

const galleryTitle = document.querySelector("#portfolio h2");

const token = window.sessionStorage.getItem("token");

const logOut = () => {
  sessionStorage.removeItem("token");

  window.location.href = "./index.html";
};

const adminPage = () => {
  body.insertAdjacentHTML(
    "afterbegin",
    `<div class="edit-bar">
          <span class="edit"><i class="fa-solid fa-pen-to-square"></i>Mode édition</span>
      </div>`
  );

  galleryTitle.insertAdjacentHTML(
    "afterend",
    `<a id="open-modal" href="#modal" class="edit-link">
          <i class="fa-solid fa-pen-to-square"></i>modifier
      </a>`
  );

  document.querySelector(".filters-nav").style.display = "none";

  const logButton = document.querySelector("#logButton");
  console.log("#logButton");

  logButton.innerHTML = `<a href="./index.html">logout</a>`;

  logButton.addEventListener("click", logOut);

  const modalLink = document.querySelector("#open-modal");

  modalLink.addEventListener("click", openModal);
};

const deleteWork = async (workID) => {
  await fetch("http://localhost:5678/api/works/" + workID, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: "bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
  });

  getWorks();
};

const createModalProject = (project) => {
  const figureModalProject = document.createElement("figure");
  figureModalProject.setAttribute("data-tag", project.id);

  const imageModalProject = document.createElement("img");
  imageModalProject.src = project.imageUrl;
  imageModalProject.alt = project.title;
  imageModalProject.classList.add("modal-project-img");

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("trash-icon", "fas", "fa-trash-alt");
  trashIcon.setAttribute("data-id", project.id);
  let trashIconID = trashIcon.getAttribute("data-id");

  const moveIcon = document.createElement("div");
  moveIcon.classList.add("move-icon");

  trashIcon.addEventListener("click", function (event) {
    event.preventDefault();

    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?") == true) {
      deleteWork(trashIconID);
    }
  });

  figureModalProject.appendChild(imageModalProject);
  figureModalProject.appendChild(trashIcon);
  trashIcon.appendChild(moveIcon);
  modalGallery.appendChild(figureModalProject);
};

const addWork = document.querySelector("#add-box");
const inputElement = document.querySelector("#title");
const selectElement = document.querySelector("#category");
const fileInputElement = document.querySelector("#image");
const submitButton = document.querySelector("#validate-button");
const inputFile = document.querySelector("#image");

const showfile = (e) => {
  e.preventDefault();

  const reader = new FileReader();

  reader.readAsDataURL(inputFile.files[0]);

  reader.addEventListener("load", function () {
    previewImage.src = reader.result;
  });

  const previewBox = document.querySelector(".upload-picture-box");
  const previewImage = document.createElement("img");
  previewImage.setAttribute("id", "preview-image");

  if (!document.querySelector(".preview-image")) {
    previewImage.style.position = "absolute";
    previewImage.style.objectFit = "contain";
    previewImage.style.width = "100%";
    previewImage.style.height = "100%";
  }

  const uploadbutton = document.querySelector(".upload-button");
  uploadbutton.style.display = "none";
  const pictureIcon = document.querySelector(".picture-icon");
  pictureIcon.style.display = "none";
  const typeFiles = document.querySelector(".type-files");
  typeFiles.style.display = "none";

  previewBox.appendChild(previewImage);
};

const checkForm = () => {
  if (
    inputElement.value !== "" &&
    selectElement.value !== "" &&
    fileInputElement.value !== ""
  ) {
    submitButton.style.backgroundColor = "#1D6154";
    submitButton.style.color = "#ffffff";
  } else {
    return console.log("Formulaire incomplet");
  }
};

inputFile.addEventListener("change", showfile);
inputElement.addEventListener("input", checkForm);
selectElement.addEventListener("input", checkForm);
fileInputElement.addEventListener("change", checkForm);

const addWorks = async () => {
  let getpic = document.getElementById("image").files[0];
  let gettitle = document.getElementById("title").value;
  let getCategory = document.getElementById("category").value;

  let formData = new FormData();
  formData.append("image", getpic);
  formData.append("title", gettitle);
  formData.append("category", getCategory);

  await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        getWorks();
        closeModal();
        console.log("Le projet a été ajouté !");
        return response.json();
      } else {
        console.log("Api data recovery error");
      }
    })

    .catch((error) => {
      console.log(error);
    });
};

const validateForm = (e) => {
  e.preventDefault();

  let imgIssue = document.querySelector("#error-img");
  let titleIssue = document.querySelector("#error-title");
  let categoryIssue = document.querySelector("#error-category");

  imgIssue.innerHTML = "";
  titleIssue.innerHTML = "";
  categoryIssue.innerHTML = "";

  if (inputElement.value === "") {
    titleIssue.innerHTML = "Titre obligatoire";
  }
  if (selectElement.value === "") {
    categoryIssue.innerHTML = "Catégorie obligatoire";
  }
  if (fileInputElement.files.length === 0) {
    imgIssue.innerHTML = "Image obligatoire";
  }

  if (
    inputElement.value !== "" &&
    selectElement.value !== "" &&
    fileInputElement.files.length > 0
  ) {
    addWorks();
  }
};

const openModal = () => {
  asideModal.classList.remove("unactive-modal");
  asideModal.setAttribute("aria-hidden", "false");

  galleryModal.classList.remove("unactive-modal");

  const addPicButton = document.querySelector("#add-photo");
  addPicButton.addEventListener("click", (event) => {
    galleryModal.classList.add("unactive-modal");
    addModal.classList.remove("unactive-modal");
    const closeIcon2 = document.querySelector(".close-icon-2");
    closeIcon2.addEventListener("click", closeModal);
    const backIcon = document.querySelector(".back-icon");
    backIcon.addEventListener("click", (event) => {
      galleryModal.classList.remove("unactive-modal");
      addModal.classList.add("unactive-modal");
    });
  });

  addWork.addEventListener("submit", validateForm);

  const closeIcon = document.querySelector(".close-icon");
  closeIcon.addEventListener("click", closeModal);

  document.getElementById("modal").addEventListener("click", (event) => {
    if (event.target === document.getElementById("modal")) {
      closeModal();
    }
  });

  getWorks();
};

const closeModal = () => {
  asideModal.classList.add("unactive-modal");
  modalGallery.classList.add("unactive-modal");
  addModal.classList.add("unactive-modal");

  document.querySelector("#add-box").reset();
  const previewBox = document.querySelector(".upload-picture-box");
  const previewImage = document.querySelector("#preview-image");
  if (previewImage !== null) {
    previewBox.removeChild(previewImage);
  }

  const uploadButtonPic = document.querySelector(".upload-button");
  uploadButtonPic.style.display = "block";

  const pictureIcon = document.querySelector(".picture-icon");
  pictureIcon.style.display = "";

  const typeFiles = document.querySelector(".type-files");
  typeFiles.style.display = "";

  submitButton.style.backgroundColor = "#a7a7a7";
};

if (token !== null) {
  adminPage();
}
