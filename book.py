from tokenize import generate_tokens
from flask import Flask, jsonify, request, make_response
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
client = MongoClient("mongodb://127.0.0.1:27017")
db = client.atr
books = db.books
users = db.users


# 展示所有数据
@app.route("/api/books", methods=["GET"])
def show_all_books():
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('pageSize', 10))
    total_books = books.count_documents({})
    start_index = (page - 1) * page_size
    end_index = start_index + page_size

    all_books = list(books.find())
    books_to_return = all_books[start_index:end_index]

    data_to_return = []
    for book in books_to_return:
        book['_id'] = str(book['_id'])
        for review in book['reviews']:
            review['_id'] = str(review['_id'])
        data_to_return.append(book)

    response_data = {
        'totalBooks': total_books,
        'books': data_to_return
    }

    return make_response(jsonify(response_data), 200)


# 展示 id数据
@app.route("/api/books/<book_id>", methods=["GET"])
def show_one_book(book_id):
    book = books.find_one({"_id": ObjectId(book_id)})
    if book:
        book['_id'] = str(book['_id'])
        for review in book.get('reviews', []):
            review['_id'] = str(review['_id'])
        return make_response(jsonify(book), 200)
    else:
        return make_response(jsonify({"error": "Book not found"}), 404)


# 展示包含 title 的所有数据
@app.route("/api/books/title/<book_title>", methods=["GET"])
def show_books_by_title(book_title):
    matching_books = books.find({"title": {"$regex": book_title, "$options": "i"}})

    books_list = []
    for book in matching_books:
        book['_id'] = str(book['_id'])
        for review in book.get('reviews', []):
            review['_id'] = str(review['_id'])
        books_list.append(book)

    if books_list:
        return make_response(jsonify(books_list), 200)
    else:
        return make_response(jsonify({"error": "No matching books found"}), 404)


# 插入 id数据
@app.route("/api/books", methods=["POST"])
def add_book():
    if request.is_json:
        data = request.get_json()
        if all(key in data for key in ["author", "country", "imageLink",
                                       "language", "link", "pages", "title", "year"]):
            new_book = {
                "author": data["author"],
                "country": data["country"],
                "imageLink": data["imageLink"],
                "language": data["language"],
                "link": data["link"],
                "pages": int(data["pages"]),
                "title": data["title"],
                "year": int(data["year"]),
                "reviews": []
            }
            new_book_id = books.insert_one(new_book)
            new_book_link = f"http://localhost:5000/api/books/{new_book_id.inserted_id}"

            return make_response(jsonify({"url": new_book_link}), 201)
        else:
            return make_response(jsonify({"error": "Missing JSON data"}), 400)
    else:
        return make_response(jsonify({"error": "Invalid content type. Use application/json"}), 400)


# 修改 id数据
@app.route("/api/books/<string:id_>", methods=["PUT"])
def edit_book(id_):
    if request.is_json:
        data = request.get_json()
        if all(key in data for key in ["author", "country", "imageLink",
                                       "language", "link", "pages", "title", "year"]):
            try:
                edited_book = {
                    "author": data["author"],
                    "country": data["country"],
                    "imageLink": data["imageLink"],
                    "language": data["language"],
                    "link": data["link"],
                    "pages": int(data["pages"]),
                    "title": data["title"],
                    "year": int(data["year"]),
                    "reviews": []
                }
            except ValueError:
                return make_response(jsonify({"error": "Invalid data types for 'pages' or 'year'"}), 400)

            result = books.update_one(
                {"_id": ObjectId(id_)},
                {
                    "$set": edited_book
                }
            )
            if result.matched_count == 1:
                edited_book_link = f"http://localhost:5000/api/books/{id_}"
                return make_response(jsonify({"url": edited_book_link}), 200)
            else:
                return make_response(jsonify({"error": "Invalid book ID"}), 404)
        else:
            return make_response(jsonify({"error": "Missing JSON data"}), 400)
    else:
        return make_response(jsonify({"error": "Invalid content type. Use application/json"}), 400)


# 删除 id数据
@app.route("/api/books/<string:id_>", methods=["DELETE"])
def delete_book(id_):
    result = books.delete_one({"_id": ObjectId(id_)})
    if result.deleted_count == 1:
        return make_response(jsonify({}), 204)
    else:
        return make_response(jsonify({"error": "Invalid book ID"}), 404)


# 插入 id数据的 id子数据
@app.route("/api/books/<string:id_>/reviews", methods=["POST"])
def add_review(id_):
    if request.is_json:
       data = request.get_json()
       if all(key in data for key in ["username","comment", "stars"]):
        try:
            new_review = {
                "_id": ObjectId(),
                "username": data["username"],
                "comment": data["comment"],
                "stars": int(data["stars"])
            }
            result = books.update_one(
                {"_id": ObjectId(id_)},
                {"$push": {"reviews": new_review}}
            )
            if result.matched_count == 1:
                new_review_link = f"http://localhost:5000/api/books/{id_}/reviews/{str(new_review['_id'])}"
                return make_response(jsonify({"url": new_review_link}), 201)
            else:
                return make_response(jsonify({"error": "Invalid book ID"}), 404)
        except KeyError as e:
            return make_response(jsonify({"error": f"Missing key: {e}"}), 400)
        except ValueError:
            return make_response(jsonify({"error": "Invalid data type for 'stars'"}), 400)
    else:
        return make_response(jsonify({"error": "Invalid content type. Use application/json"}), 400)


