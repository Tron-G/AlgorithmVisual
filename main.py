# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, redirect, url_for, jsonify
import data_structure
import algorithm
import sort

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


@app.route('/stack_page')
def stack_page():
    return render_template('StackPage.html')


@app.route('/queue_page')
def queue_page():
    return render_template('QueuePage.html')


@app.route('/bisearch_page')
def bisearch_page():
    return render_template('BisearchPage.html')


@app.route('/hash_page')
def hash_page():
    return render_template('HashPage.html')


@app.route('/insert_sort_page')
def insert_sort_page():
    return render_template('InsertSortPage.html')


@app.route('/bubble_sort_page')
def bubble_sort_page():
    return render_template('BubbleSortPage.html')


@app.route('/selection_sort_page')
def selection_sort_page():
    return render_template('SelectionSortPage.html')
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

    if data["operate_type"] == 1:  # 查找
        m_link = data_structure.LinkedList(data["array_data"])
        data["search_num"] = int(data["search_num"])
        data["search_pos"] = m_link.search(data["search_num"])
        print("ss", data)

    elif data["operate_type"] == 2:  # 插入
        m_link = data_structure.LinkedList(data["array_data"])
        data["insert_pos"] = int(data["insert_pos"])
        data["insert_num"] = int(data["insert_num"])
        m_link.insert_num(data["insert_pos"], data["insert_num"])
        data["array_data"] = m_link.get_data()

    elif data["operate_type"] == 3:  # 移除
        m_link = data_structure.LinkedList(data["array_data"])
        data["delete_pos"] = int(data["delete_pos"])
        m_link.delete_num(data["delete_pos"])
        data["array_data"] = m_link.get_data()

    return jsonify(data)


@app.route('/stack_method', methods=['POST', 'GET'])
def stack_method():
    data = request.get_json()

    if data["input_tpye"] == 1 and data["operate_type"] == 0:  # 生成随机数组
        m_stack = data_structure.Stack()
        data["array_data"] = m_stack.get_data()

    elif data["input_tpye"] == 0 and data["operate_type"] == 0:
        data["array_data"] = list(map(int, data["array_data"]))  # 字符格式转数字
        m_stack = data_structure.Stack(data["array_data"])
        m_stack.reverse_data()
        data["array_data"] = m_stack.get_data()

    if data["operate_type"] == 1:  # 入栈
        m_stack = data_structure.Stack(data["array_data"])
        data["push_num"] = int(data["push_num"])
        m_stack.push_num(data["push_num"])
        data["array_data"] = m_stack.get_data()
    if data["operate_type"] == 2:  # 出栈
        m_stack = data_structure.Stack(data["array_data"])
        m_stack.pop_num()
        data["array_data"] = m_stack.get_data()

    return jsonify(data)


@app.route('/queue_method', methods=['POST', 'GET'])
def queue_method():
    data = request.get_json()

    if data["input_tpye"] == 1 and data["operate_type"] == 0:  # 生成随机数组
        m_queue = data_structure.Queue()
        data["array_data"] = m_queue.get_data()

    elif data["input_tpye"] == 0 and data["operate_type"] == 0:
        data["array_data"] = list(map(int, data["array_data"]))  # 字符格式转数字

    if data["operate_type"] == 1:  # 入队
        m_queue = data_structure.Queue(data["array_data"])
        data["enqueue_num"] = int(data["enqueue_num"])
        m_queue.en_queue(data["enqueue_num"])
        data["array_data"] = m_queue.get_data()
    if data["operate_type"] == 2:  # 出队
        m_queue = data_structure.Queue(data["array_data"])
        m_queue.de_queue()
        data["array_data"] = m_queue.get_data()

    return jsonify(data)


@app.route('/bisearch_method', methods=['POST', 'GET'])
def bisearch_method():
    data = request.get_json()

    if data["input_tpye"] == 1 and data["operate_type"] == 0:  # 生成随机数组
        bisearch = algorithm.Search()
        data["array_data"] = bisearch.get_sort_data()

    elif data["input_tpye"] == 0 and data["operate_type"] == 0:
        data["array_data"] = list(map(int, data["array_data"]))  # 字符格式转数字
        bisearch = algorithm.Search(data["array_data"])
        data["array_data"] = bisearch.get_sort_data()

    if data["operate_type"] == 1:  # 查找
        bisearch = algorithm.Search(data["array_data"])
        data["search_num"] = int(data["search_num"])
        data["search_process"] = bisearch.binsearch(data["search_num"])

    return jsonify(data)


@app.route('/hash_method', methods=['POST', 'GET'])
def hash_method():
    data = request.get_json()

    if data["input_tpye"] == 1 and data["operate_type"] == 0:  # 生成随机数组
        hash = algorithm.Search()
        data["create_process"] = hash.hash_table()
        data["array_data"] = hash.get_data()

    elif data["input_tpye"] == 0 and data["operate_type"] == 0:
        data["array_data"] = list(map(int, data["array_data"]))  # 字符格式转数字
        hash = algorithm.Search(data["array_data"])
        data["create_process"] = hash.hash_table()
        data["array_data"] = hash.get_data()

    if data["operate_type"] == 1:  # 查找
        hash = algorithm.Search(data["create_process"][len(data["create_process"]) - 1])
        data["search_num"] = int(data["search_num"])
        data["search_process"] = hash.hash_search(data["search_num"])

    return jsonify(data)


@app.route('/insert_sort_method', methods=['POST', 'GET'])
def insert_sort_method():
    data = request.get_json()

    if data["input_tpye"] == 1 and data["operate_type"] == 0:  # 生成随机数组
        insert_sort = sort.Sort()
        data["array_data"] = insert_sort.get_data()

    elif data["input_tpye"] == 0 and data["operate_type"] == 0:
        data["array_data"] = list(map(int, data["array_data"]))  # 字符格式转数字

    if data["operate_type"] == 1:  # 排序
        insert_sort = sort.Sort(data["array_data"])
        data["sort_process"] = insert_sort.direct_insert_sort()

    return jsonify(data)


@app.route('/bubble_sort_method', methods=['POST', 'GET'])
def bubble_sort_method():
    data = request.get_json()

    if data["input_tpye"] == 1 and data["operate_type"] == 0:  # 生成随机数组
        bubble_sort = sort.Sort()
        data["array_data"] = bubble_sort.get_data()

    elif data["input_tpye"] == 0 and data["operate_type"] == 0:
        data["array_data"] = list(map(int, data["array_data"]))  # 字符格式转数字

    if data["operate_type"] == 1:  # 排序
        bubble_sort = sort.Sort(data["array_data"])
        data["sort_process"] = bubble_sort.bubble_sort()

    return jsonify(data)


@app.route('/selection_sort_method', methods=['POST', 'GET'])
def selection_sort_method():
    data = request.get_json()

    if data["input_tpye"] == 1 and data["operate_type"] == 0:  # 生成随机数组
        selection_sort = sort.Sort()
        data["array_data"] = selection_sort.get_data()

    elif data["input_tpye"] == 0 and data["operate_type"] == 0:
        data["array_data"] = list(map(int, data["array_data"]))  # 字符格式转数字

    if data["operate_type"] == 1:  # 排序
        selection_sort = sort.Sort(data["array_data"])
        data["sort_process"] = selection_sort.selection_sort()

    return jsonify(data)
# =======================前后端数据交互==============================


if __name__ == '__main__':
    app.run()
