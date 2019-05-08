/**
 * @description 输入窗口及播放暂停步进隐藏等所有交互函数
 */
function inputWindow() {
    let post_data = {};                     //向后台传输的数据包
    let svg_data = {};                       //主屏幕svg对象
    let animation_data = {};                //动画数据缓存

    resetSvgData(svg_data);
    resetPostData(post_data);                //post_data初始化
    clearAllTimer(animation_data, false);   //animation_data初始化

    let is_first = true;                   //是否首次进入
    if(is_first){
        clearAllTimer(animation_data, true);            //清除动画定时器
        clearAllTimer(animation_data, false);           //animation_data初始化
        clearLocalTimer(animation_data);
        resetPostData(post_data, 1);
        let temp = postData(post_data);
        post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
        resetSvgData(svg_data);
        drawProgress(animation_data, 0);                //重置进度条
        animation_data.is_create = true;
        drawCode(post_data, animation_data, 0, 0);
        createAnimation(svg_data, post_data, animation_data);
        is_first = false;
    }

    ///////////////////////////////--------手动输入创建--------///////////////////////////////////////
    $('#submit_bt').click(function () {
        let user_data = $('#user_data').val();
        let result = checkError(post_data, user_data, 1, 15);   //输入错误检查
        if (result !== false) {
            clearAllTimer(animation_data, true);            //清除动画定时器
            clearAllTimer(animation_data, false);           //animation_data初始化
            clearLocalTimer(animation_data);
            resetPostData(post_data, 0, result.slice(0));   //slice深拷贝
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));   //更新数据包
            // console.log("data", post_data);
            resetSvgData(svg_data);
            drawProgress(animation_data, 0);
            animation_data.is_create = true;
            drawCode(post_data, animation_data, 0, 0);
            createAnimation(svg_data, post_data, animation_data);
        }
    });
    ///////////////////////////////--------随机创建--------///////////////////////////////////////
    $('#random_bt').click(function () {
        clearAllTimer(animation_data, true);            //清除动画定时器
        clearAllTimer(animation_data, false);           //animation_data初始化
        clearLocalTimer(animation_data);
        resetPostData(post_data, 1);
        let temp = postData(post_data);
        post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
        // console.log("data", post_data);
        resetSvgData(svg_data);
        drawProgress(animation_data, 0);                //重置进度条
        animation_data.is_create = true;
        drawCode(post_data, animation_data, 0, 0);
        createAnimation(svg_data, post_data, animation_data);

    });
    ///////////////////////////////--------查找功能--------///////////////////////////////////////
    $('#search_bt').click(function () {
        let search_num = $('#search_num').val();
        let result = checkError(post_data, search_num, 2);
        if (result !== false) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            clearLocalTimer(animation_data);
            animation_data.is_search = true;                    //执行标志
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 1, result, post_data.create_process);
            resetSvgData(svg_data);
            drawArray(post_data.create_process[post_data.create_process.length - 1], svg_data);
            drawProgress(animation_data, 0);               //重置进度条
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
            // console.log("search", post_data);
            drawCode(post_data, animation_data, 1, 0);
            searchAnimation(svg_data, post_data, animation_data);
        }
    });

    // ///////////////////////////////--------播放暂停功能--------////////////////////////////////////
    $("#play_bt").click(function () {
        if (animation_data.is_create || animation_data.is_search) {                         //建表动画
            if (!animation_data.is_pause) {                     //暂停
                animation_data.is_pause = true;
                // console.log("pause", animation_data.now_step);
                $("#play_bt").attr("class", "play");            //图标切换
                clearAllTimer(animation_data, true);           // 清除所有定时器
            }
            else {
                if (animation_data.now_step === 0 && animation_data.is_create) {
                    drawCode(post_data, animation_data, 2, 0);
                    let temp_timer = setTimeout(() => {
                        drawCode(post_data, animation_data, 3, 1);
                    }, animation_data.duration / 2);
                    animation_data.local_timer.push(temp_timer);       // 计时器缓存
                    animation_data.is_pause = false;
                    $("#play_bt").attr("class", "pause");
                    animation_data.duration = 2000;
                    runAnimation(svg_data, post_data, animation_data);
                }
                else if (animation_data.now_step === 0 && animation_data.is_search) {
                    drawCode(post_data, animation_data, 14, 0);
                    let temp_timer = setTimeout(() => {
                        drawCode(post_data, animation_data, 9, 1, post_data.search_process[0]);
                    }, animation_data.duration / 2);
                    animation_data.local_timer.push(temp_timer);       // 计时器缓存
                    animation_data.is_pause = false;
                    $("#play_bt").attr("class", "pause");
                    animation_data.duration = 2000;
                    runAnimation(svg_data, post_data, animation_data);
                }
                else {
                    animation_data.is_pause = false;
                    $("#play_bt").attr("class", "pause");
                    animation_data.duration = 2000;
                    runAnimation(svg_data, post_data, animation_data);
                }
            }
        }
        else
            errorWarning(11);
    });
    // ///////////////////////////////--------步进功能--------////////////////////////////////////
    $('#next_bt').click(function () {
            if (animation_data.is_create || animation_data.is_search) {
                if (!animation_data.is_pause) {                      //强制暂停并步进播放一次
                    animation_data.is_pause = true;
                    $("#play_bt").attr("class", "play");
                    animation_data.is_next = true;
                    animation_data.duration = 1500;
                    clearAllTimer(animation_data, true);
                    runAnimation(svg_data, post_data, animation_data);
                }
                else {                                            // 步进播放
                    if (animation_data.now_step === 0 && animation_data.is_create) {
                        drawCode(post_data, animation_data, 2, 0);
                        let temp_timer = setTimeout(() => {
                            drawCode(post_data, animation_data, 3, 1);
                            animation_data.is_next = true;
                            animation_data.duration = 1500;
                            runAnimation(svg_data, post_data, animation_data);
                        }, animation_data.duration / 2);
                        animation_data.local_timer.push(temp_timer);       // 计时器缓存
                    }
                    else if (animation_data.now_step === 0 && animation_data.is_search) {
                        drawCode(post_data, animation_data, 14, 0);
                        let temp_timer = setTimeout(() => {
                            drawCode(post_data, animation_data, 9, 1, post_data.search_process[0]);
                            animation_data.is_next = true;
                            animation_data.duration = 1500;
                            runAnimation(svg_data, post_data, animation_data);
                        }, animation_data.duration / 2);
                        animation_data.local_timer.push(temp_timer);       // 计时器缓存、
                    }
                    else {
                        animation_data.is_next = true;
                        animation_data.duration = 1500;
                        runAnimation(svg_data, post_data, animation_data);
                    }
                }
            }
            else
                errorWarning(11);
        }
    );
    hideAnimation();
    drawIntrouce();
    search();
}