# 获取 id数据所有子数据
@app.route("/api/books/<string:id_>/reviews", methods=["GET"])
def fetch_all_reviews(id_):
    data_to_return = []
    book = books.find_one(
        {"_id": ObjectId(id_)},
        {"reviews": 1, "_id": 0}
    )
    if book is not None and "reviews" in book:
        for review in book["reviews"]:
            review["_id"] = str(review["_id"])
            data_to_return.append(review)
    return make_response(jsonify(data_to_return), 200)





# 获取 id数据的 id子数据
@app.route("/api/books/<string:book_id>/reviews/<string:review_id>", methods=["GET"])
def fetch_one_review(book_id, review_id):
    try:
        book = books.find_one(
            {"_id": ObjectId(book_id)},
            {"_id": 0, "reviews": {"$elemMatch": {"_id": ObjectId(review_id)}}}
        )
        if book and "reviews" in book and book["reviews"]:
            review = book["reviews"][0]
            review["_id"] = str(review["_id"])
            return make_response(jsonify(review), 200)
        else:
            return make_response(jsonify({"error": "Invalid book ID or no matching review found"}), 404)
    except Exception as e:
        return make_response(jsonify({"error": f"Error: {str(e)}"}), 500)


# 修改 id数据的 id子数据
@app.route("/api/books/<string:book_id>/reviews/<string:review_id>", methods=["PUT"])
def edit_review(book_id, review_id):
    if request.is_json:
        try:
            data = request.get_json()
            edited_review = {
                "reviews.$.username": data["username"],
                "reviews.$.comment": data["comment"],
                "reviews.$.stars": int(data["stars"])
            }
            result = books.update_one(
                {"reviews._id": ObjectId(review_id)},
                {"$set": edited_review}
            )

            if result.matched_count == 1:
                edit_review_url = f"http://localhost:5000/api/books/{book_id}/reviews/{review_id}"
                return make_response(jsonify({"url": edit_review_url}), 200)
            else:
                return make_response(jsonify({"error": "Invalid review ID"}), 404)
        except KeyError as e:
            return make_response(jsonify({"error": f"Missing key: {e}"}), 400)
        except ValueError:
            return make_response(jsonify({"error": "Invalid data type for 'stars'"}), 400)
    else:
        return make_response(jsonify({"error": "Invalid content type. Use application/json"}), 400)


# 删除 id数据的 id子数据
@app.route("/api/books/<string:book_id>/reviews/<string:review_id>", methods=["DELETE"])
def delete_review(book_id, review_id):
    try:
        result = books.update_one(
            {"_id": ObjectId(book_id)},
            {"$pull": {"reviews": {"_id": ObjectId(review_id)}}}
        )

        if result.matched_count == 1:
            return make_response(jsonify({}), 204)
        else:
            return make_response(jsonify({"error": "Invalid book ID or review ID"}), 404)
    except Exception as e:
        return make_response(jsonify({"error": f"Error: {str(e)}"}), 500)


# 删除 id数据的所有子数据
@app.route("/api/books/<string:book_id>/reviews", methods=["DELETE"])
def delete_all_reviews(book_id):
    try:
        result = books.update_one(
            {"_id": ObjectId(book_id)},
            {"$set": {"reviews": []}}
        )

        if result.matched_count == 1:
            return make_response(jsonify({}), 204)
        else:
            return make_response(jsonify({"error": "Invalid book ID"}), 404)
    except Exception as e:
        return make_response(jsonify({"error": f"Error: {str(e)}"}), 500)


# 获取所有用户
@app.route("/api/user", methods=["GET"])
def get_all_users():
    all_users = list(users.find({}, {'password': 0}))  # 排除密码信息
    users_to_return = all_users  # 修改这一行
    data_to_return = []
    for user in users_to_return:
        user['_id'] = str(user['_id'])
        # 如果用户信息中有其他字段需要处理，可以在这里添加相应逻辑
        data_to_return.append(user)

    response_data = {
        'totalUsers': len(all_users),  # 修改为获取用户列表的长度
        'users': data_to_return
    }
    return make_response(jsonify(response_data), 200)


# 检查用户名重复
@app.route("/api/user/check", methods=["POST"])
def check_duplicate_username():
    data = request.get_json()
    username = data.get("username", "")

    if users.find_one({'username': username}):
        return jsonify({"duplicate": True}), 409
    else:
        return jsonify({"duplicate": False})


# 注册用户
@app.route("/api/user/register", methods=["POST"])
def register_user():
    if request.is_json:
        data = request.get_json()
        if all(key in data for key in ["username", "password"]):
            # 检查用户名是否已存在
            existing_user = users.find_one({'username': data['username']})
            if existing_user:
                return make_response(jsonify({'message': 'Username already exists'}), 400)
            # 存储用户信息
            user_data = {
                'username': data['username'],
                'password': data['password']
                # 可以根据需要添加其他用户信息
            }
            user_id = users.insert_one(user_data).inserted_id

            return make_response(jsonify({'message': 'User added successfully', 'user_id': str(user_id)}), 201)
        else:
            return make_response(jsonify({"error": "Missing JSON data"}), 400)
    else:
        return make_response(jsonify({"error": "Invalid content type. Use application/json"}), 400)


# 用户登录
@app.route("/api/user/login", methods=["POST"])
def login_user():
    data = request.get_json()
    user = users.find_one({'username': data['username'], 'password': data['password']})

    if user:
        # 在这里生成并返回一个身份验证令牌
        # 可以使用JWT库或者其他身份验证机制
        token = generate_tokens(user['_id'])  # 假设有一个生成令牌的函数
        return make_response(jsonify({'message': 'Login successful', 'token': token}), 200)
    else:
        return make_response(jsonify({'message': 'Invalid username or password'}), 401)


if __name__ == "__main__":
    app.run(debug=True, threaded=False)

