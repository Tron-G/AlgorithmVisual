# -*- coding: utf-8 -*-
import random


class DataStructure:
    """数据结构基类"""

    # 随机生成数据
    def random_create(self, max_len=10, max_num=100):
        rand_len = random.randrange(3, max_len)
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
            self.__data = self.random_create(10, 999)
        else:
            self.__data = self.input_create(input_list)
        # print(self.__data)

    # 返回数据
    def get_data(self):
        return self.__data

    # 查找过程数据，末位为成功标志
    def search(self, num):
        result = []
        for i in range(0, len(self.__data)):
            result.append(i)
            if self.__data[i] == num:
                break

        if num in self.__data:
            result.append(1)
        else:
            result.append(-1)

        return result

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
            self.__data = self.random_create(10, 999)
        else:
            self.__data = self.input_create(input_list)
        # print(self.__data)

    # 返回数据
    def get_data(self):
        return self.__data

    # 返回值为target的序号
    def search(self, target):
        if target in self.__data:
            return self.__data.index(target)
        else:
            return -1

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


class Stack(DataStructure):
    """栈类"""
    __top = -1
    __data = []

    # 数据初始化
    def __init__(self, input_list=None):
        if input_list is None:
            self.__data = self.random_create(10, 999)
        else:
            self.__data = self.input_create(input_list)
        self.__top = len(self.__data) - 1
        # print(self.__data)

    def reverse_data(self):
        temp = []
        for i in range((len(self.__data) - 1), -1, -1):
            temp.append(self.__data[i])
        self.__data = temp

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
        self.__data.pop(0)

    # 入栈
    def push_num(self, num):
        temp = [num]
        for i in range(0, len(self.__data)):
            temp.append(self.__data[i])
        self.__data = temp

    pass