inputWindow();

/**
 * @description svg_data 矩形x坐标重置更新
 * @param {object} svg_data svg相关数据
 */
function resetSvgData(svg_data) {
    let screen = $("#screen");
    let width = screen.width();
    let height = screen.height();
    svg_data.m_svg = null;
    svg_data.width = width;
    svg_data.height = height;
    svg_data.rect_x = [];
    svg_data.rect_len = 70;        //矩形长度
    svg_data.font_size = 20;       //主视图字体大小
    svg_data.rect_stroke = "#4CB4E7";
    svg_data.num_fill = "#537791";
    svg_data.subscript_fill = "#c9d6df";
    svg_data.search_fill = "#fab57a";
    svg_data.confict_fill = "#e23e57";  //  冲突
    svg_data.success_fill = "#a1de93";  //查找成功
    svg_data.insert_fill = "#2eb872";
    svg_data.mark_fill = "#f03861";
    svg_data.done_fill = "#1e2022";
    svg_data.sample_text_fill = "#8c7676";
    svg_data.title_fill = "#3f72af";
}

/**
 * @description post_data属性设置
 * @param {object} post_data 数据包
 * @param {number} input_tpye 数据生成方式，0默认为手动输入，1为随机
 * @param {object} array_data 保存链表值
 * @param {number} operate_type 进行的操作类型，0：无，1：查找
 * @param {number} search_num 要查找的数值
 * @param create_process 建表数据(后台)
 * @param {object} search_process  查找过程数据(后台)
 */
function resetPostData(post_data, input_tpye = 0, array_data = null, operate_type = 0,
                       search_num = -1, create_process = null, search_process = null) {
    post_data.input_tpye = input_tpye;
    post_data.array_data = array_data;
    post_data.operate_type = operate_type;
    post_data.search_num = search_num;
    post_data.create_process = create_process;
    post_data.search_process = search_process;
}


/**
 * @description 清除动画定时器
 * @param {object} animation_data 动画数据包
 * @param {boolean} do_clear  动画定时器操作，true清除所有定时器，false初始化动画数据包
 */
