import { auth } from "../firebase/init.js";
import {
  readData,
  deletePost,
  likePost,
} from "../firebase/store.js";
import { navigate } from "../router/routes.js";
import { signOutWithEmail } from "../firebase/auth.js";

function publications() {
  const html =                                                                                                                                                                                                                                                                                                                                          //html
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
        <h2>PUBLICACIONES</h2>
        <button id="btnCreatePost">Nuevo post</button>
        <div class="createPost">
          
        </div>
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
  // DISPLAY POSTS WITH LIKES
  const postList = container.querySelector(".createPost");
  const setupPosts = async () => {
    let data = await readData();
    if (data) {
      let html = "";
      data.forEach((doc) => {
        const post = doc.data;
        let activeLike = "";
        let imageTemp = "https://st.depositphotos.com/1743476/1262/i/450/depositphotos_12621249-stock-photo-new-life.jpg"
        if (doc.activeLike) {
          activeLike = `<img id="${doc.id}__like" width="28" src="./assets/like.png">`;
        } else {
          activeLike = `<img id="${doc.id}__like" width="28" src="./assets/dislike.png">`;
        }

        let likes = doc.likes || 0;
        const ul =//html
          `
          <ul class="postList">
            <h3 class="postTitle"> ${post.title} </h3>
            <p class="postBody"> ${post.description} </p>
            <img width="200" src="${post.image ? post.image : imageTemp}">
            <div class="postLikes">
            <button class="btnDeletePost" id="${doc.id}"><img class="deleteButton" src="../assets/delete.png"></button>
            <a class="btnUpdatePost" id="${doc.id}" href="/updatePost?id=${doc.id}"><img class="editButton" src="../assets/edit.png"></a>
              <span>
                ${likes}
              </span>
              <picture class="toggleLike"  id="${doc.id}">
                ${activeLike}
              </picture>
            </div>
          </ul>
        `;
        html += ul;
      });
      postList.innerHTML = html;
      const btnDeletePost = container.querySelectorAll(".btnDeletePost");
      btnDeletePost.forEach((btnDelete) => {
        btnDelete.addEventListener("click", function (event) {
          deletePost(btnDelete.id);
        });
      });
      // BUTTON UPDATE
      const btnUpdatePost = container.querySelectorAll(".btnUpdatePost");
      btnUpdatePost.forEach((btnUpdate) => {
        btnUpdate.addEventListener("click", function (event) {
          let btnUpdate = window.location.pathname;
          if(btnUpdate){
            navigate("updatePost");
              }
            })
          });
      // BUTTON LIKE FUNCTIONALITY
      const toggleLike = container.querySelectorAll(".toggleLike");
      toggleLike.forEach((child) => {
        child.addEventListener("click", function () {
          likePost(this.id, auth.currentUser.uid);
          setupPosts();
        });
      });
    } else {
      postList.innerHTML = "<p>Ingresa para ver tus posts</p>";
    }
  };
  setupPosts();
  // BUTTON ADD NEW POST
  const addPost = container.querySelector("#btnCreatePost");
  if (addPost) {
    addPost.addEventListener("click", function () {
      navigate("addPost");
    });
  }
  return container;
}
export { publications };
