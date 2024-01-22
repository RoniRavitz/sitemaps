//supabase
const supabaseUrl = "https://wvoyabxqxiqbyzdbbjki.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2b3lhYnhxeGlxYnl6ZGJiamtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0ODk5NjMsImV4cCI6MjAyMTA2NTk2M30.jK9Axmf_K4V0bJ-dcBsdp8cSAaW0D9JmTl8dz7LAPGc";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

//check url
let hasIdInURL = location.href.includes("id");

if (hasIdInURL) {
  //get the id from url
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  async function fetchData() {
    try {
      let { data: sitemaps, error } = await supabase.from("sitemaps").select("*").eq("id", idParam);
      if (sitemaps) {
        document.querySelector(".workspace").innerHTML = sitemaps[0].code;
        dragAndDrop();
        contentEditable();
        removeBtn();
      }
    } catch (error) {
      console.log(error);
    }
  }
  fetchData();
}

//insert data
async function addData() {
  try {
    //get innerHTML
    const wireframesCode = document.querySelector(".workspace").innerHTML;
    //create randome number
    function generateRandomNumber() {
      return Math.floor(Math.random() * 9000000000 + 1000000000);
    }
    const randomNumber = generateRandomNumber();
    const newUrl = window.location.pathname + "?id=" + randomNumber.toString();

    // Update the URL without reloading the page
    history.pushState({ path: newUrl }, "", newUrl);
    console.log(randomNumber);

    //insert data
    const { data, error } = await supabase
      .from("sitemaps")
      .insert([{ id: randomNumber, code: wireframesCode }])
      .select();
  } catch (error) {
    console.log(error);
  }
}

//update data
async function updateData() {
  try {
    //get innerHTML
    const wireframesCode = document.querySelector(".workspace").innerHTML;

    //get the id from url
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");

    //update data
    const { data, error } = await supabase.from("sitemaps").update({ code: wireframesCode }).eq("id", idParam).select();
  } catch (error) {
    console.log(error);
  }
}
const saveBtn = document.querySelector(".save");
saveBtn.addEventListener("click", () => {
  let hasIdInURL = location.href.includes("id");
  if (!hasIdInURL) {
    addData();
  } else {
    updateData();
  }
});

//drag N drop
function dragAndDrop() {
  const panel = document.querySelector(".panel");
  const sitemaps = document.querySelectorAll(".sitemaps");

  new Sortable(panel, {
    group: {
      name: "shared",
      pull: "clone", // To clone: set pull to 'clone'
      put: false, // Do not allow items to be put into this list
    },
    onClone: function () {
      //remove btn
      removeBtn();
    },
    animation: 350,
    sort: false, // To disable sorting: set sort to false
  });
  sitemaps.forEach((e) => {
    new Sortable(e, {
      group: {
        name: "shared",
      },
      animation: 350,
    });
  });
}

dragAndDrop();

//contenteditable
function contentEditable() {
  document.querySelectorAll(".contenteditable").forEach((contenteditable) => {
    contenteditable.setAttribute("contenteditable", "true");
  });
}
contentEditable();

//remove frames btn
function removeBtn() {
  document.querySelectorAll(".remove").forEach((remove) => {
    remove.addEventListener("click", function () {
      this.parentElement.remove();
    });
  });
  document.querySelectorAll(".remove-page").forEach((remove) => {
    remove.addEventListener("click", function () {
      this.parentElement.parentElement.remove();
    });
  });
}
removeBtn();

//open add pages model
const selectPagesModel = document.querySelector(".select-pages-model");
const addPagesBtn = document.querySelector(".add-pages");
const closeModel = document.querySelector(".close-model");
addPagesBtn.addEventListener("click", () => {
  selectPagesModel.style.display = "flex";
});
closeModel.addEventListener("click", () => {
  selectPagesModel.style.display = "none";
});

//add pages
const selectPagesBtns = document.querySelectorAll(".select-pages span");
selectPagesBtns.forEach((addNewPage) => {
  addNewPage.addEventListener("click", (e) => {
    const newPage = document.createElement("div");
    document.querySelector(".workspace").appendChild(newPage);
    newPage.classList.add("sitemaps-wrap");
    newPage.innerHTML =
      '<div class="sitemaps-title-wrap"><span class="sitemaps-title contenteditable"></span><img class="remove-page" src="icons/trash.svg" alt="remove" ></div> <div class="sitemaps"></div>';
    newPage.querySelector(".sitemaps-title").innerText = e.target.innerText;
    selectPagesModel.style.display = "none";
    contentEditable();
    dragAndDrop();
    removeBtn();
  });
});

//copy url
document.querySelector(".copy-link").addEventListener("click", (e) => {
  navigator.clipboard.writeText(location.href);
  e.target.innerText = "Copied";
  setTimeout(() => {
    e.target.innerText = "Copy link";
  }, 500);
});

//save btn
document.querySelector(".save").addEventListener("click", () => {
  document.querySelector(".save-model").style.display = "flex";
  document.querySelector(".project-link").innerHTML = location.href;
});
document.querySelector(".close-save-model").addEventListener("click", () => {
  document.querySelector(".save-model").style.display = "none";
});
document.querySelector(".save-copy-link").addEventListener("click", (e) => {
  navigator.clipboard.writeText(location.href);
  e.target.innerText = "Copied";
  setTimeout(() => {
    e.target.innerText = "Copy link";
  }, 500);
});

//print PDF
document.querySelector(".download").addEventListener("click", () => {
  const PDFspace = document.createElement("div");
  PDFspace.innerHTML = document.querySelector(".workspace").innerHTML;
  PDFspace.querySelectorAll(".remove").forEach((e) => {
    e.remove();
  });
  PDFspace.querySelectorAll(".remove-page").forEach((e) => {
    e.remove();
  });
  PDFspace.querySelectorAll(".sitemaps").forEach((e) => {
    e.style.width = "760px";
  });
  PDFspace.querySelectorAll(".sitemaps-wrap").forEach((e) => {
    e.style.padding = "10px";
  });
  html2pdf(PDFspace);
});
