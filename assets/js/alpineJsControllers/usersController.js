document.addEventListener("alpine:init", () => {
  Alpine.data("usersData", () => ({
    mainUsers: [],
    users: [],
    pageUsers: [],
    isLoading: false,
    showAddUserModal: false,
    pageCount: 1,
    itemsCount: 4,
    currentPage: 1,
    newUserInfo: {
      name: "",
      username: "",
      email: "",
    },
    getUsers() {
      this.isLoading = true;
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => {
          this.users = res.data;
          this.mainUsers = res.data;
          this.pagination();
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    pagination() {
      this.pageCount = Math.ceil(this.users.length / this.itemsCount);

      let start = this.currentPage * this.itemsCount - this.itemsCount;
      let end = this.currentPage * this.itemsCount;

      this.pageUsers = this.users.slice(start, end);
    },

    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
        this.pagination();
      }
    },

    prevoiusPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.pagination();
      }
    },

    handleChangeItemsCount(value) {
      this.currentPage = 1;
      if (value < 1) {
        this.itemsCount = 1;
      }
      if (value > this.users.length) {
        this.itemsCount = this.users.length;
      }
    },

    handleSearch(e) {
      setTimeout(() => {
        this.users = this.mainUsers.filter((user) => {
          return user.name.includes(e.value) || user.username.includes(e.value);
        });

        this.currentPage = 1;
        this.pagination();
      }, 200);
    },

    handleSubmitNewUser() {
      this.isLoading = true;
      axios
        .post("https://jsonplaceholder.typicode.com/users", this.newUserInfo)
        .then((res) => {
          if (res.status == 201) {
            this.mainUsers.push(res.data);
            this.showAddUserModal = false;
            this.pagination();
            this.handleResetForm();
            M.toast({
              html: "User added successfully",
              classes: "rounded green",
            });
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    handleResetForm() {
      this.newUserInfo = {
        name: "",
        username: "",
        email: "",
      };
    },

    handleDeleteUser(userId) {
      var toastHTML =
        "<span>Are u sure to delete? (" +
        userId +
        ') </span><button class="btn-flat toast-action" x-on:click="handleConfirmDelete(' +
        userId +
        ')">Yes</button>';
      M.toast({ html: toastHTML });
    },

    handleConfirmDelete(userId) {
      this.isLoading = true;
      axios
        .delete("https://jsonplaceholder.typicode.com/users/" + userId)
        .then((res) => {
          if (res.status == 200) {
            this.mainUsers = this.mainUsers.filter((user) => user.id != userId);
            this.users = this.users.filter((user) => user.id != userId);

            this.pagination();
            M.toast({
              html: "User deleted successfully",
              classes: "green",
            });
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  }));
});