function clearAllTimer(animation_data, do_clear) {
    if (do_clear === true) {
        if (animation_data.all_timer.length !== 0) {
            for (let each in animation_data.all_timer) {
                clearTimeout(animation_data.all_timer[each]);
            }
            animation_data.all_timer.splice(0);
        }
    }
    else if (do_clear === false) {
        animation_data.all_timer = [];      //定时器缓存器
        animation_data.local_timer = [];
        animation_data.now_step = 0;        //当前执行动画的index
        animation_data.is_pause = true;     //暂停标记，默认暂停
        animation_data.is_next = false;     //执行步进标记
        animation_data.searchframe = [];     //查找动画函数缓存器
        animation_data.createframe = [];
        animation_data.duration = 2000;       //动画时间基数
        animation_data.is_create = false;   //是否执行创建标记
        animation_data.is_search = false;   //是否执行查找标记
        animation_data.code_rect_fill = "#4f5d76";
        animation_data.choose_rect_fill = "#89a4c7";
        animation_data.hint_text_fill = "#5c2626";
        animation_data.explain_words = ["请点击开始按钮开始创建哈希表(开放定址)", "请点击开始按钮开始运行查找算法",
            "新建空表，初始哈希除数为7", "依次向哈希表中填入数值", "计算哈希地址,pos=", "判断地址所在内存是否为空",
            "当前地址不为空,哈希地址后移,pos=", "当前地址为空,填入数值", "建表完成", "计算哈希地址,key=", "是否遍历完整表",
            "查找成功哈希地址为key=", "与当前数值不相等，哈希地址后移一位", "遍历完整表,查找失败", "遍历计数器置零"];
    }
}


function clearLocalTimer(animation_data) {
    if (animation_data.local_timer.length !== 0) {
        for (let each in animation_data.local_timer) {
            clearTimeout(animation_data.local_timer[each]);
        }
        animation_data.local_timer.splice(0);
    }
}

/**
 * @description 主视图数组绘制
 * @param {Array} array_data 数组数据
 * @param svg_data
 */
function drawArray(array_data, svg_data) {
    d3.select("#screen_svg").remove();

    let svg = d3.select("#screen")
        .append("svg")
        .attr("id", "screen_svg")
        .attr("width", svg_data.width)
        .attr("height", svg_data.height);

    let total_len = svg_data.rect_len * array_data.length;//总长度
    let start_pos = (svg_data.width - total_len) / 2;

    svg.selectAll("rect")                           // 数组矩形绘制
        .data(array_data)
        .enter()
        .append('g')
        .attr("class", function (d, i) {
            return "g_rect" + i;
        })
        .append("rect")
        .attr('class', function (d, i) {
            return "m_rect" + i;
        })
        .attr('id', function (d, i) {
            return "m_rect" + i;
        })
        .attr("x", function (d, i) {
            svg_data.rect_x.push(start_pos + i * svg_data.rect_len);
            return start_pos + i * svg_data.rect_len;
        })
        .attr("y", svg_data.height / 2 - svg_data.rect_len)
        .attr("width", svg_data.rect_len)
        .attr("height", svg_data.rect_len)
        .attr("fill", "white")
        .attr("stroke", svg_data.rect_stroke)
        .attr("stroke-width", 3);

    svg.selectAll('g')                              // 数组数字绘制
        .append("text")
        .attr('class', function (d, i) {
            return "rect_text" + i;
        })
        .attr('x', function (d, i) {
            return start_pos + i * svg_data.rect_len;
        })
        .attr('y', svg_data.height / 2 - svg_data.rect_len)
        .attr("dx", svg_data.rect_len / 4.5)
        .attr("dy", svg_data.rect_len / 1.5)
        .attr("font-size", svg_data.font_size)
        .attr("fill", svg_data.num_fill)
        .text(function (d) {
            return d;
        });

    svg.selectAll('g')                              // 数组下标绘制
        .append("text")
        .attr('class', function (d, i) {
            return "rect_num" + i;
        })
        .attr('x', function (d, i) {
            return start_pos + i * svg_data.rect_len;
        })
        .attr('y', svg_data.height / 2 - svg_data.rect_len)
        .attr("dx", svg_data.rect_len / 10)
        .attr("dy", svg_data.rect_len * 1.5)
        .attr("font-size", svg_data.font_size)
        .attr("fill", svg_data.subscript_fill)
        .text(function (d, i) {
            return "a[" + i + "]";
        });

    svg.append("g")
        .attr("class", "hash_text")
        .append("text")
        .attr('x', svg_data.rect_x[0])
        .attr('y', svg_data.height / 2 - svg_data.rect_len)
        .attr("dx", -svg_data.rect_len * 2)
        .attr("dy", svg_data.rect_len / 1.5)
        .attr("font-size", svg_data.font_size)
        .attr("fill", svg_data.mark_fill)
        .text("哈希表:");
    svg.append("g")
        .attr("class", "g_title")
        .append("text")
        .attr('x', svg_data.width / 2.2)
        .attr('y', svg_data.height / 10)
        .attr("font-size", svg_data.font_size * 2)
        .attr("fill", svg_data.title_fill)
        .text("哈希表");

    svg_data.m_svg = svg;
    drawSample(svg_data);
}

