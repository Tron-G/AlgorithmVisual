# -*- coding: utf-8 -*-
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


# ====================页面跳转=========================


# =======================前后端数据交互==============================
@app.route('/array_method', methods=['POST', 'GET'])
def array_method():
    data = request.get_json()

    if data["input_tpye"] == 1 and data["operate_type"] == 0:  # 生成随机数组
        m_array = data_structure.Array()
        data["array_data"] = m_array.get_data()

    elif data["input_tpye"] == 0 and data["operate_type"] == 0:
        data["array_data"] = list(map(int, data["array_data"]))  # 字符格式转数字

    if data["operate_type"] == 1:
        m_array = data_structure.Array(data["array_data"])
        data["search_num"] = int(data["search_num"])
        data["search_pos"] = m_array.search(data["search_num"])

    elif data["operate_type"] == 2:
        m_array = data_structure.Array(data["array_data"])
        data["change_pos"] = int(data["change_pos"])
        data["change_num"] = int(data["change_num"])
        m_array.assign(data["change_pos"], data["change_num"])
        data["array_data"] = m_array.get_data()

    return jsonify(data)


@app.route('/link_method', methods=['POST', 'GET'])
def link_method():
    data = request.get_json()

    if data["input_tpye"] == 1 and data["operate_type"] == 0:  # 生成随机链表
        m_link = data_structure.LinkedList()
        data["array_data"] = m_link.get_data()
        print("rd", data)
    elif data["input_tpye"] == 0 and data["operate_type"] == 0:
        data["array_data"] = list(map(int, data["array_data"]))  # 字符格式转数字
        print("ip", data)

    if data["operate_type"] == 1:                            # 查找
        m_link = data_structure.LinkedList(data["array_data"])
        data["search_num"] = int(data["search_num"])
        data["search_pos"] = m_link.search(data["search_num"])
        print("ss", data)

    elif data["operate_type"] == 2:                           # 插入
        m_link = data_structure.LinkedList(data["array_data"])
        data["insert_pos"] = int(data["insert_pos"])
        data["insert_num"] = int(data["insert_num"])
        m_link.insert_num(data["insert_pos"], data["insert_num"])
        data["array_data"] = m_link.get_data()

    elif data["operate_type"] == 3:                           # 移除
        m_link = data_structure.LinkedList(data["array_data"])
        data["delete_pos"] = int(data["delete_pos"])
        m_link.delete_num(data["delete_pos"])
        data["array_data"] = m_link.get_data()

    return jsonify(data)
# =======================前后端数据交互==============================


if __name__ == '__main__':
    app.run()
