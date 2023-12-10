from flask import Flask, jsonify, request, make_response
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS  # 导入 CORS


app = Flask(__name__)
CORS(app)  # 启用 CORS，允许所有来源
client = MongoClient("mongodb://127.0.0.1:27017")
db = client.atr
books = db.books


# 展示所有数据
@app.route("/api/books", methods=["GET"])
def show_all_books():
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('pageSize', 10))

    # 获取数据库中的书籍总数
    total_books = books.count_documents({})

    # 计算起始索引和结束索引
    start_index = (page - 1) * page_size
    end_index = start_index + page_size

    # 获取数据库中的书籍数据
    all_books = list(books.find())

    # 根据分页参数截取数据
    books_to_return = all_books[start_index:end_index]

    # 处理数据，转换 ObjectId 为字符串等
    data_to_return = []
    for book in books_to_return:
        book['_id'] = str(book['_id'])
        for review in book['reviews']:
            review['_id'] = str(review['_id'])
        data_to_return.append(book)

    # 将总书籍数量添加到返回的 JSON 数据中
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
    # 使用正则表达式忽略大小写，查找匹配的书籍
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


if __name__ == "__main__":
    app.run(debug=True, threaded=False)

