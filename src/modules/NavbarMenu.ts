export default class NavbarMenu {
  navbar = document.querySelector(".nav") as HTMLElement;
  menu = document.querySelector(".menu") as HTMLElement;

  constructor() {
    this.init();

    const initial_page_scroll_y = scrollY;
    let current_scroll_y = initial_page_scroll_y;
    let header_el = document.querySelector("#header") as HTMLElement;

    function check_scroll() {
      // Start page
      if (scrollY === 0) {
        header_el.classList.add("scroll-start");
        header_el.classList.add("scroll-up");
      }
      // Scroll down
      else if (current_scroll_y - scrollY < 0) {
        if (scrollY >= header_el.offsetHeight) {
          header_el.classList.remove("scroll-start");
          header_el.classList.remove("scroll-up");
          this.navbar.classList.remove("active");
          this.menu.classList.remove("active");
        }
      }
      // Scroll up
      else {
        if (scrollY >= header_el.offsetHeight) {
          header_el.classList.add("scroll-up");
          header_el.classList.remove("scroll-start");
        } else {
          header_el.classList.add("scroll-start");
        }
      }

      current_scroll_y = scrollY;
    }

    check_scroll.call(this);

    document.addEventListener("scroll", (event) => {
      check_scroll.call(this);
    });
  }

  init() {
    this.menu.addEventListener("click", (event: MouseEvent) => {
      this.navbar.classList.toggle("active");
      this.menu.classList.toggle("active");
    });
  }
}
