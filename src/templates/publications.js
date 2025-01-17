import { auth, } from '../firebase/init.js';
import { readData, deletePost, likePost, snapshot, } from '../firebase/store.js';
// eslint-disable-next-line import/no-cycle
import { navigate } from '../router/routes.js';
import { signOutWithEmail } from '../firebase/auth.js';

function publications() {
  // eslint-disable-next-line operator-linebreak
  const html =// html
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
        <button id="btnCreatePost">Nuevo post</button>
        <div class="createPost">
          
        </div>
    </div>
</div>`;
  const container = document.createElement('div');
  container.innerHTML = html;
  //  ACTIVE MENU
  const linkProfile = container.querySelector('#linkProfile');
  linkProfile.addEventListener('click', (event) => {
    event.preventDefault();
    navigate('profile');
  });
  const linkPublic = container.querySelector('#linkPublic');
  linkPublic.addEventListener('click', (event) => {
    event.preventDefault();
    navigate('publications');
  });
  // SIGN OUT WITH EMAIL
  const signOut = container.querySelector('#signOut');
  signOut.addEventListener('click', async () => {
    try {
      await signOutWithEmail(auth);
      navigate('login');
    } catch (error) {
      throw error.message;
    }
  });
  // DISPLAY POSTS WITH LIKES
  const postList = container.querySelector('.createPost');
  const setupPosts = async () => {
    // const data = await readData();
    // if (data) {
      snapshot((callback)=> {
      let html = '';
      callback.forEach((doc) => {
        const post = doc.data();
        const resultLikes = post.likes;
        const likesSum = post.likesSum;
        const imageTemp = 'https://st.depositphotos.com/1743476/1262/i/450/depositphotos_12621249-stock-photo-new-life.jpg';
        // if (doc.activeLike) {
          // let activeLike = `<img id="like-${doc.id}" width="25" src="./assets/dislike.png">`;
        // } else {
        //   activeLike = `<img id="like-${doc.id}" width="25" src="./assets/dislike.png">`;
        // }
        const likes = doc.likes || 0;
        const ul =// html
          `
          <div class="postList">
            <h3 class="postTitle"> ${post.title} </h3>
            <p class="postBody"> ${post.description} </p>
            <img width="400" src="${post.image ? post.image : imageTemp}">
            <div class="postLikes">
            
            <div class="modal" data-animation="modalAnimation" id="modal1">
              <div class="modal-dialog">
                <header class="modal-header">
                ELIMINAR POST
                </header>
                <section class="modal-content">¿De verdad quieres eliminar este post?</section>
                <footer class="modal-footer">
                <button class="btnDeletePost" id="btnDelete-${doc.id}">Eliminar</button>
                <button class="close-modal" aria-label="close modal" data-close>Cancelar</button>
                </footer>
              </div>
            </div> 
            <div class="like"> 
              <span>
                ${likesSum}
              </span>
              <picture class="toggleLike"  id="toggleLike-${doc.id}">
                ${resultLikes.includes(auth.currentUser.uid)? `<img id="like-${doc.id}" width="25" src="./assets/like.png">` : `<img id="like-${doc.id}" width="25" src="./assets/dislike.png">` }
              </picture>
            </div>
            <button class="btnUpdatePost" id="btnUpdate-${doc.id}"><img width="18" class="editButton" src="../assets/edit.png"></button>
            <button  class="open-modal btnDeletePost" data-open="modal1" ><img width="20" class="deleteButton" src="../assets/delete.png"></button>
            </div>
          </div>
        `;
        html += ul;
      });
      postList.innerHTML = html;
      //DELETE POST
      const openEls = container.querySelectorAll('[data-open]');
      const closeEls = container.querySelectorAll('[data-close]');
      const isVisible = 'is-visible';
      // eslint-disable-next-line no-restricted-syntax
      for (const el of openEls) {
        // eslint-disable-next-line func-names
        el.addEventListener('click', function () {
          const modalId = this.dataset.open;
          console.log(modalId)
          document.getElementById(modalId).classList.add(isVisible);
        });
      }
      const btnDeletePost = container.querySelectorAll('.btnDeletePost');
      btnDeletePost.forEach((btnDelete) => {
      btnDelete.addEventListener("click", function (event) {
        const id = btnDelete.id.split('-')[1];
        deletePost(id);
        // const modalId = this.dataset.open;
        const modal = document.getElementById('modal1');
        console.log(modal)
        // classList.remove(isVisible);
          // navigate('');
        });
      });
      // eslint-disable-next-line no-restricted-syntax
      for (const el of closeEls) {
        // eslint-disable-next-line func-names
        el.addEventListener('click', function () {
          this.parentElement.parentElement.parentElement.classList.remove(
            isVisible,
          );
        });
      }

      // BUTTON UPDATE
      const btnUpdatePost = container.querySelectorAll('.btnUpdatePost');
      btnUpdatePost.forEach((btnUpdate) => {
        btnUpdate.addEventListener('click', (event) => {
        const id = btnUpdate.id.split('-')[1]
          // let idPost = container.getElementsById(id).value;
          console.log(id)
          localStorage.setItem('id', id);
          // const id = btnUpdate.id.split('-')[1]
          // id.window.location.pathname;
          // if (id) {
          // const btnUpdate = window.location.pathname;
          // if (btnUpdate) {
            // navigate(`updatePost?id=${id}`);
            navigate('updatePost');
        //}}
      })});

      // BUTTON LIKE FUNCTIONALITY
      const toggleLike = container.querySelectorAll('.toggleLike');
      toggleLike.forEach((like) => {
        // eslint-disable-next-line func-names
        like.addEventListener('click', function () {
          const id = like.id.split('-')[1];
          // container.getElementById(`like-${id}`).src = "./assets/like.png";
          console.log(id)
          likePost(id, auth.currentUser.uid);
          console.log("HOLA")
          setupPosts();
        });
      });
    })
  // } 
  //   else {
  //     postList.innerHTML = '<p>Ingresa para ver tus posts</p>';
  //   }
      
  };

  setupPosts();
  // BUTTON ADD NEW POST
  const addPost = container.querySelector('#btnCreatePost');
  if (addPost) {
    addPost.addEventListener('click', () => {
      navigate('addPost');
    });
  }
  return container;
}
export { publications };