/**
 * @description 主视图图例绘制
 * @param svg_data
 */
 function drawSample(svg_data) {
    svg_data.m_svg.append("g")
        .attr("class", "g_sample");
    let sample_rect = [svg_data.rect_stroke, svg_data.insert_fill, svg_data.search_fill, svg_data.confict_fill, svg_data.success_fill];
    let sample_text = ["未处理元素", "已归位元素", "已查找元素", "哈希地址冲突元素/查找失败", "查找成功元素"];
    for (let idx = 0; idx < 5; idx++) {
        if (idx === 0) {
            svg_data.m_svg.select(".g_sample")
                .append("rect")
                .attr("x", svg_data.width / 30)
                .attr("y", svg_data.height / 25 + idx * 30)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill","white")
                .attr("stroke-width",3)
                .attr("stroke", sample_rect[idx]);
        }
        else {
            svg_data.m_svg.select(".g_sample")
                .append("rect")
                .attr("x", svg_data.width / 30)
                .attr("y", svg_data.height / 25 + idx * 30)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", sample_rect[idx]);
        }

        svg_data.m_svg.select(".g_sample")
            .append("text")
            .attr("x", svg_data.width / 30 + 30)
            .attr("y", svg_data.height / 25 + idx * 30)
            .attr("dy", 13)
            .attr("font-size", 15)
            .text(sample_text[idx])
            .attr("fill", svg_data.sample_text_fill);
    }
}


/**
 * @description 结论绘制
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包animation_data
 */
function drawConclusion(svg_data, post_data) {
    let sum = post_data.search_process.length - 1;

    svg_data.m_svg.append("g")
        .attr("class", "g_conclusion")
        .append("text")
        .attr("x", svg_data.width / 3)
        .attr("y", 17 * svg_data.height / 20)
        .attr("font-size", svg_data.font_size * 1.3)
        .attr("fill", svg_data.mark_fill)
        .text("本次查找总共比较的次数为：" + sum);
}

/**
 * @description 算法介绍窗口
 */
 function drawIntrouce() {
    d3.select("#intro_svg").remove();
    let screen = $("#intro_window");
    let width = screen.width();
    let height = screen.height();
    let svg = d3.select("#intro_window")
        .append("svg")
        .attr("id", "intro_svg")
        .attr("width", width)
        .attr("height", height);

    let intro_text = "算法介绍：/哈希表: 通过散列函数计算数组/中的每个元素的映射地址并存储/在表中以便查找，这个表就称为/哈希表；本例中的散列函数采用/除数留余法,除数为7，处理冲突/的方法采用开放定址法。";

    let temp = intro_text.split("/");

    let text = svg.append("g")
        .append("text")
        .attr("fill", "white")
        .attr('x', width / 15)
        .attr('y', height / 20);

    text.selectAll("tspan")
        .data(temp)
        .enter()
        .append("tspan")
        .attr("x", (d, i)=>{
            if(i===0)
                return 10;
            else
                return width / 15;

        })
        .attr("dy",(d, i)=>{
            if(i===0)
                return height / 10;
            else
                return height / 7.5;
        })
        .attr("font-size",(d, i)=>{
            if(i===0)
                return 20;
            else
                return 15;
        })
        .text(function (d) {
            return d
        })
}

/**
 * @description 查找过程的动画生成函数
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包
 * @param {object} animation_data 动画数据包
 */
