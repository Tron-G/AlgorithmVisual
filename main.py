from flask import Flask, render_template, request, redirect, url_for, jsonify
import data_structure
app = Flask(__name__, static_folder='static')


# ====================页面跳转=========================
@app.route('/')
def home_page():
    return render_template('HomePage.html')


@app.route('/array_page')
def array_page():
    return render_template('ArrayPage.html')


@app.route('/test')
def test_page():
    return render_template('test.html')
# ====================页面跳转=========================


# =======================前后端数据交互==============================
@app.route('/array_method', methods=['POST', 'GET'])
def array_method():
    data = request.get_json()
    if data["input_tpye"] == 1:  # 生成随机数组
        m_array = data_structure.Array()
        data["array_data"] = m_array.get_data()

        print("ok", data)
    else:
        data["array_data"] = list(map(int, data["array_data"]))

        print(data)
    return jsonify(data)

# =======================前后端数据交互==============================


if __name__ == '__main__':
    app.run()
