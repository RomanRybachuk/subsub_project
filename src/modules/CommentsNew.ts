interface IComment {
  id: string;
  name: string;
  text: string;
  avatar: string;
  created_at_timestamp: number;
  likes: number;
  liked?: boolean;
  sub?: boolean;
  replying?: boolean;
  replies: IComment[];
}

export default class Comments {
  comments: Array<IComment>;

  root = document.querySelector("[data-comment-list]") as HTMLElement;
  count = document.querySelector("[data-comment-count]");

  field = document.querySelector("[data-comment-field]") as HTMLInputElement;
  form = document.querySelector("[data-comment-form]");
  submit = document.querySelector("[data-comment-create-button]");

  template = document.querySelector("#comment-template") as HTMLTemplateElement;

  constructor() {
    this.init();
  }

  async init() {
    this.comments = await this.get_comments();

    this.mount(this.root, this.comments);

    this.root.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      let item: HTMLLIElement = target.closest("[data-comment-id]");

      if (!item) return;

      let id = item.dataset.commentId;

      // Like action
      if (target.closest("[data-comment-like-button]")) {
        // Change state
        this.comments = this.comments.map((comment: IComment) => {
          if (comment.id === id) {
            return {
              ...comment,
              liked: !comment.liked,
            };
          } else if (comment.replies.find((item) => item.id === id)) {
            return {
              ...comment,
              replies: comment.replies.map((item) => {
                if (item.id === id) {
                  return {
                    ...item,
                    liked: !item.liked,
                  };
                }

                return item;
              }),
            };
          }
          return comment;
        });

        // Change view
        this.update_like(
          document.querySelector(`[data-comment-id="${id}"]`) as HTMLElement,
          this.get_comment_by_id(id)
        );
      }
    });

    this.field.addEventListener("input", (event: InputEvent) => {
      if (this.field.value) {
        this.submit.classList.add("active");
      } else {
        this.submit.classList.remove("active");
      }
    });

    this.form.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();

      if (!this.field.value) return;

      const data: IComment = {
        id: Date.now().toString(),
        name: "Anonymous",
        text: this._escapeHTML(this.field.value),
        avatar: "/avatars/anonymous.png",
        created_at_timestamp: Date.now(),
        likes: 0,
        replies: [],
      };

      this.add_comment(data);

      this.field.value = "";
      this.submit.classList.remove("active");

      this.update_comments_count();
    });
  }

  get_comment_by_id(id: string) {
    const comments: IComment[] = [];

    this.comments.forEach((comment) => {
      comments.push(...[comment, ...comment.replies]);
    });

    return comments.find((comment) => comment.id === id);
  }

  add_comment(comment: IComment) {
    // Change state
    this.comments.push(comment);

    // Change view
    this.root.appendChild(this.render(comment));
  }

  render(comment: IComment) {
    const template = document.importNode(this.template.content, true);

    // ID
    template
      .querySelector("[data-comment-id]")
      .setAttribute("data-comment-id", comment.id);

    // Avatar
    template
      .querySelector("[data-comment-avatar]")
      .setAttribute("src", comment.avatar);

    // Name
    template.querySelector("[data-comment-name]").textContent = comment.name;

    // Text
    template.querySelector("[data-comment-text]").textContent = comment.text;

    this.update_like(template, comment);

    // Replies
    if (comment.replies.length) {
      const replies_list = template.querySelector(
        "[data-comment-replies]"
      ) as HTMLElement;

      replies_list.classList.add("active");

      this.mount(replies_list, comment.replies);
    }

    return template;
  }

  mount(root: HTMLElement, data: IComment[]) {
    const container = document.createDocumentFragment();

    data.forEach((comment) => {
      container.appendChild(this.render(comment));
    });

    root.innerHTML = "";
    root.appendChild(container);

    this.update_comments_count();
  }

  // UI
  update_like(root: HTMLElement | DocumentFragment, comment: IComment) {
    root
      .querySelector("[data-comment-like-button] svg path")
      .setAttribute("fill", comment.liked ? "#E92929" : "#A9A9A9");

    root.querySelector("[data-comment-like-count]").textContent = comment.liked
      ? (comment.likes + 1).toString()
      : comment.likes.toString();
  }

  // UI
  update_comments_count() {
    this.count.textContent = this._get_comments_count().toString();
  }

  _get_comments_count(): number {
    return this.comments.reduce((accumulator, comment) => {
      return accumulator + comment.replies.length + 1;
    }, 0);
  }

  _escapeHTML(text: string) {
    return text.replace(/[&<>"']/g, function (m: string) {
      const htmlSymbol: { [key: string]: string } = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };

      return htmlSymbol[m];
    });
  }

  async get_comments(): Promise<Array<IComment>> {
    // Simulation of data getting delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: "1",
        name: "Emily Fray",
        text: "Really cool! ✌ I love it!🌏",
        avatar: "/avatars/emily.png",
        created_at_timestamp: 1712048942139,
        likes: 34,
        replies: [
          {
            id: "123623632",
            name: "Anonymous",
            text: "That sounds great !!!",
            avatar: "/avatars/anonymous.png",
            created_at_timestamp: Date.now(),
            likes: 10,
            replies: [],
            sub: true,
          },
        ],
      },
      {
        id: "2",
        name: "Esther Howard",
        text: "I would also love to visit there! The best place for me. Will definitely go back there again with my family ☘💕",
        avatar: "/avatars/esther.png",
        created_at_timestamp: 1711962542139,
        likes: 13,
        liked: true,
        replies: [],
      },
    ];
  }
}
