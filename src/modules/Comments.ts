interface IComment {
  id: string;
  name: string;
  text: string;
  avatar: string;
  created_at_timestamp: number;
  likes: number;
  self?: boolean;
  replies: IComment[];
}

export default class Comments {
  comments: Array<IComment>;
  root = document.querySelector("[data-comments-list]");

  constructor() {
    this.init();
  }

  async init() {
    this.comments = await this.getComments();

    this.mount();
  }

  template(data: IComment): string {
    return /*html*/ `
      <li class="comments__item comment-item">
        <div class="comment-item__avatar">
          <img
            src="${data.avatar}"
            alt="comment avatar"
          />
        </div>
        <div class="comment-item__body">
          <div class="comment-item__info">
            <div class="comment-item__title title title--x-small">
              <h5 class="title__main"> ${data.name}</h5>
              <p class="title__sub">
                ${data.text}
              </p>
            </div>
            <div class="comment-item__actions">
              <button
                class="comment-item__like"
                aria-label="like comment"
              >
                <svg
                  width="18"
                  height="15"
                  viewBox="0 0 18 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.7454 -0.00848389C11.1331 -0.00848389 9.75538 1.14075 8.99845 1.93305C8.24153 1.14075 6.86691 -0.00848389 5.25538 -0.00848389C2.47768 -0.00848389 0.538452 1.92767 0.538452 4.69921C0.538452 7.75305 2.94691 9.7269 5.27691 11.6361C6.37691 12.5384 7.51538 13.4707 8.38845 14.5046C8.53538 14.6777 8.75076 14.7777 8.97691 14.7777H9.02153C9.24845 14.7777 9.46307 14.6769 9.60922 14.5046C10.4838 13.4707 11.6215 12.5377 12.7223 11.6361C15.0515 9.72767 17.4615 7.75382 17.4615 4.69921C17.4615 1.92767 15.5223 -0.00848389 12.7454 -0.00848389Z"
                    fill="#A9A9A9"
                  />
                </svg>
                <span>${data.likes}</span>
              </button>
              ${
                !data.self
                  ? /*html*/ `
                    <button
                      class="comment-item__share"
                      aria-label="reply post"
                    >
                      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.17381 1.07938C8.58559 1.26199 8.85415 1.67378 8.85415 2.12495V4.41662H12.8646C16.345 4.41662 19.1666 7.23823 19.1666 10.7187C19.1666 14.7757 16.2484 16.5875 15.5788 16.9527C15.4892 17.0029 15.389 17.0208 15.2887 17.0208C14.8984 17.0208 14.5833 16.7021 14.5833 16.3154C14.5833 16.0468 14.7373 15.7998 14.9342 15.6171C15.2708 15.302 15.7291 14.6718 15.7291 13.5869C15.7291 11.6891 14.1894 10.1494 12.2916 10.1494H8.85415V12.441C8.85415 12.8922 8.58917 13.304 8.17381 13.4866C7.75844 13.6692 7.27863 13.594 6.94204 13.2932L1.21287 8.13699C0.972961 7.91499 0.833313 7.60704 0.833313 7.2812C0.833313 6.95535 0.972961 6.64741 1.21287 6.42898L6.94204 1.27273C7.27863 0.968373 7.76202 0.893177 8.17381 1.07938Z" fill="#A9A9A9"/>
                      </svg>
                    </button>
                  `
                  : ""
              }
            </div>
          </div>
          ${
            data.replies.length
              ? `
                <ul class="comment-item__replies">
                  ${data.replies
                    .map((comment) => this.template(comment))
                    .join("")}
                </ul>
              `
              : ""
          }
        </div>
        <div class="comment-item__number">${this._convertTimestampToDays(
          data.created_at_timestamp
        )}</div>
      </li>
    `;
  }

  render() {
    return this.comments.map((comment) => this.template(comment)).join("");
  }

  mount() {
    this.root.innerHTML = "";

    this.root.insertAdjacentHTML("beforeend", this.render());
  }

  _convertTimestampToDays(timestamp: number) {
    const now = new Date();
    const commentDate = new Date(timestamp);

    const differenceInTime = now.getTime() - commentDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    return `${differenceInDays}d`;
  }

  async getComments(): Promise<Array<IComment>> {
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
            id: "1",
            self: true,
            name: "Anonymous",
            text: "Very Good!!!",
            avatar: "/avatars/anonymous.png",
            created_at_timestamp: Date.now(),
            likes: 10,
            replies: [],
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
        replies: [],
      },
    ];
  }
}
