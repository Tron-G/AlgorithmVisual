# -*- coding: utf-8 -*-
import copy

from algorithm import Algorithm


class Sort(Algorithm):
    """排序类"""
    __data = []

    # 数据初始化
    def __init__(self, input_list=None):
        if input_list is None:
            self.__data = self.random_create(15, 100)
        else:
            self.__data = self.input_create(input_list)
        print(self.__data)

    def get_data(self):
        return self.__data

    # 直接插入排序
    # 数据格式： [[数字,插入下标],[数字,插入下标]...[排序表]]
    def direct_insert_sort(self):
        result = []
        sort_list = []
        for i in range(0, len(self.__data)):
            temp = [self.__data[i]]
            if len(sort_list) == 0:
                sort_list.append(self.__data[i])
                temp.append(0)
                result.append(temp)
            else:
                is_insert = False
                for j in range(0, len(sort_list)):
                    if self.__data[i] <= sort_list[j]:
                        sort_list.insert(j, self.__data[i])
                        temp.append(j)
                        is_insert = True
                        break
                if not is_insert:
                    sort_list.append(self.__data[i])
                    temp.append(len(sort_list) - 1)
                result.append(temp)
        result.append(sort_list)
        return result

    def bubble_sort(self):
        result = []
        tep = copy.deepcopy(self.__data)
        for i in range(len(tep) - 1):  # 这个循环负责设置冒泡排序进行的次数
            temp1 = []
            for j in range(len(tep) - i - 1):  # j为列表下标
                temp = []
                if tep[j] > tep[j + 1]:
                    temp.append(i)
                    temp.append(j)
                    temp.append(j + 1)
                    tep[j], tep[j + 1] = tep[j + 1], tep[j]
                    temp1.append(temp)
            result.append(temp1)
        return result

# ss = Sort([5,4,3,2,1])
# print(ss.bubble_sort())
