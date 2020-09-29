const imgContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
const topBtn = document.getElementById("topBtn");
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;
let checkResponse = "";

// Unsplash API
let photoCount = 5;
const apiKey = "csCS8dKME4Et4puIzmQPaqkxrKoK_l86lBWW1oA_7Zk";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${photoCount}`;

function updateApiUrl(newCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${newCount}`;
}

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Helper function
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function displayPhotos() {
  totalImages = photosArray.length;
  imagesLoaded = 0;
  //
  photosArray.forEach((photo) => {
    // create <a> to link unsplash page
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    img.addEventListener("load", imageLoaded);
    item.appendChild(img);
    imgContainer.appendChild(item);
  });
}

// Get photos from unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    checkResponse = response.status;
    photosArray = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      updateApiUrl(30);
      isInitialLoad = false;
    }
  } catch (error) {
    let errText = error;
    if (checkResponse === 403) {
      errText = "Unsplash API hourly requests terminated";
    }
    swal.fire({
      icon: "error",
      title: "Oops...Something went wrong!",
      text: errText,
    });
  }
}

// Add a listener on scroll, when reach almost the end page new photos must be acquired
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }

  if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
});

topBtn.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

getPhotos();
