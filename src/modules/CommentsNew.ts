import type { IComment } from "../types";

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
        this.update_like(item, this.get_comment_by_id(id));
      }

      // Reply action
      else if (target.closest("[data-comment-reply-button]")) {
        const sender_form = Array.from(
          item.querySelectorAll("[data-comment-sender]")
        ).slice(-1)[0];

        sender_form.classList.add("active");

        const replies_list = item.querySelector(
          "[data-comment-replies]"
        ) as HTMLElement;
        const cancel = sender_form.querySelector(
          "[data-comment-cancel-reply-button]"
        );
        const submit = sender_form.querySelector(
          "[data-comment-create-reply-button]"
        );
        const form = sender_form.querySelector("[data-comment-reply-form]");
        const field = sender_form.querySelector(
          "[data-comment-reply-field]"
        ) as HTMLInputElement;

        cancel.addEventListener("click", (event: MouseEvent) => {
          sender_form.classList.remove("active");
        });

        field.addEventListener("input", (event: InputEvent) => {
          if (field.value) {
            submit.classList.add("active");
          } else {
            submit.classList.remove("active");
          }
        });

        form.addEventListener("submit", (event: SubmitEvent) => {
          event.preventDefault();

          if (!field.value) return;

          const data: IComment = {
            id: Date.now().toString(),
            name: "Anonymous",
            text: field.value,
            avatar: "/avatars/anonymous.png",
            created_at_timestamp: Date.now(),
            likes: 0,
            parent: id,
            replies: [],
          };

          this.add_comment(replies_list, data);

          field.value = "";
          submit.classList.remove("active");
          sender_form.classList.remove("active");
          replies_list.classList.add("active");

          this.update_comments_count();
        });
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
        text: this.field.value,
        avatar: "/avatars/anonymous.png",
        created_at_timestamp: Date.now(),
        likes: 0,
        replies: [],
      };

      this.add_comment(this.root, data);

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

  add_comment(root: HTMLElement, comment: IComment) {
    // Change state
    if (comment.parent) {
      this.comments = this.comments.map((item) => {
        if (comment.parent === item.id) {
          return {
            ...item,
            replies: [...item.replies, comment],
          };
        }

        return item;
      });
    } else {
      this.comments.push(comment);
    }

    // Change view
    root.appendChild(this.render(comment));
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

    // Reply
    if (!comment.parent) {
      template
        .querySelector("[data-comment-reply-button]")
        .classList.add("active");
    }

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

  async get_comments(): Promise<any> {
    // Simulation of data getting delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const res = await import("../data/comments.json");

      if (res.default.status !== "ok") throw new Error(res.default.message);

      return res.default.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