function createAnimation(svg_data, post_data, animation_data) {
    d3.select("#screen_svg").remove();
    svg_data.m_svg = d3.select("#screen")
        .append("svg")
        .attr("id", "screen_svg")
        .attr("width", svg_data.width)
        .attr("height", svg_data.height);

    let total_len = svg_data.rect_len * post_data.array_data.length;//总长度
    let start_pos = (svg_data.width - total_len) / 2;

    svg_data.m_svg.selectAll("rect")                           // 数组矩形绘制
        .data(post_data.array_data)
        .enter()
        .append('g')
        .attr("class", function (d, i) {
            return "g_rect" + i;
        })
        .append("rect")
        .attr('class', function (d, i) {
            return "m_rect" + i;
        })
        .attr('id', function (d, i) {
            return "m_rect" + i;
        })
        .attr("x", function (d, i) {
            svg_data.rect_x.push(start_pos + i * svg_data.rect_len);
            return start_pos + i * svg_data.rect_len;
        })
        .attr("y", svg_data.height / 2 - svg_data.rect_len)
        .attr("width", svg_data.rect_len)
        .attr("height", svg_data.rect_len)
        .attr("fill", "white")
        .attr("stroke", svg_data.rect_stroke)
        .attr("stroke-width", 3);

    svg_data.m_svg.selectAll('g')                              // 数组下标绘制
        .append("text")
        .attr('class', function (d, i) {
            return "rect_num" + i;
        })
        .attr('x', function (d, i) {
            return start_pos + i * svg_data.rect_len;
        })
        .attr('y', svg_data.height / 2 - svg_data.rect_len)
        .attr("dx", svg_data.rect_len / 10)
        .attr("dy", svg_data.rect_len * 1.5)
        .attr("font-size", svg_data.font_size)
        .attr("fill", svg_data.subscript_fill)
        .text(function (d, i) {
            return "a[" + i + "]";
        });

    svg_data.m_svg.append("g")
        .attr("class", "hash_text")
        .append("text")
        .attr('x', svg_data.rect_x[0])
        .attr('y', svg_data.height / 2 - svg_data.rect_len)
        .attr("dx", -svg_data.rect_len * 2)
        .attr("dy", svg_data.rect_len / 1.5)
        .attr("font-size", svg_data.font_size)
        .attr("fill", svg_data.mark_fill)
        .text("哈希表:");

    svg_data.m_svg.append("g")
        .attr("class", "g_title")
        .append("text")
        .attr('x', svg_data.width / 2.2)
        .attr('y', svg_data.height / 10)
        .attr("font-size", svg_data.font_size * 2)
        .attr("fill", svg_data.title_fill)
        .text("哈希表");

    ////////////////////////////////////////////////////////////////////////////////////////////
    for (let index = 0; index < post_data.array_data.length; index++) {
        svg_data.m_svg.append("g")
            .attr("class", "g_array" + index)
            .append("rect")
            .attr('class', "array_rect" + index)
            .attr("id", "array_rect" + index)
            .attr('x', svg_data.rect_x[index])
            .attr('y', svg_data.height / 2 - 3 * svg_data.rect_len)
            .attr("width", svg_data.rect_len)
            .attr("height", svg_data.rect_len)
            .attr("fill", "white")
            .attr("stroke", svg_data.rect_stroke)
            .attr("stroke-width", 3);

        svg_data.m_svg.select(".g_array" + index)                              // 数组数字绘制
            .append("text")
            .attr('class', "array_rect" + index)
            .attr("id", "array_num" + index)
            .attr('x', svg_data.rect_x[index])
            .attr('y', svg_data.height / 2 - 3 * svg_data.rect_len)
            .attr("dx", svg_data.rect_len / 4.5)
            .attr("dy", svg_data.rect_len / 1.5)
            .attr("font-size", svg_data.font_size)
            .attr("fill", svg_data.num_fill)
            .text(post_data.array_data[index]);

        svg_data.m_svg.select(".g_array" + index)                              // 数组下标绘制
            .append("text")
            .attr('class', "array_rect" + index)
            .attr("id", "array_text" + index)
            .attr('x', svg_data.rect_x[index])
            .attr('y', svg_data.height / 2 - 3 * svg_data.rect_len)
            .attr("dx", svg_data.rect_len / 10)
            .attr("dy", svg_data.rect_len * 1.5)
            .attr("font-size", svg_data.font_size - 2)
            .attr("fill", svg_data.subscript_fill)
            .text("num[" + index + "]");
    }

    svg_data.m_svg.append("g")
        .attr("class", "table_text")
        .append("text")
        .attr('x', svg_data.rect_x[0])
        .attr('y', svg_data.height / 2 - 3 * svg_data.rect_len)
        .attr("dx", -svg_data.rect_len * 2)
        .attr("dy", svg_data.rect_len / 1.5)
        .attr("font-size", svg_data.font_size)
        .attr("fill", svg_data.mark_fill)
        .text("原数组:");

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    drawSample(svg_data);
    let temp_frame;
    for (let index = 0; index < (post_data.create_process.length - 1); index++) {
        if (post_data.create_process[index].length === 2) {                 //直接插入
            temp_frame = function () {
                svg_data.m_svg.select("#array_rect" + index)
                    .transition()
                    .duration(animation_data.duration)
                    .attr("fill", svg_data.insert_fill)
                    .attr("x", svg_data.rect_x[post_data.create_process[index][1]])
                    .attr("y", svg_data.height / 2 - svg_data.rect_len);

                svg_data.m_svg.select("#array_num" + index)
                    .transition()
                    .duration(animation_data.duration)
                    .attr("x", svg_data.rect_x[post_data.create_process[index][1]])
                    .attr("y", svg_data.height / 2 - svg_data.rect_len);


                svg_data.m_svg.select("#array_text" + index)
                    .transition()
                    .duration(animation_data.duration)
                    .attr("fill", "white")
                    .attr("font-size", 1)
                    .attr("x", svg_data.rect_x[post_data.create_process[index][1]])
                    .attr("y", svg_data.height / 2 - svg_data.rect_len);


                svg_data.m_svg.select(".rect_num" + post_data.create_process[index][1])
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.done_fill);

                clearLocalTimer(animation_data);

                drawCode(post_data, animation_data, 4, 2, post_data.create_process[index][1]);
                let temp_timer = setTimeout(() => {
                    drawCode(post_data, animation_data, 5, 3);
                    temp_timer = setTimeout(() => {
                        drawCode(post_data, animation_data, 7, 5);
                    }, animation_data.duration / 4);
                    animation_data.local_timer.push(temp_timer);       // 计时器缓存
                }, animation_data.duration / 4);
                animation_data.local_timer.push(temp_timer);       // 计时器缓存

            };
            animation_data.createframe.push(temp_frame);
        }
        else {
            for (let j = 1; j < post_data.create_process[index].length; j++) {
                if (j === (post_data.create_process[index].length - 1)) {           //插入
                    temp_frame = function () {
                        clearLocalTimer(animation_data);
                        drawCode(post_data, animation_data, 7, 5, post_data.create_process[index][j]);

                        svg_data.m_svg.select("#array_rect" + index)
                            .transition()
                            .duration(animation_data.duration)
                            .attr("fill", svg_data.insert_fill)
                            .attr("x", svg_data.rect_x[post_data.create_process[index][j]])
                            .attr("y", svg_data.height / 2 - svg_data.rect_len);

                        svg_data.m_svg.select("#array_num" + index)
                            .transition()
                            .duration(animation_data.duration)
                            .attr("x", svg_data.rect_x[post_data.create_process[index][j]])
                            .attr("y", svg_data.height / 2 - svg_data.rect_len);


                        svg_data.m_svg.select("#array_text" + index)
                            .transition()
                            .duration(animation_data.duration)
                            .attr("fill", "white")
                            .attr("font-size", 1)
                            .attr("x", svg_data.rect_x[post_data.create_process[index][j]])
                            .attr("y", svg_data.height / 2 - svg_data.rect_len);


                        svg_data.m_svg.select(".rect_num" + post_data.create_process[index][j])
                            .transition()
                            .duration(animation_data.duration)
                            .attr("fill", svg_data.done_fill);

                    };
                    animation_data.createframe.push(temp_frame);
                }
                else {
                    temp_frame = function () {
                        clearLocalTimer(animation_data);
                        if (j === 1) {
                            drawCode(post_data, animation_data, 4, 2, post_data.create_process[index][j]);
                            let temp_timer = setTimeout(() => {
                                drawCode(post_data, animation_data, 5, 3);
                                temp_timer = setTimeout(() => {
                                    drawCode(post_data, animation_data, 6, 4, post_data.create_process[index][j] + 1);
                                }, animation_data.duration / 4);
                                animation_data.local_timer.push(temp_timer);       // 计时器缓存
                            }, animation_data.duration / 4);
                            animation_data.local_timer.push(temp_timer);       // 计时器缓存
                        }
                        else {
                            drawCode(post_data, animation_data, 5, 3);
                            let temp_timer = setTimeout(() => {
                                drawCode(post_data, animation_data, 6, 4, post_data.create_process[index][j] + 1);
                            }, animation_data.duration / 2);
                            animation_data.local_timer.push(temp_timer);       // 计时器缓存
                        }
                        svg_data.m_svg.select("#array_rect" +
                            post_data.array_data.indexOf(post_data.create_process[post_data.create_process.length - 1][post_data.create_process[index][j]]))
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.confict_fill)
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.insert_fill);
                        svg_data.m_svg.select(".rect_num" + post_data.create_process[index][j])
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.mark_fill)
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.done_fill);
                    };
                    animation_data.createframe.push(temp_frame);
                }
            }
        }
    }
}


