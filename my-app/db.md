# Post

- collection: post
- Add new post
- id
- title
- slug
- image
- createdAt
- status: 1(approved: đã duyệt) - 2(pending: chờ duyệt) - 3(reject: từ chối)
- content: (html -> convert sang JSON String -> đưa vào database -> muốn đưa ra bên ngoài parse nó ra dưới dạng html)
- hot(true or false) -> bài viết nổi bật
- ueserId(để biết ai là người viết)
- categoryId(danh mục)

# Category

- id
- title
- slug
- status: 1(approved) 2(unapproved)
- createdAt

# User

- id
- displayName(fullname)
- email
- password
- username
- avatar
- status: 1(active) 2(pendding) 3(ban)
- role: 1(Admin) 2(Mod) 3(User)
- permissions: (Mảng có các quyền cụ thể)
- createdAt
