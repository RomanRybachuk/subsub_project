export default class NavbarMenu {
  navbar = document.querySelector(".nav") as HTMLElement;
  menu = document.querySelector(".menu") as HTMLElement;

  constructor() {
    this.init();
  }

  init() {
    this.menu.addEventListener("click", (event: MouseEvent) => {
      this.navbar.classList.toggle("active");
      this.menu.classList.toggle("active");
    });
  }
}