/**
 * @description 查找过程的动画生成函数
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包
 * @param {object} animation_data 动画数据包
 */
function searchAnimation(svg_data, post_data, animation_data) {
    let temp_frame;
    for (let index = 0; index < (post_data.search_process.length - 1); index++) {
        if (index === (post_data.search_process.length - 2)) {
            temp_frame = function () {
                clearLocalTimer(animation_data);
                if (post_data.search_process[post_data.search_process.length - 1] !== -1)
                    drawCode(post_data, animation_data, 11, 3, post_data.search_process[post_data.search_process.length - 1]);
                else
                    drawCode(post_data, animation_data, 13, 5);

                svg_data.m_svg.select("#m_rect" + post_data.search_process[index])
                    .transition()
                    .duration(animation_data.duration)
                    .attr("fill", () => {
                        if (post_data.search_process[post_data.search_process.length - 1] !== -1)
                            return svg_data.success_fill;
                        else
                            return svg_data.confict_fill;
                    });

                svg_data.m_svg.select(".rect_num" + post_data.search_process[index])
                    .transition()
                    .duration(animation_data.duration)
                    .attr("fill", svg_data.search_fill);
            };
            animation_data.searchframe.push(temp_frame);
        }
        else {
            temp_frame = function () {
                clearLocalTimer(animation_data);
                drawCode(post_data, animation_data, 10, 2);
                let temp_timer = setTimeout(() => {
                    drawCode(post_data, animation_data, 12, 4);
                }, animation_data.duration / 2);
                animation_data.local_timer.push(temp_timer);       // 计时器缓存

                svg_data.m_svg.select("#m_rect" + post_data.search_process[index])
                    .transition()
                    .duration(animation_data.duration)
                    .attr("fill", svg_data.search_fill);

                svg_data.m_svg.select(".rect_num" + post_data.search_process[index])
                    .transition()
                    .duration(animation_data.duration)
                    .attr("fill", svg_data.search_fill);
            };
            animation_data.searchframe.push(temp_frame);
        }
    }
}


