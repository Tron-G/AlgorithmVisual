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
        # print(self.__data)

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

    # 冒泡排序
    # 数据格式：[[第几次循环,交换下标1，交换下标2].......]
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

    # 选择排序
    # 数据格式：[[第几次循环,最小值小标1，最小值小标2...]...]
    def selection_sort(self):
        result = []
        tp = copy.deepcopy(self.__data)
        for i in range(0, len(tp) - 1):
            min_ = i
            temp = [i]
            for j in range(i + 1, len(tp)):
                if tp[j] <= tp[min_]:
                    min_ = j
                    temp.append(j)
            tp[i], tp[min_] = tp[min_], tp[i]  # swap
            temp.append(min_)
            result.append(temp)
            # print(tp)

        return result

    def get_quick_sort_data(self):
        """快速排序过程数据"""
        result = []
        end = len(self.__data) - 1
        self.quick_sort(result, self.__data, 0, end, 0)
        key = 0
        nums = 0
        idx = 1
        for i in range(0, len(result)):
            if i > 0:
                if result[i][0][0] < result[i - 1][0][0]:
                    key = i
                    nums = result[i - 1][0][0]
        for j in range(key, len(result)):
            for p in range(0, len(result[j])):
                result[j][p][0] = nums + idx
            idx += 1
        return result

    def quick_sort(self, result, data, start, end, turn):
        """快速排序"""
        i = start
        j = end
        if start == end:
            result.append([[turn, data[start], data[start]]])
            turn += 1
        if start < end:
            temp = [[turn, start, end]]
            tmp = data[start]
            while i != j:
                while j > i and data[j] > tmp:
                    j -= 1
                data[i] = data[j]
                temp.append([turn, i, j])
                while i < j and data[i] < tmp:
                    i += 1
                data[j] = data[i]
                temp.append([turn, i, j])
            data[i] = tmp
            result.append(temp)
            # print(start, end, data)
            turn += 1
            t = self.quick_sort(result, data, start, i - 1, turn)
            t = self.quick_sort(result, data, i + 1, end, t)
        return turn

# data = [6, 8, 7, 9, 0, 1, 3, 2, 4, 5]
# ss = Sort(data)
# kk = ss.get_quick_sort_data()
# for i in kk:
#     print(i)
# ss = Sort()
# print(ss.selection_sort())
