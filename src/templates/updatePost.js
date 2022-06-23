import { auth } from "../firebase/init.js";
import {
  editPost,
  getPost,
} from "../firebase/store.js";
import { navigate } from "../router/routes.js";
import { signOutWithEmail } from "../firebase/auth.js";

function updatePost() {
  const html =//html
    `
<div class="background-white">
    <div class="bar">
      <div id="navMenu">
        <div>
          <h4> PlantGram <img src="./assets/flower.png"></h4>
          <ul>
              <li><a href='#' id='linkProfile'> MI PERFIL </a></li>
              <li><a href='#' id='linkPublic'> PUBLICACIONES </a></li>
          </ul>
        </div>
        <ul class="logOutList">
          <li>
            <a href='#' id='signOut'> Cerrar sesión </a>
          </li>
        </ul>
      </div>
      <h5>PlantGram</h5>
    </div>
    <div class="dashboard">
        <h2>EDICIÓN DE POST</h2>
        <div class="updatePost">
        </div>      
        <button id="addUpdatePost">Editar post</button>
    </div>
</div>`;
  const container = document.createElement("div");
  container.innerHTML = html;
  //  ACTIVE MENU
  const linkProfile = container.querySelector("#linkProfile");
  linkProfile.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("profile");
  });
  const linkPublic = container.querySelector("#linkPublic");
  linkPublic.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("publications");
  });

  //SIGN OUT WITH EMAIL
  const signOut = container.querySelector("#signOut");
  signOut.addEventListener("click", async () => {
    try {
      await signOutWithEmail(auth);
      navigate("login");
    } catch (error) {
      throw error.message;
    }
  });

  // EDIT POSTS TEMPLATE 
  const updatePost = container.querySelector(".updatePost");
  const updatePosts = async () => {
    let post = "";
    const ul =// html
      `
          <ul class="editPost">
            <input class="postTitle" id="postTitle" />
            <textarea class="postBody" id="postBody"></textarea>
          </ul>
        `;
    post += ul;
    updatePost.innerHTML = post;
  };
  updatePosts();
  // GET POST BY ID TO EDIT
  try{
    const getPostId = async () => {
    // Obtengo el parámetro de la url :ID
    let substr = window.location.search.substring(1);
    let id = substr.split("=")[1];
    // Llamo a mi función get de Firebase
    const data = await getPost(id);
    console.log("data", data);
    // Llamo los IDs de los inputs
    const title = document.getElementById("postTitle");
    const postBody = document.getElementById("postBody");
    // Agrego la información
    title.value = data.title;
    postBody.value = data.description;
  getPostId()};
  } catch (error) {
    throw error.message
  }

// UPDATE POST 
  const updateListPost = container.querySelector("#addUpdatePost");
  if (updateListPost) {
    updateListPost.addEventListener("click", function () {
      const title = container.querySelector("#postTitle").value;
      const description = container.querySelector("#postBody").value;
      // Obtengo el parámetro de la url :ID
      let substr = window.location.search.substring(1);
      let id = substr.split("=")[1];
      if (title || description) {
        editPost(id, title, description);
        // navigate("publications");
        setTimeout(() => {
          window.location.href = "/publications";
        }, 1000);
      }
    });
  }
  return container;
}
export { updatePost };