/**
 * @description 算法窗口绘制
 * @param {Object}  post_data
 * @param {Object}  animation_data
 * @param {number}  word_id 解释文字所在数组(animation_data.explain_words[])下标
 * @param {number}  now_step 当前选中的代码块
 * @param pos
 */
function drawCode(post_data, animation_data, word_id, now_step, pos = -1) {
    let code_text = [];
    if (post_data.operate_type === 1)
        code_text = ["i = 0;", "key = (num % p)% a.length;", "while(i < a.length)", "if(a[key] == num),return key;",
            "if(a[key] != num[i]),key = (key + 1) % a.length;i++;", "return false;"];
    else
        code_text = ["a = new Array(); p = 7;", "for(i = 0;i<n;i++){", "pos = (num[i] % p) % n;", "while(a[pos] != null)",
            "pos=(pos + 1) % n;", "a[pos] = num[i];", "}"];

    d3.select("#code_svg").remove();
    let screen = $("#code_window");
    let width = screen.width();
    let height = screen.height();

    let rect_height = height / code_text.length;

    let code_svg = d3.select("#code_window")
        .append("svg")
        .attr("id", "code_svg")
        .attr("width", width)
        .attr("height", height);

    code_svg.selectAll("rect")
        .data(code_text)
        .enter()
        .append("g")
        .append("rect")
        .attr("class", (d, i) => {
            return "code_rect" + i;
        })
        .attr('x', 0)
        .attr('y', (d, i) => {
            return i * rect_height;
        })
        .attr("width", width)
        .attr("height", rect_height)
        .attr("fill", animation_data.code_rect_fill);

    for (let index = 0; index < code_text.length; index++) {
        let temp = code_text[index].split(",");
        if (temp.length > 1) {
            let text = code_svg.selectAll("g")
                .append("text")
                .attr("fill", "white")
                .attr('x', () => {
                    if (index > 2 && index < 5)
                        return width / 5;
                    else
                        return width / 10;
                })
                .attr('y', index * rect_height);
            text.selectAll("tspan")
                .data(temp)
                .enter()
                .append("tspan")
                .attr("x", (d, i) => {
                    if (i > 0)
                        return 1.3 * text.attr("x");
                    else
                        return text.attr("x");
                })
                .attr("dy", rect_height / 2.5)
                .text(function (d) {
                    return d
                })
        }
        else {
            code_svg.selectAll('g')
                .append("text")
                .text(code_text[index])
                .attr('x', () => {
                    if (post_data.operate_type === 1 && (index === 3 || index === 4))
                        return width / 5;
                    else if (post_data.operate_type === 0 && (index === 2 || index === 3 || index === 5))
                        return width / 5;
                    else if (post_data.operate_type === 0 && index === 4)
                        return width / 3;
                    else
                        return width / 10;
                })
                .attr('y', index * rect_height)
                .attr('dy', rect_height / 2)
                .attr("fill", "white");
        }
    }

    code_svg.selectAll(".code_rect" + now_step)
        .transition()
        .duration(500)
        .attr("fill", animation_data.choose_rect_fill);

    hintAnimationDraw(post_data, animation_data, word_id, pos); // 提示窗口动画

}

