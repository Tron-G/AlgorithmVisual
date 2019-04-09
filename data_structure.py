# -*- coding: utf-8 -*-
import random


class DataStructure:
    """数据结构基类"""

    # 随机生成数据
    def random_create(self, max_len=10, max_num=100):
        rand_len = random.randrange(4, max_len)
        rand_data = []
        for i in range(0, rand_len):
            rand_num = random.randrange(1, max_num)
            rand_data.append(rand_num)
        return rand_data

    # 用户输入数据
    def input_create(self, data):
        return data

    pass


class Array(DataStructure):
    """数组类"""
    __data = []

    # 数据初始化
    def __init__(self, input_list=None):
        if input_list is None:
            self.__data = self.random_create(15, 999)
        else:
            self.__data = self.input_create(input_list)
        # print(self.__data)

    # 返回数据
    def get_data(self):
        return self.__data

    # 查找值为num的下标，未找到返回-1
    def search(self, num):
        if num in self.__data:
            return self.__data.index(num)
        else:
            return -1

    # 修改下标为Index处的值
    def assign(self, index, value):
        self.__data[index] = value
    pass


class LinkedList(DataStructure):
    """链表类"""
    __data = []

    # 数据初始化
    def __init__(self, input_list=None):
        if input_list is None:
            self.__data = self.random_create()
        else:
            self.__data = self.input_create(input_list)
        print(self.__data)

    # 返回数据
    def get_data(self):
        return self.__data

    # 返回值为target的序号
    def search(self, target):
        search_data = {}
        for i in range(len(self.__data)):
            if self.__data[i] == target:
                search_data[i] = 1
            else:
                search_data[i] = 0

        return search_data

    # 在序号为index处插入num
    def insert_num(self, index, num):
        if index < 0 or index > len(self.__data):
            return -1
        temp_data = []
        for i in range(index):
            temp_data.append(self.__data[i])
        temp_data.append(num)
        for i in range(index, len(self.__data)):
            temp_data.append(self.__data[i])
        self.__data = temp_data

    # 删除序号为index的节点
    def delete_num(self, index):
        if index < 0 or index >= len(self.__data):
            return -1
        temp_data = []
        for i in range(len(self.__data)):
            if i == index:
                pass
            else:
                temp_data.append(self.__data[i])
        self.__data = temp_data
    pass


class Stack(DataStructure):
    """栈类"""
    __top = -1
    __data = []

    # 数据初始化
    def __init__(self, input_list=None):
        if input_list is None:
            self.__data = self.random_create()
        else:
            self.__data = self.input_create(input_list)
        self.__top = len(self.__data) - 1
        print(self.__data)

    # 返回数据
    def get_data(self):
        return self.__data

    # 返回栈顶元素
    def get_top(self):
        return self.__data[self.__top]

    # 出栈
    def pop_num(self):
        if self.__top > -1:
            self.__top = self.__top - 1
        self.__data.pop()

    # 入栈
    def push_num(self, num):
        self.__data.append(num)
        self.__top = self.__top + 1
    pass


class Queue(DataStructure):
    """队列类"""
    __data = []

    # __front = -1
    # __rear = -1

    # 数据初始化
    def __init__(self, input_list=None):
        if input_list is None:
            self.__data = self.random_create()
        else:
            self.__data = self.input_create(input_list)
        # self.__front = -1
        # self.__rear = len(self.__data) - 1
        print(self.__data)

    # # 队列元素更新
    # def __renew_data(self):
    #     temp_data = []
    #     print(self.__front, self.__rear)
    #     for i in range(self.__front + 1, self.__rear + 1):
    #         temp_data.append(self.__data[i])
    #     self.__data = temp_data

    # 返回数据
    def get_data(self):
        return self.__data

    # 入队
    def en_queue(self, num):
        self.__data.append(num)
        # self.__rear = self.__rear + 1

    # 出队
    def de_queue(self):
        # if self.__front < self.__rear:
        #     self.__front = self.__front + 1
        self.__data.pop(0)
    pass


class BinaryTree(DataStructure):
    """二叉树类"""
    __data = []

    # 数据初始化
    def __init__(self, input_list=None):
        if input_list is None:
            self.__data = self.random_create()
        else:
            self.__data = self.input_create(input_list)
        print(self.__data)

    # 随机规则覆写
    def random_create(self, max_len=16, max_num=100):
        rand_len = random.randrange(4, max_len)
        rand_data = []
        for i in range(0, rand_len):
            if i == 0:
                rand_num = random.randrange(1, 100)
                rand_data.append(rand_num)
            else:
                temp_num = random.randint(1, 10)
                if temp_num > 3 and rand_data[int((i + 1) / 2) - 1] != -1:
                    rand_num = random.randrange(1, 100)
                    rand_data.append(rand_num)
                else:
                    rand_data.append(-1)
        return rand_data

    # 返回数据
    def get_data(self):
        return self.__data

    # 先序遍历
    # result格式：[{序号：值}...],按照访问次序排列
    def preorder(self):
        result = []
        temp = []
        top = -1
        length = len(self.__data)
        if length > 0:
            top = top + 1
            temp.append(dict({0: self.__data[0]}))
            while top > -1:
                i = temp[top]
                top = top - 1
                temp.pop()
                result.append(i)
                left = (list(i.keys())[0] + 1) * 2 - 1
                right = (list(i.keys())[0] + 1) * 2
                if right < length:
                    if self.__data[right] != -1:
                        top = top + 1
                        temp.append(dict({right: self.__data[right]}))
                if left < length:
                    if self.__data[left] != -1:
                        top = top + 1
                        temp.append(dict({left: self.__data[left]}))
        return result

    # 中序遍历
    def inorder(self):
        result = []
        temp = []
        top = -1
        length = len(self.__data)
        if length > 0:
            i = 0
            while top > -1 or i < length:
                while i < length:
                    top = top + 1
                    temp.append(dict({i: self.__data[i]}))
                    i = (i + 1) * 2 - 1
                if top > -1:
                    i = list(temp[top].keys())[0]
                    if self.__data[i] != -1:
                        result.append(temp[top])
                    top = top - 1
                    temp.pop()
                    i = (i + 1) * 2
        return result

    # 后序遍历
    def postorder(self):
        result = []
        temp = []
        top = -1
        i = 0
        left_visit = False
        length = len(self.__data)
        if length > 0:
            while True:
                while i < length:
                    top = top + 1
                    temp.append(dict({i: self.__data[i]}))
                    i = (i + 1) * 2 - 1
                p = -1
                left_visit = True
                while top != -1 and left_visit:
                    i = list(temp[top].keys())[0]
                    if (i + 1) * 2 == p or (i + 1) * 2 >= length:
                        if self.__data[i] != -1:
                            result.append(temp[top])
                        top = top - 1
                        temp.pop()
                        p = i
                    else:
                        i = (i + 1) * 2
                        left_visit = False
                if top == -1:
                    break
        return result


# bt = BinaryTree(['a', 'b', 'c', 'd', -1, 'e', 'f', -1, 'g'])
# bt = BinaryTree([1,2,3,4,5,-1,-1,-1,6])
# bt = BinaryTree([1,2,3,-1,4,5])
# bt = BinaryTree([1, 2, 3, 4, 5, -1, -1, -1, 6])
# bt = BinaryTree()
# re = bt.postorder()
# re = bt.inorder()
# print(re)
#