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


@app.route('/link_page')
def link_page():
    return render_template('LinkPage.html')


@app.route('/test')
def test_page():
    return render_template('test.html')
# ====================页面跳转=========================


# =======================前后端数据交互==============================
@app.route('/array_method', methods=['POST', 'GET'])
def array_method():
    data = request.get_json()

    if data["input_tpye"] == 1 and data["operate_type"] == 0:  # 生成随机数组
        m_array = data_structure.Array()
        data["array_data"] = m_array.get_data()
        print("rd", data)
    elif data["input_tpye"] == 0 and data["operate_type"] == 0:
        data["array_data"] = list(map(int, data["array_data"]))  # 字符格式转数字
        print("ip", data)

    if data["operate_type"] == 1:
        m_array = data_structure.Array(data["array_data"])
        data["search_num"] = int(data["search_num"])
        data["search_pos"] = m_array.search(data["search_num"])
        print("ss", data)

    elif data["operate_type"] == 2:
        m_array = data_structure.Array(data["array_data"])
        data["change_pos"] = int(data["change_pos"])
        data["change_num"] = int(data["change_num"])
        m_array.assign(data["change_pos"], data["change_num"])
        data["array_data"] = m_array.get_data()

    return jsonify(data)

# =======================前后端数据交互==============================


if __name__ == '__main__':
    app.run()
