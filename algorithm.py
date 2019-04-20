# -*- coding: utf-8 -*-
import random


class Algorithm:
    """算法基类"""

    # 随机生成数据
    def random_create(self, max_len=20, max_num=100):
        rand_len = random.randrange(4, max_len)
        rand_data = []
        for i in range(0, rand_len):
            rand_num = random.randrange(1, max_num)
            rand_data.append(rand_num)
        return rand_data

    # 用户输入数据
    def input_create(self, data):
        return data


class Search(Algorithm):
    """查找类"""
    __data = []

    # 数据初始化
    def __init__(self, input_list=None):
        if input_list is None:
            self.__data = self.random_create(15, 999)
        else:
            self.__data = self.input_create(input_list)
        # print(self.__data)

    def get_sort_data(self):
        self.__data.sort()
        return self.__data

    def get_data(self):
        return self.__data

    # 折半查找
    # 数据格式： [{下标:数字},{下标:数字}...{1:1}或{0:0}是否成功的标志位]
    def binsearch(self, num):
        self.__data.sort()  # 排序处理
        # print(self.__data)
        result = []
        length = len(self.__data)
        low = 0
        high = length - 1
        mid = (low + high) // 2
        # result.append([low, mid, high])
        find = False
        while low <= high:
            # result.append([low, mid, high])
            mid = (low + high) // 2
            result.append([low, mid, high])
            if self.__data[mid] == num:
                # result.append([low, mid, high])
                find = True
                break
            if num < self.__data[mid]:
                high = mid - 1
            else:
                low = mid + 1

        if find:  # 最后一位为查找是否成功的标志位
            result.append([mid])
        else:
            result.append([-1])
        return result

    # 哈希表,开放地址法
    # result: 创建序列，[[数字，寻找过程],[数字，寻找过程]....[哈希表]]
    def hash_table(self):
        length = len(self.__data)
        hash = [-1] * length
        result = []
        p = 7
        for i in range(0, length):
            temp = [self.__data[i]]
            position = (self.__data[i] % p) % length
            temp.append(position)
            while hash[position] != -1:
                position = (position + 1) % length
                temp.append(position)
            hash[position] = self.__data[i]
            result.append(temp)
            # print(temp)
        result.append(hash)
        return result

    # result:[寻找过程,是否成功]
    def hash_search(self, num):
        result = []
        key = (num % 7) % len(self.__data)
        index = 0
        while index < len(self.__data):
            result.append(key)
            if self.__data[key] == num:
                result.append(1)
                break
            else:
                key = (key + 1) % len(self.__data)
                index = index + 1
        if index == len(self.__data):
            result.append(-1)
        return result

    # 二叉排序树,list 储存树结构，现在问题：初始化空树，空间浪费太多
    # 数据格式： [[数字,寻找过程],[数字,寻找过程]...[二叉排序树]]
    def binary_sort_tree(self):
        self.__data = self.random_create(10, 100)
        length = len(self.__data)
        print(self.__data)
        print(length)
        result = []
        sort_tree = [-1] * (pow(2, length) - 1)
        print(len(sort_tree))
        for i in range(0, length):
            temp = [self.__data[i]]
            if i == 0:
                sort_tree[0] = self.__data[0]
                position = 0
                temp.append(position)
                result.append(temp)
                continue
            position = 0
            temp.append(position)
            while sort_tree[position] != -1:
                if self.__data[i] <= sort_tree[position]:
                    position = (position + 1) * 2 - 1
                else:
                    position = (position + 1) * 2
                temp.append(position)
            sort_tree[position] = self.__data[i]
            result.append(temp)
        print(sort_tree)
        result.append(sort_tree)
        return result


# bi = Search([14,1,23,68,20,19])
# print(bi.hash_table())
# print(bi.binary_sort_tree())
# print(bi.binsearch(11))
# print(bi.hash_search(1))