/**
 * @description 解释窗口的动画绘制
 * @param {object} post_data
 * @param {object} animation_data
 * @param word_id 解释文字所在数组(animation_data.explain_words[])下标
 * @param pos
 */
function hintAnimationDraw(post_data, animation_data, word_id, pos = -1) {
    let temp = "";
    if (word_id === 4 || word_id === 6 || word_id === 9 || word_id === 11) {
        temp = animation_data.explain_words[word_id] + pos;
    }
    else
        temp = animation_data.explain_words[word_id];

    d3.select("#hint_svg").remove();
    let screen = $("#hint_window");
    let width = screen.width();
    let height = screen.height();
    let svg = d3.select("#hint_window")
        .append("svg")
        .attr("id", "hint_svg")
        .attr("width", width)
        .attr("height", height);
    svg.append("text")
        .attr('x', width / 10)
        .attr('y', height / 2)
        .attr("dy", height / 9)
        .attr("fill", animation_data.hint_text_fill)
        .text(temp);
}


/**
 * @description 查找过程的动画运行函数
 * @param svg_data
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function runAnimation(svg_data, post_data, animation_data) {
    if (animation_data.is_create) {
        let timer = setTimeout(() => {
            if (animation_data.is_next && animation_data.now_step < animation_data.createframe.length) {   //步进执行
                drawProgress(animation_data, animation_data.createframe.length);
                animation_data.createframe[animation_data.now_step]();//执行主视图动画
                // console.log("正在播放第:" + animation_data.now_step + "帧");
                animation_data.now_step++;
                animation_data.is_next = false;
                runAnimation(svg_data, post_data, animation_data);
            }
            else {                                              //自动执行
                if (animation_data.now_step > animation_data.createframe.length - 1) {
                    animation_data.is_pause = true;
                    drawCode(post_data, animation_data, 8, 6);
                    clearLocalTimer(animation_data);
                    $("#play_bt").attr("class", "play");         //切换播放图标
                    // alert("查找失败");
                    return;
                }
                else if (animation_data.is_pause) {
                    return;
                }
                drawProgress(animation_data, animation_data.createframe.length);
                animation_data.createframe[animation_data.now_step]();
                // console.log("正在播放第:" + animation_data.now_step + "帧");
                animation_data.now_step++;
                runAnimation(svg_data, post_data, animation_data);
            }
        }, animation_data.duration);
        animation_data.all_timer.push(timer);                   // 计时器缓存
    }
    else if (animation_data.is_search) {
        let timer = setTimeout(() => {
            if (animation_data.is_next && animation_data.now_step < animation_data.searchframe.length) {   //步进执行
                drawProgress(animation_data, animation_data.searchframe.length);
                animation_data.searchframe[animation_data.now_step]();//执行主视图动画
                // console.log("正在播放第:" + animation_data.now_step + "帧");
                animation_data.now_step++;
                animation_data.is_next = false;
                runAnimation(svg_data, post_data, animation_data);
            }
            else {                                              //自动执行
                if (animation_data.now_step > animation_data.searchframe.length - 1) {
                    animation_data.is_pause = true;
                    drawConclusion(svg_data, post_data);
                    // drawCode(post_data, animation_data, 5, 3);
                    $("#play_bt").attr("class", "play");         //切换播放图标
                    // alert("查找失败");
                    return;
                }
                else if (animation_data.is_pause) {
                    return;
                }
                drawProgress(animation_data, animation_data.searchframe.length);
                animation_data.searchframe[animation_data.now_step]();
                // console.log("正在播放第:" + animation_data.now_step + "帧");
                animation_data.now_step++;
                runAnimation(svg_data, post_data, animation_data);
            }
        }, animation_data.duration);
        animation_data.all_timer.push(timer);                   // 计时器缓存
    }
}


/**
 * @description 像后台传输数据
 * @param {Object} p_data 数据包
 * @return {object} 后台返回的数据包
 */
function postData(p_data) {
    let temp = $.ajax({
        type: 'POST',
        url: "/hash_method",
        async: false,
        data: JSON.stringify(p_data),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            return data;
        }
    });
    return temp.responseJSON;
}