class Queue(DataStructure):
    """队列类"""
    __data = []

    # __front = -1
    # __rear = -1

    # 数据初始化
    def __init__(self, input_list=None):
        if input_list is None:
            self.__data = self.random_create(10, 999)
        else:
            self.__data = self.input_create(input_list)
        # self.__front = -1
        # self.__rear = len(self.__data) - 1
        # print(self.__data)

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
    def random_create(self, max_len=16, max_num=999):
        rand_len = random.randrange(3, max_len)
        rand_data = []
        for i in range(0, rand_len):
            if i == 0:
                rand_num = random.randrange(1, max_num)
                rand_data.append(rand_num)
            else:
                temp_num = random.randint(1, 10)
                if temp_num > 2 and rand_data[int((i + 1) / 2) - 1] != -1:
                    rand_num = random.randrange(1, max_num)
                    rand_data.append(rand_num)
                else:
                    rand_data.append(-1)
        return rand_data

    # 返回数据
    def get_data(self):
        return self.__data

    # 计算二叉树深度
    def calc_depth(self):
        length = len(self.__data)
        dep = 0
        if self.__data[0] != -1:
            dep += 1
        if length > 1:
            if self.__data[1] != -1 or self.__data[2] != -1:
                dep += 1
        three_floor = False
        four_floor = False
        if length > 3:
            for i in range(3, length):
                if 3 <= i <= 6 and self.__data[i] != -1 and three_floor is False:
                    dep += 1
                    three_floor = True
                if 7 <= i <= 14 and self.__data[i] != -1 and four_floor is False:
                    dep += 1
                    four_floor = True

        return dep

    # 先序遍历,operate: -1 轨迹数据, 1 遍历序列
    # result格式：[[序号,值]...],按照访问次序排列
    def preorder(self, operate=-1):
        result = []
        temp = []
        top = -1
        length = len(self.__data)
        if length > 0:
            top = top + 1
            temp.append([0, self.__data[0]])
            while top > -1:
                i = temp[top]
                top = top - 1
                temp.pop()
                result.append(i)
                left = (i[0] + 1) * 2 - 1
                right = (i[0] + 1) * 2
                if right < length:
                    if self.__data[right] != -1:
                        top = top + 1
                        temp.append([right, self.__data[right]])
                if left < length:
                    if self.__data[left] != -1:
                        top = top + 1
                        temp.append([left, self.__data[left]])
        if operate == 1:
            out_list = [-1] * len(self.__data)
            index = 0
            for each in result:
                out_list[each[0]] = index
                index += 1
            return out_list
        else:
            track_result = self.get_preorder_data(result)
            return track_result

    # 中序遍历,operate: -1 轨迹数据, 1 遍历序列
    def inorder(self, operate=-1):
        result = []
        temp = []
        top = -1
        length = len(self.__data)
        if length > 0:
            i = 0
            while top > -1 or i < length:
                while i < length:
                    top = top + 1
                    temp.append([i, self.__data[i]])
                    i = (i + 1) * 2 - 1
                if top > -1:
                    i = temp[top][0]
                    if self.__data[i] != -1:
                        result.append(temp[top])
                    top = top - 1
                    temp.pop()
                    i = (i + 1) * 2
        if operate == 1:
            out_list = [-1] * len(self.__data)
            index = 0
            for each in result:
                out_list[each[0]] = index
                index += 1
            return out_list
        else:
            track_result = self.get_inorder_data(result)
            return track_result

    # 后序遍历,operate: -1 轨迹数据, 1 遍历序列
    def postorder(self, operate=-1):
        result = []
        temp = []
        top = -1
        i = 0
        length = len(self.__data)
        if length > 0:
            while True:
                while i < length:
                    top = top + 1
                    temp.append([i, self.__data[i]])  # 左子树依次进栈
                    i = (i + 1) * 2 - 1
                p = -1
                left_visit = True
                while top != -1 and left_visit:
                    i = temp[top][0]
                    if (i + 1) * 2 == p or (i + 1) * 2 >= length:  # 右子树为空
                        if self.__data[i] != -1:
                            result.append(temp[top])  # 访问当前节点
                        top = top - 1
                        temp.pop()
                        p = i
                    else:
                        i = (i + 1) * 2
                        left_visit = False
                if top == -1:
                    break
        if operate == 1:
            out_list = [-1] * len(self.__data)
            index = 0
            for each in result:
                out_list[each[0]] = index
                index += 1
            return out_list
        else:
            track_result = self.get_postorder_data(result)
            return track_result

    # 先序遍历轨迹数据
    def get_preorder_data(self, data):
        result = []
        for idx, i in enumerate(data):
            tmp_result = [0]
            if idx == 0:
                result.append(tmp_result)
                continue
            record_pre = present = i[0]
            begin = record_last = last = data[idx - 1][0]
            count = 0

            while True:

                if last % 2 == 1:
                    last += 1
                if present % 2 == 1:
                    present += 1
                root_last = int(last / 2) - 1
                root_pre = int(present / 2) - 1

                if root_pre == record_last:
                    tmp_result[0] = begin
                    tmp_result.append(record_pre)
                    break
                else:
                    record_last = last = root_last
                    tmp_result.append(record_last)

            result.append(tmp_result)
        return result

    # 后序遍历轨迹数据
    def get_postorder_data(self, data):
        def return_root(x):
            if x == 0: return 0
            if x % 2 == 1: x += 1
            return int(x / 2) - 1

        result = []
        for idx, i in enumerate(data):
            tmp_result = [i[0]]
            node = i[0]
            if idx == 0:
                while True:
                    if node != 0:
                        node = return_root(node)
                        tmp_result.insert(0, node)
                    else:
                        break
                result.append(tmp_result)
                continue
            pre_node = i[0]
            last_node = data[idx - 1][0]
            tmp_result = []
            pre_result = [i[0]]
            last_result = [data[idx - 1][0]]
            count = 0
            while True:

                if return_root(last_node) == pre_node or return_root(pre_node) == last_node:
                    break
                if return_root(pre_node) == return_root(last_node):
                    tmp_result.append(return_root(pre_node))
                    break
                else:
                    pre_node = return_root(pre_node)
                    last_node = return_root(last_node)
                    if pre_node not in pre_result:
                        pre_result.insert(0, pre_node)
                    if last_node not in last_result:
                        last_result.append(last_node)

            if tmp_result != None: tmp_result = last_result.extend(tmp_result)
            if tmp_result == None: tmp_result = last_result
            # print(tmp_result, last_result, pre_result)
            tmp_result.extend(pre_result)
            # print(last_result,pre_result,tmp_result)
            result.append(tmp_result)
        return result

    # 中序遍历轨迹数据
    def get_inorder_data(self, data):
        def return_root(x):
            if x % 2 == 1: x += 1
            return int(x / 2) - 1

        result = []
        for idx, i in enumerate(data):
            if idx == 0:
                node = i[0]
                tmp_result = [node]
                while True:
                    if node == 0:
                        break
                    else:
                        node = return_root(node)
                        tmp_result.insert(0, node)
                result.append(tmp_result)
                continue
                # print(tmp_result)
            pre_node = i[0]
            last_node = data[idx - 1][0]
            pre_result = [pre_node]
            last_result = [last_node]

            while True:
                if last_node == pre_node:
                    break
                else:
                    if last_node > pre_node:
                        last_node = return_root(last_node)
                        last_result.append(last_node)
                    else:
                        pre_node = return_root(pre_node)
                        pre_result.insert(0, pre_node)

            if len(last_result) > len(pre_result):
                tmp_result = last_result
            else:
                tmp_result = pre_result
            result.append(tmp_result)
        return result

# bt = BinaryTree(['a', 'b', 'c', 'd', -1, 'e', 'f', -1, 'g'])
# bt = BinaryTree([1,2,3,4,5,-1,-1,-1,6])
# bt = BinaryTree([1,2,3,-1,4,5])
# bt = BinaryTree([1, 2, 3, 4, 5, -1, -1, -1, 6])
# bt = BinaryTree([472, 651, 95, 148, 36, 527, 476, 940, 315, 799, 765, 245])
# bt = BinaryTree([3,7,8,9,-1,-1,15,10,-1,-1,-1,-1,-1,1])
# bt = BinaryTree()
# bb = bt.preorder()
# re = bt.postorder()

# print(bt.calc_depth())
# re = bt.inorder()
# print(re)
# bt = BinaryTree([1,2,3,4,5,6])
# print(bt.preorder(1))
# print(bt.preorder())
# bb = BinaryTree()
# print(bb.inorder())
